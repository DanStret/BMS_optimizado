import React from "react";

function LedIndicator({ color = "red" }) {
  const getColor = () => {
    switch (color) {
      case "verde":
        return "rgba(2, 246, 10, 0.8)"; // Verde
      case "rojo":
        return "rgba(255, 0, 0, 0.8)"; // Rojo
      case "azul":
        return "rgba(0, 0, 255, 0.8)"; // Azul
      case "ambar":
        return "rgba(255, 191, 0, 0.8)"; // Ámbar
      case "negro":
        return "rgba(0, 0, 0, 0.8)"; // Negro
      case "plomo":
        return "rgba(138,149,151)";
      default:
        return "rgba(0, 0, 0, 154)"; // Rojo por defecto si no hay coincidencia
    }
  };

  const selectedColor = getColor();

  return (
    <div
      style={{
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        backgroundColor: selectedColor,
        boxShadow: `0 0 8px ${selectedColor}, 0 0 16px ${selectedColor}, 0 0 24px ${selectedColor}`,
        animation: "blink 1s infinite alternate", // Añadir animación de parpadeo
        transition: "background-color 0.3s, box-shadow 0.3s",
      }}
    >
      <style>
        {`
          @keyframes blink {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0.3;
            }
          }
        `}
      </style>
    </div>
  );
}

export default LedIndicator;
