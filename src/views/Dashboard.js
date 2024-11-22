/*!
=========================================================
* Black Dashboard React v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Row,
  Col
} from "reactstrap";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleSelectPiso = (piso) => {
    navigate(`/admin/piso${piso}`); // Uso correcto de template strings
  };

  return (
    <>
      <div className="content">
        <Row className="justify-content-center">
          <Col md="4" className="text-center">
            <img 
              alt="Edificio"
              className="avatar"
              src={require("assets/img/edificio.png")}
            />
            <UncontrolledDropdown direction="up">
              <DropdownToggle caret color="primary" className="w-100">
                Seleccionar Piso
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => handleSelectPiso(1)}>Piso 1</DropdownItem>
                <DropdownItem onClick={() => handleSelectPiso(2)}>Piso 2</DropdownItem>
                <DropdownItem onClick={() => handleSelectPiso(3)}>Piso 3</DropdownItem>
                <DropdownItem onClick={() => handleSelectPiso(4)}>Piso 4</DropdownItem>
                <DropdownItem onClick={() => handleSelectPiso(5)}>Piso 5</DropdownItem>
                <DropdownItem onClick={() => handleSelectPiso(6)}>Piso 6</DropdownItem>
                <DropdownItem onClick={() => handleSelectPiso(7)}>Piso 7</DropdownItem>
                <DropdownItem onClick={() => handleSelectPiso(8)}>Terraza</DropdownItem>
             </DropdownMenu>
            </UncontrolledDropdown>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;