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

export type MahasiswaInput = {
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  file: File | null;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
};

export type UserInput = {
  name: string;
  email: string;
  password: string;
  role: string;
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

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil data mahasiswa");
    }

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

    if (!response.ok) {
      throw new Error(result.message || "Gagal menambahkan mahasiswa");
    }

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

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil data prodi");
    }

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

    if (!response.ok) {
      throw new Error(result.message || "Gagal memperbarui mahasiswa");
    }

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

    if (!response.ok) {
      throw new Error(result.message || "Gagal menghapus mahasiswa");
    }

    return result;
  } catch (error) {
    console.error("Error deleting mahasiswa:", error);
    throw error;
  }
}

export async function loginAccount(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

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
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

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
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

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

export async function getUsers() {
  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil data user");
    }

    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function createUser(payload: UserInput) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal menambahkan user");
    }

    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(
  id: number,
  payload: {
    name: string;
    email: string;
    role: string;
  },
) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal memperbarui user");
    }

    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(id: number) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal menghapus user");
    }

    return result;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function resetPasswordByAdmin(id: number) {
  try {
    const response = await fetch(`${API_URL}/users/${id}/reset-password`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mereset password user");
    }

    return result;
  } catch (error) {
    console.error("Error resetting user password:", error);
    throw error;
  }
}

export async function requestPasswordResetByUser(email: string) {
  try {
    const response = await fetch(`${API_URL}/users/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengirim link reset password");
    }

    return result;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
}

export async function resetPasswordByUser(
  email: string,
  token: string,
  password: string,
  confirmPassword: string,
) {
  try {
    const response = await fetch(`${API_URL}/users/reset-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        token,
        password,
        confirmPassword,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengubah password");
    }

    return result;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}
