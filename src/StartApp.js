import { useState } from "react";
import App from "./App";
import './App.css'

function StartApp(props) {
  const [start, setStart] = useState(false);
  return(
    <div className="start-app App container-fluid">
      {!start
      && <div>
            <h1>Nasdaq React <i className="fas fa-globe"></i></h1>
            <button className="start-btn btn btn-primary" onClick={() => setStart(!start)}>Start</button>
        </div>
        }
      {start &&       
      <App />}
    </div>
  )
}
export default StartApp
