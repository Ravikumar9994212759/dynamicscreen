import React, { useState, useEffect, useRef } from 'react';
import {
  FilterSettingsModel,FilterType, GridComponent, ColumnsDirective, ColumnDirective, Edit, Toolbar, Inject, Page, Sort, Filter, PdfExport, ExcelExport
} from '@syncfusion/ej2-react-grids';
import useSWR from 'swr';
import { DialogFormTemplate } from '../components/DialogFormTemplate';
import supabase from '../lib/supabase';
import { setCulture, setCurrencyCode, loadCldr } from '@syncfusion/ej2-base';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

import cagregorian from './ca-gregorian.json';
import currencies from './currencies.json';
import numbers from './numbers.json';
import timeZoneNames from './timeZoneNames.json';
import numberingSystems from './numberingSystems.json';

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
}

const NormalEdit: React.FC<NormalEditProps> = ({ initialData }) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState('en-US');
  const grid = useRef<any>(null);
  const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search', 'PdfExport', 'ExcelExport',];
  const pageSettings = { pageSize: 5 };

  const toolbarClick = (args: any) => {
    console.log('Toolbar item clicked:', args);
    if (args.item.id.includes('pdfexport')) {
      console.log('Exporting to PDF');
      grid.current?.pdfExport();
    }
    else if (args.item.id.includes('excelexport')) {
      console.log('Exporting to Excel');
      grid.current?.excelExport();
    }
  };
  const filterSettings: FilterSettingsModel = {
    type: 'Menu' as FilterType,
    columns: [] // You can set filter columns here if needed
  };

  useEffect(() => {
    const loadFilters = async () => {
      const { data: filterData, error } = await supabase.from('materials').select('*');
      if (error) {
        console.error('Error loading filter data:', error);
        return;
      }
      const filterValues = filterData.map(item => item.status);

      filterSettings.columns = filterValues.map(value => ({
        field: 'status',
        operator: 'equal',
        value: value,
        predicate: 'or'
      }));
    };
    loadFilters();
  }, []);
  // Fetch live data using SWR
  const { data: liveData, error } = useSWR('materials', async () => {
    console.log('Fetching live data from Supabase...');
    const { data, error } = await supabase.from('materials').select('*');
    if (error) {
      console.error('Error fetching data from Supabase:', error);
      throw new Error(error.message);
    }
    return data;
    console.log('useSWRFetching live data from Supabase...'+data);
  }, {
    refreshInterval: 5000, // Fetch every 5 seconds
  });

  useEffect(() => {
    console.log('Effect triggered, checking initialData:', initialData);

    if (initialData && initialData.length > 0) {
      setData(initialData);

      const columns = initialData.map(field => ({
        field: field.name,
        headerText: field.label,
        width: '100',
        textAlign: 'Left'
      }));
      console.log('Columns set:', columns);
      setColumns(columns);
      setIsLoading(false);
    }
  }, [initialData]);

  if (!liveData && isLoading) {
    console.log('Data is still loading...');
    return <div>Loading...</div>;
  }
  if (error) {
    console.error('Error loading live data:', error);
    return <div>Error loading live data</div>;
  }

  const getFieldsFromColumns = () => {
    console.log('Mapping fields from columns:', initialData);
    return initialData.map(field => ({
      name: field.name,
      label: field.label,
      inputType: field.inputType || 'textbox',
      dataType: field.dataType || 'String',
      limit: field.limit || 50,
      default: field.default || '',
      gridShow: field.gridShow !== undefined ? field.gridShow : true
    }));
  };

  const dialogTemplate = (props: any) => {
    console.log('Rendering Dialog Form Template with props:', props);
    const fields = getFieldsFromColumns();
    return <DialogFormTemplate {...props} fields={fields} />;
  };

  const editOption = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog',
    template: dialogTemplate,
  };

  const changeFrLocale = () => {
    console.log('Changing locale to French (fr-FR)');
    setCulture('fr-FR');
    setCurrencyCode('EUR');
    setLocale('fr-FR'); 
    loadCldr(
      cagregorian,
      currencies,
      numbers,
      timeZoneNames,
      numberingSystems
    );    
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
  const changeEnLocale = () => {
    console.log('Changing locale to English (en-US)');
    setCulture('en-US');
    setCurrencyCode('USD');
    setLocale('en-US');
  };

  const actionComplete = (args: any) => {
    console.log('Action completed:', args);
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      console.log('Editing or adding a record');
      args.form.ej2_instances[0].rules = {};
      args.dialog.element
        .querySelector('.e-footer-content')
        .classList.add('e-hide');
      setTimeout(() => {
        const customerIDInput = args.form.elements.namedItem('CustomerID');
        if (customerIDInput) {
          console.log('Focusing on CustomerID input');
          customerIDInput.focus();
        }
      }, 0);
    }
  };

  return (
    <div>
    <ButtonComponent locale="fr-FR" cssClass="e-outline" id="frButton" onClick={changeFrLocale}>
  Change FR Locale
</ButtonComponent>

      <ButtonComponent cssClass="e-outline" id="enButton" style={{ marginLeft: "10px" }} onClick={changeEnLocale}>
        Change EN Locale
      </ButtonComponent>

      {isLoading ? (
        <div>Loading data...</div>
      ) : (
        <GridComponent
          ref={grid}
          locale={locale }
          dataSource={liveData || data}
          actionComplete={actionComplete}
          editSettings={editOption}
          toolbar={toolbarOptions}
          allowPaging={true}
          pageSettings={pageSettings}
          allowSorting={true}
          allowFiltering={true}
          filterSettings={filterSettings}
          height={265}
          allowPdfExport={true}
          toolbarClick={toolbarClick}
          allowExcelExport={true}
          created={created}
        >
          <ColumnsDirective>
            {columns.map((col, index) => (
              <ColumnDirective key={index} {...col} />
            ))}
          </ColumnsDirective>
          <Inject services={[Edit, Toolbar, Page, Sort, Filter, PdfExport, ExcelExport]} />
        </GridComponent>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  console.log('Fetching initial data from server...');
  const { data, error } = await supabase.from('materials').select('*');
  if (error) {
    console.error('Error fetching initial data:', error);
    return { notFound: true };
  }

  const initialData = data.map((item: any) => ({
    name: item.name,
    label: item.label,
    inputType: item.input_type,
    dataType: item.data_type,
    gridShow: item.grid_show !== undefined ? item.grid_show : true
  }));

  console.log('Initial data fetched:', initialData);

  return {
    props: {
      initialData
    }
  };
}

export default NormalEdit;
