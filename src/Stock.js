import React, { Component } from 'react';
import './Stock.css';
import Grafico from './Grafico';

//Definisco un componente con stato. Notazione delle classi.
class Stock extends Component {

  constructor(props) {
    super(props);

    //Assegno le mie props a delle costanti...
    const nome = this.props.datistock?.[`Meta Data`][`2. Symbol`];
    const arrData = this.getArrayData(this.props.datistock?.[`Time Series (1min)`]);
    const dataValues = this.getArrayDataValues(this.props.datistock?.[`Time Series (1min)`]);
    const arrDataHours = this.getArrayHour(arrData);

    //...che vado poi ad assegnare alle mie variabili di stato
    this.state = { 
      nome,
      quotazione: ``,
      data: arrData,
      prices: dataValues[0],
      hours: arrDataHours,
      onLoad: false,
      showErrorUpdate: false,
      msgUpdateError: null,
      checkRt: ``,
      datigrafico: [{datetime: '', price: 0}],
      showGrafico: false,      
    };
  } 

  //Definisco un metodo che mi restituisce oggetti Date dal JSON di partenza
  getArrayData = (dataArg) => {
    const mainObjData = dataArg;
    const secondaryStringData = Object.keys(mainObjData);

    const ObjectDate = secondaryStringData.map( data => new Date(data)); 

    return ObjectDate;
  }

  //Recupero i valori giornalieri
  getArrayDataValues = (dataVal) => {
    const mainData = dataVal;
    const secondaryData = Object.keys(mainData).map((key) => ({
      ...mainData[key]
    }));
    
    return secondaryData;
  }

  //Definisco il formato dell'ora
  getHourFormat = (hourData) => {
    const hour = hourData.getHours();
    const minute = hourData.getMinutes();
    const second = hourData.getSeconds();
    const fullHour = hour.toString().padStart(2, 0)
    + `:` + minute.toString().padStart(2, 0)
    + `:` + second.toString().padStart(2, 0);
    return fullHour;
  }

  //Grazie al metodo precedente, estrapolo tutti gli orari
  getArrayHour = (dateObjects) => {
    const hoursArray = dateObjects.map(date =>
       this.getHourFormat(date)
      );
    return hoursArray;
  }

  /*Aggiorno i valori visualizzati con dei valori più recenti, se disponibili -
  - Tale metodo è molto simile al metodo definito in 'App.js'*/
  getNewPrice = async (str) => {
    const accessKeyAlphaV = process.env.AV_API_KEY;
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${str}&interval=1min&outputsize=compact&apikey=${accessKeyAlphaV}&datatype=json`;
    try {
      this.setState({
        onLoad: true,
        showErrorUpdate: false,
      })
      const response = await fetch(apiUrl);
      const r = await response.json();

      //Verifico che non vi sia un oggetto vuoto
      if (Object.keys(r).length === 0) {
        throw new Error(`Errore generico,
        verificare la correttezza delle informazioni inserite`)
      }

      //Gestisco gli errori
      const data = r;
      const { 'Error Message' : invalidInput } = r;
      const { Information } = r;
      const result = invalidInput ?? data ?? Information;
      
      if (invalidInput) {
        throw new Error(`Nessuna corrispondenza trovata`);
      } else if (Information) {
        throw new Error(`Limite richieste all'API raggiunto (max 25)`)
      } else if (result === undefined) {
        throw new Error(`Errore - Verificare URL`)
      }
      
      /*Assegno le mie variabili avendo cura di verificare
      l'esistenza dei valori assegnati'*/
      const newDataVal = this.getArrayDataValues(result?.[`Time Series (1min)`]);
      const newArrayData = this.getArrayData(result?.[`Time Series (1min)`]);
      const newHours = this.getArrayHour(newArrayData);

      //Aggiungo una variabile di controllo
      const newName = result?.[`Meta Data`]?.[`2. Symbol`];      
      
