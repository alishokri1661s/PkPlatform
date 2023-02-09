/**
 *Submitted for verification at Etherscan.io on 2022-10-28
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract PkToken is IERC20 {
    using SafeMath for uint256;

    string  public  name;
    string  public  symbol;
    uint8   public  decimals;
    uint256 public  totalSupply_;
    uint256 public tokenPrice;
    uint256 public tokensSold;


    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;


    constructor(uint256 initialSupply, uint256 _tokenPrice)  {
        name = "PkToken";
        symbol = "PKT";
        decimals = 10;
        totalSupply_ = initialSupply;     // total tokens would equal (totalSupply_/10**decimals)=100
        balances[msg.sender] = totalSupply_;
        tokenPrice = _tokenPrice;
    }

    function totalSupply() public override view returns (uint256) {
        return totalSupply_;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public override view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);

        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }

    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    function buyTokens(uint256 numberOfTokens) external payable {
        require(msg.value >= mul(numberOfTokens, tokenPrice));
        require(this.balanceOf(address(this)) >= numberOfTokens);
        require(this.transfer(msg.sender, numberOfTokens));

        tokensSold += numberOfTokens;
    }
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}