import { ethers } from "hardhat";

import { token } from "../typechain-types/@openzeppelin/contracts";
import { expect } from "chai"

describe("Test Contract", function () {
    let owner: any
    let admin: any
    let moderator: any
    let user: any
    let user1: any
    let marketplace: any
    let token_notwhite: any
    let token_real: any
    let token_erc20_permit: any
    let token_erc20_nopermit: any

    let currency_usdc: any
    let currency_wxdai: any
    let currency_armmwXdai: any
    let currency_mai: any
    let tokenContract: any
    beforeEach("Deploy contract", async function () {
        [owner, admin, moderator, user, user1] = await ethers.getSigners()
        const mint_decimal = 3
        const mint_amount = 1000000
        const marketplaceContract = await ethers.getContractFactory("EstokkYam")
        marketplace = await marketplaceContract.deploy()

        tokenContract = await ethers.getContractFactory("Token")
        token_notwhite = await tokenContract.deploy("NotWhite", "NotWhite", mint_amount, mint_decimal)
        token_real = await tokenContract.deploy("RealToken", "RT", mint_amount, mint_decimal)
        token_erc20_permit = await tokenContract.deploy("ERCPermit", "Et", mint_amount, mint_decimal)
        token_erc20_nopermit = await tokenContract.deploy("ERC_not", "Ent", mint_amount, mint_decimal)

        currency_usdc = await tokenContract.deploy("USDC", "usdc", mint_amount, mint_decimal)
        currency_armmwXdai = await tokenContract.deploy("armxdai", "armxdai", mint_amount, mint_decimal)
        currency_wxdai = await tokenContract.deploy("xdai", "xdai", mint_amount, mint_decimal)
        currency_mai = await tokenContract.deploy("mai", "mai", mint_amount, mint_decimal)

        const admin_address: any = await admin.getAddress()
        const moderator_address: any = await moderator.getAddress()
        await marketplace.initialize(admin_address, moderator_address)

        //Set WhiteLIstToken
        const tokens_address: any = [
            await token_notwhite.getAddress(),
            await token_real.getAddress(),
            await token_erc20_permit.getAddress(),
            await token_erc20_nopermit.getAddress(),
            await currency_usdc.getAddress(),
            await currency_wxdai.getAddress(),
            await currency_armmwXdai.getAddress(),
            await currency_mai.getAddress()
        ]
        const tokens_type: any = [0, 1, 2, 3, 2, 2, 2, 2]

        try {
            await marketplace.connect(moderator).toggleWhitelistWithType(tokens_address, tokens_type)
        } catch (err) {
        }

        try {
            await marketplace.connect(admin).toggleWhitelistWithType(tokens_address, tokens_type)
        } catch (err) {
        }
    })

    describe("Initialize", async function () {
        it("Set role to admin", async function () {
            console.log("admin_Role: ", await marketplace.hasRole(await marketplace.DEFAULT_ADMIN_ROLE(), await admin.getAddress()))
            console.log("modifier_Role: ", await marketplace.hasRole(await marketplace.MODERATOR_ROLE(), await moderator.getAddress()))
        })
    })


    describe("Create Offer", async function () {
        it("Create Offer Buyer", async function () {
            let offer_token: any = await token_real.getAddress()
            let buyer_token: any = await currency_usdc.getAddress()
            let buyer: any = await user1.getAddress()
            let price: any = 5
            let amount: any = 500
            await marketplace.connect(user).createOffer(offer_token, buyer_token, buyer, price, amount)

            console.log("Real_Token: ", await token_real.getAddress())
            console.log("Buyer_Token: ", await currency_usdc.getAddress())
            console.log("Seller: ", await user.getAddress())
            console.log("Buyer: ", await user1.getAddress())

            console.log("OfferCount: ", await marketplace.getOfferCount())
            console.log(await marketplace.showOffer(0))
            console.log(await marketplace.getAddress());

            await token_real.connect(owner).transfer(user1, 30000)
            await token_real.connect(owner).transfer(user, 30000)
            await currency_usdc.connect(owner).transfer(user1, 10000)
            await currency_usdc.connect(owner).transfer(user, 10000)
            console.log("realTokenBalance", await token_real.connect(user1).balanceOf(user1))
            console.log("realTokenBalence: ", await token_real.connect(user1).balanceOf(user))
            console.log("currancy_Token: ", await currency_usdc.connect(user1).balanceOf(user1))
            console.log("currancy_Token: ", await currency_usdc.connect(user1).balanceOf(user))


            await token_real.connect(user1).approve(marketplace, amount)
            await token_real.connect(user).approve(marketplace, amount)
            await currency_usdc.connect(user).approve(marketplace, amount * price)
            await currency_usdc.connect(user1).approve(marketplace, amount * price)
            await marketplace.connect(user1).buy(0, price, amount)

            console.log("realTokenBalance", await token_real.connect(user1).balanceOf(user1))
            console.log("realTokenBalence: ", await token_real.connect(user1).balanceOf(user))
            console.log("currancy_Token: ", await currency_usdc.connect(user1).balanceOf(user1))
            console.log("currancy_Token: ", await currency_usdc.connect(user1).balanceOf(user))
        })

        // it("Create Permit Offer", async function () {
        //     let offer_token: any = token_real
        //     let buyer_token: any = await currency_usdc.getAddress()
        //     let buyer: any = await user1.getAddress()
        //     let price: any = 50
        //     let amount: any = 200
        //     let deadline: any = Math.floor(Date.now() / 1000) + 4200
        //     const nonce = await offer_token.nonces(await user1.getAddress());
        //     console.log("nonce: ", nonce)
        //     console.log("deadLine: ", deadline)
        //     const domain = {
        //         name: await offer_token.name(),
        //         version: "1",
        //         chainId: (await ethers.provider.getNetwork()).chainId,
        //         verifyingContract: await offer_token.getAddress(),
        //     }

        //     const types = {
        //         Permit: [
        //             { name: "owner", type: "address" },
        //             { name: "spender", type: "address" },
        //             { name: "value", type: "uint256" },
        //             { name: "nonce", type: "uint256" },
        //             { name: "deadline", type: "uint256" },
        //         ],
        //     }

        //     const value = ethers.parseEther("1")
        //     const values = {
        //         owner: await user1.getAddress(),
        //         spender: await user.getAddress(),
        //         value: value,
        //         nonce: nonce,
        //         deadline: deadline,
        //     };
        //     const signature = await user1.signTypedData(domain, types, values);
        //     console.log("Signature: ", signature)
        //     const splitSign = await marketplace.splitSignature(signature)
        //     const sigV = splitSign[0]
        //     const sigR = splitSign[1]
        //     const sigS = splitSign[2]

        //     console.log("user_address: ", await user.getAddress())
        //     console.log("user1_address: ", await user1.getAddress())
        //     try{
        //         await marketplace.connect(user1).createOfferWithPermit(await offer_token.getAddress(), buyer_token, buyer, price, amount, deadline, sigV , sigR ,sigS )
        //     } catch (err) {
        //         console.log(err)
        //     }
        // })
    })
})


