// pages/index.js or components/Page.js
'use client';
import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Edit, Toolbar, Inject } from '@syncfusion/ej2-react-grids';
import { data } from '../components/datasource'; // Import data for grid
import { DialogFormTemplate } from '../components/DialogFormTemplate'; // Import dialog form

export default function Page() {
  const [isLoading, setIsLoading] = React.useState(true);
  const toolbarOptions = ['Add', 'Edit', 'Delete'];
  const rules = { required: true };
  let grid;

  const dialogTemplate = (props) => {
    return <DialogFormTemplate {...props} grid={grid} />;
  };

  const editOption = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog',
    template: dialogTemplate,
  };

  const actionComplete = (args) => {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      args.form.ej2_instances[0].rules = {}; // Disable default validation
      args.dialog.element
        .querySelector('.e-footer-content')
        .classList.add('e-hide');

      setTimeout(() => {
        const customerIDInput = args.form.elements.namedItem('CustomerID');
        if (customerIDInput) {
          customerIDInput.focus();
        }
      }, 0);
    }
  };

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate data fetching
  }, []);

  return (
    <div>
      {isLoading ? (
        <div id="loader" style={{ color: '#008cff', height: '140px', left: '45%', position: 'absolute', top: '45%', width: '30%' }}>
          Loading....
        </div>
      ) : (
        <GridComponent
          ref={(g) => (grid = g)}
          dataSource={data}
          actionComplete={actionComplete}
          editSettings={editOption}
          toolbar={toolbarOptions}
          height={265}
        >
          <ColumnsDirective>
            <ColumnDirective
              field="OrderID"
              headerText="Order ID"
              width="100"
              textAlign="Right"
              isPrimaryKey={true}
              validationRules={rules}
            />
            <ColumnDirective field="CustomerID" headerText="Customer ID" width="120" validationRules={rules} />
            <ColumnDirective field="ShipCountry" headerText="Ship Country" width="150" />
          </ColumnsDirective>
          <Inject services={[Edit, Toolbar]} />
        </GridComponent>
      )}
    </div>
  );
}
