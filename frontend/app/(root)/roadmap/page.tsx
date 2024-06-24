import React from "react";
import { Container } from "@mui/material";
import CustomToolbar from "../../../components/shared/Toolbar";
import NoteBody from "../../../components/shared/NoteBody";
import { RoadmapProvider } from "../../../contexts/RoadmapContext";
import RoadmapForm from "@/components/shared/RoadmapForm";
import NestedNodeTaker from "@/components/shared/NestedNoteTaker";
import { ReduxProvider } from "@/lib/redux-provider";

const Home: React.FC = () => {
  return (
    <ReduxProvider>
      <Container maxWidth="md">
        {/* <CustomToolbar  /> */}
        {/* <NoteBody /> */}
        {/* <RoadmapForm /> */}
        <NestedNodeTaker />
      </Container>
    </ReduxProvider>
  );
};

export default Home;
