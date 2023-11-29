import React, {Component} from 'react';
import './App.css';
import Cerca from './Cerca';
import NomeStock from './NomeStock';
import Stock from './Stock';

//Definisco il componente con stato tramite notazione classe
class App extends Component {

  constructor(props) {
    super(props);

    //Definisco l'oggetto state, e le proprietà necessarie
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
  }

  /*Il metodo passato al componente 'Cerca.js',
  mi restituisce la stringa che passo poi al metodo interno.
  Tale stringa andrà a inserirsi nell'URL dell'API Call*/
  cercaElementi =  (strcerca) => {   
    this.getElementi(strcerca);
  }

  /*Definisco una funzione asincrona,
  effettuo un primo tentativo di chiamata API,
  gestisco gli errori, e se tutto è ok,
  manipolo i dati salvandoli nelle apposite variabili di stato */
  getElementi = async (str) => {            

      //Using a .env file providing more security of my API Key
      const accessKeyAlphaV = process.env.AV_API_KEY;
      const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${str}&interval=1min&outputsize=compact&apikey=${accessKeyAlphaV}&datatype=json`;
      try {
        //Inizializzo due proprietà dell'oggetto state
        this.setState({inCaricamento: true, showError: false});

        //Effettuo la chiamata all'API, gestisco la risposta come oggetto JSON
        const response = await fetch(apiUrl);
        const r = await response.json();

        //Inizio a definire le possibili casistiche di errore
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
        
        //Aggiungo i nuovi elementi alla variabile di stato
        this.setState((prevState) => ({          
          listaelementi : [...prevState.listaelementi, result],
          inCaricamento: false,              
        }));  

      } catch (error) {
        //Gestisco gli errori, imposto lo stato, e li riporto in console
        console.log(`Fetch failed, ${error}`);
        this.setState({
          inCaricamento: false,
          showError: true,
          msgError: error.message ? error.message : error,          
        })
      };
  }

  /*Cosa accade quando effettuo un 'click' sul comp. 'NomeStock.js',
  e come viene agganciato 'Stock.js'*/
  onAddPreferiti = (ids) => {
    try {
      //Inizializzo due variabili di stato
      this.setState({
        inCaricamentoStock: true,
        showErrorStock: false,
      });

      /*Tramite l'indice verifico quali elementi ci sono,
      e se non ci sono lancio 'Error'*/
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
      //Gestisco gli errori, imposto lo stato, e li riporto in console
      console.log(`Failed to execute: ${error.message}`);
      this.setState({
        inCaricamentoStock: false,
        showErrorStock: true,
        msgErrorStock: error.message ? error.message: error,
      })
    }
  }

  //Come elimino i dati quando elimino il componente 'Stock.js'
  elimino = (id) => {
    if(id) {
      //Se l'id esiste, filtro tutti gli elementi della lista, tranne quello
      const preferiti = this.state.listapreferiti.filter((el) => {
        return el.id !== id;
      })
      //Imposto lo stato con i nuovi valori
      this.setState({
        listapreferiti: preferiti,
        showErrorStock: false,
        cont: this.state.cont - 1})
    }
  } 

  render() {    
    
    return(
      <div className='App container-fluid'>
        <header className='App-header'>
          {/*Inserisco il componente per effettuare la ricerca*/}
          <Cerca onInputSearch={this.cercaElementi}/>

          {/*Imposto la posizione per gli Error Alert*/}
          {this.state.showError &&
            <p className={this.state.classError}>{this.state.msgError}</p>}

          {/*Imposto un'icona di caricamento*/}
          {this.state.inCaricamento && 
            <p className='loadico text-center fas fa-sync-alt fa-2x mt-3'></p>}          

          {/*Imposto il contenitore per i risultati iniziali della lista stock*/}
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

            {/*Imposto il contenitore per gli Stock al dettaglio*/}
            <section className='listapreferiti'>
              <div className='row'>
              {this.state.listapreferiti.map((el, index) => 
                <div className='col-sm-6'>

                    {/*Imposto un'icona di caricamento*/}
                    {this.state.inCaricamentoStock && 
                      <p className='loadico text-center fas fa-sync-alt fa-3x mt-3'></p>}
                    
                    {/*Imposto gli Error Alert*/}
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