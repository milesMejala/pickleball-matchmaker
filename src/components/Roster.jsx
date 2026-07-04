import "../css/Roster.css";

export default function Roster({ players, onRemovePlayer, onRemoveAll }) {

  const skillClass = {
    Beginner: "beginner",
    Intermediate: "intermediate",
    Advanced: "advanced",
  };

  return (
    <section className="roster-wrapper">
      <div className="roster-header">
        <h2>Roster</h2>
        <button 
          type="button" 
          onClick={() => onRemoveAll()}
          className="clear-all"
          aria-label="Delete all players"
          >
            <span className="material-symbols-rounded">
              delete_sweep
            </span>
        </button>
      </div>
      {players.map((p) => (
        <div key={p.id} className="player-wrapper">
          <div className="player-info">
            <span className="player-initial">{p.name.charAt(0).toUpperCase()}</span>
            <div>
              <span>{p.name}</span>
              <span className={`player-skill ${skillClass[p.skill]}`}>{p.skill}</span>
            </div>
          </div>
          <button 
            type="button" 
            className="remove-player" 
            onClick={() => onRemovePlayer(p.id)}
            aria-label="Delete player"
            >
              <span className="material-symbols-rounded">
                delete  
              </span> 
            </button>
        </div>
      ))}
    </section>
  );
}
