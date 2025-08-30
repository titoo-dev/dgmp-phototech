"use client";

import { useActionState, useTransition, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { signUpAction, type SignUpFormState } from "@/actions/sign-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const initialState: SignUpFormState = {};

const SignUpPage = () => {
  const [state, formAction] = useActionState(signUpAction, initialState);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.redirect) {
      router.push(state.redirect);
    }
    if (state.error) {
      toast.error(state.error);
    }
    if (state.success) {
      toast.success("Account created successfully! Redirecting...");
    }
  }, [state.error, state.success]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create your account
          </CardTitle>
          <CardDescription className="text-center">
            Or{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-primary hover:underline"
            >
              sign in to your existing account
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                aria-invalid={!!state.fieldErrors?.name}
              />
              {state.fieldErrors?.name && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.name[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                aria-invalid={!!state.fieldErrors?.email}
              />
              {state.fieldErrors?.email && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                aria-invalid={!!state.fieldErrors?.password}
              />
              {state.fieldErrors?.password && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>



            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
