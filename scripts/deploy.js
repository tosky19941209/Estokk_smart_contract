const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
    // const BridgeToken = await ethers.deployContract("BridgeToken");
    // console.log("BridgeT deployed to address:", await BridgeToken.getAddress());
    const EstokkYam = await ethers.deployContract("EstokkYam");
    console.log("EstokkYam deployed to address:", await EstokkYam.getAddress());
    // const TokenFactory = await ethers.deployContract("TokenFactory");
    // console.log("TokenFactory deployed to address:", await TokenFactory.getAddress());
    // const Token = await ethers.deployContract("Token", ["Token", "TK", 100000, 18]);
    // console.log("Token deployed to address:", await Token.getAddress());
    // // saveFrontendFiles(_tokenAddress, stakingAddress);
}

// function saveFrontendFiles(token, staking) {
//   const contractsDir = path.join(__dirname, "..");

//   if (!fs.existsSync(contractsDir)) {
//     fs.mkdirSync(contractsDir);
//   }

//   fs.writeFileSync(
//     path.join(contractsDir, "addresses.json"),
//     JSON.stringify({ Token: token, Staking: staking }, undefined, 2)
//   );
// }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
});