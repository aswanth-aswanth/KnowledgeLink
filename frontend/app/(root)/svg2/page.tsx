// page.tsx
import ClientOnly from "@/contexts/ClientOnly";
import Editor from "@/components/shared/Editor";
import { EditorProvider } from "@/contexts/EditorContext";

export default function Home() {
  return (
    <EditorProvider>
      <main className="min-h-screen bg-gray-100">
        <ClientOnly>
          <Editor />
        </ClientOnly>
      </main>
    </EditorProvider>
  );
}
