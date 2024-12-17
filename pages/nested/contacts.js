import { Stack, Typography } from "@mui/material";
import React from "react";
import Head from "next/head";

const About = () => {
  return (
    <>
      <Head>
        <title>Next | Contacts</title>
        <meta name="keyword" content="about" />
      </Head>

      <Stack spacing={5} mt={10} mb={20}>
        <Typography variant="h3">Contact</Typography>
        <Typography color="gray">
      Contact Support Team      
      </Typography>
      </Stack>
    </>
  );
};

export default About;
