import React, { useState, useEffect } from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import { GaugeComponent } from "react-gauge-component";
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import SystemStatus from "../../components/Comun/SystemStatus";
import ImageModal from '../../components/FixedPlugin/ImageModal/ImageModal';
import '../Sistemas/styles/Prezurisacion.css'
import { FiActivity, FiZap, FiThermometer, FiPower, FiEye } from "react-icons/fi";
import { MdOutlineSensors } from "react-icons/md";

function Prezurisacion() {
  const [signals, setSignals] = useState([]);
  const [states, setStates] = useState([]);
  const [selectorMode, setSelectorMode] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl] = useState("https://scontent.flim18-1.fna.fbcdn.net/v/t1.6435-9/138752942_123194292971714_2934574921352228503_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHj6t8q62SldDEucr6hK7OTtWPe9AOLp8S1Y970A4unxHlfxU3SJgc_EXhX_awb97TwMo87jD8aRp6PZGFEAivz&_nc_ohc=VaqMHVkZRKwQ7kNvgHpRUWb&_nc_ht=scontent.flim18-1.fna&_nc_gid=AhxO7BFmUblo62Y1vqnn8L9&oh=00_AYAtLBlVADTaUoliRGoi7gfP93d_mltptMVCBUtFF3z5hQ&oe=6740EF38");

  // Estados de los dispositivos
  const [variadorState, setVariadorState] = useState(false);
  const [rele1State, setRele1State] = useState(false);
  const [rampState, setRampState] = useState(false);
  const [reverseState, setReverseState] = useState(false);
  const [data, setData] = useState({
    tensionMotor: 0,
    tensionDC: 0,
    corriente: 0,
    potencia: 0,
    frecuencia: 0,
    temperatura: 0,
    ia: 0,
    av: 0
  })




  const fetchSystemStatus = async () => {
    try {
      const response = await fetch("http://localhost:3001/system-status/1"); // Cambia el ID según sea necesario
      const { signals, states, selector } = await response.json();
  
      // Mantener los colores de las señales independientemente del estado
      const processedSignals = signals.map((signal) => ({
        ...signal,
        color: signal.status === "ON" ? signal.color : "" // No depende del status
      }));
  
      // Filtrar estados: solo enviar el color si el estado es "1"
      const processedStates = states.map((state) => ({
        ...state,
        color: state.status === "1" ? state.color : "" // Color solo si está "1"
      }));
  
      // Actualizar los estados en el componente
      setSignals(processedSignals);
      setStates(processedStates);
  
      // Actualizar el selector
      setSelectorMode(selector.name || "AUTOMATICO");
    } catch (error) {
      console.error("Error al obtener el estado del sistema:", error);
    }
  };
  
  const handleToggleSelector = async (newMode) => {
    try {
      await fetch("http://localhost:3001/toggle-selector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode }),
      });
      setSelectorMode(newMode); // Actualiza el estado tras la respuesta
    } catch (error) {
      console.error("Error al cambiar el modo:", error);
    }
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
    const fetchInitialData = async () => {
      await fetchSystemStatus(); // Sincronizar el estado inicial
      fetchDeviceStatus();
      fetchIndicators();
    };
  
    fetchInitialData();
    const intervalId = setInterval(() => {
      fetchSystemStatus();
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
  }

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
      <SystemStatus
          signals={signals}
          states={{
            parada: states.find(state => state.name === "PARADA")?.color || "",
            marcha: states.find(state => state.name === "MARCHA")?.color || "",
            error: states.find(state => state.name === "ERROR")?.color || "",
          }}
          selectorMode={selectorMode || "AUTOMATICO"} // Sincroniza con el estado inicial
          onToggleSelector={handleToggleSelector} // Maneja el cambio
        />

        <Col md="6" className="card-container">
          <Card className="h-100">
            <CardBody style={{ position: "relative" }}>
              <h5>Controladores</h5>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                height: "50%",
              }}>
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
                  <ToggleSwitch onToggle={handleReverseToggle} />
                </div>
              </div>

              {/* Ícono de ojo en la esquina superior derecha */}
              <FiEye
                onClick={toggleImageModal} // Acción al hacer clic
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  fontSize: "1.5rem",
                  color: "#007bff",
                  cursor: "pointer"
                }}
              />
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
                  colorArray: ['#FF2121', '#FF8C00', '#FFD700', '#00FF15'], // Colores para representar distintos niveles
                  padding: 0.02,
                  subArcs: [
                    { limit: 15, color: '#FF2121' }, // Rango verde hasta 15hz
                    { limit: 30, color: '#FFD700' }, // Amarillo hasta 30hz
                    { limit: 45, color: '#FF8C00' }, // Naranja hasta 45hz
                    { limit: 60, color: '#00FF15' } // Rojo hasta 60hz
                  ]
                }}
                pointer={{
                  type: "blob",
                  animationDelay: 0,
                  length: 0.8,
                  width: 15
                }}
                labels={{
                  valueLabel: {
                    formatTextValue: (value) => `${value} Hz` // Mostrar en grados Celsius
                  },
                  tickLabels: {
                    type: 'outer',
                    defaultTickValueConfig: {
                      formatTextValue: (value) => `${value} Hz`,
                      style: { fontSize: 10 }
                    },
                    ticks: [
                      { value: 0, label: '0 Hz' },
                      { value: 15, label: '15 Hz' },
                      { value: 30, label: '30 Hz' },
                      { value: 45, label: '45 Hz' },
                      { value: 60, label: '60 Hz' }
                    ],
                  }
                }}
                value={data.frecuencia} // Ajusta el valor para cada métrica en grados Celsius
                minValue={0} // Establece el mínimo
                maxValue={60} // Establece el máximo para que quede bien alineado
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
                  colorArray: ['#00FF15', '#FFD700', '#FF8C00', '#FF2121'], // Colores para representar distintos niveles
                  padding: 0.02,
                  subArcs: [
                    { limit: 10, color: '#00FF15' }, // Rango verde hasta 25°C
                    { limit: 20, color: '#FFD700' }, // Amarillo hasta 50°C
                    { limit: 30, color: '#FF8C00' }, // Naranja hasta 75°C
                    { limit: 40, color: '#FF2121' } // Rojo hasta 100°C
                  ]
                }}
                pointer={{
                  type: "blob",
                  animationDelay: 0,
                  length: 0.8,
                  width: 15
                }}
                labels={{
                  valueLabel: {
                    formatTextValue: (value) => `${value} A` // Mostrar en grados Celsius
                  },
                  tickLabels: {
                    type: 'outer',
                    defaultTickValueConfig: {
                      formatTextValue: (value) => `${value} A`,
                      style: { fontSize: 10 }
                    },
                    ticks: [
                      { value: 0, label: '0 A' },
                      { value: 10, label: '10 A' },
                      { value: 20, label: '20 A' },
                      { value: 30, label: '30 A' },
                      { value: 40, label: '40 A' }
                    ],
                  }
                }}
                value={data.corriente} // Ajusta el valor para cada métrica en grados Celsius
                minValue={0} // Establece el mínimo
                maxValue={40} // Establece el máximo para que quede bien alineado
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
                  colorArray: ['#00FF15', '#FFD700', '#FF8C00', '#FF2121'], // Colores para representar distintos niveles
                  padding: 0.02,
                  subArcs: [
                    { limit: 15, color: '#00FF15' }, // Rango verde hasta 25°C
                    { limit: 25, color: '#FFD700' }, // Amarillo hasta 50°C
                    { limit: 45, color: '#FF8C00' }, // Naranja hasta 75°C
                    { limit: 70, color: '#FF2121' } // Rojo hasta 100°C
                  ]
                }}
                pointer={{
                  type: "blob",
                  animationDelay: 0,
                  length: 0.8,
                  width: 15
                }}
                labels={{
                  valueLabel: {
                    formatTextValue: (value) => `${value} Kw` // Mostrar en grados Celsius
                  },
                  tickLabels: {
                    type: 'outer',
                    defaultTickValueConfig: {
                      formatTextValue: (value) => `${value} Kw`,
                      style: { fontSize: 10 }
                    },
                    ticks: [
                      { value: 0, label: '0 Kw' },
                      { value: 15, label: '15 Kw' },
                      { value: 25, label: '25 Kw' },
                      { value: 45, label: '45 Kw' },
                      { value: 70, label: '75 Kw' }
                    ],
                  }
                }}
                value={data.corriente} // Ajusta el valor para cada métrica en grados Celsius
                minValue={0} // Establece el mínimo
                maxValue={70} // Establece el máximo para que quede bien alineado
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
                  colorArray: ['#00FF15', '#FFB400', '#FF2121'], // Colores para bajo, medio, y alto
                  padding: 0.02,
                  subArcs: [
                    { limit: 30, color: '#00FF15' },  // Verde para temperaturas bajas
                    { limit: 60, color: '#FFD700' },  // Amarillo para temperaturas medias
                    { limit: 90, color: '#FFA500' },  // Naranja para temperaturas moderadamente altas
                    { limit: 120, color: '#FF4500' },  // Rojo claro para altas
                    { limit: 150, color: '#FF2121' }  // Rojo fuerte para muy altas
                  ]
                }}
                pointer={{
                  type: "blob",
                  animationDelay: 0,
                  color: '#345243',  // Color para el puntero
                  length: 0.8,  // Ajusta la longitud del puntero para que sea visible
                  width: 15
                }}
                labels={{
                  valueLabel: { formatTextValue: (value) => `${value}ºC` },  // Muestra el valor actual con ºC
                  tickLabels: {
                    type: 'outer',
                    defaultTickValueConfig: {
                      formatTextValue: (value) => `${value}ºC`,
                      style: { fontSize: 10 }
                    },
                    ticks: [
                      { value: 0, label: '0ºC' },
                      { value: 30, label: '30ºC' },
                      { value: 60, label: '60ºC' },
                      { value: 90, label: '90ºC' },
                      { value: 120, label: '120ºC' },
                      { value: 150, label: '150ºC' }
                    ]
                  }
                }}
                value={data.temperatura}  // Ajusta el valor para cada métrica (en grados Celsius)
                minValue={0}  // Rango mínimo
                maxValue={150}  // Rango máximo
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
