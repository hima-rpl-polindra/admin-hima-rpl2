import { mongooseConnect } from "@/lib/mongoose";
import { Alumni } from "@/models/Alumni";

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res
        .status(400)
        .json({ message: "Data harus berupa array dan tidak boleh kosong" });
    }

    const currentYear = new Date().getFullYear();
    const errors = [];
    const validData = [];

    // Validasi setiap row
    data.forEach((row, index) => {
      const rowErrors = [];
      const rowNumber = index + 2; // +2 karena row 1 = header di Excel

      // Validasi nama
      if (!row.nama || String(row.nama).trim().length < 2) {
        rowErrors.push("Nama wajib diisi (min. 2 karakter)");
      }
      if (row.nama && String(row.nama).trim().length > 100) {
        rowErrors.push("Nama maksimal 100 karakter");
      }

      // Validasi angkatan
      const angkatan = Number(row.angkatan);
      if (!row.angkatan || isNaN(angkatan)) {
        rowErrors.push("Angkatan wajib diisi (harus angka)");
      } else if (angkatan < 1900 || angkatan > currentYear) {
        rowErrors.push(`Angkatan harus antara 1900 - ${currentYear}`);
      }

      // Validasi industri (opsional, cek maxlength saja)
      if (row.industri && String(row.industri).trim().length > 100) {
        rowErrors.push("Industri maksimal 100 karakter");
      }

      // Validasi posisi (opsional, cek maxlength saja)
      if (row.posisi && String(row.posisi).trim().length > 100) {
        rowErrors.push("Posisi maksimal 100 karakter");
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: rowNumber,
          nama: row.nama || "-",
          message: rowErrors.join(", "),
        });
      } else {
        validData.push({
          nama: String(row.nama).trim(),
          angkatan: angkatan,
          industri: row.industri ? String(row.industri).trim() : "",
          posisi: row.posisi ? String(row.posisi).trim() : "",
        });
      }
    });

    // Insert data yang valid
    let inserted = 0;
    if (validData.length > 0) {
      const result = await Alumni.insertMany(validData, { ordered: false });
      inserted = result.length;
    }

    return res.status(201).json({
      inserted,
      totalRows: data.length,
      errors,
      message:
        errors.length > 0
          ? `${inserted} data berhasil, ${errors.length} data gagal`
          : `${inserted} data alumni berhasil ditambahkan`,
    });
  } catch (error) {
    console.error("Bulk insert error:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan saat menyimpan data",
      error: error.message,
    });
  }
}
