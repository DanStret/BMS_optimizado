import React, { useState } from "react";
import ToggleSwitch from "../components/ToggleSwitch/ToggleSwitch";
import { updateControllerState } from "../api/controladoresApi";

function Controladores() {
  const [variadorState, setVariadorState] = useState(false);
  const [rele1State, setRele1State] = useState(false);

  // Maneja el cambio de estado para cada controlador e invoca la API
  const handleVariadorToggle = () => {
    const newState = !variadorState;
    setVariadorState(newState);
    updateControllerState("variador", newState);
  };

  const handleRele1Toggle = () => {
    const newState = !rele1State;
    setRele1State(newState);
    updateControllerState("rele1", newState);
  };

  return (
    <div>
      <h5>Controladores</h5>
      <div style={{ display: "flex", gap: "15px" }}>
        <div>
          <span>Variador</span>
          <ToggleSwitch checked={variadorState} onChange={handleVariadorToggle} />
        </div>
        <div>
          <span>Rele 1</span>
          <ToggleSwitch checked={rele1State} onChange={handleRele1Toggle} />
        </div>
        {/* Agrega más controladores aquí */}
      </div>
    </div>
  );
}

export default Controladores;
