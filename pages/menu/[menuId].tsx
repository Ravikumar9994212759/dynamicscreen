// pages/menu/[menuId].tsx
import { useRouter } from 'next/router';

interface MenuItem {
  menuurl: string;
  parentmenuid: string;
  nprimarykey: number;
  screename: string;
  nstatus: string;
}

interface MenuPageProps {
  menuItem: MenuItem;
}

export async function getStaticPaths() {
  const menuData: MenuItem[] = [
    { menuurl: '/dashboard', parentmenuid: '1', nprimarykey: 1, screename: 'Dashboard', nstatus: '1' },
    { menuurl: '/inventory', parentmenuid: '2', nprimarykey: 2, screename: 'Inventory', nstatus: '1' },
    { menuurl: '/store', parentmenuid: '3', nprimarykey: 3, screename: 'Store', nstatus: '1' },
    { menuurl: '/outward', parentmenuid: '4', nprimarykey: 4, screename: 'Outward', nstatus: '1' },
    { menuurl: '/inward', parentmenuid: '5', nprimarykey: 5, screename: 'Inward', nstatus: '1' },
    { menuurl: '/Stock', parentmenuid: '1', nprimarykey: 6, screename: 'Stock', nstatus: '1' },
  ];

  const paths = menuData.map((item) => ({
    params: { menuId: item.nprimarykey.toString() },  // Dynamic route generation based on nprimarykey
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { menuId: string } }) {
  const menuData: MenuItem[] = [
    { menuurl: '/dashboard', parentmenuid: '1', nprimarykey: 1, screename: 'Dashboard', nstatus: '1' },
    { menuurl: '/inventory', parentmenuid: '2', nprimarykey: 2, screename: 'Inventory', nstatus: '1' },
    { menuurl: '/store', parentmenuid: '3', nprimarykey: 3, screename: 'Store', nstatus: '1' },
    { menuurl: '/outward', parentmenuid: '4', nprimarykey: 4, screename: 'Outward', nstatus: '1' },
    { menuurl: '/inward', parentmenuid: '5', nprimarykey: 5, screename: 'Inward', nstatus: '1' },
    { menuurl: '/Stock', parentmenuid: '1', nprimarykey: 6, screename: 'Stock', nstatus: '1' },
  ];

  const menuItem = menuData.find((item) => item.nprimarykey.toString() === params.menuId);

  return {
    props: {
      menuItem: menuItem || { nprimarykey: 0, screename: 'Not Found', menuurl: '#' },
    },
  };
}

const MenuPage: React.FC<MenuPageProps> = ({ menuItem }) => {
  return (
    <div>
      <h1>{menuItem.screename}</h1>
      <p>Menu URL: {menuItem.menuurl}</p>
      <p>Status: {menuItem.nstatus}</p>
    </div>
  );
};

export default MenuPage;
