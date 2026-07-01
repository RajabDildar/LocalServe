import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center flex-col gap-3 bg-slate-100">
        <h1 className="text-3xl font-bold text-blue-600 underline">
          Hello world!
        </h1>
        <Button>Click me</Button>
      </div>{" "}
    </>
  );
}

export default App;
