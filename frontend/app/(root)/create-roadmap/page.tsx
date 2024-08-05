import React from "react";
import NestedNodeTaker from "@/app/(root)/create-roadmap/NestedNoteTaker";
import { EditorProvider } from "@/contexts/EditorContext";
import { ReduxProvider } from "@/lib/redux-provider";

const Home: React.FC = () => {
  return (
    <ReduxProvider>
      <EditorProvider>
        <NestedNodeTaker />
      </EditorProvider>
    </ReduxProvider>
  );
};

export default Home;
