import React, { Component, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import snapp from "../assets/snapp.png";
import tapsi from "../assets/tapsi.png";
import digikala from "../assets/Digikala.png";
import pkt from "../assets/pkt.png";
import { ParticlesConf } from "../components/ParticlesConf";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import TokenPKT from "../contracts/PkToken.json";
import TokenSNP from "../contracts/TokenSNP.json";
import TokenDGK from "../contracts/TokenDGK.json";
import getWeb3 from "../getWeb3";
import PortfolioModal from "./modals/PortfolioModal.js";
import AboutModal from "./modals/AboutModal.js";

const images = [
  {
    url: digikala,
    title: "digikala",
  },
  // {
  //   url: tapsi,
  // },
  {
    url: snapp,
    title: "snapp",
  },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 200,
  [theme.breakpoints.down("sm")]: {
    width: "100% !important",
    height: 100,
  },
}));
const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  borderRadius: "50px",
  backgroundSize: "85%",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

function HomeScreen() {
  const [web3, setweb3] = useState(null);
  const [accounts, setaccounts] = useState([]);
  const [networkId, setNetworId] = useState(null);
  const [deployedNetwork, setDeployedNetwork] = useState(null);
  const [contracts, setContracts] = useState(null);
  const [tokenSnpBalance, setTokenSnpBalance] = useState(0);
  const [tokenDGKBalance, setTokenDGKBalance] = useState(0);
  const [tokenPKTBalance, setTokenPKTBalance] = useState(0);

  const [pktTokenPrice, setpktTokenPrice] = useState(0);
  const [snpTokenPrice, setsnpTokenPrice] = useState(0);
  const [dgkTokenPrice, setdgkTokenPrice] = useState(0);
  const [portfolioShow, setPortfolioShow] = useState(false);
  const [aboutShow, setAboutShow] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();

        const metaMaskAccounts = await web3.eth.getAccounts();

        const networkId = await web3.eth.net.getId();

        // const deployedNetworkTokenPKT = TokenPKT.networks[networkId];
        const deployedNetworkTokenSNP = TokenSNP.networks[networkId];
        const deployedNetworkTokenDGK = TokenDGK.networks[networkId];

        const instance2 = await new web3.eth.Contract(
          TokenSNP.abi,
          deployedNetworkTokenSNP && deployedNetworkTokenSNP.address
        );
        const instance3 = await new web3.eth.Contract(
          TokenDGK.abi,
          deployedNetworkTokenDGK && deployedNetworkTokenDGK.address
        );
        // const instance4 = await new web3.eth.Contract(
        //   TokenPKT.abi,
        //   deployedNetworkTokenPKT && deployedNetworkTokenPKT.address
        // );

        const con = [instance2, instance3];

        setweb3(web3);
        setDeployedNetwork(deployedNetwork);
        setaccounts(metaMaskAccounts);
        setNetworId(networkId);
        await setContracts(con);
        await updateBalance(con, metaMaskAccounts);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    init();
  }, []);

  const updateBalance = async (contracts, accounts) => {
    const result = await contracts[0].methods.balanceOf(accounts[0]).call();
    setTokenSnpBalance(parseInt(result));

    const result2 = await contracts[1].methods.balanceOf(accounts[0]).call();
    setTokenDGKBalance(parseInt(result2));

    // const result3 = await contracts[2].methods.balanceOf(accounts[0]).call();
    // setTokenPKTBalance(parseInt(result3));

    const snpPrice = await contracts[0].methods.tokenPrice().call();
    setsnpTokenPrice(snpPrice);
    const dgkPrice = await contracts[1].methods.tokenPrice().call();
    setdgkTokenPrice(dgkPrice);
    // const pktPrice = await contracts[2].methods.tokenPrice().call();
    // setpktTokenPrice(pktPrice);
  };

  return (
    <div>
      <div class="container mt-5">
        <ParticlesConf />
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
                <Nav.Link onClick={() => setAboutShow(true)}>About</Nav.Link>
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
            {
              name: "TokenPKT",
              balance: tokenPKTBalance,
              price: pktTokenPrice,
            },
          ]}
          show={portfolioShow}
          onHide={() => setPortfolioShow(false)}
        />
      </div>
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "85%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImageButton
          style={{
            width: "25%",
            height: "25%",
            margin: 4,
          }}
          href="/main"
        >
          <ImageSrc
            style={{
              backgroundImage: `url(${pkt})`,
            }}
          />
        </ImageButton>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            minWidth: 300,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {images.map((image) => (
            <ImageButton
              style={{
                width: "20%",

                margin: 10,
              }}
              href={image.title}
            >
              <ImageSrc
                style={{
                  backgroundImage: `url(${image.url})`,
                }}
              />
            </ImageButton>
          ))}
        </Box>
      </div>
    </div>
  );
}

export default HomeScreen;
