import React from "react";
import { Container } from "@mui/material";
import CustomToolbar from "../../../components/shared/Toolbar";
import NoteBody from "../../../components/shared/NoteBody";
import { RoadmapProvider } from "../../../contexts/RoadmapContext";
import RoadmapForm from "@/components/shared/RoadmapForm";
import NestedNodeTaker from "@/components/shared/NestedNoteTaker";

const Home: React.FC = () => {
  return (
    <RoadmapProvider>
      <Container maxWidth="md">
        {/* <CustomToolbar  /> */}
        {/* <NoteBody /> */}
        {/* <RoadmapForm /> */}
        <NestedNodeTaker />
      </Container>
    </RoadmapProvider>
  );
};

export default Home;
