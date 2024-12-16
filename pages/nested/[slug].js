import { useRouter } from 'next/router';
import supabase from '../../lib/supabase';
import { Typography, Card, CardContent, Grid } from '@mui/material';

// Generate static paths at build time-Modified
export const getStaticPaths = async () => {
  const { data, error } = await supabase
    .from('inventoryMaster')
    .select('nprimarykey');

  if (error) {
    console.error('Error fetching paths:', error);
    return { paths: [], fallback: 'blocking' };
  }

  // Generate paths based on the primary key (nprimarykey)
  const paths = data.map(item => ({
    params: { slug: item.nprimarykey.toString() + '/' }, // Ensuring trailing slash
  }));

  return { paths, fallback: 'blocking' };
};

// Fetch specific data for each path
export const getStaticProps = async ({ params }) => {
  const { slug } = params;

  const { data, error } = await supabase
    .from('inventoryMaster')
    .select(`nprimarykey, screename, jsondata->menuUrl AS menuURL, jsondata->parentMenuId AS parentMenuID, nstatus`)
    .eq('nprimarykey', slug.replace(/\/$/, ''))  // Remove extra slash if exists
    .single();

  if (error) {
    console.error('Error fetching data:', error);
    return { notFound: true };
  }

  return {
    props: { item: data },
    revalidate: 1, // Revalidate every 1 seconds
  };
};

const SlugPage = ({ item }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item>
        <Card>
          <CardContent>
            <Typography variant="h5">{item.screename}</Typography>
            <Typography variant="body2" color="textSecondary">{item.menuURL}</Typography>
            {/* Add other item details here */}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SlugPage;
