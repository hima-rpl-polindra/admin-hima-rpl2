import { mongooseConnect } from "@/lib/mongoose";
import { Alumni } from "@/models/Alumni";

export default async function handler(req, res) {
  await mongooseConnect();

  const { method } = req;
  const { id } = req.query;

  if (method === "GET") {
    if (id) {
      const alumni = await Alumni.findById(id).lean();
      if (!alumni) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }
      return res.json(alumni);
    } else {
      // Fetch semua data untuk list
      const alumni = await Alumni.find({}).sort({ angkatan: -1 }).lean();
      return res.json(alumni);
    }
  }

  if (method === "POST") {
    try {
      const { nama, angkatan, industri, posisi } = req.body;
      const alumni = await Alumni.create({ nama, angkatan, industri, posisi });
      return res.status(201).json(alumni);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  if (method === "PUT") {
    try {
      const { _id, nama, angkatan, industri, posisi } = req.body;
      const updateId = id || _id;

      const alumni = await Alumni.findByIdAndUpdate(
        updateId,
        { nama, angkatan, industri, posisi },
        { new: true, runValidators: true },
      );

      if (!alumni) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }
      return res.json(alumni);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  if (method === "DELETE") {
    const deleteId = id || req.body._id;
    const alumni = await Alumni.findByIdAndDelete(deleteId);

    if (!alumni) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    return res.json({ message: "Data berhasil dihapus" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
