// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Tombala - Turkish Bingo Game
 * @author Tombala Team
 * @notice A decentralized tombala (bingo) game on Base
 */
contract Tombala is Ownable, ReentrancyGuard {
    // Constants
    uint256 public constant BET_PRICE = 0.001 ether;
    uint256 public constant GAME_DURATION = 24 hours;
    uint256 public constant MIN_NUMBER = 1;
    uint256 public constant MAX_NUMBER = 25;
    
    // Game State
    uint256 public currentGameId;
    uint256 public gameStartTime;
    uint256 public totalPot;
    
    // Current game mappings
    mapping(uint256 => address) public numberOwners; // number => player address
    mapping(address => uint256[]) public playerNumbers; // player => numbers
    mapping(address => bool) public hasPlayerBet; // track if player has bet this game
    
    // Game history
    struct GameResult {
        uint256 gameId;
        uint256 winningNumber;
        address winner;
        uint256 prize;
        uint256 timestamp;
        uint256 totalBets;
    }
    
    mapping(uint256 => GameResult) public gameHistory;
    uint256[] public filledNumbers; // numbers that have been bet on
    
    // Events
    event BetPlaced(
        uint256 indexed gameId,
        address indexed player,
        uint256 number,
        uint256 timestamp
    );
    
    event GameDrawn(
        uint256 indexed gameId,
        uint256 winningNumber,
        address indexed winner,
        uint256 prize,
        uint256 timestamp
    );
    
    event NewGameStarted(
        uint256 indexed gameId,
        uint256 timestamp
    );
    
    // Errors
    error InvalidNumber();
    error NumberAlreadyTaken();
    error IncorrectBetAmount();
    error GameNotActive();
    error GameStillActive();
    error TransferFailed();
    error PlayerAlreadyBet();
    
    constructor() Ownable(msg.sender) {
        _startNewGame();
    }
    
    /**
     * @notice Modifier to automatically draw winner if game time has passed
     */
    modifier autoDrawCheck() {
        if (!isGameActive() && currentGameId > 0) {
            _drawWinner();
        }
        _;
    }
    
    /**
     * @notice Place a bet on a specific number
     * @param number The number to bet on (1-25)
     */
    function placeBet(uint256 number) external payable nonReentrant autoDrawCheck {
        if (msg.value != BET_PRICE) revert IncorrectBetAmount();
        if (number < MIN_NUMBER || number > MAX_NUMBER) revert InvalidNumber();
        if (numberOwners[number] != address(0)) revert NumberAlreadyTaken();
        if (!isGameActive()) revert GameNotActive();
        if (hasPlayerBet[msg.sender]) revert PlayerAlreadyBet();
        
        // Update state
        numberOwners[number] = msg.sender;
        playerNumbers[msg.sender].push(number);
        hasPlayerBet[msg.sender] = true;
        filledNumbers.push(number);
        totalPot += msg.value;
        
        emit BetPlaced(currentGameId, msg.sender, number, block.timestamp);
    }
    
    /**
     * @notice Internal function to draw winner and handle payouts
     */
    function _drawWinner() internal {
        if (isGameActive()) return; // Safety check
        
        // Generate random number between 1-25
        uint256 winningNumber = (_generateRandomNumber() % MAX_NUMBER) + 1;
        address winner = numberOwners[winningNumber];
        
        uint256 prize = 0;
        uint256 houseFee = totalPot;
        
        // If someone picked the winning number, they get 90%, house gets 10%
        if (winner != address(0)) {
            prize = (totalPot * 90) / 100;
            houseFee = totalPot - prize;
        }
        // If no one picked the winning number, house gets 100%
        
        // Record game result
        gameHistory[currentGameId] = GameResult({
            gameId: currentGameId,
            winningNumber: winningNumber,
            winner: winner,
            prize: prize,
            timestamp: block.timestamp,
            totalBets: filledNumbers.length
        });
        
        emit GameDrawn(currentGameId, winningNumber, winner, prize, block.timestamp);
        
        // Transfer prize to winner if there is one
        if (prize > 0 && winner != address(0)) {
            (bool success, ) = payable(winner).call{value: prize}("");
            if (!success) revert TransferFailed();
        }
        
        // Transfer house fee to owner
        if (houseFee > 0) {
            (bool success, ) = payable(owner()).call{value: houseFee}("");
            if (!success) revert TransferFailed();
        }
        
        // Reset pot for new game
        totalPot = 0;
        
        // Start new game automatically
        _startNewGame();
    }
    
    /**
     * @notice Draw a winner and end the current game (public interface)
     * @dev Can be called by anyone after game duration has passed
     */
    function drawWinner() external nonReentrant {
        _drawWinner();
    }
    
    /**
     * @notice Internal function to start a new game
     */
    function _startNewGame() internal {
        currentGameId++;
        gameStartTime = block.timestamp;
        
        // Clear previous game state - numbers
        for (uint i = 0; i < filledNumbers.length; i++) {
            delete numberOwners[filledNumbers[i]];
        }
        
        // Clear previous game state - players
        for (uint i = 0; i < filledNumbers.length; i++) {
            address player = numberOwners[filledNumbers[i]];
            if (player != address(0)) {
                delete hasPlayerBet[player];
                delete playerNumbers[player];
            }
        }
        
        // We need to manually clear player data for all players who bet
        // This is done by tracking players in the filledNumbers array
        for (uint i = 1; i <= MAX_NUMBER; i++) {
            if (numberOwners[i] != address(0)) {
                address player = numberOwners[i];
                delete hasPlayerBet[player];
                delete playerNumbers[player];
                delete numberOwners[i];
            }
        }
        
        // Clear filled numbers array
        delete filledNumbers;
        
        emit NewGameStarted(currentGameId, block.timestamp);
    }
    
    /**
     * @notice Check if the current game is active
     * @return bool True if game is active, false otherwise
     */
    function isGameActive() public view returns (bool) {
        return block.timestamp < gameStartTime + GAME_DURATION;
    }
    
    /**
     * @notice Get remaining time for current game
     * @return uint256 Remaining time in seconds
     */
    function getRemainingTime() external view returns (uint256) {
        if (!isGameActive()) return 0;
        return (gameStartTime + GAME_DURATION) - block.timestamp;
    }
    
    /**
     * @notice Get all filled numbers in current game
     * @return uint256[] Array of filled numbers
     */
    function getFilledNumbers() external view returns (uint256[] memory) {
        return filledNumbers;
    }
    
    /**
     * @notice Get player's numbers for current game
     * @param player The player address
     * @return uint256[] Array of player's numbers
     */
    function getPlayerNumbers(address player) external view returns (uint256[] memory) {
        return playerNumbers[player];
    }
    
        /**
     * @notice Get current game statistics
     * @return gameId Current game ID
     * @return isActive Whether game is active
     * @return pot Total pot amount
     * @return betsCount Number of bets placed
     * @return timeLeft Time remaining in seconds
     */
    function getGameStats() external view returns (
        uint256 gameId,
        bool isActive,
        uint256 pot,
        uint256 betsCount,
        uint256 timeLeft
    ) {
        return (
            currentGameId,
            isGameActive(),
            totalPot,
            filledNumbers.length,
            isGameActive() ? (gameStartTime + GAME_DURATION) - block.timestamp : 0
        );
    }
    
    /**
     * @notice Generate a pseudo-random number
     * @dev This is not cryptographically secure - for demo purposes only
     * @return uint256 Random number
     */
    function _generateRandomNumber() internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            currentGameId,
            filledNumbers.length
        )));
    }
    
    /**
     * @notice Emergency withdraw function (only owner)
     * @dev Should only be used in emergency situations
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        if (!success) revert TransferFailed();
    }
    
    /**
     * @notice Get contract balance
     * @return uint256 Contract balance
     */
    function getContractBalance() external autoDrawCheck returns (uint256) {
        return address(this).balance;
    }
}
