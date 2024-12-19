import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import MenuCard from '../components/MenuCard';
import DynamicForm from '../components/DynamicForm';

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
    <div className="menu-grid">
      {orderedMenus.length > 0 ? (
        orderedMenus.map((menu) => (
          <MenuCard
            key={menu.nprimarykey}
            screenname={menu.screename}
            onAddClick={handleAddClick}
          />
        ))
      ) : (
        <p>No menu items available...</p>
      )}
      
      {/* Form Wrapper */}
      <div className={`form-container ${showForm ? 'show' : ''}`}>
        {showForm && formFields?.length > 0 && (
          <DynamicForm
            fields={formFields}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
        {showForm && formFields?.length === 0 && <p>Loading form fields...</p>}
      </div>
      
      <style jsx>{`
        .form-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
          transition: all 0.5s ease;
          z-index: 1000;
          background-color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 30px;
          border-radius: 8px;
        }

        .form-container.show {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export async function getStaticProps() {
  // Fetch menus data
  const { data: menus, error: menuError } = await supabase
    .from('inventoryMaster')
    .select('nprimarykey, screename');

  // Fetch formJson data for form fields
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
