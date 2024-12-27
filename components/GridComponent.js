'use client';
import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Edit, Toolbar, Inject } from '@syncfusion/ej2-react-grids';
import { data } from './datasource';
import { DialogFormTemplate } from './DialogFormTemplate';

export default function Grid() {
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

  return (
    <GridComponent
      ref={(g) => (grid = g)}
      dataSource={data}
      actionComplete={actionComplete}
      editSettings={editOption}
      toolbar={toolbarOptions}
      height={265}
    >
      <ColumnsDirective>
        <ColumnDirective field="OrderID" headerText="Order ID" width="100" textAlign="Right" isPrimaryKey={true} validationRules={rules} />
        <ColumnDirective field="CustomerID" headerText="Customer ID" width="120" validationRules={rules} />
        <ColumnDirective field="ShipCountry" headerText="Ship Country" width="150" />
      </ColumnsDirective>
      <Inject services={[Edit, Toolbar]} />
    </GridComponent>
  );
}
