async function main() {
  // Get the signer
  const [deployer] = await ethers.getSigners();
  console.log(deployer);
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Deployer balance:", await deployer.getBalance());

  // Get contract factory
  const WasteManagement = await ethers.getContractFactory("WasteManagement");
  console.log("Factory");

  try {
    // Deploy the contract
    const wasteManagement = await WasteManagement.deploy({gasLimit: 6721975,});
    console.log("WasteManagement contract deployed to:", wasteManagement.address);
  } catch (error) {
    console.error("Error during contract deployment:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
