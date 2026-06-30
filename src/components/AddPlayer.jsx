import { useState } from "react";

export default function AddPlayer() {
  const [formData, setFormData] = useState({
    name: "",
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
        <button type="submit">Add to Roster</button>
      </form>
    </div>
  );
}
