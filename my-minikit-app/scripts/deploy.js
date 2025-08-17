const { ethers } = require("hardhat");
require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log("Deploying Tombala contract...");

  // Check if private key exists
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ PRIVATE_KEY not found in environment variables!");
    console.error("Please check your .env.local file");
    return;
  }

  console.log("✅ Private key found, proceeding with deployment...");

  // Ensure private key has 0x prefix
  const privateKey = process.env.PRIVATE_KEY.startsWith('0x') 
    ? process.env.PRIVATE_KEY 
    : `0x${process.env.PRIVATE_KEY}`;

  // Get the deployer account from private key
  const deployer = new ethers.Wallet(privateKey, ethers.provider);
  console.log("Deploying with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.error("❌ Account has no ETH! Please fund the account with Base Sepolia ETH:");
    console.error("   Address:", deployer.address);
    console.error("   Faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet");
    return;
  }

  // Get the contract factory with deployer
  const Tombala = await ethers.getContractFactory("Tombala", deployer);

  // Deploy the contract
  console.log("Deploying contract...");
  const tombala = await Tombala.deploy();

  // Wait for deployment to finish
  await tombala.waitForDeployment();

  const address = await tombala.getAddress();
  console.log("Tombala deployed to:", address);

  // Get deployment transaction
  const deploymentTx = tombala.deploymentTransaction();
  console.log("Deployment transaction hash:", deploymentTx.hash);

  console.log("Waiting for block confirmations...");
  await deploymentTx.wait(3);

  console.log("Contract deployment completed!");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Contract Address:", address);
  
  // Save deployment info to a file
  const fs = require('fs');
  const deploymentInfo = {
    address: address,
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deploymentTx: deploymentTx.hash,
    timestamp: new Date().toISOString(),
    deployer: deployer.address
  };

  fs.writeFileSync(
    './deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment-info.json");
  console.log("\nNext steps:");
  console.log("1. Update .env.local with contract address:");
  console.log(`   NEXT_PUBLIC_TOMBALA_CONTRACT_ADDRESS_SEPOLIA=${address}`);
  console.log("2. Verify contract on BaseScan (optional)");
  console.log("3. Test the application");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
