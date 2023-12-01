import { useState } from "react";
import App from "./App";
import './StartApp.css'

//Definisco il componente Hook
function StartApp(props) {

  //Definisco una variabile di stato
  const [start, setStart] = useState(false);

  return(
    <div className="start-app container-fluid">

      {/*Inserisco dinamicamente var di stato ed elemento JSX*/}
      {!start
      && <div>
            <h1>Nasdaq React <i className="fas fa-globe"></i></h1>
            <button className="start-btn btn btn-primary" onClick={() => setStart(!start)}>Start</button>
        </div>
        }

      {/*Tramite il metodo onClick definito, inserisco App*/}
      {start &&       
      <App />}
    </div>
  )
}
export default StartApp;