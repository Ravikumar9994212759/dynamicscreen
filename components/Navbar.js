import { AppBar, Stack, styled, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';

const StyledToolBar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  background: 'black',
});

const NavBar = () => {
  return (
    <AppBar position="static">
      <StyledToolBar>
        <Typography variant="h5">Next</Typography>
        <Stack direction="row" justifyContent="space-between" width="20%">
          <Link href="/" passHref>
            <Typography component="a" sx={{ color: 'white' }}>Home</Typography>
          </Link>
          <Link href="/about" passHref>
            <Typography component="a" sx={{ color: 'white' }}>About</Typography>
          </Link>
          <Link href="/nested/contacts" passHref>
            <Typography component="a" sx={{ color: 'white' }}>Contact</Typography>
          </Link>
        </Stack>
      </StyledToolBar>
    </AppBar>
  );
};

export default NavBar;
