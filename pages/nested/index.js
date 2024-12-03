import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Category, People, Receipt, Storage, Settings, Work } from "@mui/icons-material"; // Add more icons if needed
import Link from "next/link";
import styles from "./index.module.css";

export const getStaticProps = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9385/QuaLIS";
    const response = await fetch(`${apiUrl}/invoicecustomermaster/getinventorymaster`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    const users = json.data || [];

    return {
      props: { users },
      revalidate: 10, 
    };
  } catch (error) {
    console.error("Error fetching users:", error.message, error.stack);
    return { props: { users: [] } };
  }
};

const Index = ({ users }) => {
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
