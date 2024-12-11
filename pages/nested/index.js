import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Category, People, Receipt, Storage, Settings, Work } from "@mui/icons-material";
import Link from "next/link";
import styles from "./index.module.css";
import supabase from "../../lib/supabase";

// Fetch initial data using getStaticProps
export const getStaticProps = async () => {
  console.log("[Server] Fetching initial data with getStaticProps...");

  try {
    const { data, error } = await supabase
      .from('inventoryMaster')
      .select(`nprimarykey, screename, jsondata->menuUrl AS menuURL`)
      .order('nprimarykey', { ascending: true });

    if (error) {
      console.error("[Server] Supabase Error:", error.message);
      return { 
        props: { 
          initialData: [], 
          error: error.message 
        },
        revalidate: 60, // Regenerate page every 60 seconds
      };
    }

    console.log("[Server] Initial data fetched:", data);

    return {
      props: { 
        initialData: data || [], 
        error: null 
      },
      revalidate: 60, // Regenerate page every 60 seconds
    };
  } catch (err) {
    console.error("[Server] Unexpected error in getStaticProps:", err.message);
    return {
      props: { 
        initialData: [], 
        error: err.message 
      },
      revalidate: 60, // Regenerate page every 60 seconds
    };
  }
};

const UserItem = React.memo(({ user }) => {
  console.log(`[Client] Rendering Item: screename = ${user.screename}, nprimarykey = ${user.nprimarykey}`);

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
  );
});

UserItem.displayName = "UserItem";

const Index = ({ initialData, error: initialError }) => {
  const [users, setUsers] = useState(initialData);
  const [error, setError] = useState(initialError);

  useEffect(() => {
    // Log the users state to check for unnecessary updates
    console.log("[Client] users state changed", users);
  }, [users]); // Logs when the `users` state changes

  useEffect(() => {
    const channel = supabase
      .channel('inventoryMaster')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'inventoryMaster' }, (payload) => {
        console.log(`[Client] Data updated: screename = ${payload.new.screename}, nprimarykey = ${payload.new.nprimarykey}`);

        // Update only the modified record based on `nprimarykey`
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.map((user) =>
            user.nprimarykey === payload.new.nprimarykey ? { ...user, ...payload.new } : user
          );

          // Only update if the data has actually changed
          if (JSON.stringify(updatedUsers) !== JSON.stringify(prevUsers)) {
            console.log("[Client] Updated users array:", updatedUsers);
            return updatedUsers;
          }

          return prevUsers; // No change, return the old state
        });
      })
      .subscribe();

    // Clean up the subscription on component unmount
    return () => {
      console.log("[Client] Unsubscribing from Supabase channel.");
      channel.unsubscribe();
    };
  }, []); // Empty dependency ensures that subscription happens only once when the component mounts

  // Optional: Periodically refresh the users data every 60 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from('inventoryMaster')
        .select(`nprimarykey, screename, jsondata->menuUrl AS menuURL`)
        .order('nprimarykey', { ascending: true });

      if (error) {
        console.error("[Client] Error fetching new data:", error.message);
        return;
      }

      setUsers(data);
    }, 60000); // Refresh data every 60 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  if (!users || users.length === 0) {
    return (
      <div className={styles.container}>
        <Typography align="center" variant="h6" color="textSecondary">
          No data available. Please try again later.
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Typography align="center" variant="h6" color="error">
          Error: {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Typography variant="h4" align="left" gutterBottom>
        Invoice
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {/* Render only the updated users */}
        {users.map((user) => (
          <UserItem key={user.nprimarykey} user={user} />
        ))}
      </Grid>
    </div>
  );
};

export default Index;
