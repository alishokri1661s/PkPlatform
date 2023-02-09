import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React from "react";
import { width } from "@mui/system";

export default function AboutModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">About Us</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <table
            style={{
              fontFamily: "arial, sans-serif",
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <tr>
              {/* <td>
                <h3>Ali Shokri</h3>
                - Web Developer
                <br />- Phone Number: +989190128693
              </td>
              <br /> */}
              <br />
              <td>
                <h3>Amirali Noorani</h3>
                - Blockchain Developer
                <br />- Phone Number: +989027444241
              </td>
            </tr>
          </table>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
