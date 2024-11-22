import React from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

function Piso1() {
  const navigate = useNavigate();

  const handleNavigateToPresurizacion = () => {
    navigate("/admin/prezurisacion");
  };

  return (
    <div className="content">
      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <Card className="text-center">
              <CardBody>
              <CardTitle tag="h2" style={{ fontWeight: "bold" }}>Piso 1</CardTitle>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Bienvenido al piso 1</p>
                  <p>Aquí visualizarás los diversos sistemas que se encuentran en este piso.</p>
                </div>
                <Button
                  color="primary"
                  onClick={handleNavigateToPresurizacion}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                  <img
                    src={require("assets/img/Presuri.jpg")}
                    alt="Sistema de Presurización"
                    style={{ width: "400px", height: "200px", marginBottom: "12px" }}
                  />
                  Sistema de Presurización
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Piso1;
