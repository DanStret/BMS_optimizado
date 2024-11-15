import React from "react";

function ImageModal({ imageUrl, onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        position: "relative",
        width: "80%",
        maxWidth: "600px",
        padding: "10px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
      }}>
        {/* Imagen con un tamaño ajustado */}
        <img src={imageUrl} alt="Imagen del dispositivo" style={{ width: "100%", height: "auto", maxHeight: "80vh", borderRadius: "8px" }} />
        
        {/* Botón de cierre sobre la imagen */}
        <button 
          onClick={onClose} 
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "10px",
            backgroundColor: "rgba(255, 0, 0, 0.7)",
            color: "white",
            border: "none",
            borderRadius: "10%",
            cursor: "pointer",
            fontSize: "1rem"
          }}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default ImageModal;
