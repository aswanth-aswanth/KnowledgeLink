"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Rect, ConnectionType } from "@/types/EditorTypes";

interface EditorContextType {
  rectangles: Rect[];
  setRectangles: React.Dispatch<React.SetStateAction<Rect[]>>;
  connections: ConnectionType[];
  setConnections: React.Dispatch<React.SetStateAction<ConnectionType[]>>;
  isInitialized: boolean;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
};

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [rectangles, setRectangles] = useState<Rect[]>([]);
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load data from localStorage on the client side
    const savedRectangles = localStorage.getItem("rectangles");
    const savedConnections = localStorage.getItem("connections");

    if (savedRectangles) {
      setRectangles(JSON.parse(savedRectangles));
    }

    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes, but only after initial load
    if (isInitialized) {
      localStorage.setItem("rectangles", JSON.stringify(rectangles));
    }
  }, [rectangles, isInitialized]);

  useEffect(() => {
    // Save data to localStorage whenever it changes, but only after initial load
    if (isInitialized) {
      localStorage.setItem("connections", JSON.stringify(connections));
    }
  }, [connections, isInitialized]);

  return (
    <EditorContext.Provider
      value={{
        rectangles,
        setRectangles,
        connections,
        setConnections,
        isInitialized,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
