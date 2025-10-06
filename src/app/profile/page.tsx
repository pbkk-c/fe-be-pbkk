"use client";

import ProtectedRoute from "../components/ProtectedRoute";

export default function Home() {

  
  return (
    <ProtectedRoute>

<div>

<h1>halo ini profile, hanya user yang login aja yang bisa akses ini</h1>
</div>
    </ProtectedRoute>
  );
}
