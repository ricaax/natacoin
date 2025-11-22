// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./GovernanceRegistry.sol";

/**
 * @title SimpleGovernance
 * @notice Minimal governance contract for MVP voting
 * @dev For MVP: simple yes/no voting. Future: integrate with DAVINCI SDK
 *      This is a stub that can be replaced with full DAVINCI integration
 */
contract SimpleGovernance is Ownable {
    /// @notice Governance registry for voting weights
    GovernanceRegistry public registry;

    /// @notice Proposal structure
    struct Proposal {
        string description;        // Proposal description (can be CID for Filecoin-stored data)
        uint256 yesVotes;          // Total yes votes (weighted)
        uint256 noVotes;           // Total no votes (weighted)
        uint256 startTime;         // Proposal start timestamp
        uint256 endTime;           // Proposal end timestamp
        bool executed;             // Whether proposal has been executed
    }

    /// @notice Mapping from proposal ID to Proposal
    mapping(uint256 => Proposal) public proposals;

    /// @notice Mapping from proposal ID => user address => has voted
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    /// @notice Total number of proposals
    uint256 public proposalCount;

    /// @notice Voting period duration (default: 7 days)
    uint256 public votingPeriod = 7 days;

    /// @notice Event emitted when a new proposal is created
    event ProposalCreated(uint256 indexed proposalId, string description, uint256 endTime);

    /// @notice Event emitted when a user votes
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);

    /// @notice Event emitted when a proposal is executed
    event ProposalExecuted(uint256 indexed proposalId);

    /**
     * @param _registry Address of the GovernanceRegistry contract
     */
    constructor(address _registry) Ownable(msg.sender) {
        registry = GovernanceRegistry(_registry);
    }

    /**
     * @notice Create a new proposal
     * @dev For MVP: only owner can create. Future: can be permissionless or DAO-governed
     * @param description Proposal description (can be a Filecoin CID)
     * @return proposalId The ID of the newly created proposal
     */
    function createProposal(string memory description) external onlyOwner returns (uint256) {
        uint256 proposalId = proposalCount++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + votingPeriod;

        proposals[proposalId] = Proposal({
            description: description,
            yesVotes: 0,
            noVotes: 0,
            startTime: startTime,
            endTime: endTime,
            executed: false
        });

        emit ProposalCreated(proposalId, description, endTime);
        return proposalId;
    }

    /**
     * @notice Vote on a proposal
     * @dev Users can only vote once per proposal. Voting weight from GovernanceRegistry
     * @param proposalId ID of the proposal
     * @param support True for yes, false for no
     */
    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.startTime > 0, "SimpleGovernance: proposal does not exist");
        require(block.timestamp >= proposal.startTime, "SimpleGovernance: voting not started");
        require(block.timestamp <= proposal.endTime, "SimpleGovernance: voting ended");
        require(!hasVoted[proposalId][msg.sender], "SimpleGovernance: already voted");
        require(!proposal.executed, "SimpleGovernance: proposal already executed");

        uint256 weight = registry.getVotingWeight(msg.sender);
        require(weight > 0, "SimpleGovernance: no voting weight");

        hasVoted[proposalId][msg.sender] = true;

        if (support) {
            proposal.yesVotes += weight;
        } else {
            proposal.noVotes += weight;
        }

        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    /**
     * @notice Get proposal details
     * @param proposalId ID of the proposal
     * @return proposal Proposal struct
     */
    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return proposals[proposalId];
    }

    /**
     * @notice Check if a user has voted on a proposal
     * @param proposalId ID of the proposal
     * @param user Address of the user
     * @return voted True if user has voted
     */
    function userHasVoted(uint256 proposalId, address user) external view returns (bool) {
        return hasVoted[proposalId][user];
    }

    /**
     * @notice Set voting period duration (only owner)
     * @param newPeriod New voting period in seconds
     */
    function setVotingPeriod(uint256 newPeriod) external onlyOwner {
        votingPeriod = newPeriod;
    }

    /**
     * @notice Update governance registry address (only owner)
     * @param _registry New GovernanceRegistry contract address
     */
    function setRegistry(address _registry) external onlyOwner {
        registry = GovernanceRegistry(_registry);
    }
}


