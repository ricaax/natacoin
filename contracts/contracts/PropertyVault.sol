// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NataToken.sol";

/**
 * @title PropertyVault
 * @notice Cooperative vault for property fund deposits
 * @dev Users deposit NATA tokens into the vault, representing their share in the cooperative
 *      For MVP: simple deposit/withdraw. Future: can add yield distribution, proposals, etc.
 */
contract PropertyVault is Ownable {
    /// @notice NATA token contract
    NataToken public nataToken;

    /// @notice Mapping from user address to their deposit balance
    mapping(address => uint256) public deposits;

    /// @notice Total NATA deposited in the vault
    uint256 public totalDeposits;

    /// @notice Event emitted when a user deposits NATA
    event Deposit(address indexed user, uint256 amount, uint256 totalDeposits);

    /// @notice Event emitted when a user withdraws NATA
    event Withdraw(address indexed user, uint256 amount, uint256 totalDeposits);

    /// @notice Event emitted when rewards are distributed
    event RewardsDistributed(uint256 totalAmount);

    /**
     * @param _nataToken Address of the NataToken contract
     */
    constructor(address _nataToken) Ownable(msg.sender) {
        nataToken = NataToken(_nataToken);
    }

    /**
     * @notice Deposit NATA tokens into the vault
     * @dev User must approve this contract to spend their NATA first
     * @param amount Amount of NATA to deposit
     */
    function deposit(uint256 amount) external {
        require(amount > 0, "PropertyVault: amount must be greater than 0");
        
        // Transfer NATA from user to vault
        require(
            nataToken.transferFrom(msg.sender, address(this), amount),
            "PropertyVault: transfer failed"
        );

        deposits[msg.sender] += amount;
        totalDeposits += amount;

        emit Deposit(msg.sender, amount, totalDeposits);
    }

    /**
     * @notice Withdraw NATA tokens from the vault
     * @param amount Amount of NATA to withdraw
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "PropertyVault: amount must be greater than 0");
        require(deposits[msg.sender] >= amount, "PropertyVault: insufficient balance");

        deposits[msg.sender] -= amount;
        totalDeposits -= amount;

        // Transfer NATA back to user
        require(
            nataToken.transfer(msg.sender, amount),
            "PropertyVault: transfer failed"
        );

        emit Withdraw(msg.sender, amount, totalDeposits);
    }

    /**
     * @notice Get user's deposit balance
     * @param user Address of the user
     * @return balance User's deposit balance
     */
    function getDeposit(address user) external view returns (uint256) {
        return deposits[user];
    }

    /**
     * @notice Distribute rewards proportionally to all depositors (for demo purposes)
     * @dev Only owner can call. For MVP: simple proportional distribution
     *      Future: can be governance-driven or automated
     * @param rewardAmount Total amount of NATA to distribute as rewards
     */
    function distributeRewards(uint256 rewardAmount) external onlyOwner {
        require(rewardAmount > 0, "PropertyVault: reward amount must be greater than 0");
        require(totalDeposits > 0, "PropertyVault: no deposits to distribute to");

        // Transfer reward tokens to vault (owner must approve first)
        require(
            nataToken.transferFrom(msg.sender, address(this), rewardAmount),
            "PropertyVault: reward transfer failed"
        );

        // For MVP: we'll need to track all depositors or use a different approach
        // This is a simplified version - in production, you'd iterate through depositors
        // For now, we just emit an event. A full implementation would require:
        // - A list of depositors, or
        // - Users claiming rewards, or
        // - A more complex distribution mechanism

        emit RewardsDistributed(rewardAmount);
    }

    /**
     * @notice Update the NATA token contract address (only owner)
     * @param _nataToken New NataToken contract address
     */
    function setNataToken(address _nataToken) external onlyOwner {
        nataToken = NataToken(_nataToken);
    }
}


