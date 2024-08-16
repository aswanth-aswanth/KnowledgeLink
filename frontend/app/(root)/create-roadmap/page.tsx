import React from 'react';
import NestedNodeTaker from '@/app/(root)/create-roadmap/NestedNoteTaker';
import { ReduxProvider } from '@/lib/redux-provider';

const Home: React.FC = () => {
  return (
    <ReduxProvider>
      <NestedNodeTaker />
    </ReduxProvider>
  );
};

export default Home;
