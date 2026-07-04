"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import {
  createMahasiswa,
  getAllProdi,
  getMahasiswa,
  Mahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
  logoutAccount,
} from "@/lib/api";
import { getToken, getUser, logout } from "@/lib/auth";

export default function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [prodi, setProdi] = useState<{ id: number; nama: string }[]>([]);
  const [search, setSearch] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const user = getUser();
    setUser(user);
  }, []);

  const loadMahasiswa = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getMahasiswa({
        search,
        prodi_id: prodiId,
        page,
        limit,
      });

      setMahasiswa(result.data);
      setTotalPage(result.meta.totalPage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data mahasiswa",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadProdi = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getAllProdi();
      setProdi(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data prodi",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMahasiswa();
    loadProdi();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    loadMahasiswa();
  };

  const handleSubmit = async (payload: MahasiswaInput) => {
    try {
      setMessage("");
      setError("");

      const formData = new FormData();

      formData.append("nim", payload.nim);
      formData.append("nama", payload.nama);
      formData.append("prodi_id", payload.prodi);
      formData.append("angkatan", String(payload.angkatan));

      if (payload.file instanceof File) {
        formData.append("foto", payload.file);
      }

      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, formData);
        setMessage("Data mahasiswa berhasil diperbarui");
      } else {
        await createMahasiswa(formData);
        setMessage("Data mahasiswa berhasil ditambahkan");
      }

      setSelectedMahasiswa(null);
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await deleteMahasiswa(id);
      setMessage("Data mahasiswa berhasil dihapus");
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
      throw err;
    }
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("Yakin ingin logout?");
    if (confirmed) {
      await logoutAccount();
      logout();
      window.location.href = "/login";
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>CRUD Data Mahasiswa</h1>
          <p>Frontend Next.js yang terhubung ke backend Express.js.</p>
        </div>

        <div>
          <div>
            <p>Welcome, {user?.name || "User"}</p>
          </div>
          <button className="btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <MahasiswaForm
        selectedMahasiswa={selectedMahasiswa}
        prodi={prodi}
        onSubmit={handleSubmit}
        onCancelEdit={() => setSelectedMahasiswa(null)}
      />

      <section className="card" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari NIM atau nama"
          />
          <select value={prodiId} onChange={(e) => setProdiId(e.target.value)}>
            <option value="">Semua Prodi</option>
            {prodi.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama_prodi}
              </option>
            ))}
          </select>
          <button onClick={handleSearch}>Cari</button>
        </div>

        <h2>Daftar Mahasiswa</h2>
        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <MahasiswaTable
            mahasiswa={mahasiswa}
            onEdit={setSelectedMahasiswa}
            onDelete={handleDelete}
          />
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Halaman {page} dari {totalPage}
          </span>
          <button
            disabled={page >= totalPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}
