const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tombala", function () {
  let tombala;
  let owner;
  let player1;
  let player2;
  let player3;

  const BET_PRICE = ethers.parseEther("0.001");

  beforeEach(async function () {
    [owner, player1, player2, player3] = await ethers.getSigners();
    
    const Tombala = await ethers.getContractFactory("Tombala");
    tombala = await Tombala.deploy();
    await tombala.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await tombala.owner()).to.equal(owner.address);
    });

    it("Should start with game ID 1", async function () {
      expect(await tombala.currentGameId()).to.equal(1);
    });

    it("Should initialize with active game", async function () {
      expect(await tombala.isGameActive()).to.equal(true);
    });
  });

  describe("Betting", function () {
    it("Should allow valid bets", async function () {
      await expect(tombala.connect(player1).placeBet(5, { value: BET_PRICE }))
        .to.emit(tombala, "BetPlaced")
        .withArgs(1, player1.address, 5, await time.latest() + 1);

      expect(await tombala.numberOwners(5)).to.equal(player1.address);
      expect(await tombala.totalPot()).to.equal(BET_PRICE);
    });

    it("Should reject bets with wrong amount", async function () {
      await expect(
        tombala.connect(player1).placeBet(5, { value: ethers.parseEther("0.002") })
      ).to.be.revertedWithCustomError(tombala, "IncorrectBetAmount");
    });

    it("Should reject bets on invalid numbers", async function () {
      await expect(
        tombala.connect(player1).placeBet(0, { value: BET_PRICE })
      ).to.be.revertedWithCustomError(tombala, "InvalidNumber");

      await expect(
        tombala.connect(player1).placeBet(26, { value: BET_PRICE })
      ).to.be.revertedWithCustomError(tombala, "InvalidNumber");
    });

    it("Should reject bets on already taken numbers", async function () {
      await tombala.connect(player1).placeBet(5, { value: BET_PRICE });
      
      await expect(
        tombala.connect(player2).placeBet(5, { value: BET_PRICE })
      ).to.be.revertedWithCustomError(tombala, "NumberAlreadyTaken");
    });

    it("Should reject multiple bets from same player", async function () {
      await tombala.connect(player1).placeBet(5, { value: BET_PRICE });
      
      await expect(
        tombala.connect(player1).placeBet(10, { value: BET_PRICE })
      ).to.be.revertedWithCustomError(tombala, "PlayerAlreadyBet");
    });

    it("Should track filled numbers correctly", async function () {
      await tombala.connect(player1).placeBet(5, { value: BET_PRICE });
      await tombala.connect(player2).placeBet(10, { value: BET_PRICE });
      await tombala.connect(player3).placeBet(15, { value: BET_PRICE });

      const filledNumbers = await tombala.getFilledNumbers();
      expect(filledNumbers.length).to.equal(3);
      expect(filledNumbers).to.include(5n);
      expect(filledNumbers).to.include(10n);
      expect(filledNumbers).to.include(15n);
    });
  });

  describe("Game Flow", function () {
    beforeEach(async function () {
      // Place some bets
      await tombala.connect(player1).placeBet(5, { value: BET_PRICE });
      await tombala.connect(player2).placeBet(10, { value: BET_PRICE });
      await tombala.connect(player3).placeBet(15, { value: BET_PRICE });
    });

    it("Should not allow drawing winner while game is active", async function () {
      await expect(tombala.drawWinner())
        .to.be.revertedWithCustomError(tombala, "GameStillActive");
    });

    it("Should allow drawing winner after game duration", async function () {
      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60 + 1]); // 24 hours + 1 second
      await ethers.provider.send("evm_mine");

      await expect(tombala.drawWinner())
        .to.emit(tombala, "GameDrawn");

      // Check that game is recorded in history
      const gameResult = await tombala.gameHistory(1);
      expect(gameResult.gameId).to.equal(1);
      expect(gameResult.totalBets).to.equal(3);
    });

    it("Should not allow starting new game while current is active", async function () {
      await expect(tombala.startNewGame())
        .to.be.revertedWithCustomError(tombala, "GameStillActive");
    });

    it("Should allow starting new game after previous ends", async function () {
      // Fast forward time and draw winner
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60 + 1]);
      await ethers.provider.send("evm_mine");
      await tombala.drawWinner();

      await expect(tombala.startNewGame())
        .to.emit(tombala, "NewGameStarted")
        .withArgs(2, await time.latest() + 1);

      expect(await tombala.currentGameId()).to.equal(2);
      expect(await tombala.isGameActive()).to.equal(true);
    });
  });

  describe("Game Statistics", function () {
    it("Should return correct game stats", async function () {
      await tombala.connect(player1).placeBet(5, { value: BET_PRICE });
      await tombala.connect(player2).placeBet(10, { value: BET_PRICE });

      const stats = await tombala.getGameStats();
      expect(stats.gameId).to.equal(1);
      expect(stats.isActive).to.equal(true);
      expect(stats.pot).to.equal(BET_PRICE * 2n);
      expect(stats.betsCount).to.equal(2);
      expect(stats.timeLeft).to.be.greaterThan(0);
    });

    it("Should return player numbers correctly", async function () {
      await tombala.connect(player1).placeBet(5, { value: BET_PRICE });

      const playerNumbers = await tombala.getPlayerNumbers(player1.address);
      expect(playerNumbers.length).to.equal(1);
      expect(playerNumbers[0]).to.equal(5);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle game with no bets correctly", async function () {
      // Fast forward time without any bets
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60 + 1]);
      await ethers.provider.send("evm_mine");

      await expect(tombala.drawWinner())
        .to.be.revertedWithCustomError(tombala, "NoNumbersToDrawFrom");
    });

    it("Should calculate prizes correctly", async function () {
      await tombala.connect(player1).placeBet(5, { value: BET_PRICE });
      await tombala.connect(player2).placeBet(10, { value: BET_PRICE });

      const totalPot = BET_PRICE * 2n;
      const expectedPrize = (totalPot * 90n) / 100n;

      // Fast forward and draw
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60 + 1]);
      await ethers.provider.send("evm_mine");

      const tx = await tombala.drawWinner();
      const receipt = await tx.wait();
      
      // Find the GameDrawn event
      const gameDrawnEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === "GameDrawn"
      );
      
      expect(gameDrawnEvent.args.prize).to.equal(expectedPrize);
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to emergency withdraw", async function () {
      await tombala.connect(player1).placeBet(5, { value: BET_PRICE });
      
      const initialBalance = await ethers.provider.getBalance(owner.address);
      await tombala.emergencyWithdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);
      
      expect(finalBalance).to.be.greaterThan(initialBalance);
    });

    it("Should not allow non-owner to emergency withdraw", async function () {
      await expect(tombala.connect(player1).emergencyWithdraw())
        .to.be.revertedWithCustomError(tombala, "OwnableUnauthorizedAccount");
    });
  });
});

// Helper to get current timestamp
const time = {
  latest: async () => {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
};
