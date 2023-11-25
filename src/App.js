import React, {Component} from 'react';
import './App.css';
import Cerca from './Cerca';
import NomeStock from './NomeStock';
import Stock from './Stock';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      listaelementi: [],
      listapreferiti: [],
      inCaricamento: false,
      showError: false,
      inCaricamentoStock: false,
      showErrorStock: false,
      classError: `text-center`,
      msgError: null,
      msgErrorStock: null,
      noResult: false,
      cont: 0,     
    };

    console.log('1g) Creo istanza GENITORE');
  }

  //Start search and save elements from search input to API Call
  //On Click Submit button in Cerca.js
  cercaElementi =  (strcerca) => {   
    this.getElementi(strcerca);
  }

  /*Call API, manipulate data and save in this.state. Generation NomeStock.js component
  About error: see example file '.json' in public folder like 'fetchStock.json',
  for catch behavior*/
  getElementi = async (str) => {            

      //Using a .env file for more security of my API Key
      const accessKeyAlphaV = process.env.AV_API_KEY;
      const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${str}&interval=1min&outputsize=compact&apikey=${accessKeyAlphaV}&datatype=json`;
      try {
        this.setState({inCaricamento: true, showError: false});
        const response = await fetch(apiUrl);
        const r = await response.json();

        //Start setting error behavior
        if (Object.keys(r).length === 0) {
          throw new Error(`Errore generico -
          verificare la correttezza delle informazioni inserite`)
        }

        const data = r;
        const { 'Error Message' : invalidInput } = r;
        const { Information } = r;
        const result = invalidInput ?? data ?? Information;

        if (invalidInput) {
          throw new Error(`Nessuna corrispondenza trovata`);
        } else if (Information) {
          this.setState({classError: `red text-center`});
          throw new Error(`Limite richieste all'API raggiunto (max 25)`)
        } else if (result === undefined) {
          this.setState({classError: `red text-center`});
          throw new Error(`Errore - Verificare URL`)
        }
        
        this.state.listaelementi.forEach((el) => {
          if (result[`Meta Data`][`2. Symbol`] === el[`Meta Data`][`2. Symbol`]) {            
            throw new Error(`Elemento già in lista`);
          }
        })

        console.log(`Recupero dati ${JSON.stringify(result)}`);
        
        this.setState((prevState) => ({          
          listaelementi : [...prevState.listaelementi, result],
          inCaricamento: false,              
        }), () => {
          console.log(`Numero elementi trovati: ${this.state.listaelementi.length}`);                  
        });        
      } catch (error) {
        console.log(`Fetch failed, ${error}`);
        this.setState({
          inCaricamento: false,
          showError: true,
          msgError: error.message ? error.message : error,          
        })
      };
  }

  //How Stock.js being create
  onAddPreferiti = (ids) => {
    try {
      console.log(this.state.cont);
      this.setState({
        inCaricamentoStock: true,
        showErrorStock: false,
      });

      if (!this.state.listapreferiti[ids]) {

        const newStock = this.state.listaelementi[ids];
        const contatore = this.state.cont + 1;
        newStock['id'] = contatore;
        this.setState({
          listapreferiti: [...this.state.listapreferiti, newStock],
          cont: contatore,
          inCaricamentoStock: false,
        })
        console.log(`ID: ${JSON.stringify(newStock)}`);

      } else {
        throw new Error(`Elemento già aggiunto ai preferiti`);        
      }
      
    } catch (error){
      console.log(`Failed to execute: ${error.message}`);
      this.setState({
        inCaricamentoStock: false,
        showErrorStock: true,
        msgErrorStock: error.message ? error.message: error,
      })
    }
  }

  //How Stock.js being delete
  elimino = (id) => {
    if(id) {
      const preferiti = this.state.listapreferiti.filter((el) => {
        return el.id !== id;
      })
      this.setState({
        listapreferiti: preferiti,
        showErrorStock: false,
        cont: this.state.cont - 1})
    }
  } 

  render() {
    console.log('2g) GENITORE Render App');
    
    return(
      <div className='App container-fluid'>
        <header className='App-header'>
          
          <Cerca onInputSearch={this.cercaElementi}/>

          {this.state.showError &&
            <p className={this.state.classError}>{this.state.msgError}</p>}

          {this.state.inCaricamento && 
            <p className='loadico text-center fas fa-sync-alt fa-2x mt-3'></p>}          

          <div className='container'>
            <section className='listastock'>
              <div className='row'>
                <div className='col'>
                  {!this.state.noResult && this.state.listaelementi.map((el, index) => 
                    <NomeStock 
                      key={index}
                      datistock={el}
                      onAddPreferiti = {() => this.onAddPreferiti(index)}
                    />
                    )
                  }
                
                </div>
              </div>
            </section>
            <section className='listapreferiti'>
              <div className='row'>
              {this.state.listapreferiti.map((el, index) => 
                <div className='col-sm-6'>
                    {this.state.inCaricamentoStock && 
                      <p className='loadico text-center fas fa-sync-alt fa-3x mt-3'></p>}

                    {this.state.showErrorStock && 
                      <p className={this.state.classError}>{this.state.msgErrorStock}</p>}

                    
                      <Stock
                        key={el.id}
                        datistock= {el}
                        eliminoStock= {this.elimino}
                      />
                      </div>
                      )
                    }
                
              </div>
            </section>
          </div>
        </header>
      </div>
    );
  }
}

export default App;