import React from 'react';
import supabase from '../lib/supabase';

const MenuDetails = ({ menuData }) => {
  if (!menuData) {
    console.log('Menu item not found. Displaying fallback message.');
    return <h1>Menu Item Not Found</h1>;
  }

  console.log('Menu Data:', menuData); // Log menu data when found

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

// Generate paths for ISR
export async function getStaticPaths() {
  console.log('Generating static paths...');

  try {
    const { data: menus, error } = await supabase.from('inventoryMaster').select('screenname');
    if (error) throw error;

    console.log('Fetched menus for paths:', menus); // Log fetched menu data

    // Generate paths based on menu screennames
    const paths = menus.map((menu) => ({
      params: { slug: menu.screenname.toLowerCase().replace(/\s+/g, '-') }, // Slugify screenname
    }));

    console.log('Generated paths:', paths); // Log the generated paths

    return {
      paths,
      fallback: 'blocking', // Use 'blocking' to ensure the page is generated before serving
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
    // Fetch all menu items from Supabase
    const { data: menus, error } = await supabase.from('inventoryMaster').select('*');
    if (error) throw error;

    // Find the menu item matching the slug
    const menuData = menus.find(
      (menu) =>
        menu.screenname.toLowerCase().replace(/\s+/g, '-') === slug
    );

    console.log('Fetched menu data:', menuData); // Log the fetched menu data

    return {
      props: { menuData: menuData || null },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching menu details:', error.message);
    return { props: { menuData: null } };
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
