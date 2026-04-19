import { useState } from "react";
import Alumni from "@/components/Contents/Alumni";
import AlumniExcelUpload from "@/components/Contents/AlumniExcelUpload";
import { Users, FileText, FileSpreadsheet } from "lucide-react";
import Head from "next/head";

export default function UploadAlumni() {
  const [activeTab, setActiveTab] = useState("manual");

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

        {/* Tab Toggle */}
        <div className="upload__tabs">
          <button
            type="button"
            className={`upload__tab ${activeTab === "manual" ? "upload__tab--active" : ""}`}
            onClick={() => setActiveTab("manual")}
          >
            <FileText size={18} />
            <span>Form Manual</span>
          </button>
          <button
            type="button"
            className={`upload__tab ${activeTab === "excel" ? "upload__tab--active" : ""}`}
            onClick={() => setActiveTab("excel")}
          >
            <FileSpreadsheet size={18} />
            <span>Upload Excel</span>
          </button>
        </div>

        {/* Render komponen berdasarkan tab aktif */}
        <div className="set__content mt-3">
          {activeTab === "manual" ? <Alumni /> : <AlumniExcelUpload />}
        </div>
      </div>
    </>
  );
}
