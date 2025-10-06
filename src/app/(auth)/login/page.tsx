"use client";

import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import UnstyledLink from "@/components/links/Unstyledlink";
import { LoginType } from "@/types/user";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function LoginForm() {
  const methods = useForm<LoginType>({
    mode: "onTouched",
  });
  const { handleSubmit, register, formState: { errors } } = methods;

  const router = useRouter();
    const onSubmit = async (data: LoginType) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Login failed");
        return;
      }

      // misalnya backend kirim token
      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      toast.success(result.message || "Login success!");

      // redirect setelah 2 detik
      setTimeout(() => {
        router.push("/"); // ganti sesuai kebutuhan
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };
  // const onSubmit = (data: any) => {
  //   console.log("Login data:", data);
  // };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-[#f4f1ed] p-4">
      {/* Container responsive */}
      <div className="w-full max-w-[320px] sm:max-w-[420px] rounded-2xl bg-[#f5f5f5] p-2 pb-7 shadow-lg mx-auto">
        <div className="w-full rounded-2xl bg-white p-6 sm:p-8 shadow-lg">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex h-12 w-44 items-center justify-center rounded-xl bg-gray-100">
              <span className="text-2xl font-bold text-black">XenoTimes</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <Typography as="h1" variant="h5" weight="bold" className="text-gray-900 text-xl sm:text-2xl">
              Sign in to continue
            </Typography>
            <Typography as="p" className="text-gray-500 text-sm sm:text-base">
              Please sign in to check some news
            </Typography>
          </div>

          {/* Form */}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <div className={`flex items-center border rounded-md p-2 focus-within:ring-1 focus-within:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}>
                  <img src="/mail.svg" alt="Email Icon" className="h-5 w-5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                    className="ml-3 w-full border-none focus:ring-0 outline-none text-sm sm:text-base"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email?.message?.toString()}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className={`flex items-center border rounded-md p-2 focus-within:ring-1 focus-within:ring-blue-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}>
                  <img src="/lock.svg" alt="Password Icon" className="h-5 w-5 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: "Password is required" })}
                    className="ml-3 w-full border-none focus:ring-0 outline-none text-sm sm:text-base"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password?.message?.toString()}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="slate"
                size="lg"
                className="w-full bg-black hover:bg-gray-900 text-white py-2 sm:py-3"
              >
                <Typography as="p" variant="btn" weight="medium" className="text-base sm:text-lg text-white">
                  Sign In
                </Typography>
              </Button>
            </form>
          </FormProvider>

          {/* Separator */}
          <div className="my-6 flex items-center justify-center gap-2">
            <div className="h-px flex-1 bg-gray-200" />
            <Typography as="p" variant="c1" className="text-gray-500 text-center text-sm sm:text-base">
              Or continue with
            </Typography>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Social buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex h-10 w-[75] sm:w-[100] items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100">
              <img src="/google.svg" alt="Google" className="h-6 w-6" />
            </button>
            <button className="flex h-10 w-[74] sm:w-[100] items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100">
              <img src="/facebook.svg" alt="Facebook" className="h-6 w-6" />
            </button>
            <button className="flex h-10 w-[75] sm:w-[100] items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100">
              <img src="/apple.svg" alt="Apple" className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Footer link */}
        <Typography as="p" variant="c1" className="mt-6 text-center text-gray-600 text-sm sm:text-base">
          Don’t have an account?{" "}
          <UnstyledLink href="/register" className="font-semibold text-gray-900 hover:underline">
            Sign Up
          </UnstyledLink>
        </Typography>
      </div>
    </section>
  );
}
