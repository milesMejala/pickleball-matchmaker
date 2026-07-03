import AddPlayer from "./components/AddPlayer";
import Roster from "./components/Roster";
import "./App.css";

import { useState } from "react";

function App() {
  const [players, setPlayers] = useState([]);

  function addPlayer(player) {
    setPlayers((prev) => [...prev, player]);
  }

  return (
    <>
      <h1>Pickleball Matchmaker</h1>
      <p>Enter players, balance skill levels, and generate fair matchups.</p>
      <AddPlayer onAddPlayer={addPlayer} />
      <Roster players={players} />
    </>
  );
}

export default App;
