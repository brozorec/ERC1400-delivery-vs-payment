const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const { utils } = ethers;

describe("Delivery vs. Payment", function () {
  let contract;
  let accounts;

  describe("ERC1400", function () {
    it("Should deploy", async function () {
      accounts  = await ethers.getSigners();
      const partition1 = '0x7265736572766564000000000000000000000000000000000000000000000000'; // reserved in hex
      const partition2 = '0x6973737565640000000000000000000000000000000000000000000000000000'; // issued in hex
      const partition3 = '0x6c6f636b65640000000000000000000000000000000000000000000000000000'; // locked in hex
      const ERC1400 = await ethers.getContractFactory("ERC1400");

      contract = await ERC1400.deploy(
        'ERC1400Token',
        'DAU',
        1,
        [],
        [partition1, partition2, partition3]
      );
    });

    describe("reserveAndVerifyPayment", function () {
      it("should revert because message is not signed by the same user", async function () {

        const intent = "INTENT_123";
        const amount = utils.parseUnits("1");
        const message = utils.solidityKeccak256(
          ["address", "uint256", "string"],
          [accounts[0].address, amount, intent]
        );
        const messageBytes = utils.arrayify(message);
        const sig = await accounts[0].signMessage(messageBytes)

        await expect(contract.connect(accounts[1]).reserveAndVerifyPayment(amount, intent, sig))
          .to.be.revertedWith("Not same user");
      });
    });
  });
});
