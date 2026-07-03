import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi: string;
  angkatan: number;
  foto?: string | null;
};

export async function getMahasiswa(params: {
  search?: string;
  prodi_id?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const query = new URLSearchParams();

    if (params?.search) query.set("search", params.search);
    if (params?.prodi_id) query.set("prodi_id", params.prodi_id);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const response = await fetch(`${API_URL}/mahasiswa?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.message);
    return result;
  } catch (error) {
    console.error("Error fetching mahasiswa:", error);
    throw error;
  }
}

export async function createMahasiswa(formData: FormData) {
  try {
    const response = await fetch(`${API_URL}/mahasiswa`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  } catch (error) {
    console.error("Error creating mahasiswa:", error);
    throw error;
  }
}

export async function getAllProdi() {
  try {
    const response = await fetch(`${API_URL}/prodi`);
    const result = await response.json();

    if (!response.ok) throw new Error(result.message);
    return result;
  } catch (error) {
    console.error("Error fetching prodi:", error);
    throw error;
  }
}

export async function updateMahasiswa(id: number, formData: FormData) {
  try {
    const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.message);
    return result;
  } catch (error) {
    console.error("Error updating mahasiswa:", error);
    throw error;
  }
}

export async function deleteMahasiswa(id: number) {
  try {
    const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.message);
    return result;
  } catch (error) {
    console.error("Error deleting mahasiswa:", error);
    throw error;
  }
}

export async function loginAccount(email: string, password: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login gagal");
    }
    return result;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

export async function registerAccount(
  name: string,
  email: string,
  password: string,
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      },
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registrasi gagal");
    }
    return result;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}

export async function logoutAccount() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Logout gagal");
    }
    return result;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}
