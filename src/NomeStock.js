import React from "react";
import "./NomeStock.css";

/*Definisco un componente senza stato.
Graficamente farà comparire un riquadro grigio
che conterrà la sigla dello Stock, e una data*/
const NomeStock = props => {

  /*Definisco un metodo per richiamare
  il metodo del componente genitore*/
  const addPreferiti = () => {
    props.onAddPreferiti();
  }

  //Definisco le variabili contenenti le mie props
  const acronym = props.datistock?.[`Meta Data`]['2. Symbol']?.toString();
  const date = props.datistock?.[`Meta Data`]['3. Last Refreshed'];  
  
  return (
    <div className="nomestock" onClick={addPreferiti}>
      
      <i title="Add" className="fas fa-plus-circle m-1"></i>
        {acronym} - {date}
      
    </div>
  )
}

export default NomeStock;