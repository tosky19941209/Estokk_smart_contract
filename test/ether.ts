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

    beforeEach("Deploy contract", async function () {
        [owner, admin, moderator, user, user1] = await ethers.getSigners()

        const marketplaceContract = await ethers.getContractFactory("EstokkYam")
        marketplace = await marketplaceContract.deploy()

        const tokenContract = await ethers.getContractFactory("Token")
        token_notwhite = await tokenContract.deploy("NotWhite", "NotWhite", 1000000, 18)
        token_real = await tokenContract.deploy("RealToken", "RT", 100000, 18)
        token_erc20_permit = await tokenContract.deploy("ERCPermit", "Et", 100000, 18)
        token_erc20_nopermit = await tokenContract.deploy("ERC_not", "Ent", 100000, 18)

        currency_usdc = await tokenContract.deploy("USDC", "usdc", 100000, 18)
        currency_armmwXdai = await tokenContract.deploy("armxdai", "armxdai", 100000, 18)
        currency_wxdai = await tokenContract.deploy("xdai", "xdai", 100000, 18)
        currency_mai = await tokenContract.deploy("mai", "mai", 100000, 18)

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
            let price: any = 50
            let amount: any = 200
            await marketplace.createOffer(offer_token, buyer_token, buyer, price, amount)

            console.log("OfferCount: ", await marketplace.getOfferCount())
        })

        it("should create an offer with permit", async function () {
            const offer_token = token_real;
            const buyer_token = currency_usdc.address;
            const buyer = await user1.getAddress();
            const price = 50;
            const amount = 200;
            const deadline = Math.floor(Date.now() / 1000) + 4200; // ~1 hour later
            const nonce = await offer_token.nonces(buyer);
            const domain = {
                name: await offer_token.name(),
                version: "1",
                chainId: (await ethers.provider.getNetwork()).chainId,
                verifyingContract: offer_token.address,
            };

            const types = {
                Permit: [
                    { name: "owner", type: "address" },
                    { name: "spender", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" },
                ],
            };

            const value = ethers.parseUnits("1", 18);
            const values = {
                owner: buyer,
                spender: marketplace.address,
                value: value,
                nonce: nonce,
                deadline: deadline,
            };

            const signature = await user1.signTypedData(domain, types, values);
            const { v, r, s } = ethers.utils.splitSignature(signature);

            await marketplace.connect(user1).createOfferWithPermit(
                offer_token.address,
                buyer_token,
                buyer,
                price,
                amount,
                deadline,
                v,
                r,
                s
            );

            // Further assertions can be added here to check if the offer was created successfully
        });
    });
})


