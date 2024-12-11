import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import Link from 'next/link';
import { Category, People, Receipt, Storage, Settings, Work } from '@mui/icons-material';
import useRealTimeUpdates from '../../lib/useRealTimeUpdates'; // <-- Import the custom hook
import styles from './index.module.css';
import supabase from '../../lib/supabase';

export const getStaticProps = async () => {
  try {
    const { data, error } = await supabase
      .from('inventoryMaster')
      .select(`nprimarykey, screename, jsondata->menuUrl AS menuURL, jsondata->parentMenuId AS parentMenuID, nstatus`)
      .order('nprimarykey', { ascending: true });

    if (error) {
      return { props: { initialData: [], error: error.message } };
    }

    return {
      props: { initialData: data || [], error: null },
      revalidate: 1,
    };
  } catch (err) {
    return {
      props: { initialData: [], error: err.message },
      revalidate: 1,
    };
  }
};

const Index = ({ initialData, error: initialError }) => {
  const [users, setUsers] = useState(initialData);
  const [error, setError] = useState(initialError);

  // Use the real-time updates hook
  useRealTimeUpdates();

  const getIcon = (screename) => {
    const dynamicIconMapping = {
      'Product Type': <Category className={styles.icon} />,
      'Customer Master': <People className={styles.icon} />,
      'Tax Type': <Receipt className={styles.icon} />,
      'Product Master': <Storage className={styles.icon} />,
      'Settings': <Settings className={styles.icon} />,
      'Work': <Work className={styles.icon} />,
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
        {users.map((user) => (
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
        ))}
      </Grid>
    </div>
  );
};

export default Index;
