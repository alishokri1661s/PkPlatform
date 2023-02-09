const TokenDGK = artifacts.require("./TokenDGK.sol");

contract("TokenDGK", (accounts) => {
  it("Testing the DGK Token price", async () => {
    const TokenInstance = await TokenDGK.deployed();
    const result = await TokenInstance.totalSupply.call();
    assert.equal(1000000 * 10 ** 18, result);
  });
});
