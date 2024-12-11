import { Box, Chip, Stack, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
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
        <Stack alignSelf="flex-start" spacing={2} mb={10}></Stack>
        <Link href="/nested" passHref>
          <Chip label="Go to Screens" />
        </Link>
      </Stack>
    </Box>
  );
}
