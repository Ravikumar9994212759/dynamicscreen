import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Category, People, Receipt, Storage, Settings, Work } from "@mui/icons-material";
import Link from "next/link";
import styles from "./index.module.css";
import supabase from "../../lib/supabase";

// You can either use getStaticProps or getServerSideProps for data fetching.
// If you want data to always be fresh, consider using getServerSideProps instead of getStaticProps.

export const getServerSideProps = async () => {
  console.log("[Server] Fetching initial data with getServerSideProps...");

  try {
    const { data, error } = await supabase
      .from('inventoryMaster')
      .select(`nprimarykey, screename, jsondata->menuUrl AS menuURL, jsondata->parentMenuId AS parentMenuID, nstatus`)
      .order('nprimarykey', { ascending: true });

    if (error) {
      console.error("[Server] Supabase Error:", error.message);
      return { props: { initialData: [], error: error.message } };
    }

    console.log("[Server] Initial data fetched:", JSON.stringify(data, null, 2));
    return { props: { initialData: data || [], error: null } };
  } catch (err) {
    console.error("[Server] Unexpected error in getServerSideProps:", err.message);
    return { props: { initialData: [], error: err.message } };
  }
};

const Index = ({ initialData, error: initialError }) => {
  const [users, setUsers] = useState(initialData);  // Static data from SSR
  const [error, setError] = useState(initialError);

  // Polling mechanism to refresh data every 10 seconds (client-side)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('inventoryMaster')
          .select(`nprimarykey, screename, jsondata->menuUrl AS menuURL, jsondata->parentMenuId AS parentMenuID, nstatus`)
          .order('nprimarykey', { ascending: true });

        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setUsers(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching data:", err.message);
      }
    }, 10000); // Poll every 10 seconds

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  // Real-time update mechanism (using Supabase's subscription)
  useEffect(() => {
    const channel = supabase
      .channel('inventoryMaster')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'inventoryMaster' }, (payload) => {
        console.log("Database updated:", payload);
        setUsers((prevUsers) =>
          prevUsers.map(user =>
            user.nprimarykey === payload.new.nprimarykey ? payload.new : user
          )
        );
      })
      .subscribe();

    // Clean up the subscription using unsubscribe
    return () => {
      channel.unsubscribe();  // Unsubscribing from the channel correctly
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <Typography variant="h4" align="left" gutterBottom>
        Invoice
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {users && users.length > 0 ? (
          users.map((user) =>
            user.nprimarykey ? (
              <Grid item key={user.nprimarykey}>
                <Link href={`/nested/${user.nprimarykey}/`} passHref>
                  <Card className={styles.card}>
                    <CardContent>
                      {getIcon(user.screename)}
                      <Typography className={styles.text}>{user.screename}</Typography>
                      <Typography variant="body2" color="textSecondary">{user.menuURL}</Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ) : null
          )
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
