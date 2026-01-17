"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";
import { useLogin, useConfirmEmail } from "@/provider/auth";
import Image from "next/image";
import { AuthVisualSection } from "@/components/common/AuthVisualSection";

function LoginForm() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const loginMutation = useLogin();
  const confirmEmailMutation = useConfirmEmail();
  const searchParams = useSearchParams();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [isVerified, setIsVerified] = useState(false);
  const [showVerifiedSuccess, setShowVerifiedSuccess] = useState(false);

  // Check if user just verified their email
  useEffect(() => {
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      setShowVerifiedSuccess(true);
      // Clear the query parameter
      router.replace('/login');
      // Hide message after 10 seconds
      setTimeout(() => {
        setShowVerifiedSuccess(false);
      }, 10000);
    }
  }, [searchParams, router]);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setEmailNotVerified(false);
    try {
      const response = await authLogin(data.email, data.password, rememberMe);

      // Check if email is verified
      const statusId = response.user.status?.id;
      const INACTIVE_STATUS_ID = "1b3d5416-2531-47be-a659-2ab101ace57f"; // INACTIVE status ID

      if (statusId === INACTIVE_STATUS_ID) {
        // Email not verified - show message only
        setEmailNotVerified(true);
        return;
      }

      // Small delay to ensure state is updated before navigation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Email verified - check if approved
      if (!response.user.isApproved) {
        // Email verified but not approved - redirect to profile
        router.push("/profile");
        return;
      }

      // Fully approved - go to dashboard
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error && error.message === "EMAIL_NOT_VERIFIED") {
        setEmailNotVerified(true);
      } else {
        // Parse error message to determine if it's email or password error
        const errorMessage =
          error instanceof Error ? error.message : "Invalid email or password";

        // Check error type and set appropriate field errors
        if (
          errorMessage.includes("email is not recognized") ||
          errorMessage.includes("not recognized")
        ) {
          form.setError("email", { message: errorMessage });
        } else if (
          errorMessage.includes("Incorrect password") ||
          errorMessage.toLowerCase().includes("password")
        ) {
          form.setError("password", { message: errorMessage });
        } else {
          form.setError("email", { message: errorMessage });
        }
      }
    }
  };

  return (
    <div
      className="flex h-screen w-full flex-row overflow-hidden font-display text-gray-900 dark:text-white antialiased"
      style={{ backgroundColor: "#eaeef7" }}
    >
      {/* Left Side: Form Section */}
      <div className="relative flex w-full flex-col justify-center lg:w-[50%] z-10">
        <div className="flex h-full w-full flex-col overflow-y-auto no-scrollbar">
          <div className="flex grow flex-col justify-center px-8 py-6 lg:px-12">
            <div className="mx-auto w-full max-w-[480px]">
              <div className="flex flex-col gap-2 items-center mb-8">
                <Image
                  src={isDark ? "/logo-main-light.png" : "/logo-main.png"}
                  alt="CRM Nexus Logo"
                  width={268}
                  height={isDark ? 64 : 48}
                  className={`mb-2 object-contain`}
                  suppressHydrationWarning
                />
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white">
                  Hi, Welcome Back
                </h1>
              </div>
              {/* Card Container */}
              <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-neutral-200 dark:border-slate-700 p-8">
                <div className="flex flex-col gap-6">

                  {/* Email Verified Success Message */}
                  {showVerifiedSuccess && (
                    <div className="px-4 py-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[24px]">
                          check_circle
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Email verified successfully!
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            You can now log in to your account. Your account is pending admin approval.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email Not Verified Message */}
                  {emailNotVerified && !isVerified && (
                    <div className="flex flex-col gap-4">
                      <div className="px-4 py-4 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[24px]">
                            mail
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                              Please verify your email address
                            </p>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                              We've sent a verification code to{" "}
                              <strong>{form.watch("email")}</strong>. Please
                              enter the code below to verify your email address.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Verification Code Input */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 ml-1">
                          Verification Code
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex gap-3">
                          <Input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => {
                              const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6);
                              setVerificationCode(value);
                              setVerificationError(null);
                            }}
                            maxLength={6}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={async () => {
                              if (verificationCode.length !== 6) {
                                setVerificationError(
                                  "Please enter a 6-digit verification code"
                                );
                                return;
                              }

                              setIsVerifying(true);
                              setVerificationError(null);

                              try {
                                const formValues = form.getValues();
                                await confirmEmailMutation.mutateAsync({
                                  email: formValues.email,
                                  code: verificationCode,
                                });
                                setIsVerified(true);
                                setEmailNotVerified(false);
                                // After verification, try to login again with rememberMe preference
                                await authLogin(
                                  formValues.email,
                                  formValues.password,
                                  rememberMe
                                );
                                router.push("/profile");
                              } catch (error) {
                                setVerificationError(
                                  error instanceof Error
                                    ? error.message
                                    : "Invalid verification code"
                                );
                              } finally {
                                setIsVerifying(false);
                              }
                            }}
                            isLoading={isVerifying}
                            disabled={
                              verificationCode.length !== 6 || isVerifying
                            }
                            className="px-6"
                          >
                            Verify
                          </Button>
                        </div>
                        {verificationError && (
                          <p className="text-sm text-red-600 dark:text-red-400 ml-1">
                            {verificationError}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Email Verified Success Message */}
                  {isVerified && (
                    <div className="px-4 py-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[24px]">
                          check_circle
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Email verified successfully!
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Redirecting you to your profile...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  {!emailNotVerified && (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-5 mt-2"
                        autoComplete="off"
                      >
                        {/* Email Field */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email
                              <span className="text-red-500 ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  icon="mail"
                                  placeholder="name@company.com"
                                  autoComplete="off"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Password Field */}
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Password
                                <span className="text-red-500 ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    {...field}
                                  />
                                  {field.value && field.value.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-[20px]">
                                        {showPassword
                                          ? "visibility"
                                          : "visibility_off"}
                                      </span>
                                    </button>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-start gap-3">
                            <div className="flex h-6 items-center">
                              <input
                                className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-primary/25 dark:border-neutral-600 dark:bg-neutral-700 cursor-pointer"
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) =>
                                  setRememberMe(e.target.checked)
                                }
                              />
                            </div>
                            <label
                              htmlFor="remember"
                              className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                              Remember me
                            </label>
                          </div>
                          <Link
                            href="/forgot-password"
                            className="text-sm font-bold text-primary hover:text-primary/80 hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          isLoading={loginMutation.isPending}
                          className="mt-2 flex w-full items-center justify-center"
                        >
                          <span className="flex items-center gap-2">
                            Sign In
                            <span className="material-symbols-outlined text-[18px]">
                              arrow_forward
                            </span>
                          </span>
                        </Button>
                      </form>
                    </Form>
                  )}

                  {/* Footer Area */}
                  <div className="text-center pt-4 border-t border-neutral-200 dark:border-slate-700 mt-6">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Don't have an account?{" "}
                      <Link
                        href="/signup"
                        className="font-bold text-primary hover:text-primary/80 hover:underline"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Visual Section */}
      <AuthVisualSection />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
