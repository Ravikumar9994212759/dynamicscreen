import React, { useState, useEffect, useCallback } from 'react';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars'; // Import DateTimePicker

const renderInputField = (field, state, onChange, dropdownData) => {
  const { name, label, dataType, inputType, default: defaultValue } = field;
  const commonProps = {
    id: name,
    name: name,
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
              value={state[name] || ''}
              onChange={(e) => onChange(e.target.value, name)}
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
            value={state[name] || defaultValue || 0}
            change={(e) => onChange(e.value, name)}
          />
        </div>
      );
    case 'dropdown':
      return (
        <div className="form-group">
          <DropDownListComponent
            {...commonProps}
            dataSource={dropdownData} // Use the fetched dropdown data
            fields={{ text: 'ssitename', value: 'ssitename' }} // Use ssitename for both text and value
            value={state[name] || ''}
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
            value={state[name] || ''}
            onChange={(e) => onChange(e.target.value, name)}
          />
        </div>
      );
    case 'datetime':
      return (
        <div className="form-group">
          <input
            {...commonProps}
            type="datetime-local"
            value={state[name] || ''}
            onChange={(e) => onChange(e.target.value, name)}
          />
        </div>
      );
    case 'checkbox':
      return (
        <div className="form-group">
          <CheckBoxComponent
            {...commonProps}
            checked={!!state[name]}
            change={(e) => onChange(e.checked, name)}
          />
        </div>
      );
    default:
      return null;
  }
};

export function DialogFormTemplate({ fields, form2, ...props }) {
  const [state, setState] = useState(() => {
    const initialState = {};
    fields.forEach((field) => {
      if (field.gridShow) { // Check if gridShow is true
        initialState[field.name] = props[field.name] || field.default || '';
      }
    });
    return initialState;
  });

  const [sidebarState, setSidebarState] = useState(() => {
    const initialState = {};
    form2.forEach((field) => {
      initialState[field.name] = field.default || '';  // Using the default values for initialization
    });
    return initialState;
  });

  const [showSidebar, setShowSidebar] = useState(false);
  const [dropdownData, setDropdownData] = useState([]); // State for dropdown data

  // Fetch dropdown data from the API
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch('http://localhost:9356/QuaLIS/invoicecustomermaster/getsitedetailsdata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setDropdownData(data); // Set the fetched data in state
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  const onMainFormChange = useCallback((value, name) => {
    console.log(`Main form field updated: ${name}, Value: ${value}`);
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const onSidebarFormChange = useCallback((value, name) => {
    console.log(`Sidebar form field updated: ${name}, Value: ${value}`);
    
    if (name === 'djoindate' || name === 'dcreatedat') {
      const date = new Date(value);
  
      // Ensure the date is formatted in UTC
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Zero-based
      const day = String(date.getUTCDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day} 00:00:00`; // Always set time to 00:00:00 in UTC
      
      value = formattedDate;
    }
  
    setSidebarState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSaveAndContinue = async () => {
    try {
      console.log('sidebarState:', sidebarState);
      const res = await fetch('http://localhost:9356/QuaLIS/invoicecustomermaster/createSiteDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newMaterial: sidebarState }),
      });

      if (!res.ok) {
        throw new Error('Failed to save material');
      }
      const data = await res.json();
      console.log('Material saved successfully:', data);
      setDropdownData(data); 
      // Close the sidebar after successful save
      setShowSidebar(false);

    } catch (error) {
      console.error('Error saving material:', error);
    }
  };

  return (
    <div style={{ width: '350px' }}>
      <h2 style={{ textAlign: 'center', color: '#333', fontSize: '20px' }}>Dynamic Form</h2>
      <div className="form-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {fields.filter(field => field.gridShow).map((field, index) => (
          <div key={`${field.name}-${index}`}>
            {renderInputField(field, state, onMainFormChange, dropdownData)} {/* Pass dropdownData here */}
          </div>
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
            {form2.map((field, index) => renderInputField(field, sidebarState, onSidebarFormChange, dropdownData))}
          </div>
          <button
            onClick={handleSaveAndContinue}
            type="button"
            style={saveButtonStyle}
          >
            Save & Continue
          </button>
          <button
            onClick={() => setShowSidebar(false)} 
            style={{ marginTop: '10px', backgroundColor: '#f44336', color: '#fff', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Close
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
