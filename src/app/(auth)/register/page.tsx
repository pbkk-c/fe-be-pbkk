"use client";

import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import UnstyledLink from "@/components/links/Unstyledlink";
import { RegisterType } from "@/types/user";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";

export default function RegisterForm() {
  const methods = useForm<RegisterType>({ mode: "onTouched" });
  const { handleSubmit, register, formState: { errors }, watch } = methods;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const password = watch("password", "");

  const onSubmit = async (data: RegisterType) => {
    try {
      setLoading(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Register failed");
        setLoading(false);
        return;
      }
      toast.success(result.message || "Register success!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-orange-200 overflow-hidden">
      {/* Background Decoration */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1 }}
        className="absolute w-[400px] h-[400px] bg-orange-300 rounded-full blur-3xl top-10 left-[-120px]"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute w-[350px] h-[350px] bg-amber-400 rounded-full blur-3xl bottom-10 right-[-100px]"
      />

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-[90%] max-w-md bg-white/70 backdrop-blur-lg border border-orange-200 rounded-3xl shadow-xl p-8 z-10"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex h-12 w-44 items-center justify-center rounded-xl bg-orange-50">
            <span className="text-2xl font-extrabold text-orange-600">XenoTimes</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <Typography as="h1" variant="h5" weight="bold" className="text-gray-900 text-2xl">
            Create Account
          </Typography>
          <Typography as="p" className="text-gray-500 text-sm">
            Masukkan data untuk mendaftar akun baru
          </Typography>
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <div
                className={`relative flex items-center border rounded-lg bg-white/70 px-3 py-2 focus-within:ring-2 ${
                  errors.name ? "border-red-400 ring-red-200" : "border-orange-200 focus-within:ring-orange-300"
                }`}
              >
                <User className="w-4 h-4 text-orange-500" />
                <input
                  type="text"
                  placeholder="Username"
                  {...register("name", { required: "Username is required" })}
                  className="ml-3 w-full bg-transparent border-none outline-none text-sm"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message?.toString()}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <div
                className={`relative flex items-center border rounded-lg bg-white/70 px-3 py-2 focus-within:ring-2 ${
                  errors.email ? "border-red-400 ring-red-200" : "border-orange-200 focus-within:ring-orange-300"
                }`}
              >
                <Mail className="w-4 h-4 text-orange-500" />
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                  className="ml-3 w-full bg-transparent border-none outline-none text-sm"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message?.toString()}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div
                className={`relative flex items-center border rounded-lg bg-white/70 px-3 py-2 focus-within:ring-2 ${
                  errors.password ? "border-red-400 ring-red-200" : "border-orange-200 focus-within:ring-orange-300"
                }`}
              >
                <Lock className="w-4 h-4 text-orange-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", { required: "Password is required" })}
                  className="ml-3 w-full bg-transparent border-none outline-none text-sm"
                />
                
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message?.toString()}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div
                className={`relative flex items-center border rounded-lg bg-white/70 px-3 py-2 focus-within:ring-2 ${
                  errors.confirm_password ? "border-red-400 ring-red-200" : "border-orange-200 focus-within:ring-orange-300"
                }`}
              >
                <Lock className="w-4 h-4 text-orange-500" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirm_password", {
                    required: "Confirm password is required",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                  className="ml-3 w-full bg-transparent border-none outline-none text-sm"
                />
                {showConfirm ? (
                  <EyeOff className="w-4 h-4 text-zinc-500 cursor-pointer" onClick={() => setShowConfirm(false)} />
                ) : (
                  <Eye className="w-4 h-4 text-zinc-500 cursor-pointer" onClick={() => setShowConfirm(true)} />
                )}
              </div>
              {errors.confirm_password && (
                <p className="mt-1 text-xs text-red-500">{errors.confirm_password.message?.toString()}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="slate"
              size="lg"
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                loading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-400 active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" /> <span>Registering...</span>
                </div>
              ) : (
                <Typography as="p" variant="btn" className="text-white">
                  Register
                </Typography>
              )}
            </Button>

            {/* Back to Home */}
            <Button
              variant="slate"
              size="lg"
              onClick={() => router.push("/")}
              className="w-full mt-3 bg-white hover:bg-orange-50 text-black border border-orange-200 py-3"
            >
              <Typography as="p" variant="btn" className="text-black">
                Kembali ke Home
              </Typography>
            </Button>
          </form>
        </FormProvider>

        {/* Footer */}
        <Typography as="p" variant="c1" className="mt-6 text-center text-gray-600 text-sm">
          Sudah punya akun?{" "}
          <UnstyledLink href="/login" className="font-semibold text-orange-600 hover:underline">
            Masuk Sekarang
          </UnstyledLink>
        </Typography>
      </motion.section>
    </main>
  );
}
  