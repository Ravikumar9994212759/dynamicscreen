import { useRouter } from 'next/router';
import supabase from '../../lib/supabase';
import { Typography, Card, CardContent, Grid } from '@mui/material';

// Generate static paths at build time
export const getStaticPaths = async () => {
  console.log("[Server] Fetching paths with getStaticPaths...");

  const { data, error } = await supabase
    .from('inventoryMaster')
    .select('nprimarykey');

  if (error) {
    console.error("[Server] Error fetching paths:", error);
    return { paths: [], fallback: 'blocking' };
  }

  // Generate paths based on the primary key (nprimarykey)
  const paths = data.map(item => ({
    params: { slug: item.nprimarykey.toString() + '/' }, // Ensuring trailing slash
  }));

  console.log("[Server] Generated paths:", JSON.stringify(paths, null, 2));

  return { paths, fallback: 'blocking' };
};

// Fetch specific data for each path
export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  console.log("[Server] Fetching data for slug:", slug);

  const { data, error } = await supabase
    .from('inventoryMaster')
    .select(`nprimarykey, screename, jsondata->menuUrl AS menuURL, jsondata->parentMenuId AS parentMenuID, nstatus`)
    .eq('nprimarykey', slug.replace(/\/$/, ''))  // Remove extra slash if exists
    .single();

  if (error) {
    console.error("[Server] Error fetching data for slug:", error);
    return { notFound: true };
  }

  console.log("[Server] Data fetched for slug:", JSON.stringify(data, null, 2));

  return {
    props: { item: data },
    revalidate: 1, // Revalidate every 1 second
  };
};

const SlugPage = ({ item }) => {
  const router = useRouter();

  if (router.isFallback) {
    console.log("[Client] Fallback page loading...");
    return <div>Loading...</div>;
  }

  console.log("[Client] Rendering item for slug:", item.nprimarykey);

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
