'use client';
import * as React from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Toolbar,
  Edit,
  Inject,
  Sort,
  Filter,
  FilterSettingsModel,
  EditSettingsModel
} from '@syncfusion/ej2-react-grids';

export const data = [
  { OrderID: 10248, CustomerName: "Paul Henriot", Freight: 32.38, OrderDate: new Date(2023, 10, 1), ShipCountry: "France" },
  { OrderID: 10249, CustomerName: "Victor E.", Freight: 11.61, OrderDate: new Date(2023, 10, 2), ShipCountry: "Germany" },
  { OrderID: 10250, CustomerName: "Maria Anders", Freight: 65.13, OrderDate: new Date(2023, 10, 3), ShipCountry: "Mexico" },
  { OrderID: 10251, CustomerName: "Antonio Moreno", Freight: 58.52, OrderDate: new Date(2023, 10, 4), ShipCountry: "Spain" },
  { OrderID: 10252, CustomerName: "Thomas Hardy", Freight: 17.32, OrderDate: new Date(2023, 10, 5), ShipCountry: "UK" }
];

const columnConfig = [
  { field: "OrderID", headerText: "Order ID", width: 120, textAlign: "Right", validationRules: { required: true, number: true }, isPrimaryKey: true },
  { field: "CustomerName", headerText: "Customer Name", width: 150, validationRules: { required: true } },
  { field: "Freight", headerText: "Freight", width: 120, format: "C2", textAlign: "Right", editType: "numericedit" },
  { field: "OrderDate", headerText: "Order Date", editType: "datepickeredit", format: "yMd", width: 170 },
  { field: "ShipCountry", headerText: "Ship Country", width: 150, editType: "dropdownedit", edit: { params: { popupHeight: '300px' } } }
];

function DialogEdit() {
  const toolbarOptions = ['Add', 'Edit', 'Delete'];
  
  const filterSettings: FilterSettingsModel = { type: 'Excel' as 'Excel' };
  
  const editSettings: EditSettingsModel = { 
    allowEditing: true, 
    allowAdding: true, 
    allowDeleting: true, 
    mode: 'Dialog' as 'Dialog' // Dialog mode should be triggered only after specific actions like Add or Edit
  };

  const pageSettings = { pageCount: 5 };

  // To prevent auto-opening of dialog on refresh
  const [dialogVisible, setDialogVisible] = React.useState(false);

  React.useEffect(() => {
    // Reset any state on page load (in case dialog is opened automatically)
    setDialogVisible(false);
  }, []);

  return (
    <div id="dialog-edit-control-pane" className="control-pane">
      <div id="dialog-edit-control-section" className="control-section">
        <GridComponent
          id="grid-component"
          dataSource={data}
          toolbar={toolbarOptions}
          allowPaging={true}
          allowSorting={true}
          allowFiltering={true}
          filterSettings={filterSettings}
          editSettings={editSettings}
          pageSettings={pageSettings}
        >
          <ColumnsDirective>
            {columnConfig.map((col, index) => (
              <ColumnDirective key={index} {...col} />
            ))}
          </ColumnsDirective>
          <Inject services={[Page, Toolbar, Edit, Sort, Filter]} />
        </GridComponent>
      </div>
    </div>
  );
}

export default DialogEdit;
