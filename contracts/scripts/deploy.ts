import { ethers } from "hardhat";

/**
 * Deployment script for NataCoin contracts
 * Deploys: NataToken -> Treasury -> GovernanceRegistry -> PropertyVault -> SimpleGovernance
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // 1. Deploy NataToken
  console.log("\n1. Deploying NataToken...");
  const NataToken = await ethers.getContractFactory("NataToken");
  const initialSupply = ethers.parseEther("1000000"); // 1M NATA for testing
  const initialCoefficient = 100; // 1.00
  const nataToken = await NataToken.deploy(initialSupply, initialCoefficient);
  await nataToken.waitForDeployment();
  const nataTokenAddress = await nataToken.getAddress();
  console.log("NataToken deployed to:", nataTokenAddress);

  // 2. Deploy Treasury
  console.log("\n2. Deploying Treasury...");
  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(nataTokenAddress);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("Treasury deployed to:", treasuryAddress);

  // 3. Set Treasury as minter/burner in NataToken
  console.log("\n3. Setting Treasury in NataToken...");
  const setTreasuryTx = await nataToken.setTreasury(treasuryAddress);
  await setTreasuryTx.wait();
  console.log("Treasury set in NataToken");

  // 4. Deploy GovernanceRegistry
  console.log("\n4. Deploying GovernanceRegistry...");
  const GovernanceRegistry = await ethers.getContractFactory("GovernanceRegistry");
  const registry = await GovernanceRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("GovernanceRegistry deployed to:", registryAddress);

  // 5. Deploy PropertyVault
  console.log("\n5. Deploying PropertyVault...");
  const PropertyVault = await ethers.getContractFactory("PropertyVault");
  const vault = await PropertyVault.deploy(nataTokenAddress);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("PropertyVault deployed to:", vaultAddress);

  // 6. Deploy SimpleGovernance
  console.log("\n6. Deploying SimpleGovernance...");
  const SimpleGovernance = await ethers.getContractFactory("SimpleGovernance");
  const governance = await SimpleGovernance.deploy(registryAddress);
  await governance.waitForDeployment();
  const governanceAddress = await governance.getAddress();
  console.log("SimpleGovernance deployed to:", governanceAddress);

  // Summary
  console.log("\n=== Deployment Summary ===");
  console.log("NataToken:", nataTokenAddress);
  console.log("Treasury:", treasuryAddress);
  console.log("GovernanceRegistry:", registryAddress);
  console.log("PropertyVault:", vaultAddress);
  console.log("SimpleGovernance:", governanceAddress);
  console.log("\nDeployer address:", deployer.address);
  console.log("Initial NATA supply:", ethers.formatEther(initialSupply), "NATA");
  console.log("\n=== Next Steps ===");
  console.log("1. Save these addresses to your frontend .env file");
  console.log("2. Update backend configuration with contract addresses");
  console.log("3. For testing: use Treasury.mintNata() to mint tokens to test accounts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


