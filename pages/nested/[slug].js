// pages/nested/[slug].js
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';
import { useState, useEffect } from 'react';

// Function to update record and trigger revalidation
const updateRecord = async (nprimarykey, updatedData) => {
  // Update the record in the inventoryMaster table
  const { data, error } = await supabase
    .from('inventoryMaster')
    .update(updatedData)  // updatedData contains the fields you want to update
    .eq('nprimarykey', nprimarykey);  // Match the primary key to the record
  
  if (error) {
    console.error('Error updating record:', error);
    return { success: false, error };
  }

  // Trigger page revalidation after the update
  await revalidatePage(nprimarykey);
  return { success: true, data };
};

// Function to trigger revalidation of a page based on nprimarykey
const revalidatePage = async (nprimarykey) => {
  try {
    const revalidatePath = `/nested/${nprimarykey}/`;  // Dynamic path for the page
    console.log(`Revalidating path: ${revalidatePath}`);

    // Call the revalidation API
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: nprimarykey.toString() }),  // Send nprimarykey as slug
    });

    if (response.ok) {
      console.log(`Page revalidated successfully: ${revalidatePath}`);
    } else {
      console.error(`Failed to revalidate page: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error during revalidation:', error);
  }
};

const SlugPage = ({ item }) => {
  const router = useRouter();
  const { slug } = router.query;

  const [formData, setFormData] = useState(item);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      screename: formData.screename,  // Update with your form data
      jsondata: { menuUrl: formData.menuURL, parentMenuId: formData.parentMenuID },
      nstatus: formData.nstatus,
    };

    const { success, error } = await updateRecord(item.nprimarykey, updatedData);
    
    if (success) {
      alert("Record updated and page revalidated!");
    } else {
      alert(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{item.screename}</Typography>
        <form onSubmit={handleUpdate}>
          <TextField
            label="Screen Name"
            value={formData.screename}
            onChange={(e) => setFormData({ ...formData, screename: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Menu URL"
            value={formData.menuURL}
            onChange={(e) => setFormData({ ...formData, menuURL: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Parent Menu ID"
            value={formData.parentMenuID}
            onChange={(e) => setFormData({ ...formData, parentMenuID: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Status"
            value={formData.nstatus}
            onChange={(e) => setFormData({ ...formData, nstatus: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;

  const { data, error } = await supabase
    .from('inventoryMaster')
    .select('nprimarykey, screename, jsondata->menuUrl AS menuURL, jsondata->parentMenuId AS parentMenuID, nstatus')
    .eq('nprimarykey', slug.replace(/\/$/, ''))  // Handle the trailing slash
    .single();

  if (error) {
    console.error('Error fetching data:', error);
    return { notFound: true };
  }

  return {
    props: { item: data },
    revalidate: 1,  // Revalidate every 1 second
  };
};

export const getStaticPaths = async () => {
  const { data, error } = await supabase
    .from('inventoryMaster')
    .select('nprimarykey');

  if (error) {
    console.error('Error fetching paths:', error);
    return { paths: [], fallback: 'blocking' };
  }

  const paths = data.map(item => ({
    params: { slug: item.nprimarykey.toString() + '/' },
  }));

  return { paths, fallback: 'blocking' };
};

export default SlugPage;
