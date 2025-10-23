"use client";
import { useState, useEffect } from "react";

export default function GardioPage() {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [newLink, setNewLink] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch link gardio terbaru
  const fetchActiveLink = async () => {
    try {
      const res = await fetch("/api/gardio");
      const data = await res.json();
      if (data.success) setActiveLink(data.data?.url || null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchActiveLink();
  }, []);

  // Post link baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.trim()) return alert("Masukkan URL Gardio dulu!");

    setLoading(true);
    try {
      const res = await fetch("/api/gardio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newLink }),
      });
      const data = await res.json();
      if (data.success) {
        setNewLink("");
        fetchActiveLink();
        alert("Link Gardio berhasil ditambahkan!");
      } else {
        alert(data.error || "Gagal menambahkan link");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>🌐 Gardio Link Manager</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Masukkan link Gardio..."
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Tambah"}
        </button>
      </form>

      <div>
        <h3>🔗 Link Gardio Aktif:</h3>
        {activeLink ? (
          <a href={activeLink} target="_blank" rel="noopener noreferrer">
            {activeLink}
          </a>
        ) : (
          <p><i>Belum ada link aktif.</i></p>
        )}
      </div>
    </div>
  );
}
