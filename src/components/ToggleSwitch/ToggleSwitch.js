// En el archivo ToggleSwitch.js, asegúrate de que reciba el estado inicial y lo use para cambios controlados
import React, { useState, useEffect } from "react";

function ToggleSwitch({ initialState = false, onToggle }) {
  const [isOn, setIsOn] = useState(initialState);

  // Efecto para actualizar el estado cuando el valor de initialState cambia
  useEffect(() => {
    setIsOn(initialState);
  }, [initialState]);

  const toggleSwitch = () => {
    const newState = !isOn;
    setIsOn(newState);
    onToggle(newState); // Llama a la función onToggle pasando el nuevo estado
  };

  return (
    <div
      onClick={toggleSwitch}
      style={{
        display: "flex",
        alignItems: "center",
        width: "50px",
        height: "25px",
        borderRadius: "15px",
        backgroundColor: isOn ? "#00c853" : "#bdbdbd", // Verde si está activo, gris si está inactivo
        padding: "3px",
        cursor: "pointer",
        transition: "background-color 0.3s", // Animación suave de cambio de color
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "white",
          transform: isOn ? "translateX(28px)" : "translateX(0)", // Posición
          transition: "transform 0.3s ease", // Animación de deslizamiento
        }}
      />
    </div>
  );
}

export default ToggleSwitch;
