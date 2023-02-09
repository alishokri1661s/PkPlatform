import React, { useEffect, useState } from "react";

export default function Admin({ Web3, Contracts, Accounts, TokenSwapAddress }) {
  const [ratio, setRatio] = useState(0);
  const [numOfTokenA, setNumOfTokenA] = useState(0);
  const [numOfTokenX, setNumOfTokenX] = useState(0);
  const [fees, setFees] = useState(0);
  const [tokenSnpBalance, setTokenSnpBalance] = useState(0);
  const [tokenDGKBalance, setTokenDGKBalance] = useState(0);
  const [snpTokenPrice, setsnpTokenPrice] = useState(0);
  const [dgkTokenPrice, setdgkTokenPrice] = useState(0);

  const updateBalance = async () => {
    const result = await Contracts[1].methods
      .balanceOf(TokenSwapAddress)
      .call();
    setTokenSnpBalance(parseInt(result));

    const result2 = await Contracts[2].methods
      .balanceOf(TokenSwapAddress)
      .call();
    setTokenDGKBalance(parseInt(result2));
  };

  useEffect(async () => {
    updateBalance();

    const receipt = await Contracts[1].events.Transfer(
      { fromBlock: 0, filter: { _from: Accounts[0], _to: TokenSwapAddress } },
      (error, event) => {
        updateBalance();
      }
    );
    const receipt2 = await Contracts[2].events.Transfer(
      { fromBlock: 0, filter: { _from: Accounts[0], _to: TokenSwapAddress } },
      (error, event) => {
        updateBalance();
      }
    );

    const snpPrice = await Contracts[1].methods.tokenPrice().call();
    setsnpTokenPrice(snpPrice);
    const xyzPrice = await Contracts[2].methods.tokenPrice().call();
    setdgkTokenPrice(xyzPrice);

    const result = await Contracts[0].methods.getRatio().call();
    setRatio(result);
    const result2 = await Contracts[0].methods.getFees().call();
    setFees(result2);
  }, []);

  const buyTokensSNP = async (value) => {
    await Contracts[0].methods
      .buyTokensSNP(value)
      .send({ from: Accounts[0], value: snpTokenPrice * value });
  };
  const buyTokensDGK = async (value) => {
    await Contracts[0].methods
      .buyTokensDGK(value)
      .send({ from: Accounts[0], value: dgkTokenPrice * value });
  };
  const changeFees = async (value) => {
    await Contracts[0].methods.setFees(value).send({ from: Accounts[0] });
    const result = await Contracts[0].methods.getFees().call();
    setFees(result);
  };

  const changeRatio = async (value) => {
    await Contracts[0].methods.setRatio(value).send({ from: Accounts[0] });
    const result = await Contracts[0].methods.getRatio().call();
    setRatio(result);
  };

  return (
    <div class="container">
      <div class="mt-2 d-flex justify-content-center align-items-center navbar rounded bg-warning ">
        <p class="h2 text-white">Admin panel</p>
      </div>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          changeFees(evt.target.fees.value);
          evt.target.fees.value = "";
        }}
      >
        <label class="mt-3 alert alert-info">fees: {fees}%</label>
        <div class="input-group">
          <input
            name="fees"
            type="number"
            class="text-center form-control"
            placeholder="Fees"
            min="1"
          ></input>
          <button
            class="btn-primary form-control"
            type="submit"
            style={{
              backgroundColor: "orange",
            }}
          >
            Set Fees
          </button>
        </div>
      </form>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          changeRatio(evt.target.ratio.value);
          evt.target.ratio.value = "";
        }}
      >
        <label class="mt-3 alert alert-info">Ratio: {ratio}</label>
        <div class="input-group">
          <input
            type="number"
            name="ratio"
            class="text-center form-control"
            placeholder="Ratio"
          ></input>
          <button
            class="btn-primary form-control"
            type="submit"
            style={{
              backgroundColor: "orange",
            }}
          >
            Set Ratio
          </button>
        </div>
      </form>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          buyTokensSNP(evt.target.TokenSNPAmount.value);
          evt.target.TokenSNPAmount.value = "";
        }}
      >
        <label class="mt-3 alert alert-info">
          Tokens PKT bought:{tokenSnpBalance}
        </label>
        <div class="input-group">
          <input
            type="number"
            name="TokenSNPAmount"
            class="text-center form-control"
            max="5000"
            placeholder="Amount"
          ></input>
          <button class="btn-danger form-control" type="submit">
            Buy TokenPKT
          </button>
        </div>
      </form>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          buyTokensSNP(evt.target.TokenSNPAmount.value);
          evt.target.TokenSNPAmount.value = "";
        }}
      >
        <label class="mt-3 alert alert-info">
          Tokens SNP bought:{tokenSnpBalance}
        </label>
        <div class="input-group">
          <input
            type="number"
            name="TokenSNPAmount"
            class="text-center form-control"
            max="5000"
            placeholder="Amount"
          ></input>
          <button class="btn-danger form-control" type="submit">
            Buy TokenSNP
          </button>
        </div>
      </form>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          buyTokensDGK(evt.target.TokenDGKAmount.value);
          evt.target.TokenDGKAmount.value = "";
        }}
      >
        <label class="mt-3 alert alert-info">
          Tokens DGK bought:{tokenDGKBalance}
        </label>
        <div class="input-group">
          <input
            type="number"
            name="TokenDGKAmount"
            class="text-center form-control"
            placeholder="Amount"
          ></input>
          <button class="btn-danger form-control" type="submit">
            Buy TokenDGK
          </button>
        </div>
      </form>
    </div>
  );
}
