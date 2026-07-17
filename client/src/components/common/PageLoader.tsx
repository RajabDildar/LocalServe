import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-full bg-primary/10 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
