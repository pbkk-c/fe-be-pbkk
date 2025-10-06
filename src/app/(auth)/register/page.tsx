"use client";

import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import UnstyledLink from "@/components/links/Unstyledlink";
import { RegisterType } from "@/types/user";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const methods = useForm<RegisterType>({
    mode: "onTouched",
  });

  const { handleSubmit, register, formState: { errors }, watch } = methods;
  const router = useRouter();
  // const onSubmit = (data: any) => {
  //   console.log("Register data:", data);
  // };

  const onSubmit = async (data: RegisterType) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Register failed");
        return;
      }

      toast.success(result.message || "Register success!");

      // Delay biar user lihat toast dulu
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };
  const password = watch("password", "");

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-[#f4f1ed] p-4">
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
              Create an Account
            </Typography>
            <Typography as="p" className="text-gray-500 text-sm sm:text-base">
              Please fill the form to register
            </Typography>
          </div>

          {/* Form */}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <div>
                <div className={`flex items-center border rounded-md p-2 focus-within:ring-1 focus-within:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}>
                  <img src="/profile.svg" alt="User Icon" className="h-5 w-5 p-0.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Username"
                    {...register("name", { required: "Username is required" })}
                    className="ml-3 w-full border-none focus:ring-0 outline-none text-sm sm:text-base"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name?.message?.toString()}</p>
                )}
              </div>

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

              {/* Confirm Password */}
              <div>
                <div className={`flex items-center border rounded-md p-2 focus-within:ring-1 focus-within:ring-blue-500 ${errors.confirm_password ? "border-red-500" : "border-gray-300"}`}>
                  <img src="/lock.svg" alt="Confirm Password Icon" className="h-5 w-5 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    {...register("confirm_password", { 
                      required: "Confirm password is required",
                      validate: value => value === password || "Passwords do not match"
                    })}
                    className="ml-3 w-full border-none focus:ring-0 outline-none text-sm sm:text-base"
                  />
                </div>
                {errors.confirm_password && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirm_password?.message?.toString()}</p>
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
                  Register
                </Typography>
              </Button>
            </form>
          </FormProvider>
          </div>

          {/* Footer link */}
          <Typography as="p" variant="c1" className="mt-6 text-center text-gray-600 text-sm sm:text-base">
            Already have an account?{" "}
            <UnstyledLink href="/login" className="font-semibold text-gray-900 hover:underline">
              Sign In
            </UnstyledLink>
          </Typography>
        </div>

    </section>
  );
}
