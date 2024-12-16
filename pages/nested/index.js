import React from 'react';
import supabase from '../../lib/supabase';
import MenuCard from '../../components/MenuCard';

const HomePage = ({ menus }) => {
  return (
    <div style={styles.grid}>
      {menus.map((menu) => (
        <MenuCard key={menu.id} screenname={menu.screenname} />
      ))}
    </div>
  );
};

export async function getStaticProps() {
  try {
    const { data: menus, error } = await supabase.from('inventoryMaster').select('*');
    if (error) throw error;

    return {
      props: { menus: menus || [] },
      revalidate: 10, // ISR every 10 seconds
    };
  } catch (error) {
    console.error('Error fetching menu list:', error.message);
    return { props: { menus: [] } };
  }
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
};

export default HomePage;
