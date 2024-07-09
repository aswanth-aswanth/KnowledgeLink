import React from "react";
import { Container } from "@mui/material";
import NestedNodeTaker from "@/app/(root)/create-roadmap/NestedNoteTaker";
import { EditorProvider } from "@/contexts/EditorContext";
import { ReduxProvider } from "@/lib/redux-provider";

const Home: React.FC = () => {
  return (
    <ReduxProvider>
      <EditorProvider>
        <Container maxWidth="md">
          <NestedNodeTaker />
        </Container>
      </EditorProvider>
    </ReduxProvider>
  );
};

export default Home;
