import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Category, People, Receipt, Storage, Settings, Work } from "@mui/icons-material";
import Link from "next/link";
import styles from "./index.module.css";
import supabase from "../../lib/supabase";

export const getStaticProps = async () => {
  console.log("[Server] Fetching initial data with getStaticProps...");

  try {
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

    if (error) {
      console.error("[Server] Supabase Error:", error.message);
      return {
        props: { initialData: [], error: error.message },
        revalidate: 5, // Revalidate every 5 seconds
      };
    }

    console.log("[Server] Initial data fetched:", JSON.stringify(data, null, 2));
    return {
      props: { initialData: data || [], error: null },
      revalidate: 5,
    };
  } catch (err) {
    console.error("[Server] Unexpected error in getStaticProps:", err.message);
    return {
      props: { initialData: [], error: err.message },
      revalidate: 1,
    };
  }
};

const Index = ({ initialData, error: initialError }) => {
  const [users, setUsers] = useState(initialData); // Static data from ISR
  const [error, setError] = useState(initialError);

  const fetchLatestData = async () => {
    try {
      console.log("[Client] Fetching latest data from Supabase...");
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

      if (error) {
        console.error("[Client] Supabase Fetch Error:", error.message);
        setError(error.message);
      } else {
        console.log("[Client] Latest data fetched:", JSON.stringify(data, null, 2));
        setUsers(data || []);
      }
    } catch (err) {
      console.error("[Client] Unexpected error during fetch:", err.message);
    }
  };

  useEffect(() => {
    // Fetch the latest data on the client side after page load
    fetchLatestData();

    // Set up a real-time subscription
    console.log("[Client] Setting up real-time subscription...");
    const subscription = supabase
      .channel('realtime:inventoryMaster')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventoryMaster' },
        (payload) => {
          console.log("[Client] Real-time data update received:", JSON.stringify(payload, null, 2));
          fetchLatestData(); // Re-fetch data when real-time updates are received
        }
      )
      .subscribe();

    return () => {
      console.log("[Client] Cleaning up real-time subscription...");
      supabase.removeChannel(subscription);
    };
  }, []);

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
