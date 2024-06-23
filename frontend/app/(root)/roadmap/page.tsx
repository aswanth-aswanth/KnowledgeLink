import React from 'react';
import { Container } from '@mui/material';
import CustomToolbar from '../../../components/shared/Toolbar';
import NoteBody from '../../../components/shared/NoteBody';

const Home: React.FC = () => {
  return (
    <Container maxWidth="md">
      <CustomToolbar  />
      <NoteBody />
    </Container>
  );
};

export default Home;
