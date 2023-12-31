import React, {Component} from 'react';

class Cerca extends Component {
  
  constructor(props) {
    super(props);
    //definisco lo stato per il mio text-input
    this.state = {
      camporicerca: ``,
    }
    this.place = `Cerca Stock...`
  }
  
  //Definisco lo stato, esso si aggiorna durante la digitazione
  aggiornoCerca = e => {
    this.setState({camporicerca: e.target.value})
  }

  //Definisco che cosa avviene quando clicco su 'Ok'
  invioForm = e => {
    e.preventDefault();
    this.props.onInputSearch(this.state.camporicerca);
    this.setState({camporicerca: ''});    
  }

  //Definisco una finitura estetica
  onFocus = (e) => {
    e.target.blur();
  }

 
  render() {
    const defPlace = this.place;
    return (
      
        <form className='row mt-5' onSubmit={this.invioForm}>
          <div className='col-auto'>
            <input 
              type='text'
              name='cerca'
              placeholder={defPlace}
              value={this.state.camporicerca}
              onChange={this.aggiornoCerca}
              className='form-control mb-4 mr-sm-2'
            >          
            </input>
          </div>
          <div className='col-auto'>
          <button
            type='submit'
            onFocus={this.onFocus}
            className='subsearch btn btn-primary mt-1'
          >
              Ok
          </button>
          </div>
        </form>
      
    )
  }
}
export default Cerca;
