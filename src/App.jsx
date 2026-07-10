import AddPlayer from "./components/AddPlayer";
import Roster from "./components/Roster";
import GenerateMatchups from "./components/GenerateMatchups";
import Matchups from "./components/Matchups";
import "./App.css";

import { useState } from "react";

function App() {
  const [players, setPlayers] = useState([]);
  const [numberOfCourts, setNumberOfCourts] = useState(1)
  const [balanceBySkill, setBalanceBySkill] = useState(true)
  const [randomize, setRandomize] = useState(true)
  const [matchups, setMatchups] = useState([])


  function addPlayer(player) {
    setPlayers((prev) => [...prev, { ...player, id: crypto.randomUUID() }]);
  }
  
  const skillClass = {
    Beginner: 1,
    Intermediate: 2,  
    Advanced: 3,
  };

  function removePlayer(id) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }

  function removeAll() {
    setPlayers([]);
  }

  function shuffle(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  function generateMatchups(players, numberOfCourts, balanceBySkill, randomize) {
    if (players.length < 4) return []

    let pool = [...players]

    if (randomize) {
      pool = shuffle(pool)
    }

    const playersPerRound = numberOfCourts * 4
    const rounds = []

    // Generate enough rounds so every player gets to play at least once
    const usedIds = new Set()

    while (usedIds.size < pool.length) {
      // Prioritize players who haven't played yet, then fill with others
      const notYetPlayed = []
      const alreadyPlayed = []
      for (const p of pool) {
        if (usedIds.has(p.id)) alreadyPlayed.push(p)
        else notYetPlayed.push(p)
      }
      
      // Select players for this round: unplayed first, then fill remaining spots
      const roundPlayers = notYetPlayed.length >= playersPerRound
        ? notYetPlayed.slice(0, playersPerRound)
        : [...notYetPlayed, ...alreadyPlayed.slice(0, playersPerRound - notYetPlayed.length)]

      // Need at least 4 players to form a match
      if (roundPlayers.length < 4) break

      // Make sure we use an even number divisible by 4
      const usable = roundPlayers.slice(0, Math.floor(roundPlayers.length / 4) * 4)

      // Mark these players as having played
      usable.forEach(p => usedIds.add(p.id))

      // Sort for balanced pairing AFTER selection
      if (balanceBySkill) {
        usable.sort((a, b) => skillClass[a.skill] - skillClass[b.skill])
      }

      // Pair by splitting into lower/upper skill halves, shuffling within
      // each half, then pairing across. This ensures teams mix weaker +
      // stronger players while allowing varied matchups (e.g. Adv+Int,
      // not just Adv+Beg every time).
      const mid = Math.floor(usable.length / 2)
      const lowerHalf = shuffle(usable.slice(0, mid))
      const upperHalf = shuffle(usable.slice(mid))

      const teams = []
      for (let i = 0; i < Math.min(lowerHalf.length, upperHalf.length); i++) {
        teams.push({
          player1: lowerHalf[i],
          player2: upperHalf[i]
        })
      }

      const courts = []
      for (let i = 0; i + 1 < teams.length; i += 2) {
        courts.push({
          id: crypto.randomUUID(),
          teamA: teams[i],
          teamB: teams[i + 1],
        })
      }

      const usableIds = new Set(usable.map(p => p.id))
      const sittingOut = pool.filter(p => !usableIds.has(p.id))

      rounds.push({
        id: crypto.randomUUID(),
        roundNumber: rounds.length + 1,
        courts,
        sittingOut
      })
    }

    return rounds
  }

  function handleGenerate() {
    const courts = generateMatchups(players, numberOfCourts, balanceBySkill, randomize)
    setMatchups(courts)
  }


  return (
    <div>
      <h1>Pickleball Matchmaker</h1>
      <p className="intro-text">Enter players, balance skill levels, and generate fair matchups.</p>
      <AddPlayer onAddPlayer={addPlayer} />
      <Roster players={players} onRemovePlayer={removePlayer} onRemoveAll={removeAll}/>
      <GenerateMatchups 
        numberOfCourts={numberOfCourts} 
        onSetNumberOfCourts={setNumberOfCourts}
        balanceBySkill={balanceBySkill}
        onSetBalanceBySkill={setBalanceBySkill}
        randomize={randomize}
        onSetRandomize={setRandomize}
      />
      <button className="generate-matchups-btn" onClick={handleGenerate}>Generate Matchups</button>
      {matchups.length > 0 && <Matchups matchups={matchups}/>}
    </div>
  );
}

export default App;
