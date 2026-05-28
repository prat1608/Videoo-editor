import { Suspense } from "react";
import EditorScreen from "../../components/editor-screen";

export default function EditorPage() {
  return (
    <Suspense>
      <EditorScreen />
    </Suspense>
  );
}
