import "../css/GenerateMatchups.css"

export default function GenerateMatchups({
  numberOfCourts, 
  onSetNumberOfCourts,
  balanceBySkill,
  onSetBalanceBySkill,
  randomize,
  onSetRandomize
}) {
  return (
    <section className="generate-matchups-wrapper">
      <h2>Match Options</h2>
      <label className="toggle-row">
        <div>
          <p>Balance by skill</p>
          <p>Distribute talent evenly</p>
        </div>

        <input 
          type="checkbox" 
          role="switch"
          checked={balanceBySkill}
          onChange={(e) => onSetBalanceBySkill(e.target.checked)}/>
        <span className="toggle-track"></span>
      </label>
      <label className="toggle-row">
        <div>
          <p>Randomize partners</p>
          <p>Mix up the pairings</p>
        </div>

        <input 
          type="checkbox" 
          role="switch"
          checked={randomize}
          onChange={(e) => onSetRandomize(e.target.checked)}/>
        <span className="toggle-track"></span>
      </label>
      <div className="available-courts-wrapper">
        <p>Available Courts</p>
        <div className="court-counter">
            <button onClick={() => onSetNumberOfCourts((prev) => Math.max(1, prev - 1))}>-</button>
            <span>{numberOfCourts}</span>
            <button onClick={() => onSetNumberOfCourts((prev) => Math.max(1, prev + 1))}>+</button>
        </div>
      </div>
    </section>
  );
}