      //Se il controllo viene superato aggiorno lo stato
      if (newName === this.state.nome) {
      this.setState({
        prices: newDataVal[0],
        onLoad: false,
        hours: newHours,
        datigrafico: [...this.state.datigrafico, {datetime: this.state.hours[0],
          price: Number(this.state.prices[`2. high`] - this.state.prices[`3. low`]).toFixed(2)}]      
      })
    } else {
      throw new Error(`Nome Stock non corrisponde`)
    }
    } catch (error) {
      console.log(`Fetch failed, ${error}`);
      this.setState({
        onLoad: false,
        showErrorUpdate: true,
        msgUpdateError: error.message ? error.message : error,
      })
    }
  }  

  //Il metodo precedente è annidato all'interno di questo metodo
  aggiornoStock = (val) => {
    this.getNewPrice(val);
  }

  //Richiamo il metodo da App.js
  eliminoStock = () => {
    this.props.eliminoStock(this.props.datistock.id)
  }

  //Definisco un metodo che assegnerò al pusante di switch (checked)
  startRealTime = () => {
    this.timer = setInterval(() => {
      this.getNewPrice(this.state.nome);
    }, 60000)
  }

  //Definisco un metodo che assegnerò al pusante di switch (unchecked)
  stopRealTime = () => {
    clearInterval(this.timer);
  }

  //Il metodo genitore che controlla lo start/stop dell'aggiornamento in Real Time
  startStopRealTime = () => {
    const ckrt = this.state.checkRt === `checked` ? `` : `checked`;

    if (ckrt === `checked`) {
      this.startRealTime();
    } else {
      this.stopRealTime();
    }

    this.setState({checkRt: ckrt});
  }

  //Il comportamento del pulsante grafico
  showGrafico = () => {
    this.setState({showGrafico: !this.state.showGrafico})
  }

  //Quando monto il componente chiamo automaticamente l'API una volta
  componentDidMount() {
    this.aggiornoStock(this.state.nome);
  }  

  //QUando rimuovo il componente fermo l'update automatico
  componentWillUnmount = () => {
    this.stopRealTime();
  }
  
  /*Quando l'utente clicca su NomeStock.js,
  viene agganciato e renderizzato Stock.js, 
  che contiente il dettaglio dello stock ricercato:
  Sigla dell'azienda, ultimo valore massimo dello stock,
  percentuale di volatilità e grafico di volatilità*/
  render() {    
    const hours = this.state.hours[0];
    const price = Number(this.state?.prices?.[`2. high`]);

    const openPrice = parseFloat(this.state?.prices?.["1. open"]);
    const closePrice = parseFloat(this.state?.prices?.["4. close"]);

    const percentageChange = ((closePrice - openPrice) / openPrice) * 100;
    return (
      <div className="stock col-sm">
        <div className="bodystock m-1 p-3">

          <i className='fas fa-times-circle closebtn mt-1 mb-3'
            onClick={this.eliminoStock}>
          </i>

          <div className="row">

            <div className="col-sm">
              <h2>{this.state.nome}</h2>
              <p>Stock</p>
            </div>

            <div className="col-sm">
              <h2>{price}</h2>
              <p>{hours}</p>
            </div>

            <div className="col-sm">
              <h2>{percentageChange.toFixed(2)}</h2>
              <p>%</p>
            </div>

            <div className="col-sm">

              <h2 onClick={() => this.aggiornoStock(this.state.nome)}>
                {this.state.onLoad &&
                  <i className="iconupInf fas fa-sync-alt fa-1x mb-3"></i>}
                
                {!this.state.onLoad &&
                  <i title="Update" className="iconup fas fa-sync-alt fa-1x mb-3"></i>}
              </h2>

            <p onClick={this.showGrafico}>
              <i className='btnGraph fas fa-chart-line fa-2x'></i>
            </p>

            <label className='bs-switch'>
              <input type='checkbox'
                    checked= {this.state.checkRt}
                    onChange={this.startStopRealTime}/>
              <span className='slider round'></span>
            </label>

            </div>
            
              {this.state.showErrorUpdate 
              && <p className='red'>{this.state.msgUpdateError}</p>}

          </div>

          <div className='bodygrafico'>
            <div className='row'>
              <div className='col-sm'>
                { this.state.showGrafico && <Grafico datistock={this.state.datigrafico} />}
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default Stock;