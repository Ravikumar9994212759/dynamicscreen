import React, { useState, useCallback } from 'react';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';

const renderInputField = (field, state, onChange) => {
  const { name, label, dataType, inputType, default: defaultValue } = field;
  const commonProps = {
    id: name,
    name: name,
    value: state[name] || defaultValue || '',
    onChange,
    placeholder: label,
    style: { width: '100%' },
  };

  switch (inputType) {
    case 'textbox':
      return (
        <div className="form-group">
          <div className="e-float-input e-control-wrapper">
            <input
              {...commonProps}
              type={dataType === 'Integer' ? 'number' : 'text'}
            />
            <span className="e-float-line" />
            <label className="e-float-text e-label-top">{label}</label>
          </div>
        </div>
      );
    case 'numeric':
      return (
        <div className="form-group">
          <NumericTextBoxComponent
            {...commonProps}
            floatLabelType="Always"
            change={(e) => onChange(e.value, name)}
          />
        </div>
      );
    case 'dropdown':
      return (
        <div className="form-group">
          <DropDownListComponent
            {...commonProps}
            floatLabelType="Always"
            change={(e) => onChange(e.value, name)}
          />
        </div>
      );
    case 'textarea':
      return (
        <div className="form-group">
          <textarea
            {...commonProps}
            rows={4}
          />
        </div>
      );
    case 'datetime':
      return (
        <div className="form-group">
          <input
            {...commonProps}
            type="datetime-local"
          />
        </div>
      );
    case 'checkbox':
      return (
        <div className="form-group">
          <CheckBoxComponent
            {...commonProps}
            checked={state[name] || defaultValue || false}
            change={(e) => onChange(e.checked, name)}
          />
        </div>
      );
    default:
      return null;
  }
};

export function DialogFormTemplate({ fields, ...props }) {
  const [state, setState] = useState({ ...props });
  const [showSidebar, setShowSidebar] = useState(false);

  const onChange = useCallback((value, name) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  return (
    <div style={{ width: '350px' }}>
      <h2 style={{ textAlign: 'center', color: '#333', fontSize: '20px' }}>Dynamic Form</h2>
      <div className="form-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {fields.map((field, index) => (
          field.gridShow && (
            <div key={`${field.name}-${index}`}>{renderInputField(field, state, onChange)}</div>
          )
        ))}
      </div>

      <div id="footer" style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          className="e-info e-btn"
          type="button"
          onClick={() => setShowSidebar(true)} 
          style={buttonStyle}
        >
          Add Site
        </button>
      </div>

      {showSidebar && (
        <div id="sidebar" style={sidebarStyle}>
          <h2 className="sidebar-header" style={{ textAlign: 'center' }}>Site Form</h2>
          <div className="form-container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {fields.map((field, index) => renderInputField(field, state, onChange))}
          </div>
          <button
            onClick={() => setShowSidebar(false)} 
            style={saveButtonStyle}
          >
            Save & Continue
          </button>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  backgroundColor: '#396ab3',
  color: '#fff',
  padding: '1px 10px',
  fontSize: '22px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const sidebarStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  width: '380px',
  height: '600px',
  backgroundColor: '#fff',
  padding: '30px',
  boxShadow: '-5px 0px 20px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
};

const saveButtonStyle = {
  backgroundColor: '#396ab3',
  color: '#fff',
  padding: '2px 40px',
  fontSize: '18px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  marginTop: '-6px',
  display: 'block',
  width: '100%',
};
