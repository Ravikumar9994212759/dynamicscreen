import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';

// Fetch data for the individual user based on the dynamic 'id' for each request
export const getServerSideProps = async (context) => {
  const { id } = context.params; // Ensure it matches 'id' from the dynamic URL

  console.log('Fetching data for user with id:', id);

  // Call the Java backend endpoint to fetch data for the specific user
  const response = await fetch('http://localhost:9385/QuaLIS/invoicecustomermaster/getinventorymaster', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ /* pass the necessary request body here */ }),
  });

  if (!response.ok) {
    console.error(`Failed to fetch user with id ${id}:`, response.statusText);
    return {
      notFound: true, // If the user is not found, show a 404 page
    };
  }

  // Parse the response to access the data and responseTime
  const responseData = await response.json();
  console.log('Fetched user data:', responseData); // Log the entire user data

  // Assuming responseData.data contains a list of users and finding the specific user by id
  const user = responseData.data.find((u) => u.nprimarykey.toString() === id);

  if (!user) {
    console.error(`User with id ${id} not found`);
    return {
      notFound: true, // Return 404 if the user is not found
    };
  }

  return {
    props: { user }, // Pass the user data to the page
  };
};

const Detail = ({ user }) => {
  console.log('Rendering Detail component with user:', user); // Log user data when rendering

  return (
    <Stack spacing={5} m={20}>
      <Typography variant="h3">{user.screename}</Typography>
      <Typography variant="subtitle1" color="gray">{user.nprimarykey}</Typography>
      <Typography variant="subtitle1" color="gray">{user.menuURL}</Typography>
      <Typography variant="subtitle1" color="gray">{user.screename}</Typography>
    </Stack>
  );
};

export default Detail;
