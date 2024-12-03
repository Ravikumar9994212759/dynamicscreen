import { Typography, Button } from '@mui/material';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';

const PageNotFound = () => {
  const router = useRouter();

  useEffect(() => {
    const id = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(id);
  }, []);

  return (
    <Box sx={{ margin: 20 }}>
      <Typography variant="h5">Whoops! Page not found</Typography>
      <Link href="/" passHref>
        <Button variant="text">Go to Home</Button>
      </Link>
    </Box>
  );
};

export default PageNotFound;
