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
      <h1>{menuData.screename}</h1>
      <p>
        <strong>Menu URL:</strong> {menuData.jsondata.menuUrl}
      </p>
      <p>
        <strong>Parent Menu ID:</strong> {menuData.jsondata.parentMenuId}
      </p>
    </div>
  );
};

// ISR - Pre-render the page at build time and revalidate after 60 seconds
export async function getStaticProps(context) {
  const { slug } = context.params;
  console.log(`Fetching details for menu: ${slug}`);

  try {
    const start = Date.now();
    const { data: menus, error } = await supabase.from('inventoryMaster').select('*');
    const duration = Date.now() - start;
    console.log(`Query execution time: ${duration}ms`);

    if (error) throw error;

    const menuData = menus.find((menu) => {
      return menu.screename.toLowerCase().replace(/\s+/g, '-') === slug;
    });

    console.log('Menu data fetched:', menuData);

    return {
      props: { menuData: menuData || null },
      revalidate: 60,  // Regenerate page every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching menu details:', error.message);
    return {
      props: { menuData: null },
    };
  }
}

// Static paths for dynamic routing
export async function getStaticPaths() {
  console.log('Generating static paths...');

  try {
    const { data: menus, error } = await supabase.from('inventoryMaster').select('screename');
    if (error) throw error;

    const paths = menus.map((menu) => ({
      params: { slug: menu.screename.toLowerCase().replace(/\s+/g, '-') },
    }));

    console.log('Generated static paths:', paths);

    return {
      paths,
      fallback: 'blocking',  // Block until the page is ready if not generated yet
    };
  } catch (error) {
    console.error('Error generating paths:', error.message);
    return { paths: [], fallback: 'blocking' };
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
