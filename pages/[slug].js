import React from 'react';
import supabase from '../lib/supabase';

const MenuDetails = ({ menuData }) => {
  if (!menuData) {
    console.log('Menu item not found. Displaying fallback message.');
    return <h1>Menu Item Not Found</h1>;
  }

  console.log('Menu Data:', menuData);

  return (
    <div style={styles.container}>
      <h1>{menuData.screenname}</h1>
      <p>
        <strong>Menu URL:</strong> {menuData.jsondata.menuUrl}
      </p>
      <p>
        <strong>Parent Menu ID:</strong> {menuData.jsondata.parentMenuId}
      </p>
    </div>
  );
};

export async function getStaticPaths() {
  console.log('Generating static paths...');

  try {
    const { data: menus, error } = await supabase.from('inventoryMaster').select('screename');
    if (error) throw error;

    console.log('Fetched menus for paths:', menus); 

    const paths = menus.map((menu) => ({
      params: { slug: menu.screename.toLowerCase().replace(/\s+/g, '-') }, 
    }));

    console.log('Generated paths:', paths); 

    return {
      paths,
      fallback: 'blocking', 
    };
  } catch (error) {
    console.error('Error generating paths:', error.message);
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps(context) {
  const { slug } = context.params;
  console.log(`Fetching details for menu: ${slug}`);

  try {
    const { data: menus, error } = await supabase.from('inventoryMaster').select('*');
    if (error) throw error;

    console.log('Fetched menus:', menus);

    const menuData = menus.find((menu) => {
      if (menu.screename && typeof menu.screename === 'string') {
        return menu.screename.toLowerCase().replace(/\s+/g, '-') === slug;
      }
      return false;
    });

    console.log('Fetched menu data:', menuData);

    return {
      props: { menuData: menuData || null },
      revalidate: 10, 
    };
  } catch (error) {
    console.error('Error fetching menu details:', error.message);

    return { 
      props: { menuData: null } 
    };
  }
}


const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    margin: '40px auto',
    width: '50%',
  },
};

export default MenuDetails;
