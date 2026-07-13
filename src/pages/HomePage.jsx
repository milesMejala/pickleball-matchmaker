import { useState } from "react";
import { Link } from "react-router";

import AddPlayer from "../components/AddPlayer";
import Roster from "../components/Roster";
import GenerateMatchups from "../components/GenerateMatchups";
import Matchups from "../components/Matchups";
import "../css/HomePage.css";



export default function HomePage() {
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
    const usedIds = new Set()

    // #2: Track sit-out counts so players rotate fairly across rounds
    const sitOutCount = new Map()
    pool.forEach(p => sitOutCount.set(p.id, 0))

    // #3: Track opponent history to avoid repeat matchups
    const opponentHistory = new Map()
    pool.forEach(p => opponentHistory.set(p.id, new Set()))

    while (usedIds.size < pool.length) {
      const notYetPlayed = []
      const alreadyPlayed = []
      for (const p of pool) {
        if (usedIds.has(p.id)) alreadyPlayed.push(p)
        else notYetPlayed.push(p)
      }

      // #1: Shuffle fill-ins for unbiased selection
      // #2: Then prioritize players who've sat out the most
      const fillIns = shuffle(alreadyPlayed).sort(
        (a, b) => sitOutCount.get(b.id) - sitOutCount.get(a.id)
      )

      let roundPlayers = notYetPlayed.length >= playersPerRound
        ? notYetPlayed.slice(0, playersPerRound)
        : [...notYetPlayed, ...fillIns.slice(0, playersPerRound - notYetPlayed.length)]

      if (roundPlayers.length < 4) break

      // #2: When trimming to a multiple of 4, sit out players who've sat least
      const targetCount = Math.floor(roundPlayers.length / 4) * 4
      if (roundPlayers.length > targetCount) {
        roundPlayers.sort((a, b) => sitOutCount.get(a.id) - sitOutCount.get(b.id))
        roundPlayers = roundPlayers.slice(roundPlayers.length - targetCount)
      }

      const usable = roundPlayers
      usable.forEach(p => usedIds.add(p.id))

      // Sort for balanced pairing AFTER selection
      if (balanceBySkill) {
        usable.sort((a, b) => skillClass[a.skill] - skillClass[b.skill])
      }

      // Try multiple shuffled team formations and pick the most balanced one.
      // Shuffling within halves creates varied pairings (I+A, B+A, B+I)
      // while the greedy court assignment ensures balanced courts.
      const mid = Math.floor(usable.length / 2)

      let bestCourts = null
      let bestMaxDiff = Infinity

      const maxAttempts = 10
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const lowerHalf = shuffle(usable.slice(0, mid))
        const upperHalf = shuffle(usable.slice(mid))

        // Form teams by pairing across halves
        const candidateTeams = []
        for (let i = 0; i < Math.min(lowerHalf.length, upperHalf.length); i++) {
          candidateTeams.push({
            player1: lowerHalf[i],
            player2: upperHalf[i]
          })
        }

        // Sort teams by combined skill
        candidateTeams.sort((a, b) => {
          const scoreA = skillClass[a.player1.skill] + skillClass[a.player2.skill]
          const scoreB = skillClass[b.player1.skill] + skillClass[b.player2.skill]
          return scoreA - scoreB
        })

        // Greedy court assignment minimizing skill diff + repeat opponents
        const candidateCourts = []
        const paired = new Set()

        for (let i = 0; i < candidateTeams.length; i++) {
          if (paired.has(i)) continue

          let bestJ = -1
          let bestScore = Infinity

          for (let j = i + 1; j < candidateTeams.length; j++) {
            if (paired.has(j)) continue

            const skillDiff = Math.abs(
              (skillClass[candidateTeams[i].player1.skill] + skillClass[candidateTeams[i].player2.skill]) -
              (skillClass[candidateTeams[j].player1.skill] + skillClass[candidateTeams[j].player2.skill])
            )

            let repeats = 0
            const aIds = [candidateTeams[i].player1.id, candidateTeams[i].player2.id]
            const bIds = [candidateTeams[j].player1.id, candidateTeams[j].player2.id]
            for (const aId of aIds) {
              for (const bId of bIds) {
                if (opponentHistory.get(aId)?.has(bId)) repeats++
              }
            }

            const score = skillDiff * 10 + repeats
            if (score < bestScore) {
              bestScore = score
              bestJ = j
            }
          }

          if (bestJ !== -1) {
            paired.add(i)
            paired.add(bestJ)
            candidateCourts.push({
              id: crypto.randomUUID(),
              teamA: candidateTeams[i],
              teamB: candidateTeams[bestJ],
            })
          }
        }

        // Score this attempt by worst court skill gap
        const maxDiff = candidateCourts.reduce((max, court) => {
          const diff = Math.abs(
            (skillClass[court.teamA.player1.skill] + skillClass[court.teamA.player2.skill]) -
            (skillClass[court.teamB.player1.skill] + skillClass[court.teamB.player2.skill])
          )
          return Math.max(max, diff)
        }, 0)

        if (maxDiff < bestMaxDiff) {
          bestMaxDiff = maxDiff
          bestCourts = candidateCourts
        }

        if (bestMaxDiff === 0) break // Perfect balance found
      }

      const courts = bestCourts || []

      // #3: Update opponent history after forming courts
      for (const court of courts) {
        const aIds = [court.teamA.player1.id, court.teamA.player2.id]
        const bIds = [court.teamB.player1.id, court.teamB.player2.id]
        for (const aId of aIds) {
          for (const bId of bIds) {
            opponentHistory.get(aId)?.add(bId)
            opponentHistory.get(bId)?.add(aId)
          }
        }
      }

      // #2: Track who's sitting out and update their counts
      const usableIds = new Set(usable.map(p => p.id))
      const sittingOut = pool.filter(p => !usableIds.has(p.id))
      sittingOut.forEach(p => sitOutCount.set(p.id, (sitOutCount.get(p.id) || 0) + 1))

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


