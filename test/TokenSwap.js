const TokenSwap = artifacts.require("./TokenSwap.sol");
const TokenA = artifacts.require("./TokenSNP.sol");
const TokenX = artifacts.require("./TokenDGK.sol");

contract("TokenSwap", (accounts) => {
  it("testing the swapSNPtoDGK function", async () => {
    const TokenSwapInstance = await TokenSwap.deployed();
    const TokenAInstance = await TokenA.deployed();
    const TokenXInstance = await TokenX.deployed();

    await TokenSwapInstance.tokenSNP.call();
    await TokenSwapInstance.buyTokensSNP(1000, {
      from: accounts[0],
      value: 1000 * 1000 + 2000,
    });
    await TokenSwapInstance.buyTokensDGK(1000, {
      from: accounts[0],
      value: 1000 * 1000 + 2000,
    });

    await TokenSwapInstance.setRatio(3);
    await TokenSwapInstance.setFees(30);

    await TokenAInstance.buyTokens(10, {
      from: accounts[0],
      value: 1000 * 1000 + 2000,
    });

    await TokenAInstance.approve(TokenSwapInstance.address, 5);

    let allowanceValue = await TokenAInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );
    assert.equal(allowanceValue, 5);

    await TokenSwapInstance.swapSNPtoDGK(5, {
      from: accounts[0],
    });

    let allowanceValueAfter = await TokenAInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );
    assert.equal(allowanceValueAfter, 0);

    const balanceOfX = await TokenXInstance.balanceOf(
      TokenSwapInstance.address
    );
    assert.equal(balanceOfX, 989);

    const balanceOfA = await TokenAInstance.balanceOf(
      TokenSwapInstance.address
    );

    assert.equal(balanceOfA, 1005);

    const balanceTKA = await TokenAInstance.balanceOf.call(accounts[0]);
    const balanceTKX = await TokenXInstance.balanceOf.call(accounts[0]);
    assert.equal(balanceTKA, 5);
    assert.equal(balanceTKX, 11);
  });

  it("testing the swapDGKtoSNP function", async () => {
    const TokenSwapInstance = await TokenSwap.deployed();
    const TokenAInstance = await TokenA.deployed();
    const TokenXInstance = await TokenX.deployed();

    const ratio = await TokenSwapInstance.setRatio(3);

    const checkPre = await TokenXInstance.balanceOf.call(accounts[0]);
    assert.equal(checkPre, 11);

    
    await TokenXInstance.approve(TokenSwapInstance.address, 10);

    let allowanceValue = await TokenXInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );
    assert.equal(allowanceValue, 10);

    await TokenSwapInstance.swapDGKtoSNP(10, {
      from: accounts[0],
    });

    let allowanceValueAfter = await TokenAInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );
    assert.equal(allowanceValueAfter, 0);

    const balanceOfX = await TokenXInstance.balanceOf(
      TokenSwapInstance.address
    );
    assert.equal(balanceOfX, 999);

    const balanceOfA = await TokenAInstance.balanceOf(
      TokenSwapInstance.address
    );

    assert.equal(balanceOfA, 1002);

    const balanceTKA = await TokenAInstance.balanceOf.call(accounts[0]);
    const balanceTKX = await TokenXInstance.balanceOf.call(accounts[0]);
    assert.equal(balanceTKA, 8);
    assert.equal(balanceTKX, 1);
  });
});
