import React from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button } from "reactstrap";

function Piso2() {
  return (
    <div className="content">
      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <Card className="text-center">
              <CardBody>
                <CardTitle tag="h2">Piso 2</CardTitle>
                <CardText>
                  Bienvenido al Piso 2. Aquí puedes mostrar información o contenido específico relacionado con este piso.
                </CardText>
                {/* Agrega cualquier contenido específico para el Piso 1 aquí */}
                <Button color="primary" onClick={() => alert("Acción para el Piso 2")}>
                  Acción específica del Piso 2
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Piso2;