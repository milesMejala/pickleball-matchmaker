import { useState, useRef, useEffect } from "react";

const SKILLS = ["Beginner", "Intermediate", "Advanced"];
import "../css/AddPlayer.css";

export default function AddPlayer({ onAddPlayer }) {
  const [formData, setFormData] = useState({
    name: "",
    skill: "Beginner",
  });
  const [error, setError] = useState("");

  const pillRef = useRef(null);
  const fieldsetRef = useRef(null);
  const dragRef = useRef(null); // { startX, startTranslate, isDragging }

  // Sync pill to current skill (handles label clicks)
  useEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const idx = SKILLS.indexOf(formData.skill);
    if (idx === -1) return;
    pill.style.translate = `${idx * pill.offsetWidth}px`;
  }, [formData.skill]);

  function handlePointerDown(e) {
    const pill = pillRef.current;
    if (!pill) return;
    
    dragRef.current = {
      startX: e.clientX,
      startTranslate: parseFloat(pill.style.translate) || 0,
      isDragging: false,
    };
  }

  function handlePointerMove(e) {
    if (!dragRef.current) return;
    const pill = pillRef.current;
    if (!pill) return;

    const delta = e.clientX - dragRef.current.startX;

    // Don't enter drag mode until the user moves 6px
    if (!dragRef.current.isDragging) {
      if (Math.abs(delta) < 6) return;
      dragRef.current.isDragging = true;
      // Capture pointer only when drag starts, so we don't block normal clicks
      fieldsetRef.current.setPointerCapture(e.pointerId);
      pill.style.transition = "none"; // follow finger without easing
    }

    const pillWidth = pill.offsetWidth;
    const raw = dragRef.current.startTranslate + delta;
    pill.style.translate = `${Math.max(0, Math.min(pillWidth * 2, raw))}px`;
  }

  function handlePointerUp() {
    if (!dragRef.current?.isDragging) {
      dragRef.current = null;
      return;
    }
    const pill = pillRef.current;
    if (!pill) return;

    const pillWidth = pill.offsetWidth;
    const current = parseFloat(pill.style.translate) || 0;
    const idx = Math.max(0, Math.min(2, Math.round(current / pillWidth)));

    pill.style.transition = ""; // restore for snap animation
    pill.style.translate = `${idx * pillWidth}px`;
    setFormData((prev) => ({ ...prev, skill: SKILLS[idx] }));

    dragRef.current = null;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "name") setError("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter a player name.");
      return;
    }
    onAddPlayer(formData);

    setFormData({
      name: "",
      skill: "Beginner",
    });
    setError("");
  }

  return (
    <section className="add-player-wrapper">
      <h2>Add Player</h2>
      <form onSubmit={handleSubmit}>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Player Name"
          aria-describedby={error ? "name-error" : undefined}
        />
        {error && <p id="name-error" className="input-error">{error}</p>}
        <fieldset
          ref={fieldsetRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Real element so JS can set inline translate + attach events */}
          <span className="sliding-pill" ref={pillRef} aria-hidden="true" />
          <label className="radio-option" htmlFor="beginner">
            <input
              id="beginner"
              name="skill"
              type="radio"
              value="Beginner"
              onChange={handleChange}
              checked={formData.skill === "Beginner"}
            />
            <span>Beg.</span>
          </label>
          <label className="radio-option" htmlFor="intermediate">
            <input
              id="intermediate"
              name="skill"
              type="radio"
              value="Intermediate"
              onChange={handleChange}
              checked={formData.skill === "Intermediate"}
            />
            <span>Int.</span>
          </label>
          <label className="radio-option" htmlFor="advanced">
            <input
              id="advanced"
              name="skill"
              type="radio"
              value="Advanced"
              onChange={handleChange}
              checked={formData.skill === "Advanced"}
            />
            <span>Adv.</span>
          </label>
        </fieldset>
        <button type="submit" className="btn-primary">Add to Roster</button>
      </form>
    </section>
  );
}
