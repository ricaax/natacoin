// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GovernanceRegistry
 * @notice Tracks user locality, reputation, and participation for governance voting weights
 * @dev Non-financial governance: voting power = locality + participation + contribution + time
 *      For MVP: admin-controlled updates. Future: Self Protocol for locality, DAO for reputation
 */
contract GovernanceRegistry is Ownable {
    /// @notice User profile data
    struct UserProfile {
        bool localityVerified;      // Verified by Self Protocol (stub for MVP)
        uint256 reputationScore;    // Community reputation points
        uint256 participationScore; // Participation in governance/cooperative activities
        uint256 joinTimestamp;      // When user joined the cooperative
    }

    /// @notice Mapping from user address to profile
    mapping(address => UserProfile) public profiles;

    /// @notice Event emitted when locality is verified
    event LocalityVerified(address indexed user, bool status);

    /// @notice Event emitted when reputation is updated
    event ReputationUpdated(address indexed user, uint256 newScore);

    /// @notice Event emitted when participation is updated
    event ParticipationUpdated(address indexed user, uint256 newScore);



/**
     * @notice Set locality verification status for a user
     * @dev For MVP: admin-controlled. Future: callable by Self Protocol integration
     * @param user Address of the user
     * @param status True if locality is verified
     */
    function setLocality(address user, bool status) external onlyOwner {
        if (profiles[user].joinTimestamp == 0) {
            profiles[user].joinTimestamp = block.timestamp;
        }
        profiles[user].localityVerified = status;
        emit LocalityVerified(user, status);
    }

    /**
     * @notice Increment reputation score for a user
     * @dev For MVP: admin-controlled. Future: can be community-driven or DAO-governed
     * @param user Address of the user
     * @param amount Amount to add to reputation
     */
    function incrementReputation(address user, uint256 amount) external onlyOwner {
        if (profiles[user].joinTimestamp == 0) {
            profiles[user].joinTimestamp = block.timestamp;
        }
        profiles[user].reputationScore += amount;
        emit ReputationUpdated(user, profiles[user].reputationScore);
    }
    
    /**
     * @notice Increment participation score for a user
     * @dev For MVP: admin-controlled. Future: auto-incremented on governance participation
     * @param user Address of the user
     * @param amount Amount to add to participation
     */
    function incrementParticipation(address user, uint256 amount) external onlyOwner {
        if (profiles[user].joinTimestamp == 0) {
            profiles[user].joinTimestamp = block.timestamp;
        }
        profiles[user].participationScore += amount;
        emit ParticipationUpdated(user, profiles[user].participationScore);
    }

    /**
     * @notice Calculate voting weight for a user
     * @dev Simple formula: locality bonus (if verified) + reputation + participation + time bonus
     *      Time bonus = days since join * 0.1 (capped at 10 points)
     * @param user Address of the user
     * @return weight Voting weight (uint)
     */
    function getVotingWeight(address user) external view returns (uint256) {
        UserProfile memory profile = profiles[user];
        
        if (profile.joinTimestamp == 0) {
            return 0; // User not registered
        }

        uint256 weight = 0;

        // Locality bonus: +50 if verified
        if (profile.localityVerified) {
            weight += 50;
        }

        // Reputation score (direct)
        weight += profile.reputationScore;

        // Participation score (direct)
        weight += profile.participationScore;

        // Time bonus: 0.1 points per day since join, capped at 10
        uint256 daysSinceJoin = (block.timestamp - profile.joinTimestamp) / 1 days;
        uint256 timeBonus = daysSinceJoin / 10; // 0.1 per day = divide by 10
        if (timeBonus > 10) {
            timeBonus = 10; // Cap at 10
        }
        weight += timeBonus;

        return weight;
    }

    /**
     * @notice Get full user profile
     * @param user Address of the user
     * @return profile UserProfile struct
     */
    function getUserProfile(address user) external view returns (UserProfile memory) {
        return profiles[user];
    }
}



