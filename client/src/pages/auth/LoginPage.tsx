import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AlertCircle, MailCheck } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { authApi } from "@/services/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password is required (minimum 8 characters)"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Verification resend states
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Client-side 5-minute countdown effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    setUnverifiedEmail(null); // Reset unverified state on a new login attempt
    try {
      const user = await login(values);
      toast.success("Welcome back");
      const from = (location.state as { from?: string })?.from;
      if (from) navigate(from, { replace: true });
      else if (user.role === "provider")
        navigate("/provider/profile", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      const errMsg =
        (err as { message?: string })?.message || "Invalid email or password";
      setSubmitError(errMsg);

      // Check if backend returned the unverified error string
      if (errMsg.toLowerCase().includes("verify your email")) {
        setUnverifiedEmail(values.email);
      }
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setIsResending(true);
    try {
      const response = await authApi.resendVerification(unverifiedEmail);
      toast.success(response.message || "Verification email sent!");
      setResendCooldown(300); // Start 5-minute (300s) countdown
    } catch (err) {
      const errMsg =
        (err as { message?: string })?.message ||
        "Failed to resend verification email.";
      toast.error(errMsg);

      // If they bypassed client-side timer (e.g. by refreshing) but hit the backend rate-limit
      if (
        errMsg.toLowerCase().includes("too many") ||
        errMsg.toLowerCase().includes("rate limit")
      ) {
        setResendCooldown(300); // Enforce the UI cooldown again
      }
    } finally {
      setIsResending(false);
    }
  };

  // Helper to format 300 seconds down into a "4:59" string style
  const formatCooldown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>Welcome back to LocalServe.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="you@example.com"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* Error & Warning Box Handling */}
            {unverifiedEmail ? (
              <div className="rounded-lg border bg-muted/40 p-3 text-sm text-foreground">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold leading-none text-foreground">
                      Email verification required
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Check your inbox. If you didn't receive it, you can
                      request a new one.
                    </p>
                    <div className="pt-1">
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-xs font-semibold text-primary hover:underline decoration-primary/30"
                        onClick={handleResendVerification}
                        disabled={isResending || resendCooldown > 0}
                      >
                        {isResending ? (
                          "Sending..."
                        ) : resendCooldown > 0 ? (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MailCheck className="h-3.5 w-3.5 text-emerald-500" />{" "}
                            Resend in {formatCooldown(resendCooldown)}
                          </span>
                        ) : (
                          "Resend verification link"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              submitError && (
                <p className="text-sm font-medium text-destructive">
                  {submitError}
                </p>
              )
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
            <Link to="/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
            <Link to="/register" className="hover:underline">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
