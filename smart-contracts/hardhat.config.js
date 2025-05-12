require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",  // Ensure the contract's Solidity version is compatible
  networks: {
    // Local Ganache network
    hardhat: {
      chainId: 1337  // Default Ganache chainId
    },
    ganache: {
      url: "http://127.0.0.1:7545",  // Local Ganache RPC URL
      chainId: 1337,  // Correct the chainId here to match Ganache's ID
      accounts: [
        "0xcf2be5a0fcb2d491debbe92fd6f0c72dd5119fc76d1168a8cffe5fd7c412a9ec" // Hardcoded private key
      ],
    },
  },
};
