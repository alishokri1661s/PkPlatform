// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./TokenSNP.sol";
import "./TokenDGK.sol";


contract TokenSwap {
    address payable admin;

    uint256 ratioAX;
    bool AcheaperthenX;
    uint256 fees;
    TokenSNP public tokenSNP;
    TokenDGK public tokenDGK;

    constructor(address _tokenSNP, address _tokenDGK) {
        admin = payable(msg.sender);
        tokenSNP = TokenSNP(_tokenSNP);
        tokenDGK = TokenDGK(_tokenDGK);

        tokenSNP.approve(address(this), tokenSNP.totalSupply());
        tokenDGK.approve(address(this), tokenSNP.totalSupply());
    }

    modifier onlyAdmin() {
        payable(msg.sender) == admin;
        _;
    }

    function setRatio(uint256 _ratio) public onlyAdmin {
        ratioAX = _ratio;
    }

    function getRatio() public view onlyAdmin returns (uint256) {
        return ratioAX;
    }

    function setFees(uint256 _Fees) public onlyAdmin {
        fees = _Fees;
    }

    function getFees() public view onlyAdmin returns (uint256) {
        return fees;
    }

    function swapSNPtoDGK(uint256 amountTKA) public returns (uint256) {
        require(amountTKA > 0, "amountTKA must be greater then zero");
        require(
            tokenSNP.balanceOf(msg.sender) >= amountTKA,
            "sender doesn't have enough Tokens"
        );

        uint256 exchangeA = uint256(mul(amountTKA, ratioAX));
        uint256 exchangeAmount = exchangeA -
            uint256((mul(exchangeA, fees)) / 100);
        require(
            exchangeAmount > 0,
            "exchange Amount must be greater then zero"
        );

        require(
            tokenDGK.balanceOf(address(this)) > exchangeAmount,
            "currently the exchange doesnt have enough DGK Tokens, please retry later :=("
        );

        tokenSNP.transferFrom(msg.sender, address(this), amountTKA);
        tokenDGK.approve(address(msg.sender), exchangeAmount);
        tokenDGK.transferFrom(
            address(this),
            address(msg.sender),
            exchangeAmount
        );
        return exchangeAmount;
    }

    function swapDGKtoSNP(uint256 amountTKX) public returns (uint256) {
        require(amountTKX >= ratioAX, "amountTKX must be greater then ratio");
        require(
            tokenDGK.balanceOf(msg.sender) >= amountTKX,
            "sender doesn't have enough Tokens"
        );

        uint256 exchangeA = amountTKX / ratioAX;
        uint256 exchangeAmount = exchangeA - ((exchangeA * fees) / 100);

        require(
            exchangeAmount > 0,
            "exchange Amount must be greater then zero"
        );

        require(
            tokenSNP.balanceOf(address(this)) > exchangeAmount,
            "currently the exchange doesnt have enough DGK Tokens, please retry later :=("
        );
        tokenDGK.transferFrom(msg.sender, address(this), amountTKX);
        tokenSNP.approve(address(msg.sender), exchangeAmount);
        tokenSNP.transferFrom(
            address(this),
            address(msg.sender),
            exchangeAmount
        );
        return exchangeAmount;
    }


    function buyTokensSNP(uint256 amount) public payable onlyAdmin {
        tokenSNP.buyTokens{value: msg.value}(amount);
    }

    function buyTokensDGK(uint256 amount) public payable onlyAdmin {
        tokenDGK.buyTokens{value: msg.value}(amount);
    }

    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }
}
