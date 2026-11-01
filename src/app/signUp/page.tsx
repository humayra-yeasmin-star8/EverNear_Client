"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2"; // 👈 Import SweetAlert2

export default function SignUpPage() {
  const router = useRouter();

  const handleEmailSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      name: string;
      image: string;
      email: string;
      password: string;
    };

    // --- PASSWORD VALIDATION RULES ---
    const minLength = user.password.length >= 6;
    const hasUppercase = /[A-Z]/.test(user.password);
    const hasLowercase = /[a-z]/.test(user.password);

    if (!minLength || !hasUppercase || !hasLowercase) {
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 6 characters long and contain at least one uppercase and one lowercase letter.",
        confirmButtonColor: "#b45309", // matches amber styling
      });
      return; // Stop execution if validation fails
    }
    // ---------------------------------

    const { data, error } = await authClient.signUp.email({
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.image,
    });

    if (data) {
      // Success Toast/Alert
      await Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Account created successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      router.refresh();
      router.push("/");
    }

    if (error) {
      console.error("Error signing up:", error);
      Swal.fire({
        icon: "error",
        title: "Sign Up Failed",
        text: error.message || "Something went wrong during registration.",
        confirmButtonColor: "#b45309",
      });
    }
  };

  const handleGoogleSignUp = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="bg-amber-800 min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col gap-6 max-w-md mx-auto px-6 py-6 bg-amber-200 rounded-xl shadow-xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create an account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSignUp}>
              <FieldGroup>
                <Field>
                  <Button
                    onClick={handleGoogleSignUp}
                    variant="outline"
                    type="button"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Sign up with Google
                  </Button>
                </Field>

                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>

                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="image">ImageURL</FieldLabel>
                  <Input
                    id="image"
                    type="url"
                    name="image"
                    placeholder="Image URL"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </Field>

                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" name="password" type="password" required />
                  <p className="text-[11px] text-slate-600 mt-1">
                    Must be 6+ chars with uppercase & lowercase letters.
                  </p>
                </Field>

                <Field>
                  <Button type="submit" className="w-full">Sign up</Button>
                  <FieldDescription className="text-center mt-2">
                    Already have an account? <a href="/signin" className="underline font-semibold">Sign in</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <FieldDescription className="px-6 text-center text-xs text-amber-950">
          By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a>{" "}
          and <a href="#" className="underline">Privacy Policy</a>.
        </FieldDescription>
      </div>
    </div>
  );
}