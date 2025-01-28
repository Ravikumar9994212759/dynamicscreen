//NoramEdit.tsx

import React, { useState, useEffect, useRef } from 'react';
import { FilterSettingsModel, FilterType, GridComponent, ColumnsDirective, ColumnDirective, Edit, Toolbar, Inject, Page, Sort, Filter, PdfExport, ExcelExport, Resize } from '@syncfusion/ej2-react-grids';
import useSWR from 'swr';
import { DialogFormTemplate } from '../components/DialogFormTemplate';
import { setCulture, setCurrencyCode, loadCldr } from '@syncfusion/ej2-base';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { GetServerSideProps } from 'next';
import cagregorian from './ca-gregorian.json';
import currencies from './currencies.json';
import numbers from './numbers.json';
import timeZoneNames from './timeZoneNames.json';
import numberingSystems from './numberingSystems.json';
import { EditSettingsModel } from '@syncfusion/ej2-react-grids'; // Import EditSettingsModel
import { FaTrashAlt, FaRegEdit } from 'react-icons/fa'; // Font Awesome icons
import { ToastComponent } from '@syncfusion/ej2-react-notifications';


interface Column {
  field: string;
  headerText: string;
  width: string;
  textAlign: string;
}

interface FieldConfig {
  name: string;
  label: string;
  inputType?: 'textbox' | 'numeric' | 'dropdown' | 'textarea' | 'datetime' | 'checkbox';
  dataType?: 'String' | 'Integer' | 'Boolean';
  limit?: number;
  default?: string | boolean | number;
  gridShow?: boolean;
}

interface NormalEditProps {
  initialData: FieldConfig[];
  ssdata: Material[];  // Ensure ssdata is passed as a prop
  form2: FieldConfig[];
}

interface FilterValue {
  status: string;
}

interface Material {
  nid: string;
  id: string;
  field1: string;
  field2: string;
}

