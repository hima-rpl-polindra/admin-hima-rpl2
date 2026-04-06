import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, Trash2 } from "lucide-react";

export default function DeleteAlumni() {
  const router = useRouter();
  const { id } = router.query;

  const [contentAlumni, setContentAlumni] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    } else {
      // Mengambil data alumni berdasarkan ID untuk ditampilkan namanya
      axios
        .get("/api/alumni?id=" + id)
        .then((response) => {
          setContentAlumni(response.data);
        })
        .catch((error) => {
          console.error("Gagal mengambil data alumni:", error);
        });
    }
  }, [id]);

  function goBack() {
    router.push("/alumni"); // Arahkan kembali ke halaman utama alumni
  }

  async function deleteAlumni() {
    try {
      await axios.delete("/api/alumni?id=" + id);
      toast.success("Data alumni berhasil dihapus");
      goBack();
    } catch (error) {
      toast.error("Gagal menghapus data");
      console.error(error);
    }
  }

  return (
    <>
      <Head>
        <title>Delete Data Alumni</title>
      </Head>
      <div className="set__content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Delete <span>{contentAlumni?.nama}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <Users />
            <span>/</span> <span>Delete Data Alumni</span>
          </div>
        </div>
        <div className="delete__content">
          <div className="delete__content__card">
            <Trash2 size={50} color="#f1d00a" />
            <p className="delete__content__info">Hmm.. Yakin Gak?</p>
            <p className="delete__content__desc">
              Kalau kamu hapus data alumni ini, datanya bakal kehapus permanen
              dari sistem.
            </p>
            <div className="confirm__button">
              <button onClick={deleteAlumni} className="accept__button">
                Hapus
              </button>
              <button onClick={goBack} className="decline__button">
                Gak jadi
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
