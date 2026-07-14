import "../css/Matchups.css";

export default function Matchups({matchups}) {
    return (
        <section className="matchups-results">
          {matchups.map((round) => (
            <div key={round.id} className="round-card">
              <h3 className="round-title">Round {round.roundNumber}</h3>
              {round.courts.map((court, courtIndex) => (
                <div key={court.id} className="court-card">
                  <h4>Court {courtIndex + 1}</h4>
                  <div className="court-teams">
                    <div className="team">
                      <p className="team-label">Team A</p>
                      <div className="player">
                        <p>{court.teamA.player1.name}</p>
                        <span className={`player-skill ${court.teamA.player1.skill.toLowerCase()}`}>{court.teamA.player1.skill}</span>
                      </div>
                      <div className="player">
                        <p>{court.teamA.player2.name}</p>
                        <span className={`player-skill ${court.teamA.player2.skill.toLowerCase()}`}>{court.teamA.player2.skill}</span>
                      </div>
                    </div>  
                    <p className="vs">vs</p>
                    <div className="team">
                      <p className="team-label align-text-end">Team B</p>
                      <div className="player">
                        <p>{court.teamB.player1.name}</p>
                        <span className={`player-skill ${court.teamB.player1.skill.toLowerCase()}`}>{court.teamB.player1.skill}</span>
                      </div>
                      <div className="player">
                        <p>{court.teamB.player2.name}</p>
                        <span className={`player-skill ${court.teamB.player2.skill.toLowerCase()}`}>{court.teamB.player2.skill}</span>
                      </div>
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
    )
}