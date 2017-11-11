import * as React from 'react';
import { Game } from './game';
import './App.css';

export class App extends React.Component<{}, {}> {
  render() {
    const gameRef = 'game1';
    return (
      <div className="App">
        <div className="App-header">
          <h2>Mazing Contest POC</h2>
        </div>
        <Game gameRef={gameRef} size={320}/>
      </div>
    );
  }
}

export default App;
