import AddPlayer from "./components/AddPlayer";
import Roster from "./components/Roster";
import GenerateMatchups from "./components/GenerateMatchups";
import "./App.css";

import { useState } from "react";

function App() {
  const [players, setPlayers] = useState([]);

  function addPlayer(player) {
    setPlayers((prev) => [...prev, { ...player, id: crypto.randomUUID() }]);
  }

  function removePlayer(id) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }

  function removeAll() {
    setPlayers([]);
  }

  const [numberOfCourts, setNumberOfCourts] = useState(1);

  return (
    <>
      <h1>Pickleball Matchmaker</h1>
      <p className="intro-text">Enter players, balance skill levels, and generate fair matchups.</p>
      <AddPlayer onAddPlayer={addPlayer} />
      <Roster players={players} onRemovePlayer={removePlayer} onRemoveAll={removeAll}/>
      <GenerateMatchups numberOfCourts={numberOfCourts} onSetNumberOfCourts={setNumberOfCourts}/>
    </>
  );
}

export default App;
