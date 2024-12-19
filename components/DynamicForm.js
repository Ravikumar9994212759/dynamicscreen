import React, { useState } from 'react';

const DynamicForm = ({ fields, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = field.default || '';
      return acc;
    }, {})
  );

  const handleChange = (e, name) => {
    const { value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="dynamic-form">
      {fields.map((field) => (
        <div key={field.name} className="form-field">
          <label htmlFor={field.name}>{field.label}</label>
          {field.inputType === 'TextBox' && (
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              maxLength={field.limit || 255}
              onChange={(e) => handleChange(e, field.name)}
            />
          )}
          {field.inputType === 'textarea' && (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              maxLength={field.limit || 255}
              onChange={(e) => handleChange(e, field.name)}
            />
          )}
          {field.inputType === 'checkbox' && (
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={formData[field.name] || false}
              onChange={(e) => handleChange(e, field.name)}
            />
          )}
          {field.inputType === 'select' && (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={(e) => handleChange(e, field.name)}
            >
              <option value="">Select...</option>
              <option value="Option1">Option 1</option>
              <option value="Option2">Option 2</option>
            </select>
          )}
          {field.inputType === 'datetime-local' && (
            <input
              type="datetime-local"
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={(e) => handleChange(e, field.name)}
            />
          )}
        </div>
      ))}
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
