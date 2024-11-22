import React from "react";

function Button({ label, onClick, className = '', disabled = false }) {
  return (
    <button 
      className={`button ${className}`} 
      onClick={onClick} 
      disabled={disabled}
      style={{
        backgroundColor: "#007bff",  
        color: "white",              
        border: "none",              
        padding: "8px 10px",         
        borderRadius: "8px",         
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "16px",            
        fontWeight: "bold",          
        transition: "background-color 0.3s",
      }}
    >
      {label}
    </button>
  );
}

export default Button;
