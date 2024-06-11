import React, { useState } from "react";
import { useGlobalData } from "../../GlobalContext";

export default function DataInfo({ onDataInfoChange }) {
  const [fields, setFields] = useState([
    { id: Date.now(), feature: "", type: "" },
  ]);

  const addField = () => {
    setFields([...fields, { id: Date.now(), feature: "", type: "" }]);
  };

  const removeField = (id) => {
    if (fields.length !== 1)
      setFields(fields.filter((field) => field.id !== id));
  };

  const handleChange = (id, event) => {
    const newFields = fields.map((field) => {
      if (field.id === id) {
        return { ...field, [event.target.name]: event.target.value };
      }
      return field;
    });
    setFields(newFields);
    onDataInfoChange(newFields.map(({ id, ...rest }) => rest)); // Send updated data (witout id) to the Request component
  };

  return (
    <div className="container mt-3">
      <h4>Data Info:</h4>

      {/* About Dataset */}
      <div className="input-group mb-3">
        <span className="input-group-text">About Dataset:</span>
        <input
          type="text"
          id="datainfo"
          aria-label="About Dataset"
          className="form-control"
          placeholder="Name, purpose, etc.."
        />
      </div>

      {/* Parent Div (where cloned elements will be inserted) */}
      <div id="parent-template-div">
        {fields.map((field) => (
          <div key={field.id} className="input-group mb-3">
            <span className="input-group-text">Column Name and Type</span>
            <input
              type="text"
              aria-label="Feature"
              className="form-control"
              placeholder="Feature of dataset"
              name="feature"
              value={field.feature}
              onChange={(event) => handleChange(field.id, event)}
            />
            <input
              type="text"
              aria-label="Type"
              className="form-control"
              placeholder="Type of feature"
              name="type"
              value={field.type}
              onChange={(event) => handleChange(field.id, event)}
            />
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => removeField(field.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="btn btn-primary" onClick={addField}>
        Add
      </button>
    </div>
  );
}
