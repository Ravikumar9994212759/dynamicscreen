import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Category, People, Receipt, Storage, Settings, Work } from "@mui/icons-material";
import Link from "next/link";
import styles from "./index.module.css";
import supabase from "../../lib/supabase";

// Fetch data from Supabase using getStaticProps
export const getStaticProps = async () => {
  console.log("[Server] Fetching initial data with getStaticProps...");

  try {
    const { data, error } = await supabase
      .from('inventoryMaster')
      .select(`nprimarykey, screename, jsondata->menuUrl AS menuURL, jsondata->parentMenuId AS parentMenuID, nstatus`)
      .order('nprimarykey', { ascending: true });

    if (error) {
      console.error("[Server] Supabase Error:", error.message);
      return {
        props: { initialData: [], error: error.message },
        revalidate: 1,  // Revalidate every 1 second for updates
      };
    }

    console.log("[Server] Initial data fetched:", JSON.stringify(data, null, 2));
    return {
      props: { initialData: data || [], error: null },
      revalidate: 1,  // Revalidate every 1 second
    };
  } catch (err) {
    console.error("[Server] Unexpected error in getStaticProps:", err.message);
    return {
      props: { initialData: [], error: err.message },
      revalidate: 1,  // Revalidate every 1 second in case of error
    };
  }
};

const Index = ({ initialData, error: initialError }) => {
  const [users, setUsers] = useState(initialData);  // Static data from ISR
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

  // This will allow us to update users if there are any changes
  const handleUpdateUser = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.nprimarykey === updatedUser.nprimarykey ? updatedUser : user
    );
    setUsers(updatedUsers);
    console.log(`[Client] Updated user: ${updatedUser.nprimarykey}`);
  };

  if (error) {
    console.error("[Client] Error:", error);
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