const NormalEdit: React.FC<NormalEditProps> = ({ initialData, form2 }) => {
  const [data, setData] = useState<Material[]>([]); 
  const [columns, setColumns] = useState<Column[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState('en-US');
  const [error, setError] = useState<string | null>(null);
  const grid = useRef<any>(null);
  const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search', 'PdfExport', 'ExcelExport'];
  const pageSettings = { pageSize: 10 };
  const toastInstance = useRef<ToastComponent>(null); 


  const toastCreated = () => {
    console.log("Toast created");
  };

  const toolbarClick = (args: any) => {
    if (args.item.id.includes('pdfexport')) {
      grid.current?.pdfExport();
    } else if (args.item.id.includes('excelexport')) {
      grid.current?.excelExport();
    }
  };

  const filterSettings: FilterSettingsModel = {
    type: 'Menu' as FilterType,
    //  columns: [],
  };

  // Fetch data from live API
  const { data: liveData, error: liveDataError } = useSWR<Material[]>('http://localhost:9356/QuaLIS/invoicecustomermaster/getmaterialsdata', async () => {
    const startTime = Date.now();
    const res = await fetch('/api/materials');
    if (!res.ok) throw new Error('Failed to fetch live data');
    const endTime = Date.now(); 
    const duration = endTime - startTime; 
    toastInstance.current?.show({
      title: 'Success',
      content: `Initial get successfully! (Time: ${duration}ms)`,
      showCloseButton: true,
      timeOut: 5000, 
    });
    return res.json();
  });

  // Fetch filter settings
  const { data: filterValues, error: filterError } = useSWR<FilterValue[]>('/api/filter-settings', async () => {
    const res = await fetch('/api/filter-settings');
    if (!res.ok) throw new Error('Failed to fetch filter settings');
    return res.json();
  });

  useEffect(() => {
    if (filterValues) {
      filterSettings.columns = filterValues.map(value => ({
        field: 'status',
        operator: 'equal',
        value: value.status,
        predicate: 'or',
      }));
    }
  }, [filterValues]);

  useEffect(() => {
    if (initialData.length > 0) {
      const transformedData: Material[] = initialData.map((field, index) => ({
        id: `${index}`, // Assuming 'id' is unique for each row
        nid: `${field.name}-${index}`,
        field1: field.name,
        field2: field.label, 
      }));

      setData(transformedData);
      setColumns(initialData.map(field => ({
        field: field.name,
        headerText: field.label,
        width: '100',
        textAlign: 'Left',
      })));
      setIsLoading(false);
    }
  }, [initialData]);

  useEffect(() => {
    if (liveData) {
      setIsLoading(false);
    }
  }, [liveData]);

  if (isLoading || liveDataError || filterError) {
    return <div>Loading data...</div>;
  }

  const getFieldsFromColumns = () => initialData.map(field => ({
    name: field.name,
    label: field.label,
    inputType: field.inputType || 'textbox',
    dataType: field.dataType || 'String',
    limit: field.limit || 50,
    default: field.default || '',
    gridShow: field.gridShow !== undefined ? field.gridShow : true
  }));

  const dialogTemplate = (props: any) => {
    const fields = getFieldsFromColumns();
    return <DialogFormTemplate {...props} fields={fields} form2={form2} />;
  };

  const editOption: EditSettingsModel = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog',  
    template: dialogTemplate,
  };

  const created = () => {
    if (grid.current) {
      const searchbar = document.getElementById(grid.current.element.id + '_searchbar');
      if (searchbar) {
        searchbar.addEventListener('keyup', (event) => {
          if (grid.current) {
            grid.current.search((event.target as HTMLInputElement).value);
          }
        });
      }
    }
  };

  const changeFrLocale = () => {
    setCulture('fr-FR');
    setCurrencyCode('EUR');
    setLocale('fr-FR');
    loadCldr(cagregorian, currencies, numbers, timeZoneNames, numberingSystems);
  };

  const changeEnLocale = () => {
    setCulture('en-US');
    setCurrencyCode('USD');
    setLocale('en-US');
  };

  const actionComplete = async (args: any) => {
    const { requestType, action, data } = args;
    if (requestType === 'save') {
      if (action === 'add') {
        await addRecord(data);
      } else if (action === 'edit') {
        await updateRecord(data);
      }
    } else if (requestType === 'delete') {
      await deleteRecord(data);
    }
  };

  const addRecord = async (newData: Material) => {
    try {
      const startTime = Date.now();
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newMaterial: newData }),
      });
      const endTime = Date.now(); 
      const duration = endTime - startTime; 
      if (!res.ok) throw new Error('Failed to add the record');

      setData((prevData) => [...prevData, newData]); 
      toastInstance.current?.show({
        title: 'Success',
        content: `Record added successfully! (Time: ${duration}ms)`,
        showCloseButton: true,
        timeOut: 5000, 
      });
    } catch (err) {
      console.error('Error adding record:', err);
      setError('Failed to add record.');
    }
  };

  const updateRecord = async (updatedData: Material) => {
    try {
      const startTime = Date.now();

      const res = await fetch('http://localhost:9356/QuaLIS/invoicecustomermaster/updatematerialsdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newMaterial: updatedData }),
      });
      const endTime = Date.now(); 
      const duration = endTime - startTime; 
      if (!res.ok) throw new Error('Failed to update the record');
      toastInstance.current?.show({
        title: 'Success',
        content: `Record Updated successfully! (Time: ${duration}ms)`,
        showCloseButton: true,
        timeOut: 3000,
      });
      setData((prevData) => prevData.map((item) => (item.nid === updatedData.nid ? updatedData : item))); // Optimistic update

    } catch (err) {
      console.error('Error updating record:', err);
      setError('Failed to update record.');
    }
  };

  const deleteRecord = async (deletedData: Material | Material[]) => {
    const dataToDelete = Array.isArray(deletedData) ? deletedData[0] : deletedData;

    try {
      const startTime = Date.now();
      const res = await fetch('http://localhost:9356/QuaLIS/invoicecustomermaster/deletematerialsdata', {
        method: 'POST',  
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newMaterial: { nid: dataToDelete.nid } }),
      });

      if (!res.ok) {
        throw new Error('Failed to delete the record');
      }
      const endTime = Date.now(); 
      const duration = endTime - startTime; 
      setData((prevData) => prevData.filter((item) => item.nid !== dataToDelete.nid)); 
      toastInstance.current?.show({
        title: 'Success',
        content: `Record Deleted successfully! (Time: ${duration}ms)`,
        showCloseButton: true,
        timeOut: 3000,
      });
    } catch (err) {
      console.error('Error deleting record:', err);
      setError('Failed to delete record.');
    }
  };
  const deleteRow = (nid: string) => {
    const materialToDelete = data.find(item => item.nid === nid);
    if (materialToDelete) {
      deleteRecord(materialToDelete);
    }
  };

  return (
    <div>

       <ToastComponent
        ref={toastInstance}
        created={toastCreated}
      />
      <ButtonComponent locale="fr-FR" cssClass="e-outline" id="frButton" onClick={changeFrLocale}>
        Change FR Locale
      </ButtonComponent>
      <ButtonComponent cssClass="e-outline" id="enButton" style={{ marginLeft: "10px" }} onClick={changeEnLocale}>
        Change EN Locale
      </ButtonComponent>

      <GridComponent
        ref={grid}
        locale={locale}
        dataSource={liveData} 
        actionComplete={actionComplete}
        editSettings={editOption}
        toolbar={toolbarOptions}
        allowPaging={true}
        pageSettings={pageSettings}
        allowSorting={true}
        allowFiltering={true}
        allowResizing={true} 
        filterSettings={filterSettings}
        height={350}
        allowPdfExport={true}
        toolbarClick={toolbarClick}
        allowExcelExport={true}
        created={created}
      >

        <ColumnsDirective>
          {columns.map((col, index) => (
            <ColumnDirective
              key={index}
              {...col}
              isPrimaryKey={col.field == 'nuserid'}  
            />
          ))}
          <ColumnDirective
            field="actions"
            headerText="Actions"
            width="200"
            textAlign="Center"
            template={(props: Material) => (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button
                  style={{
                    backgroundColor: 'green',
                    color: 'white',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                  onClick={() => updateRecord(props)} // Edit button
                >
                  <FaRegEdit size={18} />
                  <span>Edit</span>
                </button>
                <button
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '8px 1px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                  onClick={() => deleteRow(props.nid)} // Delete button
                >
                  <FaTrashAlt size={18} />
                  <span>Delete</span>
                </button>

              </div>
            )}
          />
        </ColumnsDirective>
        <Inject services={[Edit, Toolbar, Page, Sort, Filter, PdfExport, ExcelExport, Resize]} />
      </GridComponent>
    </div>
  );
};

export default NormalEdit;
