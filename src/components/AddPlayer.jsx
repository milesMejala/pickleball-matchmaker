import { useState } from "react";
import "../css/AddPlayer.css";

export default function AddPlayer({ onAddPlayer }) {
  const [formData, setFormData] = useState({
    name: "",
    skill: "Beg.",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);
    onAddPlayer(formData);

    setFormData({
      name: "",
    });
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
        />
        <fieldset>
          <label className="radio-option" htmlFor="beginner">
            <input
              id="beginner"
              name="skill"
              type="radio"
              value="Beg."
              onChange={handleChange}
              checked={formData.skill === "Beg."}
            />
            <span>Beg.</span>
          </label>
          <label className="radio-option" htmlFor="intermediate">
            <input
              id="intermediate"
              name="skill"
              type="radio"
              value="Int."
              onChange={handleChange}
              checked={formData.skill === "Int."}
            />
            <span>Int.</span>
          </label>
          <label className="radio-option" htmlFor="advanced">
            <input
              id="advanced"
              name="skill"
              type="radio"
              value="Adv."
              onChange={handleChange}
              checked={formData.skill === "Adv."}
            />
            <span>Adv.</span>
          </label>
        </fieldset>
        <button type="submit">Add to Roster</button>
      </form>
    </section>
  );
}
