// pages/index.js
import { registerLicense } from '@syncfusion/ej2-base';
import GridPage from '../components/NormalEdit';  // Import GridPage component
import supabase from '../lib/supabase';  // Make sure you have supabase.js set up correctly

// Register Syncfusion license
registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH1cc3RTRWFYVkV0W0c=');

// Define the Home component that receives props
export default function Home({ initialData, menus }) {
  return (
    <div>
      <h1>Syncfusion DataGrid in Next.js</h1>
      {/* Pass the initialData as a prop to GridPage */}
      <GridPage initialData={initialData} menus={menus} />
    </div>
  );
}

// Fetch data with getStaticProps
export async function getStaticProps() {
  try {
    // Fetch menus and form data from Supabase (or any other external API)
    const { data: menus, error: menuError } = await supabase
      .from('inventoryMaster')
      .select('nprimarykey, screename');

    const { data: inventoryMaster, error: formError } = await supabase
      .from('inventoryMaster')
      .select('formJson')
      .eq('nprimarykey', 1);  // Example, change this based on your use case

    // Handle errors
    if (menuError || formError) {
      console.error('Error fetching data:', menuError?.message, formError?.message);
      return { props: { menus: [], initialData: [] } };
    }

    const initialData = inventoryMaster?.[0]?.formJson?.fields || [];  // Ensure fallback if formJson is empty

    return {
      props: {
        menus: menus || [],          // Passing menus data as prop
        initialData: initialData,    // Passing the form fields as initialData prop
      },
      revalidate: 10,  // Optional: Revalidate after 10 seconds
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { props: { menus: [], initialData: [] } };  // Fallback in case of error
  }
}
