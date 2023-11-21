import React from "react";
import "./NomeStock.css";

const NomeStock = props => {

  const addPreferiti = () => {
    props.onAddPreferiti();
  }
  
  /*When the form in Cerca.js is submit,
   under it appear the result, a grey square with a round plus icon,
   and two values: Stock name and Last Refreshed Date*/
  return (
    <div className="nomestock" onClick={addPreferiti}>
      <i title="Add" className="fas fa-plus-circle m-1"></i>
        {props.datistock?.[`Meta Data`]['2. Symbol']?.toString()} - {props.datistock?.[`Meta Data`]['3. Last Refreshed']}
      
    </div>
  )
}

export default NomeStock;