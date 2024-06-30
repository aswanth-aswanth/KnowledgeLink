import React from "react";
import { Container } from "@mui/material";
import NestedNodeTaker from "@/components/shared/NestedNoteTaker";
import { ReduxProvider } from "@/lib/redux-provider";

const Home: React.FC = () => {
  return (
    <ReduxProvider>
      <Container maxWidth="md">
        <NestedNodeTaker />
      </Container>
    </ReduxProvider>
  );
};

export default Home;
