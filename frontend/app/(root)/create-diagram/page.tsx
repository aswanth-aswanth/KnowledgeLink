"use client";

import React from "react";
import ClientOnly from "@/contexts/ClientOnly";
import { EditorProvider } from "@/contexts/EditorContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Editor from "./Editor";

const EditorPage: React.FC = () => {
  const editorData = useSelector((state: RootState) => state.topics.editorData);
  const router = useRouter();

  useEffect(() => {
    if (!editorData) {
      router.push("/");
    }
  }, [editorData, router]);

  if (!editorData) {
    return null;
  }

  return <Editor />;
};

export default function Home() {
  return (
    <EditorProvider>
      <main className="min-h-screen bg-gray-100">
        <ClientOnly>
          <EditorPage />
        </ClientOnly>
      </main>
    </EditorProvider>
  );
}