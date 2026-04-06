import Alumni from "@/components/Contents/Alumni";
import { Users } from "lucide-react";
import Head from "next/head";

export default function UploadAlumni() {
  return (
    <>
      <Head>
        <title>Tambah Data Alumni</title>
      </Head>
      <div className="set__content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Tambah <span>Data Alumni</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            {/* Menggunakan icon Users agar seragam dengan halaman Semua Alumni */}
            <Users size={20} /> <span>/</span> <span>Tambah Data Alumni</span>
          </div>
        </div>

        {/* Render komponen form Alumni tanpa passing props _id untuk mode "Create" */}
        <div className="set__content mt-3">
          <Alumni />
        </div>
      </div>
    </>
  );
}
