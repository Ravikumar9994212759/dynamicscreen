//pages/menu/menus.tsx
import Link from "next/link";

// Define the type of your menu item based on the structure of the response data
interface MenuItem {
  menuurl: string;
  parentmenuid: string;
  nprimarykey: number;
  screename: string;
  nstatus: string;
}

interface MenuPageProps {
  menuData: MenuItem[];  // Expect the data passed as prop from the parent
}

const MenuPage: React.FC<MenuPageProps> = ({ menuData }) => {
  // Check if menuData is undefined or empty
  if (!menuData || menuData.length === 0) {
    return <div>No menu items available.</div>;
  }

  return (
    <div>
      <h1>Menu</h1>
      <nav>
        <ul>
          {/* Dynamically create links for each menu item */}
          {menuData.map((item) => (
            <li key={item.nprimarykey}>
              {/* Generate the dynamic route based on nprimarykey */}
              <Link href={`/menu/${item.nprimarykey}`}>
                <a>{item.screename}</a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MenuPage;
