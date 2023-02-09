import { Modal } from "react-bootstrap";
import React from "react";
import Button from "react-bootstrap/Button";

export default function PortfolioModal(props) {
  let tokenSnpBalance = props.tokens[0].balance;
  let tokenDGKBalance = props.tokens[1].balance;
  // let tokenPKTBalance = props.tokens[2].balance;
  let snpTokenPrice = parseFloat(props.tokens[0].price / Math.pow(10, 18));
  let dgkTokenPrice = parseFloat(props.tokens[1].price / Math.pow(10, 18));
  // let pktTokenPrice = parseFloat(props.tokens[2].price / Math.pow(10, 10));

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Portfolio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table
          style={{
            fontFamily: "arial, sans-serif",
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <tr>
            <th>Token Name</th>
            <th>Balance</th>
            <th>Price</th>
          </tr>
          <tr>
            <td>TokenPKT</td>
            <td>{tokenSnpBalance}</td>
            <td>{snpTokenPrice} ETH</td>
          </tr>
          <tr>
            <td>TokenSNP</td>
            <td>{tokenSnpBalance}</td>
            <td>{snpTokenPrice} ETH</td>
          </tr>
          <tr>
            <td>TokenDGK</td>
            <td>{tokenDGKBalance}</td>
            <td>{dgkTokenPrice} ETH</td>
          </tr>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
