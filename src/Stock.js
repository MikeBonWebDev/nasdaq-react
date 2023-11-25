import React, { Component } from 'react';
import './Stock.css';
import Grafico from './Grafico';

class Stock extends Component {

  constructor(props) {
    super(props);
    const nome = this.props.datistock?.[`Meta Data`][`2. Symbol`];
    const arrData = this.getArrayData(this.props.datistock?.[`Time Series (1min)`]);
    const dataValues = this.getArrayDataValues(this.props.datistock?.[`Time Series (1min)`]);
    const arrDataHours = this.getArrayHour(arrData); 
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
      datigrafico: [{datetime: '09:00:00', price: 0}],
      showGrafico: false,      
    };
    console.log('1f) FIGLIO Creo istanza');
  }  

  static getDerivedStateFromProps(np,ns) {
    //  console.log('1fa) FIGLIO check props ');
      // if(np.datistock.quotazione !== ns.quotazione && np.datistock.nome!== ns.nome) {
      //   return { nome: np.datistock.nome, quotazione: np.datistock.quotazione };
      // }
      return null;
  }

  getArrayData = (dataArg) => {
    const mainObjData = dataArg;
    const secondaryStringData = Object.keys(mainObjData);

    const ObjectDate = secondaryStringData.map( data => new Date(data)); 

    return ObjectDate;
  }

  getArrayDataValues = (dataVal) => {
    const mainData = dataVal;
    const secondaryData = Object.keys(mainData).map((key) => ({
      ...mainData[key]
    }));
    
    return secondaryData;
  }

  getHourFormat = (hourData) => {
    const hour = hourData.getHours();
    const minute = hourData.getMinutes();
    const second = hourData.getSeconds();
    const fullHour = hour.toString().padStart(2, 0)
    + `:` + minute.toString().padStart(2, 0)
    + `:` + second.toString().padStart(2, 0);
    return fullHour;
  }

  getArrayHour = (dateObjects) => {
    const hoursArray = dateObjects.map(date =>
       this.getHourFormat(date)
      );
    return hoursArray;
  } 
  //Start method for Update Stock values
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

      if (Object.keys(r).length === 0) {
        throw new Error(`Errore generico,
        verificare la correttezza delle informazioni inserite`)
      }

      const data = r;
      const { 'Error Message' : invalidInput } = r;
      const { Information } = r;
      const result = invalidInput ?? data ?? Information;

      if (invalidInput) {
        throw new Error(`Nessuna corrispondenza trovata`);
      } else if (Information) {
        throw new Error(`Limite richieste all'API raggiunto (max 25)`)
      } else if (result === undefined) {
        throw new Error(`Errore - Verificare URL`)      }
      
      
      const newDataVal = this.getArrayDataValues(result?.[`Time Series (1min)`]);
      const newArrayData = this.getArrayData(result?.[`Time Series (1min)`]);
      const newHours = this.getArrayHour(newArrayData);
      const newName = result?.[`Meta Data`]?.[`2. Symbol`];
      console.log(`Recupero Dati: ${JSON.stringify(newDataVal)}`);
      
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


  aggiornoStock = (val) => {
    this.getNewPrice(val);
  }

  eliminoStock = () => {
    this.props.eliminoStock(this.props.datistock.id)
  }

  //Methods for switch button and update stock in Real Time (1min interval)
  startRealTime = () => {
    this.timer = setInterval(() => {
      this.getNewPrice(this.state.nome);
      console.log(`Nuovo Intervallo`);
    }, 60000)
  }

  stopRealTime = () => {
    clearInterval(this.timer);
  }

  startStopRealTime = () => {
    const ckrt = this.state.checkRt === `checked` ? `` : `checked`;
    if (ckrt === `checked`) {
      this.startRealTime();
    } else {
      this.stopRealTime();
    }
    this.setState({checkRt: ckrt})
  }

  //Method used to hide/show Graph Element
  showGrafico = () => {
    this.setState({showGrafico: !this.state.showGrafico})
  }

  componentDidMount() {
    console.log('3f) FIGLIO DidMount ');
    this.aggiornoStock(this.state.nome);
  }

  componentDidUpdate(pp,ps) {
   console.log('4f) FIGLIO – DidUpdate ');
  }

  componentWillUnmount = () => {
    console.log(`5f) FIGLIO - removed`);
    this.stopRealTime();
  }
  
  /*When user click on NomeStock.js component, it add Stock.js component,
  that contains Stock details, Update button, Show Graphic, and switch for auto Update mode (1min)*/
  render() {    
    console.log('2f) FIGLIO Render ' + this.state.nome);
    const hours = this.state.hours[0];
    const price = Number(this.state?.prices?.[`2. high`]);
    const colore = this.state.quotazione > 280 ? 'giallo' : 'bianco';

    const openPrice = parseFloat(this.state?.prices?.["1. open"]);
    const closePrice = parseFloat(this.state?.prices?.["4. close"]);

    const percentageChange = ((closePrice - openPrice) / openPrice) * 100;
    return (
      <div className="stock col-sm">
        <div className="bodystock m-1 p-3">          
        <i 
          className='fas fa-times-circle closebtn mt-1'
          onClick={this.eliminoStock}>
            </i>        
          <div className="row">
            <div className="col-sm">
              <h2 className={colore}>{this.state.nome}</h2>
              <p>Nasdaq</p>
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
              <input 
                type='checkbox'
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