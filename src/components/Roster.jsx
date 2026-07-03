import "../css/Roster.css";

export default function Roster({ players }) {
  return (
    <section className="roster-wrapper">
      <h2>Roster</h2>
      {players.map((p) => (
        <div className="player-wrapper">
          <div className="player-info">
            <span>Letter</span>
            <div>
              <span>{p.name}</span>
              <span>{p.skill}</span>
            </div>
          </div>
          <span>x</span>
        </div>
      ))}
    </section>
  );
}
