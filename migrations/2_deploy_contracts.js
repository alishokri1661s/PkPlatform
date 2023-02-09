var TokenSNP = artifacts.require("./TokenSNP.sol");
var TokenDGK = artifacts.require("./TokenDGK.sol");
var PkToken = artifacts.require("./PkToken.sol");
var TokenSwap = artifacts.require("./TokenSwap.sol");

module.exports = async function (deployer) {
  const snappToken = await deployer.deploy(
    TokenSNP,
    1000000,
    10 * Math.pow(10, 12)
  );
  const DigiToken = await deployer.deploy(
    TokenDGK,
    1000000,
    10 * Math.pow(10, 12)
  );
  const TokenP = await deployer.deploy(PkToken, 1000000000000, 100000);
  return deployer.deploy(TokenSwap, TokenSNP.address, TokenDGK.address);
};
