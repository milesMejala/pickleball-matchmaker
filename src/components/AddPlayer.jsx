import { useState } from "react";
import "../css/AddPlayer.css";

export default function AddPlayer({ onAddPlayer }) {
  const [formData, setFormData] = useState({
    name: "",
    skill: "Beginner",
  });
  const [error, setError] = useState("");

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

    console.log(formData);
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
        <fieldset>
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
        <button type="submit">Add to Roster</button>
      </form>
    </section>
  );
}
