import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import MenuCard from '../components/MenuCard';

const HomePage = ({ menus }) => {
  const [orderedMenus, setOrderedMenus] = useState([]);

  useEffect(() => {
    console.log('Menus changed, starting to sort...');
    
    const sortedMenus = [...menus].sort((a, b) => a.screename.localeCompare(b.screename));
    console.log('Sorted Menus:', sortedMenus);

    setOrderedMenus(sortedMenus);

  }, [menus]); 

  return (
    <div className="menu-grid">
      {orderedMenus.length > 0 ? (
        orderedMenus.map((menu) => (
          <MenuCard key={menu.nprimarykey} screenname={menu.screename} />
        ))
      ) : (
        <p>No menu items available..</p>
      )}
    </div>
  );
};

export async function getStaticProps() {
  console.log('Starting SSR for homepage...');
  try {
    const { data: menus, error } = await supabase
      .from('inventoryMaster')
      .select('nprimarykey, screename');

    if (error) {
      console.error('Error fetching menus:', error.message);
      throw error;
    }

    console.log('Fetched Menus:', menus); 
    return {
      props: { menus: menus || [] }, 
      revalidate: 10, 
    };
  } catch (error) {
    console.error('Error fetching menu list:', error.message);
    return { props: { menus: [] } }; 
  }
}

export default HomePage;
