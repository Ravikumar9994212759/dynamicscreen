// pages/index.js
import { registerLicense } from '@syncfusion/ej2-base';
import GridPage from '../components/NormalEdit';  
import supabase from '../lib/supabase';  

registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH1cc3RTRWFYVkV0W0c=');

export default function Home({ initialData, menus }) {
  return (
    <div>
      <h1>Syncfusion DataGrid in Next.js</h1>
      <GridPage initialData={initialData} menus={menus} />
    </div>
  );
}

export async function getStaticProps() {
  try {

    const { data: inventoryMaster, error: formError } = await supabase
      .from('inventoryMaster')
      .select('formJson')
      .eq('nprimarykey', 1);  
    if (formError) {
      console.error('Error fetching data:', menuError?.message, formError?.message);
      return { props: { menus: [], initialData: [] } };
    }

    const initialData = inventoryMaster?.[0]?.formJson?.fields || [];  
    return {
      props: {
        initialData: initialData,    
      },
      revalidate: 10, 
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { props: { initialData: [] } };  
  }
}
