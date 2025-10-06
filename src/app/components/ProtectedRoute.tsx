"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
