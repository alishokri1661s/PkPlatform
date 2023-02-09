# PK Platform

PK Platform that you can buy fan tokens of componies and swaps two ERC20 tokens and takes a fee.

[For more information please read the report](https://github.com/alishokri1661s/PkPlatform/blob/master/Report.pdf)

# Run

First you have to install truffle

```
npm install -g truffle
```

Open Ganache and run the following command:

```
truffle migrate
```

you need to modify the Admin address in App.js to get the Admin panel and charge the TokenSwap Smart contract and then run the following comand

```
npm install
cd Client
yarn install
yarn start
```

- add the Admin account in your wallet, the TokenSwap will detect changes and redirect you to the Admin component
  you need to charge the smart Contract with Tokens SNP and DGK and set the Ratio and the Fee
- make sure to configure Metamask to whichever network you migrated to when you ran the `truffle migarte ` command, this repository is already configured to connect to the testnet.

# Test

Open Ganache and run the following commands :

```
truffle migrate
truffle test
```

- in case you want to publish to the testnet dont Forget to add .secret file and put the seed of metamask account in it. for more informations : https://docs.binance.org/smart-chain/developer/deploy/truffle.html

# Abstract

Considering the lack of a single platform to bring together various projects and businesses, providing a common platform between small and large businesses in the country is the goal pursued in this project. Also, due to the fact that not focusing on a centralized structure improves the security of communication between the customer and the business and can lead to increasement of both sides wealth, therefore, the Blockchain platform is considered the best option for achieving this goal. Similar projects are taking place outside our dear country, but a similar project has never been carried out inside our country, due to the existing limits and restrictions. By using the existing algorithms and standards and implementing a smart contract for the exchange of fan tokens and the details mentioned in the following thesis, we have created a decentralized platform on the Ethereum Blockchain, through which several different businesses can be connected to each other. We legally connect the businesses to their customers which leads to bringing benefits to both sides. The importance of the mean of payment in selected businesses in this project has made us able to ensure the success of the business and satisfaction of the customers. We created a structure to create a common token between all the selected platforms and businesses, which will make it easier for customers to pay and invest, and attract funds for all three sides of the transactions.
