// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NataToken
 * @notice ERC-20 stablecoin for the NataCoin cooperative system
 * @dev NATA is a Celo-native stablecoin with a cost-of-living coefficient
 *      For MVP: simple admin-controlled minting/burning via Treasury
 */
contract NataToken is ERC20, Ownable {
    /// @notice Cost-of-living index coefficient (represents local economic conditions)
    /// @dev For MVP: set by admin. Future: can be governance-driven or oracle-fed
    uint256 public nataCoefficient;

    /// @notice Treasury contract address that can mint/burn tokens
    address public treasury;

    /// @notice Event emitted when coefficient is updated
    event CoefficientUpdated(uint256 oldCoefficient, uint256 newCoefficient);

    /// @notice Event emitted when treasury address is set
    event TreasuryUpdated(address oldTreasury, address newTreasury);

    /**
     * @param initialSupply Initial supply of NATA tokens (can be 0 for MVP)
     * @param initialCoefficient Initial cost-of-living coefficient (e.g., 100 = 1.00)
     */
    constructor(
        uint256 initialSupply,
        uint256 initialCoefficient
    ) ERC20("NataCoin", "NATA") Ownable(msg.sender) {
        nataCoefficient = initialCoefficient;
        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply);
        }
    }

    /**
     * @notice Set the treasury address (only owner)
     * @param _treasury Address of the Treasury contract
     */
    function setTreasury(address _treasury) external onlyOwner {
        address oldTreasury = treasury;
        treasury = _treasury;
        emit TreasuryUpdated(oldTreasury, _treasury);
    }

    /**
     * @notice Update the cost-of-living coefficient (only owner)
     * @dev For MVP: simple admin function. Future: can be governance-driven
     * @param newCoefficient New coefficient value (e.g., 105 = 1.05)
     */
    function setNataCoefficient(uint256 newCoefficient) external onlyOwner {
        uint256 oldCoefficient = nataCoefficient;
        nataCoefficient = newCoefficient;
        emit CoefficientUpdated(oldCoefficient, newCoefficient);
    }

    /**
     * @notice Mint NATA tokens (only callable by Treasury)
     * @param to Address to receive the tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external {
        require(msg.sender == treasury, "NataToken: only treasury can mint");
        _mint(to, amount);
    }

    /**
     * @notice Burn NATA tokens (only callable by Treasury)
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn
     */
    function burn(address from, uint256 amount) external {
        require(msg.sender == treasury, "NataToken: only treasury can burn");
        _burn(from, amount);
    }
}


