import React from "react";
import Editor from "@/components/shared/Editor";
import styles from "@/styles/Home.module.css";

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Editor />
    </div>
  );
};

export default Home;
