import React, { Component, useState, useEffect } from "react";
import TokenSwap from "../contracts/TokenSwap.json";
import TokenSNP from "../contracts/TokenSNP.json";
import TokenDGK from "../contracts/TokenDGK.json";
import getWeb3 from "../getWeb3";
import Admin from "../components/Admin";
import TokenSwapScreen from "../components/TokenSwapScreen";
import "../App.css";
import { ParticlesConf } from "../components/ParticlesConf";

function SubScreen() {
  const [web3, setweb3] = useState(null);
  const [accounts, setaccounts] = useState([]);
  const [networkId, setNetworId] = useState(null);
  const [deployedNetwork, setDeployedNetwork] = useState(null);
  const [contracts, setContracts] = useState(null);
  const [TokenSwapAddress, setTokenSwapAddress] = useState(null);
  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();

        const metaMaskAccounts = await web3.eth.getAccounts();

        const networkId = 5777;
        const deployedNetworkTokenSwap = TokenSwap.networks[networkId];
        const deployedNetworkTokenSNP = TokenSNP.networks[networkId];
        const deployedNetworkTokenDGK = TokenDGK.networks[networkId];
        console.log("deployedNetworkTokenSwap: " + deployedNetworkTokenSwap);
        setTokenSwapAddress(deployedNetworkTokenSwap.address);
        const instance = new web3.eth.Contract(
          TokenSwap.abi,
          deployedNetworkTokenSwap && deployedNetworkTokenSwap.address
        );

        const instance2 = new web3.eth.Contract(
          TokenSNP.abi,
          deployedNetworkTokenSNP && deployedNetworkTokenSNP.address
        );
        const instance3 = new web3.eth.Contract(
          TokenDGK.abi,
          deployedNetworkTokenDGK && deployedNetworkTokenDGK.address
        );

        const arr = [instance, instance2, instance3];


        setweb3(web3);
        setDeployedNetwork(deployedNetwork);
        setaccounts(metaMaskAccounts);
        setNetworId(networkId);
        setContracts(arr);
      } catch (error) {

        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const load = async () => {
      window.ethereum.on("accountsChanged", async (accounts) => {
        console.log("accountsChanges", accounts);
        setaccounts(accounts);
        window.location.reload();
      });
    };
    if (web3 && accounts) {
      load();
    }
  }, [web3, contracts, accounts]);

  if (!web3) {
    return (
      <React.Fragment>
        <div class="d-flex justify-content-center position-absolute top-50 start-50 translate-middle">
          <div
            class="spinner-grow"
            style={{ width: "6rem", height: "6rem" }}
            role="status"
          ></div>
        </div>
      </React.Fragment>
    );
  }

  if (web3 && accounts && contracts) {
    if (accounts[0] === "0x068a1D9f3c12003cfaE8b9939c300BD3BC2343a7") {
      return (
        <React.Fragment>
          <ParticlesConf />
          <Admin
            Web3={web3}
            Contracts={contracts}
            Accounts={accounts}
            TokenSwapAddress={TokenSwapAddress}
          ></Admin>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <ParticlesConf />
          <TokenSwapScreen
            Web3={web3}
            Contracts={contracts}
            Accounts={accounts}
            TokenSwapAddress={TokenSwapAddress}
          ></TokenSwapScreen>
        </React.Fragment>
      );
    }
  }
}

export default SubScreen;
