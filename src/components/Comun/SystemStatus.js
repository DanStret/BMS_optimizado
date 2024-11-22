import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import LedIndicator from "./Leds/LedIndicator";

function SystemStatus({ signals, states, selectorMode, onToggleSelector }) {
  const handleToggle = () => {
    const newMode = selectorMode === "AUTOMATICO" ? "MANUAL" : "AUTOMATICO";
    onToggleSelector(newMode); // Notifica al padre directamente
  };

  return (
    <>
      <style>
        {`
          .system-status-left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px 0 0 50px;
            gap: 15px;
          }

          .status-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            color: #fff; /* Ajusta el color del texto */
          }

          .system-status-right {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
          }

          .status-indicators {
            display: flex;
            justify-content: space-around;
            width: 100%;
          }

          .indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
            color: #fff; /* Ajusta el color del texto */
          }

          .selector-button {
            background-color: #007bff;
            color: white;
            padding: 8px 15px;
            font-size: 14px;
            font-weight: bold;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            width: 60%;
          }

          .selector-button:hover {
            background-color: #0056b3;
          }
        `}
      </style>
      <Col md="6" className="system-status-container">
        <Card className="h-100">
          <CardBody>
            <h5>Estado del sistema</h5>
            <Row>
              <Col md="6" className="system-status-left">
                {signals.map((signal, index) => (
                  <div key={index} className="status-item">
                    <LedIndicator color={signal.color} />
                    <span>{signal.name}</span>
                  </div>
                ))}
              </Col>
              <Col md="6" className="system-status-right">
                <div className="status-indicators">
                  <div className="indicator">
                    <span>Parada</span>
                    <LedIndicator color={states.parada} />
                  </div>
                  <div className="indicator">
                    <span>Marcha</span>
                    <LedIndicator color={states.marcha} />
                  </div>
                  <div className="indicator">
                    <span>Error</span>
                    <LedIndicator color={states.error} />
                  </div>
                </div>
                <button
                  className="selector-button"
                  onClick={handleToggle}
                >
                  {selectorMode || "Cargando..."}
                </button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

export default SystemStatus;
