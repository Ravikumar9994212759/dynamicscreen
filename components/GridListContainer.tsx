//components/GridListContainer.tsx

import React from "react";
import ListViewComponent from "./ListViewComponent"; 
import NormalEdit from "./NormalEdit";
import ListView from "./ListView";
import MenuPage from "../pages/menu/menus";

interface Material {
  nid: string;
  id: string;
  field1: string;
  field2: string;
}

interface GridListContainerProps {
  initialDataSource: any[];
  initialData: any[];
  form2: any[];
  ssdata: Material[];
  menuDataSource: any[];
}

const GridListContainer: React.FC<GridListContainerProps> = ({ 
 // initialDataSource,
   initialData, form2, ssdata ,menuDataSource}) => {
  return (
    <div className="grid-container">
            <div className="data-grid-container">
        <h2>Menu Grid</h2>
        <MenuPage menuData={menuDataSource} />
      </div>

      <div className="data-grid-container">
        <h2>Data Grid</h2>
        <NormalEdit initialData={initialData} ssdata={ssdata} form2={form2} />
      </div>


      <div className="list-view-container">
        <h2>List View</h2>
        <ListView 
        //initialDataSource={initialDataSource} 
        />
      </div>
    </div>
  );
};

export default GridListContainer;
