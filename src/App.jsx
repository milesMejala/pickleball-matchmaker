import AddPlayer from "./components/AddPlayer";
import Roster from "./components/Roster";
import GenerateMatchups from "./components/GenerateMatchups";
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

    if (balanceBySkill) {
      pool.sort((a, b) => skillClass[a.skill] - skillClass[b.skill])
    }

    const playersPerRound = numberOfCourts * 4
    const rounds = []
    const remaining = [...pool]

    // Generate enough rounds so every player gets to play at least once
    const usedIds = new Set()

    while (usedIds.size < pool.length) {
      // Prioritize players who haven't played yet, then fill with others
      const notYetPlayed = remaining.filter(p => !usedIds.has(p.id))
      const alreadyPlayed = remaining.filter(p => usedIds.has(p.id))
      
      // Select players for this round: unplayed first, then fill remaining spots
      let roundPlayers = [...notYetPlayed]
      if (roundPlayers.length < playersPerRound) {
        roundPlayers = [...roundPlayers, ...alreadyPlayed.slice(0, playersPerRound - roundPlayers.length)]
      } else {
        roundPlayers = roundPlayers.slice(0, playersPerRound)
      }

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

      // Pair up using the balanced pairing (weakest + strongest)
      const teams = []
      let left = 0
      let right = usable.length - 1

      while (left < right) {
        teams.push({
          player1: usable[left],
          player2: usable[right]
        })
        left++
        right--
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
      <Roster players={players} skillClass={skillClass} onRemovePlayer={removePlayer} onRemoveAll={removeAll}/>
      <GenerateMatchups 
        numberOfCourts={numberOfCourts} 
        onSetNumberOfCourts={setNumberOfCourts}
        balanceBySkill={balanceBySkill}
        onSetBalanceBySkill={setBalanceBySkill}
        randomize={randomize}
        onSetRandomize={setRandomize}
      />
      <button className="generate-matchups-btn" onClick={handleGenerate}>Generate Matchups</button>
      {matchups.length > 0 && (
        <section className="matchups-results">
          <h2>Matchups</h2>
          {matchups.map((round) => (
            <div key={round.id} className="round-card">
              <h3 className="round-title">Round {round.roundNumber}</h3>
              {round.courts.map((court, courtIndex) => (
                <div key={court.id} className="court-card">
                  <h4>Court {courtIndex + 1}</h4>
                  <div className="court-teams">
                    <div className="team">
                      <span className="team-label">Team A</span>
                      <span>{court.teamA.player1.name} ({court.teamA.player1.skill})</span>
                      <span>{court.teamA.player2.name} ({court.teamA.player2.skill})</span>
                    </div>
                    <span className="vs">vs</span>
                    <div className="team">
                      <span className="team-label">Team B</span>
                      <span>{court.teamB.player1.name} ({court.teamB.player1.skill})</span>
                      <span>{court.teamB.player2.name} ({court.teamB.player2.skill})</span>
                    </div>
                  </div>
                </div>
              ))}
              {round.sittingOut.length > 0 && (
                <div className="sitting-out">
                  <span className="sitting-out-label">Sitting out:</span>
                  <span>{round.sittingOut.map(p => p.name).join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default App;
