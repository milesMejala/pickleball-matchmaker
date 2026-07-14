import { useRef } from "react";
import "../css/Roster.css";

export default function Roster({ players, onRemovePlayer, onRemoveAll }) {

  const clearDialogRef = useRef(null)

  function openClearDialog() {
    clearDialogRef.current?.showModal()
  }

  function closeClearDialog() {
    clearDialogRef.current?.close()
  }

  function handleClearAll() {
    onRemoveAll()
    closeClearDialog()
  }

  return (
    <section className="roster-wrapper">
      <div className="roster-header">
        <h2>Roster</h2>
        <button 
          type="button" 
          onClick={openClearDialog}
          className="clear-all"
          aria-label="Delete all players"
          >
            <span className="material-symbols-rounded">
              delete_sweep
            </span>
        </button>
      </div>
      {players.length > 0 ? (
        players.map((p) => (
          <div key={p.id} className="player-wrapper">
            <div className="player-info">
              <span className="player-initial">{p.name.charAt(0).toUpperCase()}</span>
              <div>
                <span className="player-name">{p.name}</span>
                <span className={`player-skill ${p.skill.toLowerCase()}`}>{p.skill}</span>
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
        ))
      ) : (
        <p className="empty-roster">No players yet. Add some!</p>
      )}

      {/* the dialog element for clear all players */}
      <dialog
        ref={clearDialogRef}
        className="clear-dialog"
        aria-labelledby="clear-dialog-title"
        aria-describedby="clear-dialog-description"
      >
        <div className="clear-dialog-content">  
          <h3>Clear all players?</h3>

          <p>
            This will permanently remove every player from the roster.
          </p>

          <div className="clear-dialog-actions">
            <button
              type="button"
              className="dialog-confirm"
              onClick={handleClearAll}
            >
              Clear all
            </button>
            <button
              type="button"
              className="dialog-cancel"
              onClick={closeClearDialog}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
