import React, { useState, useEffect } from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import { GaugeComponent } from "react-gauge-component";
import ToggleSwitch from "../components/ToggleSwitch/ToggleSwitch";
import Button from "../components/FixedPlugin/Buttons/Button";
import LedIndicator from "../components/Leds/LedIndicator";
import ImageModal from "../components/FixedPlugin/ImageModal/ImageModal"; // Importa el modal de imagen
import { FiActivity, FiZap, FiThermometer, FiPower } from "react-icons/fi";
import { MdOutlineSensors } from "react-icons/md";

function Prezurisacion() {
  const [ledColor, setLedColor] = useState("red");
  const [ledStatusText, setLedStatusText] = useState("Desconocido");
  const [isAutomatic, setIsAutomatic] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl] = useState("https://scontent.flim18-1.fna.fbcdn.net/v/t1.6435-9/138752942_123194292971714_2934574921352228503_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHj6t8q62SldDEucr6hK7OTtWPe9AOLp8S1Y970A4unxHlfxU3SJgc_EXhX_awb97TwMo87jD8aRp6PZGFEAivz&_nc_ohc=VaqMHVkZRKwQ7kNvgHpRUWb&_nc_ht=scontent.flim18-1.fna&_nc_gid=AhxO7BFmUblo62Y1vqnn8L9&oh=00_AYAtLBlVADTaUoliRGoi7gfP93d_mltptMVCBUtFF3z5hQ&oe=6740EF38");

  // Estados de los dispositivos
  const [variadorState, setVariadorState] = useState(false);
  const [rele1State, setRele1State] = useState(false);
  const [rampState, setRampState] = useState(false);
  const [reverseState, setReverseState] = useState(false);
  const [data, setData] = useState({
          tensionMotor: 0,
          tensionDC	: 0,
          corriente: 0,
          potencia: 0,
          frecuencia: 0,
          temperatura: 0,
          ia: 0,
          av: 0
  })

  const fetchLedStatus = async () => {
    try {
      const response = await fetch("https://apibms.onrender.com/api/led-status");
      const data = await response.json();
      if (data && data.color) {
        setLedColor(data.color);
        updateStatusBasedOnColor(data.color);
      }
    } catch (error) {
      console.error("Error al obtener el estado del LED:", error);
    }
  };

  const updateStatusBasedOnColor = (color) => {
    const statusText = {
      verde: "En funcionamiento",
      ambar: "Modo Manual",
      azul: "Modo BMS",
      negro: "Humo Detectado",
      rojo: "Apagado"
    };
    setLedStatusText(statusText[color] || "Desconocido");
    setIsAutomatic(color === "verde");
  };

  const fetchDeviceStatus = async () => {
    try {
      const response = await fetch("https://apibms.onrender.com/api/device-status");
      const data = await response.json();

      // Actualizar el estado de cada dispositivo basado en los datos obtenidos
      data.forEach((device) => {
        switch (device.dispositivo) {
          case "Variador":
            setVariadorState(device.estado === "ON");
            break;
          case "Rele 1":
            setRele1State(device.estado === "ON");
            break;
          case "Ramp":
            setRampState(device.estado === "ON");
            break;
          case "Reverse":
            setReverseState(device.estado === "ON");
            break;
          default:
            break;
        }
      });
    } catch (error) {
      console.error("Error al obtener el estado de los dispositivos:", error);
    }
  };

  useEffect(() => {
    fetchLedStatus();
    fetchDeviceStatus();
    fetchIndicators();
    const intervalId = setInterval(() => {
      fetchLedStatus();
      fetchIndicators();
    }, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(intervalId);
  }, []);

  const enviarComando = async (dispositivo, comando, estado) => {
    try {
      await fetch("https://apibms.onrender.com/api/send-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dispositivo, comando, estado }),
      });
    } catch (error) {
      console.error("Error al enviar el comando:", error);
    }
  };

  const fetchIndicators = async () => {
    try {
      const response = await fetch("https://apibms.onrender.com/api/indicadores");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error al obtener los datos de indicadores:", error);
    }
  };

  // Handlers para cada dispositivo
  const handleVariadorToggle = (isOn) => {
    setVariadorState(isOn);
    enviarComando("Variador", isOn ? 1148 : 1076, isOn ? "ON" : "OFF");
  };

  const handleRele1Toggle = (isOn) => {
    setRele1State(isOn);
    enviarComando("Rele 1", isOn ? 3072 : 1024, isOn ? "ON" : "OFF");
  };

  const handleRampToggle = (isOn) => {
    setRampState(isOn);
    if (isOn) enviarComando("Ramp", 1084, "ON");
  };

  const handleReverseToggle = (isOn) => {
    setReverseState(isOn);
    if (isOn) enviarComando("Reverse", 33916, "ON");
  };

  const toggleImageModal = () => {
    setShowImage(!showImage);
  };

  return (
    <div className="content">
      <h4>Panel de control</h4>
      <Row style={{ marginBottom: "20px" }}>
        <Col md="6">
          <Card className="h-100">
            <CardBody>
              <h5>Estado del sistema</h5>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <LedIndicator color={ledColor} />
                <span style={{ fontSize: "1rem", color: "#FFFFFF" }}>{ledStatusText}</span>
                <Button
                  label={isAutomatic ? "Automático" : "Manual"}
                  onClick={() => setIsAutomatic(!isAutomatic)}
                  style={{
                    backgroundColor: isAutomatic ? "#007bff" : "#dc3545",
                    color: "white",
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Card className="h-100">
            <CardBody>
              <h5>Controladores</h5>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span>Variador</span>
                  <ToggleSwitch initialState={variadorState} onToggle={handleVariadorToggle} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span>Rele 1</span>
                  <ToggleSwitch initialState={rele1State} onToggle={handleRele1Toggle} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span>Ramp</span>
                  <ToggleSwitch onToggle={handleRampToggle} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span>Reverse</span>
                  <ToggleSwitch  onToggle={handleReverseToggle} />
                </div>
                <Button label="Ver Imagen" onClick={toggleImageModal} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal de imagen */}
      {showImage && <ImageModal imageUrl={imageUrl} onClose={toggleImageModal} />}


      {/* Contenedor de indicadores con GaugeComponent en una fila de 4 gauges */}
      <Row style={{ marginBottom: "-10px" }}>
        <Col md="3">
          <Card className="h-90">
            <CardBody>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FiActivity style={{ color: "#D65FFA", fontSize: "2rem" }} />
                <h6 style={{ margin: 0 }}>Frecuencia (Hz)</h6>
              </div>
              <GaugeComponent
                type="semicircle"
                arc={{
                  colorArray: ['#00FF15', '#FF2121'],
                  padding: 0.02,
                  subArcs: [
                    { limit: 40 },
                    { limit: 60 },
                    { limit: 70 },
                    {},
                    {},
                    {},
                    {}
                  ]
                }}
                pointer={{ type: "blob", animationDelay: 0 }}
                value={data.frecuencia} // Ajusta el valor para cada métrica
              />
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="h-90">
            <CardBody>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FiZap style={{ color: "#FFD700", fontSize: "2rem" }} />
                <h6 style={{ margin: 0 }}>Corriente (A)</h6>
              </div>
              <GaugeComponent
                type="semicircle"
                arc={{
                  colorArray: ['#00FF15', '#FF2121'],
                  padding: 0.02,
                  subArcs: [
                    { limit: 40 },
                    { limit: 60 },
                    { limit: 70 },
                    {},
                    {},
                    {},
                    {}
                  ]
                }}
                pointer={{ type: "blob", animationDelay: 0 }}
                value={data.corriente} // Ajusta el valor para cada métrica
              />
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="h-90">
            <CardBody>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FiPower style={{ color: "#FF4500", fontSize: "2rem" }} />
                <h6 style={{ margin: 0 }}>Potencia (Kw)</h6>
              </div>
              <GaugeComponent
                type="semicircle"
                arc={{
                  colorArray: ['#00FF15', '#FF2121'],
                  padding: 0.02,
                  subArcs: [
                    { limit: 40 },
                    { limit: 60 },
                    { limit: 70 },
                    {},
                    {},
                    {},
                    {}
                  ]
                }}
                pointer={{ type: "blob", animationDelay: 0 }}
                value={data.potencia} // Ajusta el valor para cada métrica
              />
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="h-90">
            <CardBody>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FiThermometer style={{ color: "#1E90FF", fontSize: "2rem" }} />
                <h6 style={{ margin: 0 }}>Temperatura (°C)</h6>
              </div>
              <GaugeComponent
                type="semicircle"
                arc={{
                  colorArray: ['#00FF15', '#FF2121'],
                  padding: 0.02,
                  subArcs: [
                    { limit: 40 },
                    { limit: 60 },
                    { limit: 70 },
                    {},
                    {},
                    {},
                    {}
                  ]
                }}
                pointer={{ type: "blob", animationDelay: 0 }}
                value={data.temperatura} // Ajusta el valor para cada métrica
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Contenedor de sensores en una fila */}
      <Row className="mb-3">
        <Col md="3">
          <Card className="h-90">
            <CardBody>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MdOutlineSensors style={{ color: "blue", fontSize: "2rem", verticalAlign: "middle" }} />
                <h6 style={{ margin: 0 }}>SENSOR AI (mA)</h6>
              </div>

              <p style={{ fontSize: "2rem", textAlign: "center", color: "#FFFFFF" }}>{data.ia} mA</p>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="h-90">
            <CardBody>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MdOutlineSensors style={{ color: "blue", fontSize: "2rem", verticalAlign: "middle" }} />
                <h6 style={{ margin: 0 }}>SENSOR Av (V)</h6>
              </div>
              <p style={{ fontSize: "2rem", textAlign: "center", color: "#FFFFFF" }}>{data.av} V</p>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="h-90">
            <CardBody>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MdOutlineSensors style={{ color: "blue", fontSize: "2rem", verticalAlign: "middle" }} />
                <h6 style={{ margin: 0 }}>Voltage motor (V)</h6>
              </div>
              <p style={{ fontSize: "2rem", textAlign: "center", color: "#FFFFFF" }}>{data.tensionMotor} V</p>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="h-90">
            <CardBody>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FiThermometer style={{ color: "#1E90FF", fontSize: "2rem" }} />
                <h6 style={{ margin: 0 }}>Bus Danfoss (Vdc)</h6>
              </div>
              <p style={{ fontSize: "2rem", textAlign: "center", color: "#FFFFFF" }}>{data.tensionDC} Vdc</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Prezurisacion;
