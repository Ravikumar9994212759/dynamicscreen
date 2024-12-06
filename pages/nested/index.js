import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Category, People, Receipt, Storage, Settings, Work } from "@mui/icons-material";
import Link from "next/link";
import styles from "./index.module.css";
import supabase from "../config/superbaseconfig";

export const getStaticProps = async () => {
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

    // Check if there is an error
    if (error) {
      console.error("Error fetching data from Supabase:", error.message);
      return { props: { users: [], error: error.message } };  // Return error message in props if error occurs
    }

    // If no error, return the data
    return {
      props: { users: data || [], error: null },  // Return the fetched data and no error
      revalidate: 1,  // Revalidate every 1 second if the data changes
    };
  } catch (error) {
    console.error("Error with Supabase request:", error.message);
    return { props: { users: [], error: error.message } };  // Return error message if there's an exception
  }
};

const Index = ({ users, error }) => {
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
