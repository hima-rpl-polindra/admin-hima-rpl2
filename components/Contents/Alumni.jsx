import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";

export default function Alumni({
  _id,
  nama: existingNama,
  angkatan: existingAngkatan,
  industri: existingIndustri,
  posisi: existingPosisi,
}) {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();

  // Inisialisasi state
  const [nama, setNama] = useState(existingNama || "");
  const [angkatan, setAngkatan] = useState(existingAngkatan || "");
  const [industri, setIndustri] = useState(existingIndustri || "");
  const [posisi, setPosisi] = useState(existingPosisi || "");

  const [isSaving, setIsSaving] = useState(false);

  async function saveAlumni(ev) {
    ev.preventDefault();
    setIsSaving(true);

    const data = {
      nama,
      angkatan: Number(angkatan),
      industri,
      posisi,
    };

    try {
      if (_id) {
        await axios.put("/api/alumni", { ...data, _id });
        toast.success("Data Alumni Berhasil Diperbarui");
      } else {
        await axios.post("/api/alumni", data);
        toast.success("Data Alumni Berhasil Ditambahkan");
      }

      setIsSaving(false);
      setRedirect(true);
    } catch (error) {
      setIsSaving(false);

      // KUNCI PERBAIKAN: Tangkap pesan spesifik dari backend
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan data";

      // Tampilkan di UI
      toast.error(errorMessage);
      console.error("Error Detail:", error);
    }
  }

  // Arahkan kembali ke halaman list alumni setelah save
  if (redirect) {
    router.push("/alumni"); // Sesuaikan dengan route list alumni kamu
    return null;
  }

  return (
    <>
      <Head>
        <title>{_id ? "Edit Alumni" : "Tambah Alumni"}</title>
      </Head>
      <form className="content__form" onSubmit={saveAlumni}>
        {/* Input Nama */}
        <div className="filling__form">
          <label htmlFor="nama">Nama Lengkap</label>
          <input
            type="text"
            id="nama"
            value={nama}
            onChange={(ev) => setNama(ev.target.value)}
            placeholder="Masukkan nama alumni"
            required
            minLength={2}
            maxLength={100}
          />
        </div>

        {/* Input Angkatan */}
        <div className="filling__form">
          <label htmlFor="angkatan">Angkatan (Tahun)</label>
          <input
            type="number"
            id="angkatan"
            value={angkatan}
            onChange={(ev) => setAngkatan(ev.target.value)}
            placeholder="Contoh: 2022"
            min="1900"
            max={new Date().getFullYear()}
            required
          />
        </div>

        <div className="filling__form">
          <label htmlFor="industri">Bidang Industri</label>
          <input
            type="text"
            id="industri"
            value={industri}
            onChange={(ev) => setIndustri(ev.target.value)}
            placeholder="Contoh: Teknologi, Perbankan, dll (opsional)"
            maxLength={100}
          />
        </div>

        {/* Input Posisi */}
        <div className="filling__form">
          <label htmlFor="posisi">Posisi / Pekerjaan</label>
          <input
            type="text"
            id="posisi"
            value={posisi}
            onChange={(ev) => setPosisi(ev.target.value)}
            placeholder="Contoh: Software Engineer (opsional)"
            maxLength={100}
          />
        </div>

        {/* Tombol Simpan */}
        <div className="form__button">
          <button type="submit" disabled={isSaving}>
            {isSaving ? "Menyimpan.." : "Simpan"}
          </button>
        </div>
      </form>
    </>
  );
}
