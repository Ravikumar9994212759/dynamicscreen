'use client';
import React, { useState } from 'react';
import { DataUtil } from '@syncfusion/ej2-data';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { data } from './datasource';

export function DialogFormTemplate({ grid, ...props }) {
  const [state, setState] = useState({ ...props });
  const [showSidebar, setShowSidebar] = useState(false); // Controls sidebar visibility

  const shipCountryDistinctData = DataUtil.distinct(data, 'ShipCountry', true);
  const shipCityDistinctData = DataUtil.distinct(data, 'ShipCity', true);

  const onChange = (event) => {
    const { name, value, checked, type } = event.target;
    setState({
      ...state,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const save = () => {
    if (validate()) {
      grid.endEdit();
    }
  };

  const validate = () => {
    let valid = true;
    const elements = document.querySelectorAll(`[name]`);
    elements.forEach((element) => {
      if (element.form && element.form.ej2_instances) {
        element.form.ej2_instances[0].validate(element.name);
        if (element.getAttribute('aria-invalid') === 'true') {
          valid = false;
        }
      }
    });
    return valid;
  };

  const formConfig1 = [
    {
      id: 'OrderID',
      name: 'OrderID',
      type: 'text',
      label: 'User ID',
      disabled: !state.isAdd,
      value: state.OrderID || '',
    },
    {
      id: 'CustomerName',
      name: 'CustomerID',
      type: 'text',
      label: 'User Name',
      value: state.CustomerID || '',
    },
    {
      id: 'Password',
      name: 'Password',
      type: 'password',
      label: 'Password',
      value: state.Password || '',
    },
    {
      id: 'Freight',
      type: 'numeric',
      label: 'Age',
      value: state.Freight,
    },
    {
      id: 'ShipCity',
      type: 'dropdown',
      label: 'City name',
      value: state.ShipCity,
      dataSource: shipCityDistinctData,
      fields: { text: 'ShipCity', value: 'ShipCity' },
    },
    {
      id: 'ShipCountry',
      type: 'dropdown',
      label: 'Country name',
      value: state.ShipCountry,
      dataSource: shipCountryDistinctData,
      fields: { text: 'ShipCountry', value: 'ShipCountry' },
    },
    {
      id: 'Verified',
      name: 'Verified',
      type: 'checkbox',
      label: 'Discount',
      value: state.Verified,
    },
    {
      id: 'Comments',
      name: 'Comments',
      type: 'textarea',
      label: 'User details',
      value: state.Comments || '',
    },
  ];

  const formConfig2 = [
    {
      id: 'ProductID',
      name: 'ProductID',
      type: 'text',
      label: 'Site',
      value: state.ProductID || '',
    },
    {
      id: 'ProductName',
      name: 'ProductName',
      type: 'text',
      label: 'Contact name',
      value: state.ProductName || '',
    },
    {
      id: 'Quantity',
      name: 'Quantity',
      type: 'numeric',
      label: 'Quantity',
      value: state.Quantity || 0,
    },
    {
      id: 'Category',
      type: 'dropdown',
      label: 'Category',
      value: state.Category,
      dataSource: shipCountryDistinctData,
      fields: { text: 'ShipCountry', value: 'ShipCountry' },
    },
    {
      id: 'Price',
      name: 'Price',
      type: 'numeric',
      label: 'Price',
      value: state.Price || 0,
    },
  ];

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'password':
        return (
          <div className="form-group " key={field.id}>
            <div className="e-float-input e-control-wrapper">
              <input
                id={field.id}
                name={field.name}
                type={field.type}
                disabled={field.disabled}
                value={field.value}
                onChange={onChange}
                style={{ width: '100%', fontSize: '16px'}}
              />
              <span className="e-float-line" />
              <label className="e-float-text e-label-top">{field.label}</label>
            </div>
          </div>
        );
      case 'numeric':
        return (
          <div className="form-group" key={field.id}>
            <NumericTextBoxComponent
              id={field.id}
              value={field.value}
              placeholder={field.label}
              floatLabelType="Always"
              style={{ width: '100%' }}
              change={(e) => setState({ ...state, [field.id]: e.value })}
            />
          </div>
        );
      case 'dropdown':
        return (
          <div className="form-group" key={field.id}>
            <DropDownListComponent
              id={field.id}
              value={field.value}
              dataSource={field.dataSource}
              fields={field.fields}
              placeholder={field.label}
              popupHeight="300px"
              floatLabelType="Always"
              style={{ width: '100%' }}
              change={(e) => setState({ ...state, [field.id]: e.value })}
            />
          </div>
        );
      case 'checkbox':
        return (
          <div className="form-group" key={field.id}>
            <CheckBoxComponent
              id={field.id}
              name={field.name}
              label={field.label}
              checked={field.value}
              change={(e) => setState({ ...state, [field.id]: e.checked })}
            />
          </div>
        );
      case 'textarea':
        return (
          <div className="form-group" key={field.id}>
            <label htmlFor={field.id}>{field.label}</label>
            <textarea
              id={field.id}
              name={field.name}
              value={field.value}
              onChange={onChange}
              style={{ width: '100%' }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
          width:'350px'
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#333', fontSize: '20px' }}>
       User Form
      </h2>
      <div className="form-container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {formConfig1.map((field) => renderField(field))}
      </div>

      <div id="footer" style={{ textAlign: 'center', marginTop: '60px' }}>
        <button
          id="toggleSidebarBtn"
          className="e-info e-btn"
          type="button"
          onClick={() => setShowSidebar(!showSidebar)} // Toggle sidebar visibility
          style={{
            backgroundColor: '#396ab3',
            color: '#fff',
            padding: '1px 10px',
            fontSize: '22px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Add site
        </button>
      </div>

      {showSidebar && (
        <div
          id="sidebar"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            height: '100%',
            backgroundColor: '#fff',
            padding: '40px',
            boxShadow: '-5px 0px 20px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Site form</h2>
          <div className="form-container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {formConfig2.map((field) => renderField(field))}
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            style={{
              backgroundColor: '#396ab3',
              color: '#fff',
              padding: '16px 40px',
              fontSize: '22px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '30px',
              display: 'block',
              width: '100%',
            }}
          >
            Close Sidebar
          </button>
        </div>
      )}
    </div>
  );
}
