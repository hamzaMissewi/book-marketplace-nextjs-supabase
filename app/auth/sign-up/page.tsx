"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!email || !password || !firstName || !lastName) {
      setError("All fields are required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Log environment variables for debugging (remove in production)
      console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

      const supabase = createClient();
      console.log("Supabase client created, attempting sign up...");

      const signUpData = {
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: `${firstName.trim()} ${lastName.trim()}`,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      };

      console.log("Sign up data:", JSON.stringify(signUpData, null, 2));

      const { data, error } = await supabase.auth.signUp(signUpData);

      console.log("Sign up response:", { data, error });

      if (error) {
        console.error("Supabase auth error:", error);
        throw error;
      }

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        console.log("Email confirmation required, redirecting...");
        router.push("/auth/verify-email");
        // router.push("/auth/sign-up-success");
      } else if (data?.session) {
        console.log("User signed in successfully, redirecting to browse...");
        router.push("/browse");
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);

      // Network error handling
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          setError(
            "Unable to connect to the server. Please check your internet connection and try again."
          );
        } else if (error.message.includes("already registered")) {
          setError("This email is already registered. Please login instead.");
        } else if (error.message.includes("Invalid login credentials")) {
          setError(
            "Invalid email or password. Please check your credentials and try again."
          );
        } else if (error.message.includes("Email not confirmed")) {
          setError(
            "Please check your email to confirm your account before logging in."
          );
        } else if (error.message.includes("Invalid email")) {
          setError("Please enter a valid email address");
        } else {
          setError(`An error occurred: ${error.message}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">BookStore</h1>
            <p className="text-muted-foreground mt-2">Your learning platform</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>
                Join our community and start learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        type="text"
                        placeholder="John"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        type="text"
                        placeholder="Doe"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hamza.missaoui@gmail.com"
                      defaultValue="hamza.missaoui@gmail.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      // placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="new-password"
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be at least 6 characters
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Confirm Password</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      // placeholder="••••••••"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>
                  {error && (
                    <div className="rounded-md bg-destructive/15 p-3">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign up"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="underline underline-offset-4 text-primary hover:text-primary/80"
                  >
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
