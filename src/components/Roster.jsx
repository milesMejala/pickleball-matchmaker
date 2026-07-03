import "../css/Roster.css";

export default function Roster({ players, onRemovePlayer }) {
  return (
    <section className="roster-wrapper">
      <h2>Roster</h2>
      {players.map((p) => (
        <div key={p.id} className="player-wrapper">
          <div className="player-info">
            <span className="player-initial">{p.name.charAt(0).toUpperCase()}</span>
            <div>
              <span>{p.name}</span>
              <span>{p.skill}</span>
            </div>
          </div>
          <button type="button" className="remove-player" onClick={() => onRemovePlayer(p.id)}>X</button>
        </div>
      ))}
    </section>
  );
}
