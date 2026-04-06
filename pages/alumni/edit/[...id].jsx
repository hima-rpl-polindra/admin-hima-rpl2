import Alumni from "@/components/Contents/Alumni"; // <-- Ganti import menjadi Alumni
import Head from "next/head";
import { useState, useEffect } from "react";
import { SquareLibrary } from "lucide-react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditAlumni() {
  const router = useRouter();
  const { id } = router.query;

  const [contentAlumni, setContentAlumni] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    } else {
      // Pastikan memanggil API alumni, bukan postings
      axios.get("/api/alumni?id=" + id).then((response) => {
        setContentAlumni(response.data); // <-- Set state menggunakan setContentAlumni
      });
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>Edit Data Alumni</title>
      </Head>
      <div className="set__content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              {/* Menampilkan nama alumni jika sudah load */}
              Edit <span>{contentAlumni?.nama}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <SquareLibrary /> <span>/</span> <span>Edit Data Alumni</span>
          </div>
        </div>
        <div className="mt-3">
          {/* Render komponen form Alumni */}
          {contentAlumni && <Alumni {...contentAlumni} />}
        </div>
      </div>
    </>
  );
}
