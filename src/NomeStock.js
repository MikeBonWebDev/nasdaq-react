import React from "react";
import "./NomeStock.css";

const NomeStock = props => {

  const addPreferiti = () => {
    props.onAddPreferiti();
  }

  return (
    <div className="nomestock" onClick={addPreferiti}>
      <i className="fas fa-plus-circle m-1"></i>
        {props.datistock?.[`Meta Data`]['2. Symbol']?.toString()} - {props.datistock?.[`Meta Data`]['3. Last Refreshed']}
      
    </div>
  )
}

export default NomeStock;