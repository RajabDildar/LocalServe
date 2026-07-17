import { Link, useNavigate } from "react-router-dom";
import { MoveLeft, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16 text-center">
      {/* Visual Indicator */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-10 w-10" />
      </div>

      {/* Hero 404 Text */}
      <h1 className="text-8xl font-extrabold tracking-tight text-foreground md:text-9xl">
        404
      </h1>

      <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Page not found
      </h2>

      <p className="mt-4 max-w-md text-base text-muted-foreground">
        Sorry, we couldn&apos;t find the page you are looking for. It might have
        been moved, deleted, or never existed in the first place.
      </p>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <MoveLeft className="h-4 w-4" />
          Go Back
        </Button>

        <Button asChild className="gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
