import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import PortfolioModal from "../screens/modals/PortfolioModal.js";
import AboutModal from "../screens/modals/AboutModal.js";

export default function TokenSwapScreen({
  Web3,
  Contracts,
  Accounts,
  TokenSwapAddress,
}) {
  const [tokenSelected, setTokenSelected] = useState("SNP");
  const [switchAmount, setSwitchAmount] = useState(0);
  const [numOfTokenA, setNumOfTokenA] = useState(0);
  const [numOfTokenX, setNumOfTokenX] = useState(0);
  const [tokenSnpBalance, setTokenSnpBalance] = useState(0);
  const [tokenDGKBalance, setTokenDGKBalance] = useState(0);
  const [tokenPKTBalance, setTokenPKTBalance] = useState(0);

  const [fees, setFees] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [pktTokenPrice, setpktTokenPrice] = useState(0);
  const [snpTokenPrice, setsnpTokenPrice] = useState(0);
  const [dgkTokenPrice, setdgkTokenPrice] = useState(0);
  const [portfolioShow, setPortfolioShow] = useState(false);
  const [aboutShow, setAboutShow] = useState(false);

  const web3 = Web3;
  let contracts = Contracts;
  let accounts = Accounts;
  //Run only once
  useEffect(async () => {
    updateBalance();
    const result = await contracts[0].methods.getFees().call();
    setFees(result);
    const result2 = await contracts[0].methods.getRatio().call();
    setRatio(result2);

    await contracts[1].events.Transfer(
      { fromBlock: 0, filter: { _from: accounts[0], _to: accounts[0] } },
      async (error, event) => {
        updateBalance();
      }
    );
    await contracts[2].events.Transfer(
      { fromBlock: 0, filter: { _from: accounts[0], _to: accounts[0] } },
      async (error, event) => {
        updateBalance();
      }
    );
  }, []);

  useEffect(() => {
    calculateSwap();
  }, [switchAmount]);

  const updateBalance = async () => {
    const result = await contracts[1].methods.balanceOf(accounts[0]).call();
    setTokenSnpBalance(parseInt(result));

    const result2 = await contracts[2].methods.balanceOf(accounts[0]).call();
    setTokenDGKBalance(parseInt(result2));

    // const result3 = await contracts[3].methods.balanceOf(accounts[0]).call();
    // setTokenPKTBalance(parseInt(result3));

    const snpPrice = await contracts[1].methods.tokenPrice().call();
    setsnpTokenPrice(snpPrice);
    const xyzPrice = await contracts[2].methods.tokenPrice().call();
    setdgkTokenPrice(xyzPrice);
    // const pktPrice = await contracts[3].methods.tokenPrice().call();
    // setpktTokenPrice(pktPrice);
  };

  const swapTokens = async () => {
    if (finalAmount > 0) {
      try {
        if (tokenSelected === "SNP") {
          await contracts[1].methods
            .approve(TokenSwapAddress, switchAmount)
            .send({ from: accounts[0] });
          await contracts[0].methods
            .swapSNPtoDGK(switchAmount)
            .send({ from: accounts[0] });
        } else {
          await contracts[2].methods
            .approve(TokenSwapAddress, switchAmount)
            .send({ from: accounts[0] });
          await contracts[0].methods
            .swapDGKtoSNP(switchAmount)
            .send({ from: accounts[0] });
        }
      } catch (err) {
        alert("Transaction Failed due to the following Error" + err.message);
      }
    } else {
      alert("Cant switch Tokens with Expected return less then zero");
    }
  };

  const buyTokensPKT = async (amount) => {
    try {
      await contracts[1].methods
        .buyTokens(amount)
        .send({ from: accounts[0], value: amount * pktTokenPrice });
    } catch (err) {
      alert("Transaction Failed due to the following Error" + err);
    }
  };

  const buyTokensSNP = async (amount) => {
    try {
      await contracts[1].methods
        .buyTokens(amount)
        .send({ from: accounts[0], value: amount * snpTokenPrice });
    } catch (err) {
      alert("Transaction Failed due to the following Error" + err);
    }
  };

  const buyTokensDGK = async (amount) => {
    try {
      await contracts[2].methods
        .buyTokens(amount)
        .send({ from: accounts[0], value: amount * dgkTokenPrice });
    } catch (err) {
      alert("Transaction Failed due to the following Error" + err);
    }
  };

  const calculateSwap = () => {
    let Final;
    if (tokenSelected === "SNP") {
      const exchangeA = parseInt(switchAmount) * parseInt(ratio);
      Final = exchangeA - (exchangeA * fees) / 100;
    } else {
      const exchangeA = switchAmount / ratio;
      Final = exchangeA - (exchangeA * fees) / 100;
    }
    if (isNaN(Final)) {
      setFinalAmount(0);
    } else {
      setFinalAmount(Math.ceil(Final));
    }
  };

  return (
    <div>
      <div class="container mt-5">
        <Navbar
          expand="lg"
          bg="dark"
          variant="dark"
          style={{ borderRadius: "10px", minHeight: "80px" }}
        >
          <Container>
            <Navbar.Collapse
              className="collapse order-1 order-md-0 dual-collapse2"
              id="responsive-navbar-nav"
              style={{
                fontSize: "20px",
                width: "20%",
              }}
            >
              <Navbar.Brand
                href="/"
                style={{
                  fontSize: "40px",
                }}
              >
                PKT
              </Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="#" onClick={() => setAboutShow(true)}>
                  About
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
            <Nav className="mx-auto order-0">
              <Navbar.Text>Balance: {tokenSnpBalance} PKT</Navbar.Text>
            </Nav>
            <Navbar.Collapse
              className="collapse order-3 dual-collapse2"
              id="responsive-navbar-nav"
              style={{
                fontSize: "20px",
                width: "20%",
              }}
            >
              <Nav className="ms-auto">
                <Nav.Link onClick={() => setPortfolioShow(true)}>
                  Portfolio
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <AboutModal show={aboutShow} onHide={() => setAboutShow(false)} />

        <PortfolioModal
          tokens={[
            {
              name: "TokenSNP",
              balance: tokenSnpBalance,
              price: snpTokenPrice,
            },
            {
              name: "TokenDGK",
              balance: tokenDGKBalance,
              price: dgkTokenPrice,
            },
          ]}
          show={portfolioShow}
          onHide={() => setPortfolioShow(false)}
        />

        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            buyTokensSNP(evt.target.tkABC.value);
            evt.target.tkABC.value = "";
          }}
        >
          <div class="d-flex mt-3 input-group">
            <input
              class="form-control border"
              placeholder="Amount"
              name="tkABC"
              type="number"
              onChange={(evt) => {
                setNumOfTokenA(evt.target.value);
              }}
            ></input>
            <button class="btn-danger text-center form-control" type="submit">
              buy Token PKT
            </button>
          </div>
        </form>

        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            buyTokensSNP(evt.target.tkABC.value);
            evt.target.tkABC.value = "";
          }}
        >
          <div class="d-flex mt-3 input-group">
            <input
              class="form-control border"
              placeholder="Amount"
              name="tkABC"
              type="number"
              onChange={(evt) => {
                setNumOfTokenA(evt.target.value);
              }}
            ></input>
            <button class="btn-danger text-center form-control" type="submit">
              buy Token SNP
            </button>
          </div>
        </form>

        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            buyTokensDGK(evt.target.tkXYZ.value);
            evt.target.tkXYZ.value = "";
          }}
        >
          <div class="d-flex mt-3 input-group">
            <input
              class="form-control"
              type="number"
              placeholder="Amount"
              name="tkXYZ"
              onChange={(evt) => {
                setNumOfTokenX(evt.target.value);
              }}
            ></input>
            <button class="btn-danger text-center form-control" type="submit">
              buy Token DGK
            </button>
          </div>
        </form>
        <div class="input-group mt-3">
          <select
            onChange={(evt) => {
              setTokenSelected(evt.target.value);
            }}
            class="form-select text-center"
            aria-label="Value"
          >
            <option value="SNP">switch Token PKT with Token DGK</option>
            <option value="DGK">switch Token DGK with Token PKT</option>
          </select>
        </div>
        <div class="input-group mt-5">
          <input
            class="form-control"
            placeholder="Amount"
            type="number"
            onChange={(evt) => {
              setSwitchAmount(evt.target.value);
            }}
          ></input>
          <button
            class="btn-warning form-control"
            onClick={() => {
              swapTokens();
            }}
          >
            Swap
          </button>
        </div>
        <label class="alert alert-info mt-3">
          1 PKT = {ratio} DGK, Fees: {fees}% Expected to get:{finalAmount}
        </label>
      </div>
    </div>
  );
}
