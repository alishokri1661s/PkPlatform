const TokenSNP = artifacts.require("./TokenSNP.sol");

contract("TokenSNP", (accounts) => {
  it("Testing the initial supply", async () => {
    const TokenInstance = await TokenSNP.deployed();
    const result = await TokenInstance.totalSupply.call();
    assert.equal(1000000 * 10 ** 18, result);
  });
});
