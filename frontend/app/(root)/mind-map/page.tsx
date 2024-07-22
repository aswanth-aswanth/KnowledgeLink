import React from "react";
// import Layout from '../components/Layout';
import ContentCard from "@/components/shared/ContentCard";

const Home: React.FC = () => {
  return (
    // <Layout>
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">
        How to evolve into a Superhuman with your Digital Mind Palace
      </h2>
      <ContentCard
        title="The method of loci"
        content="The method of loci is a strategy of memory enhancement which uses visualizations of familiar spatial environments in order to enhance the recall of information. The method of loci is also known as the memory journey or memory palace."
        tags={["mind", "technique"]}
      />
      <ContentCard
        title="What tools can I use to create Mind Palace?"
        content="MakeSense — is a no-code thinking tool for information organization into a highly connected data structure as a virtual mind palace for its further surfing and extraction. With MakeSense you can easily create or import notes, manage your digital mind architecture and generate new information from it."
        tags={["tool", "mind"]}
      />
      {/* Add more ContentCards as needed */}
    </div>
    // </Layout>
  );
};

export default Home;
