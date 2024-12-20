import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import MenuCard from '../components/MenuCard';
import DynamicForm from '../components/DynamicForm';
import dynamic from 'next/dynamic';

// Dynamically import the MyGrid component
const MyGrid = dynamic(() => import('../components/MyGrid'), { ssr: false });

const HomePage = ({ menus, formFields }) => {
  const [orderedMenus, setOrderedMenus] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const sortedMenus = [...menus].sort((a, b) =>
      a.screename.localeCompare(b.screename)
    );
    setOrderedMenus(sortedMenus);
  }, [menus]);

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (data) => {
    console.log('Form Submitted:', data);
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div id="main-container" className="container">
      {/* Left Pane */}
      <div id="left-pane" className="left-pane">
        <div id="left-pane-header" className="left-pane-header">
          {/* You can add a title or header for the left pane */}
          <h3 id="left-pane-title">Menu Items</h3>
        </div>
        <div id="menu-items" className="menu-items">
          {orderedMenus.length > 0 ? (
            orderedMenus.map((menu) => (
              <div key={menu.nprimarykey} id={`menu-item-${menu.nprimarykey}`} className="menu-item">
                <MenuCard
                  screenname={menu.screename}
                  onAddClick={handleAddClick}
                />
              </div>
            ))
          ) : (
            <p id="no-menu-items-text">No menu items available...</p>
          )}
        </div>
      </div>

      {/* Right Pane */}
      <div id="right-pane" className="right-pane">
        <div id="right-pane-header" className="right-pane-header">
          <h2 id="grid-title" className="title">KendoReact Grid</h2>
        </div>
        <div id="grid-container" className="grid-container">
          <MyGrid />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div id="form-container" className={`form-container ${showForm ? 'show' : ''}`}>
          <div id="form-header" className="form-header">
            <h3 id="form-title">Submit Form</h3>
          </div>
          {formFields?.length > 0 ? (
            <DynamicForm
              fields={formFields}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          ) : (
            <p id="loading-form-fields">Loading form fields...</p>
          )}
        </div>
      )}

      <style jsx>{`
        /* Global Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          width: 100%;
          height: 100%;
          font-family: Arial, sans-serif;
          overflow: hidden; /* Prevent scrollbars */
          transform: scale(1); /* Ensure no unintended zoom effects */
        }

        /* Main Container */
        .container {
          display: flex;
          flex-direction: row; /* Horizontal layout */
          width: 80vw; /* Full viewport width */
background: none;
        }

        /* Left Pane (Menu) */
        .left-pane {
          width: 20%; /* 20% of the total width */
          min-width: 250px; /* Prevent shrinking too small */
          max-width: 300px; /* Prevent expanding too large */
          height: 100%; /* Full height */
          padding: 1rem;
          background-color: #f5f5f5;
          border-right: 1px solid #ddd;
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          overflow-y: hidden;
          box-sizing: border-box;
        }

        /* Left Pane Header */
        .left-pane-header {
          width: 100%;
          padding-bottom: 1rem;
          text-align: center;
        }

        /* Menu Items in Left Pane */
        .menu-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          height: auto;
          
        }

        /* Individual Menu Item */
        .menu-item {
          width: 100%;
          margin-bottom: 1rem;
        }

        /* Individual Menu Card */
        .menu-card {
          background-color: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
          cursor: pointer;
          text-align: center;
          padding: 1rem;
          width: 100%;
          max-width: 280px;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          overflow: hidden;
        }

        .menu-card:hover {
          transform: translateY(-5px);
          box-shadow: 0px 8px 16px rgba(0, 0, 255, 0.3);
          border-color: #3a75b8;
          background-color: #227dab;
        }

        .menu-card:active {
          transform: translateY(0px);
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
        }

        /* Right Pane */
        .right-pane {
          width: 80%; /* 80% of the available width */
          height: 100%; /* Full height */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 1rem;
          background-color: #ffffff;
          overflow-y: auto;
          box-sizing: border-box;
        }

        /* Right Pane Header */
        .right-pane-header {
          width: 100%;
          padding-bottom: 5rem;
          text-align: center;
        }

        /* Grid Layout */
        .grid-container {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* Form Container */
        .form-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .form-container.show {
          opacity: 1;
          visibility: visible;
        }

        /* Form Header */
        .form-header {
          width: 100%;
          text-align: center;
          margin-bottom: 1rem;
        }

        /* Media Query for Smaller Screens */
        @media (max-width: 768px) {
          .container {
            flex-direction: column; /* Stack panes vertically */
          }

          .left-pane,
          .right-pane {
            width: 100%; /* Full width on small screens */
            margin-left: 0;
          }

          .menu-items {
            max-height: 70%;
          }

          .menu-card {
            width: 100%; /* Full width for menu items on smaller screens */
          }

          .grid-container {
            width: 100%;
            height: auto;
          }
        }

        /* General Grid Styling */
        .k-grid .k-grid-header {
          font-size: 14px; /* Smaller font size for grid headers */
        }

        .k-grid .k-grid-content {
          font-size: 14px; /* Smaller font size for grid content */
        }
      `}</style>
    </div>
  );
};

export async function getStaticProps() {
  const { data: menus, error: menuError } = await supabase
    .from('inventoryMaster')
    .select('nprimarykey, screename');

  const { data: inventoryMaster, error: formError } = await supabase
    .from('inventoryMaster')
    .select('formJson')
    .eq('nprimarykey', 1);

  if (menuError || formError) {
    console.error('Error fetching data:', menuError?.message, formError?.message);
    return {
      props: { menus: [], formFields: [] },
      revalidate: 10,
    };
  }

  const formFields = inventoryMaster?.[0]?.formJson?.fields || [];

  return {
    props: {
      menus: menus || [],
      formFields,
    },
    revalidate: 10,
  };
}

export default HomePage;
