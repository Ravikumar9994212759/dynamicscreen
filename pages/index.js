import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import MenuCard from '../components/MenuCard';

const HomePage = ({ menus }) => {
  const [orderedMenus, setOrderedMenus] = useState([]);

  // Sort the menus by screenname to maintain a consistent order
  useEffect(() => {
    // Sort by screenname alphabetically
    const sortedMenus = [...menus].sort((a, b) => a.screename.localeCompare(b.screename));
    setOrderedMenus(sortedMenus);
  }, [menus]); // Whenever menus change, resort the array

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
  try {
    // Fetch data from the inventoryMaster table
    const { data: menus, error } = await supabase
      .from('inventoryMaster')
      .select('nprimarykey, screename');

    console.log('Fetched Menus:', menus); // Debugging log

    if (error) throw error;

    return {
      props: { menus: menus || [] }, // Default to empty array
      revalidate: 10, // ISR every 10 seconds
    };
  } catch (error) {
    console.error('Error fetching menu list:', error.message);
    return { props: { menus: [] } }; // Return empty array on failure
  }
}

export default HomePage;
