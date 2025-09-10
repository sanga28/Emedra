// scripts/deploy.js
import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const ReportNFT = await ethers.getContractFactory("ReportNFT");
  const reportNFT = await ReportNFT.deploy();

  await reportNFT.waitForDeployment();

  console.log("✅ ReportNFT deployed to:", await reportNFT.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
