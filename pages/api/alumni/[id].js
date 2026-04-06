import { mongooseConnect } from "@/lib/mongoose";
import { Alumni } from "@/models/Alumni";

export default async function handler(req, res) {
  await mongooseConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    const alumni = await Alumni.findById(id).lean();
    if (!alumni)
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    return res.status(200).json({ success: true, data: alumni });
  }

  if (req.method === "PUT") {
    const alumni = await Alumni.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!alumni)
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    return res.status(200).json({ success: true, data: alumni });
  }

  if (req.method === "DELETE") {
    const alumni = await Alumni.findByIdAndDelete(id);
    if (!alumni)
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    return res
      .status(200)
      .json({ success: true, message: "Data berhasil dihapus" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
