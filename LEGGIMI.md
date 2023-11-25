> [!NOTE]
> [Visualizza l'anteprima su GitHub Pages](https://mikebonwebdev.github.io/nasdaq-react-ghpages)

[View in english](./README.md)
# Stock Market Dashboard

Questo progetto è un'applicazione web costruita utilizzando **React.js** per monitorare e visualizzare valori azionari attraverso un'interfaccia intuitiva e interattiva.

## Indice

- [Funzionalità Principali](LEGGIMI.md#funzionalità-principali)
- [Utilizzo](LEGGIMI.md#utilizzo)
- [Tecnologie impiegate](LEGGIMI.md#tecnologie-utilizzate)
- [Contributi](LEGGIMI.md#contributi)

## Funzionalità Principali


- **Ricerca degli Stock**: L'applicazione consente agli utenti di cercare valori azionari inserendo un input testuale, e per ora l'input inseribile è ristretto alle **sole _sigle_ delle aziende**. L'input viene utilizzato per interrogare un'API e ottenere i dati relativi allo stock richiesto.
- **Aggiornamento dello Stock**: È possibile aggiornare manualmente i dati relativi allo stock tramite un apposito pulsante per ottenere le informazioni più recenti.
- **Grafico di Volatilità**: Viene visualizzato un grafico che mostra la volatilità dello stock nel tempo, offrendo una rappresentazione visiva della variazione dei valori.
- **Aggiornamento Automatico**: Un pulsante di switch permette di attivare l'aggiornamento automatico dei dati a intervalli di un minuto, garantendo informazioni sempre aggiornate.
- **Eliminazione degli Stock**: Gli utenti possono cancellare gli stock precedentemente visualizzati tramite un pulsante dedicato, garantendo la gestione personalizzata dell'elenco degli stock.

## Utilizzo

- Clona il repository sul tuo computer.
- Installa le dipendenze con `npm install`.
- Avvia l'applicazione con `npm start`.
- Per costruire la cartella build dell'applicazione, usare `npm build`[^1]


Una volta avviata l'applicazione, puoi:

- Inserire il nome dello stock nell'input per visualizzare i dati.
- Se la ricerca ha successo, viene visualizzato un piccolo riquadro di anteprima con la sigla dello stock e una data, sotto la casella di ricerca.
- Cliccando sul riquadro, vengono visualizzati i dettagli dello stock selezionato
- Aggiornare manualmente i dati con il pulsante dedicato.
- Attivare l'aggiornamento automatico con il pulsante di switch(1min).
- Visualizzare il grafico di volatilità per analizzare le variazioni.
- Eliminare i dettagli stock dalla visualizzazione utilizzando il pulsante di cancellazione in alto a destra.

## Tecnologie Utilizzate
- ***React.js***: Utilizzato come framework principale per lo sviluppo dell'applicazione.
- ***Alpha Vantage***, API di Mercato Azionario: Interrogata per ottenere i dati relativi agli stock.
- **Librerie Aggiuntive**: 
  - ***Bootstrap***: Responsive e strumenti preconfigurati
  - ***Recharts***: Per il grafico.
  - ***Fontawsome***: Per le icone.

## [Contributi](LEGGIMI.md#contributi)
Sono benvenuti i contributi per migliorare l'applicazione. Sentiti libero di aprire una issue per suggerimenti o segnalazioni di bug, o invia una pull request per contribuire direttamente al codice.

[^1]: Potrebbero sorgere dei problemi con i percorsi degli URL dalla fase di sviluppo alla versione build. Al momento, ho risolto modificando manualmente i percorsi all'interno della cartella build.