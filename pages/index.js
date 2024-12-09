import { Box, Chip, Stack, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set state to true after the component has mounted on the client
    setIsClient(true);
  }, []);

  return (
    <Box sx={{ marginBottom: 20 }}>
      <Head>
        <title>Dynamic | Home</title>
        <meta name="keyword" content="home" />
      </Head>
      <Stack alignItems="center" justifyContent="center">
        {isClient && (
          <Image src="/1.png" width={500} height={250} sx={{ marginTop: 20 }} />
        )}
        <Stack alignSelf="flex-start" spacing={2} mb={10}>
          {/* <Typography variant="h3">Introduction</Typography> */}
          {/* <Typography color="gray">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. A
            perspiciatis nam recusandae facere magnam molestias at aut enim
            fugiat, excepturi laboriosam odit sit fuga incidunt accusantium
            quaerat dignissimos ipsam error.
          </Typography> */}
        </Stack>
        <Link href="/nested" passHref>
          <Chip label="Go to Screens" />
        </Link>
      </Stack>
    </Box>
  );
}
