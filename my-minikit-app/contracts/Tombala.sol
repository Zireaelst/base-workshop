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
    error NoNumbersToDrawFrom();
    error TransferFailed();
    error PlayerAlreadyBet();
    
    constructor() Ownable(msg.sender) {
        _startNewGame();
    }
    
    /**
     * @notice Place a bet on a specific number
     * @param number The number to bet on (1-25)
     */
    function placeBet(uint256 number) external payable nonReentrant {
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
     * @notice Draw a winner and end the current game
     * @dev Can only be called after game duration has passed
     */
    function drawWinner() external nonReentrant {
        if (isGameActive()) revert GameStillActive();
        if (filledNumbers.length == 0) revert NoNumbersToDrawFrom();
        
        // Generate pseudo-random number from filled numbers
        uint256 randomIndex = _generateRandomNumber() % filledNumbers.length;
        uint256 winningNumber = filledNumbers[randomIndex];
        address winner = numberOwners[winningNumber];
        
        // Calculate prize (90% to winner, 10% stays in contract)
        uint256 prize = (totalPot * 90) / 100;
        uint256 houseFee = totalPot - prize;
        
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
        
        // Transfer prize to winner
        if (prize > 0) {
            (bool success, ) = payable(winner).call{value: prize}("");
            if (!success) revert TransferFailed();
        }
        
        // Keep house fee in contract for sustainability
        // Reset for new game (but keep accumulated house fees)
        totalPot = houseFee;
    }
    
    /**
     * @notice Start a new game
     * @dev Can only be called after the previous game has ended
     */
    function startNewGame() external nonReentrant {
        if (isGameActive()) revert GameStillActive();
        _startNewGame();
    }
    
    /**
     * @notice Internal function to start a new game
     */
    function _startNewGame() internal {
        currentGameId++;
        gameStartTime = block.timestamp;
        
        // Clear previous game state
        for (uint i = 0; i < filledNumbers.length; i++) {
            delete numberOwners[filledNumbers[i]];
        }
        
        // Clear player data
        // Note: We don't iterate over all addresses, just clear as players interact
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
     * @notice Get game statistics
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
     * @notice Clear player's bet status (called internally when new game starts)
     * @param player The player address to clear
     */
    function clearPlayerBetStatus(address player) external {
        require(msg.sender == address(this), "Internal function only");
        delete hasPlayerBet[player];
        delete playerNumbers[player];
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
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
