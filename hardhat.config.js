import "@nomicfoundation/hardhat-toolbox";

export default {
  solidity: "0.8.20",
  networks: {
    development: {
      url: "http://127.0.0.1:7545", // Ganache default RPC
      accounts: [
        "0xd603c308692fa78753aba20231123ab4b6eb1b4274472f5e100ebe0e0a4ff3da"
      ],
    },
  },
};
