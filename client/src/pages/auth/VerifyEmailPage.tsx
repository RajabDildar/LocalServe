import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

import { authApi } from "@/services/auth.api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type VerificationStatus = "verifying" | "success" | "error";

export function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [message, setMessage] = useState<string>(
    "Verifying your email address...",
  );

  // Use a ref to prevent double-firing in React 18+ StrictMode
  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(
        "No verification token found. Please check your verification link.",
      );
      return;
    }

    // StrictMode safeguard
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    const verifyToken = async () => {
      try {
        const response = await authApi.verifyEmail(token);

        setStatus("success");
        setMessage(
          response.message || "Your email has been verified successfully!",
        );
        toast.success("Email verified successfully!");
      } catch (error: any) {
        setStatus("error");

        // Extract error message matching backend interceptor structure
        const errorMessage =
          error?.message ||
          "This verification link is invalid, expired, or has already been used.";

        setMessage(errorMessage);
        toast.error("Verification failed.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-background">
      <Card className="w-full max-w-md border-muted">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Account Verification
          </CardTitle>
          <CardDescription>LocalServe secure onboarding</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {/* STATE 1: VERIFYING */}
          {status === "verifying" && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {message}
              </p>
            </div>
          )}

          {/* STATE 2: SUCCESS */}
          {status === "success" && (
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="rounded-full bg-emerald-100 p-4 dark:bg-emerald-950/40">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Verified!
                </h3>
                <p className="text-sm text-muted-foreground px-4">{message}</p>
              </div>
              <Button asChild className="w-full mt-4">
                <Link to="/login">Sign In to Your Account</Link>
              </Button>
            </div>
          )}

          {/* STATE 3: ERROR */}
          {status === "error" && (
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-destructive">
                  Verification Failed
                </h3>
                <p className="text-sm text-muted-foreground px-4">{message}</p>
              </div>
              <div className="w-full space-y-2 mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <div className="text-center text-xs text-muted-foreground mt-2">
                  Back to{" "}
                  <Link to="/login" className="underline hover:text-foreground">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
