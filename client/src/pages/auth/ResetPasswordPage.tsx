import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { authApi } from "@/services/auth.api.ts";
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

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.resetPassword({
        token,
        password: data.password,
      });

      toast.success(response.message || "Password changed successfully!");
      setIsSuccess(true);

      // Wait 3 seconds to let user read success message before redirecting
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        "Failed to reset password. The link may have expired.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Reset your password
          </CardTitle>
          <CardDescription>
            Enter your new secure password below to regain access to your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="space-y-4 text-center">
              <div className="rounded-md bg-emerald-50 p-4 text-sm font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                Password changed successfully! Redirecting you to login...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Password Field */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor="password">New Password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      aria-invalid={!!errors.password}
                    />
                    {errors.password?.message && (
                      <FieldError>{errors.password.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Confirm Password Field */}
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.confirmPassword}>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      aria-invalid={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword?.message && (
                      <FieldError>{errors.confirmPassword.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Reset Password"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Back to{" "}
                <Link
                  to="/login"
                  className="font-medium underline underline-offset-4 hover:text-primary"
                >
                  Login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
