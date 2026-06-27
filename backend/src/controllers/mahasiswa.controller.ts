import { Request, Response } from "express";
import db from "../config/database";

export const getAllMahasiswa = async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search || "");
    const prodiId = req.query.prodi_id ? Number(req.query.prodi_id) : null;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const params: any[] = [];

    if (search) {
      where += " AND (m.nim LIKE ? OR m.nama LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (prodiId) {
      where += " AND m.prodi_id = ?";
      params.push(prodiId);
    }

    const [countRows]: any = await db.query(
      `SELECT COUNT(*) AS total FROM mahasiswa m ${where}`,
      params,
    );

    const total = countRows[0].total;

    const [rows] = await db.query(
      `SELECT
        m.id,
        m.nim,
        m.nama,
        m.angkatan,
        m.foto,
        p.id AS prodi_id,
        p.nama_prodi
      FROM mahasiswa m
      JOIN prodi p ON m.prodi_id = p.id
      ${where}
      ORDER BY m.id DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    res.json({
      message: "Data mahasiswa berhasil diambil",
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
