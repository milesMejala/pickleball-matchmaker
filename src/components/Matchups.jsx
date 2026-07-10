import "../css/Matchups.css";

export default function Matchups({matchups}) {
    return (
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
    )
}