import React from 'react';
import supabase from '../lib/supabaseClient';

const MenuDetails = ({ menuData }) => {
  if (!menuData) {
    return <h1>Menu Item Not Found</h1>;
  }

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
  try {
    const { data: menus, error } = await supabase.from('inventoryMaster').select('screenname');
    if (error) throw error;

    const paths = menus.map((menu) => ({
      params: { slug: menu.screenname.toLowerCase().replace(/\s+/g, '-') }, // Slugify screenname
    }));

    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    console.error('Error generating paths:', error.message);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps(context) {
  const { slug } = context.params;

  try {
    const { data: menus, error } = await supabase.from('inventoryMaster').select('*');
    if (error) throw error;

    const menuData = menus.find(
      (menu) =>
        menu.screenname.toLowerCase().replace(/\s+/g, '-') === slug
    );

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
