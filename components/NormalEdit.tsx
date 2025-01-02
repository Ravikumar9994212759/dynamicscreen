import React, { useState, useEffect, useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Edit, Toolbar, Inject, Page, Sort, Filter } from '@syncfusion/ej2-react-grids';
import useSWR from 'swr';
import { DialogFormTemplate } from '../components/DialogFormTemplate'; // Import the DialogFormTemplate
import supabase from '../lib/supabase';
// Define the type for each column
interface Column {
  field: string;
  headerText: string;
  width: string;
  textAlign: string;
}

// Define the structure of each field (based on dynamic data)
interface FieldConfig {
  name: string;
  label: string;
  inputType?: 'textbox' | 'numeric' | 'dropdown' | 'textarea' | 'datetime' | 'checkbox'; // Dynamic input type
  dataType?: 'String' | 'Integer' | 'Boolean';  // Dynamic data type
  limit?: number;  // Optional limit (e.g., max length)
  default?: string | boolean | number;  // Default value for the field
  gridShow?: boolean;  // Whether the field should be displayed in the grid
}

interface NormalEditProps {
  initialData: FieldConfig[];  // This comes from getServerSideProps
}

const NormalEdit: React.FC<NormalEditProps> = ({ initialData }) => {
  const [data, setData] = useState<any[]>([]);  // Data state
  const [columns, setColumns] = useState<Column[]>([]);  // Columns state
  const [isLoading, setIsLoading] = useState(true);  // Loading state

  const grid = useRef<any>(null);  // Grid reference
  const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search']; // Toolbar options
  const pageSettings = { pageSize: 10 }; // Page settings

  // Use SWR to fetch live data for real-time updates
  const { data: liveData, error } = useSWR('materials', async () => {
    const { data, error } = await supabase.from('materials').select('*');
    if (error) throw new Error(error.message);
    return data;
  }, {
    refreshInterval: 5000, // Refresh every 5 seconds
  });

  // Set initial data (fetched from getServerSideProps)
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);

      // Example columns data based on initialData. Adjust as needed.
      const columns = initialData.map(field => ({
        field: field.name,
        headerText: field.label,
        width: '100',
        textAlign: 'Left'
      }));
      setColumns(columns);
      setIsLoading(false);  // Data is loaded, no longer in loading state
    }
  }, [initialData]);

  // If SWR is loading or an error occurred
  if (!liveData && isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading live data</div>;

  // Map initialData to fields for DialogFormTemplate (includes dynamic configurations)
  const getFieldsFromColumns = () => {
    return initialData.map(field => ({
      name: field.name,
      label: field.label,
      inputType: field.inputType || 'textbox',  // Default to 'textbox' if no inputType is defined
      dataType: field.dataType || 'String',    // Default to 'String' if no dataType is defined
      limit: field.limit || 50,                // Default to 50 if limit is not defined
      default: field.default || '',            // Default to empty string if no default value is defined
      gridShow: field.gridShow !== undefined ? field.gridShow : true // Default to true if gridShow is undefined
    }));
  };

  const dialogTemplate = (props: any) => {
    const fields = getFieldsFromColumns(); // Map columns to fields
    return <DialogFormTemplate {...props} fields={fields} />;
  };

  const editOption = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog',
    template: dialogTemplate,
  };

  const actionComplete = (args: any) => {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      args.form.ej2_instances[0].rules = {};
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
    <div>
      {/* Show loading state if columns or data are not available */}
      {isLoading ? (
        <div>Loading data...</div>
      ) : (
        <GridComponent
          ref={grid}
          dataSource={liveData || data} // Use live data from SWR if available, otherwise fallback to initial data
          actionComplete={actionComplete}
          editSettings={editOption}
          toolbar={toolbarOptions}
          allowPaging={true}
          pageSettings={pageSettings}
          allowSorting={true}
          allowFiltering={true}
          height={265}
        >
          <ColumnsDirective>
            {columns.map((col, index) => (
              <ColumnDirective key={index} {...col} />
            ))}
          </ColumnsDirective>
          <Inject services={[Edit, Toolbar, Page, Sort, Filter]} />
        </GridComponent>
      )}
    </div>
  );
};

// Fetch initial data from Supabase in getServerSideProps
export async function getServerSideProps() {
  // Fetch data from Supabase for initial load (e.g., get the field configuration)
  const { data, error } = await supabase.from('materials').select('*'); // Query your materials table
  if (error) {
    return { notFound: true };
  }

  const initialData = data.map((item: any) => ({
    name: item.name,
    label: item.label,
    inputType: item.input_type, // Adjust according to your Supabase schema
    dataType: item.data_type,
    gridShow: item.grid_show !== undefined ? item.grid_show : true
  }));

  return {
    props: {
      initialData
    }
  };
}

export default NormalEdit;
