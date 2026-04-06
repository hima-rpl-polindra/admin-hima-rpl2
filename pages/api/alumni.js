import { mongooseConnect } from "@/lib/mongoose";
import { Alumni } from "@/models/Alumni";

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === "GET") {
    const alumni = await Alumni.find({}).sort({ angkatan: -1 }).lean();
    return res.status(200).json({ success: true, data: alumni });
  }

  if (req.method === "POST") {
    const { nama, angkatan, industri, posisi } = req.body;

    const alumni = await Alumni.create({ nama, angkatan, industri, posisi });
    return res.status(201).json({ success: true, data: alumni });
  }

  res.status(405).json({ message: "Method not allowed" });
}
