/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
import { vars } from "hardhat/config";
// const { INFURA_API_KEY, PRIVATE_KEY } = process.env;
// const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

module.exports = {
  solidity: "0.8.24",
  // networks: {
  //   etherscan: {
  //     apiKey: {
  //       sepolia: ETHERSCAN_API_KEY,
  //     },
  //   },
  //   sepolia: {
  //     url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
  //     accounts: [`0x${PRIVATE_KEY}`]
  //   },
  //   mainnet: {
  //     url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
  //     accounts: [`0x${PRIVATE_KEY}`]
  //   },
  //   testnet: {
  //     url: `https://data-seed-prebsc-1-s1.bnbchain.org:8545`,
  //     chainId: 97,
  //     gasPrice: 20000000000,
  //     accounts: [`0x${PRIVATE_KEY}`]
  //   },
  //   binanceMainnet: {
  //     url: "https://bsc-dataseed.binance.org/",
  //     chainId: 56,
  //     gasPrice: 20000000000,
  //     accounts: [`0x${PRIVATE_KEY}`]
  //   }
  // }
};