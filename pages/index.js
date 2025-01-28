//pages/index.js

import { registerLicense } from "@syncfusion/ej2-base";
import GridListContainer from "../components/GridListContainer";
import supabase from "../lib/supabase";


// Register Syncfusion license
registerLicense("Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH1cc3RTRWFYVkV0W0c=");

export default function Home({ menuDataSource, initialData, form2 }) {
  return (
    <div>
      {/* <h1>Syncfusion List and Data Grid Integration in Next.js</h1> */}
      <GridListContainer 
     // initialDataSource={initialDataSource}
     menuDataSource={menuDataSource} 
       initialData={initialData} form2={form2} />
    </div>
  );
}

// Use getStaticProps to fetch data at build time
export async function getStaticProps() {
  try {

        // Menu data
    // const menuRes = await fetch("http://localhost:9356/QuaLIS/invoicecustomermaster/getmenuslist", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({}),
    // });

    const { data, error } = await supabase
    .from('inventoryMaster')
    .select(`nprimarykey, screename, jsondata->menuUrl AS menuURL, jsondata->parentMenuId AS parentMenuID, nstatus`)
    .order('nprimarykey', { ascending: true });


    // ListView component
    // const listRes = await fetch("http://localhost:9356/QuaLIS/invoicecustomermaster/getlistview", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({}),
    // });
    
    //  Data Grid component
    const gridRes = await fetch("http://localhost:9356/QuaLIS/invoicecustomermaster/getinventorymaster", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestData: { field1: "value1", field2: "value2" } }),
    });

    //const menuData = menuRes.ok ? await menuRes.json() : [];
   // const listData = listRes.ok ? await listRes.json() : [];
    const gridData = gridRes.ok ? await gridRes.json() : { form1: [], form2: [] };

    return {
      props: {
        menuDataSource: data || [],
        //menuDataSource: Array.isArray(menuData) ? menuData : [],
        //initialDataSource: Array.isArray(listData) ? listData : [],
        initialData: gridData.form1 || [],
        form2: gridData.form2 || [],
      },
     // revalidate: 10, 
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        initialDataSource: [],
        initialData: [],
        form2: [],
      },
    };
  }
}
