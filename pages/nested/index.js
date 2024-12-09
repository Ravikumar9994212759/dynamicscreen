import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Category, People, Receipt, Storage, Settings, Work } from "@mui/icons-material";
import Link from "next/link";
import styles from "./index.module.css";
import supabase from "../../lib/supabase";

export const getStaticProps = async () => {
  console.log("[Server] Starting getStaticProps execution...");

  try {
    // Fetch data from Supabase
    const { data, error } = await supabase
      .from('inventoryMaster')
      .select(`
        nprimarykey,
        screename,
        jsondata->menuUrl AS menuURL,
        jsondata->parentMenuId AS parentMenuID,
        nstatus
      `)
      .order('nprimarykey', { ascending: true });
      console.log('Fetched data from Supabase:', data);

    // Log the data or error from Supabase
    if (error) {
      console.error("[Server] Error fetching data from Supabase:", error.message);
      return {
        props: { initialData: [], error: error.message },
        revalidate: 5,
      };
    }

    console.log("[Server] Data fetched from Supabase:", JSON.stringify(data, null, 2));
    return {
      props: { initialData: data || [], error: null },
      revalidate: 5,
    };
  } catch (err) {
    console.error("[Server] Unexpected error during getStaticProps execution:", err.message);
    return {
      props: { initialData: [], error: err.message },
      revalidate: 5,
    };
  }
};

const Index = ({ initialData, error: initialError }) => {
  const [users, setUsers] = useState(initialData);
  const [error, setError] = useState(initialError);

  const getIcon = (screename) => {
    const dynamicIconMapping = {
      "Product Type": <Category className={styles.icon} />,
      "Customer Master": <People className={styles.icon} />,
      "Tax Type": <Receipt className={styles.icon} />,
      "Product Master": <Storage className={styles.icon} />,
      "Settings": <Settings className={styles.icon} />,
      "Work": <Work className={styles.icon} />,
    };
    return dynamicIconMapping[screename] || <Category className={styles.icon} />;
  };

  useEffect(() => {
    console.log("[Client] Subscribing to real-time updates...");
    const subscription = supabase
      .channel('realtime:inventoryMaster')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventoryMaster' },
        (payload) => {
          console.log("[Client] Real-time data update received:", JSON.stringify(payload, null, 2));

          // Re-fetch data to update the UI
          supabase
            .from('inventoryMaster')
            .select(`
              nprimarykey,
              screename,
              jsondata->menuUrl AS menuURL,
              jsondata->parentMenuId AS parentMenuID,
              nstatus
            `)
            .order('nprimarykey', { ascending: true })
            .then(({ data, error }) => {
              if (error) {
                console.error("[Client] Error fetching updated data:", error.message);
                setError(error.message);
              } else {
                console.log("[Client] Updated data fetched:", JSON.stringify(data, null, 2));
                setUsers(data || []);
              }
            });
        }
      )
      .subscribe();

    return () => {
      console.log("[Client] Cleaning up subscription...");
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Typography variant="h4" align="left" gutterBottom>
        Invoice
      </Typography>
      {error && (
        <Typography variant="h6" color="error" align="center">
          {`Error fetching data: ${error}`}
        </Typography>
      )}
      <Grid container spacing={3} justifyContent="center">
        {users && users.length > 0 ? (
          users.map((user) => (
            user.nprimarykey && (
              <Grid item key={user.nprimarykey}>
                <Link
                  href={`nested/${user.nprimarykey}`}
                  style={{ textDecoration: "none" }}
                  aria-label={`Go to details for ${user.screename || "Unknown Screen"}`}
                >
                  <Card className={styles.card}>
                    <CardContent>
                      {getIcon(user.screename)}
                      <Typography className={styles.text}>{user.screename}</Typography>
                      <Typography variant="body2" color="textSecondary">{user.menuURL}</Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            )
          ))
        ) : (
          <Typography align="center" variant="h6" color="textSecondary">
            No data available. Please try again later.
          </Typography>
        )}
      </Grid>
    </div>
  );
};

export default Index;
