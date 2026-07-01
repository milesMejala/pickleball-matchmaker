import { useState } from "react";
import "../css/AddPlayer.css";

export default function AddPlayer() {
  const [formData, setFormData] = useState({
    name: "",
    skill: "Beg."
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

    setFormData({
      name: "",
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Player Name"
        />
        <div className="radio-btns">
            <input
                id="beginner"
                name="skill"
                type="radio"
                value="Beg."
                onChange={handleChange}
                checked={formData.skill === "Beg."}
            />
            <input
                id="intermediate"
                name="skill"
                type="radio"
                value="Int."
                onChange={handleChange}
                checked={formData.skill === "Int."}
            />
            <input
                id="advanced"
                name="skill"
                type="radio"
                value="Adv."
                onChange={handleChange}
                checked={formData.skill === "Adv."}
            />
        </div>
        <button type="submit">Add to Roster</button>
      </form>
    </div>
  );
}
