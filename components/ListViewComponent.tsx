import React, { useEffect, useState } from "react";
import { ListView } from "@syncfusion/ej2-lists";
import { DataManager, Query } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "./listComponent";  // Import FieldSettingsModel

interface ListViewComponentProps {
  dataSource: any[];  // The data to be passed to the ListView component
  filterInputId: string;  // The ID of the input field for filtering
}

const ListViewComponent: React.FC<ListViewComponentProps> = ({ dataSource, filterInputId }) => {
  const [listData, setListData] = useState<any[]>(dataSource);

  // Define a custom template for the ListView
  const getTemplate = (data: any) => {
    return `
      <div class="e-list-wrapper e-list-multi-line e-list-avatar">
        ${data.avatar ? 
          `<span class="e-avatar e-avatar-circle">${data.avatar}</span>` : 
          `<span class="e-avatar e-avatar-circle"> </span>`
        }
        <span class="e-list-item-header">${data.name}</span>
        <span class="e-list-content">${data.phone_number}</span>
      </div>
    `;
  };

  useEffect(() => {
    // Initialize the ListView component with the correct configuration
    const listObj = new ListView({
      dataSource: listData,  // Pass the dataSource as an array of objects
      fields: FieldSettingsModel, // Use the FieldSettingsModel for the field mapping
      width: "350px",
      showHeader: true,
      showCheckBox: true,
      cssClass: "e-list-template",
      template: (data: any) => getTemplate(data),  // Use the custom template
      sortOrder: "Ascending",
    });

    // Append ListView to the DOM element
    listObj.appendTo("#List");

    // Handle filtering by user input
    const handleKeyUp = (e: Event) => {
      const value = (document.getElementById(filterInputId) as HTMLInputElement).value;
      const filteredData = new DataManager(listData).executeLocal(
        new Query().where("name", "startswith", value, true)
      );

      listObj.dataSource = value ? filteredData : listData.slice();
      listObj.dataBind();  // Explicitly bind the filtered data
    };

    // Attach the keyup event listener for filtering
    document.getElementById(filterInputId)?.addEventListener("keyup", handleKeyUp);

    return () => {
      document.getElementById(filterInputId)?.removeEventListener("keyup", handleKeyUp);
    };
  }, [listData, filterInputId]);

  return <div id="List" style={{ height: "300px", overflowY: "auto" }}></div>;
};

export default ListViewComponent;
