// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NataToken.sol";

/**
 * @title Treasury
 * @notice Centralized controller for minting and burning NATA tokens
 * @dev For MVP: owner-controlled. Future: can be upgraded to DAO governance
 *      In production, this would hold backing assets (e.g., CELO, cUSD)
 */
contract Treasury is Ownable {
    /// @notice NATA token contract
    NataToken public nataToken;

    /// @notice Event emitted when NATA is minted
    event NataMinted(address indexed to, uint256 amount);

    /// @notice Event emitted when NATA is burned
    event NataBurned(address indexed from, uint256 amount);

    /**
     * @param _nataToken Address of the NataToken contract
     */
    constructor(address _nataToken) Ownable(msg.sender) {
        nataToken = NataToken(_nataToken);
    }

    /**
     * @notice Mint NATA tokens to a recipient
     * @dev Only owner can call (for MVP). Future: can be restricted to DAO
     * @param to Address to receive the tokens
     * @param amount Amount of NATA to mint
     */
    function mintNata(address to, uint256 amount) external onlyOwner {
        nataToken.mint(to, amount);
        emit NataMinted(to, amount);
    }

    /**
     * @notice Burn NATA tokens from a user
     * @dev Only owner can call (for MVP). Future: can be restricted to DAO
     * @param from Address to burn tokens from
     * @param amount Amount of NATA to burn
     */
    function burnNata(address from, uint256 amount) external onlyOwner {
        nataToken.burn(from, amount);
        emit NataBurned(from, amount);
    }

    /**
     * @notice Update the NATA token contract address (only owner)
     * @param _nataToken New NataToken contract address
     */
    function setNataToken(address _nataToken) external onlyOwner {
        nataToken = NataToken(_nataToken);
    }
}


