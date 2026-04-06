"use client";

import { useState, useEffect } from "react";
import { Users, SquarePen, Trash } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import toast from "react-hot-toast"; // Opsional: Tambahkan toast agar user tahu kalau berhasil dihapus

export default function AlumniAll() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(7);

  // FETCH DATA
  useEffect(() => {
    fetch("/api/alumni")
      .then((res) => res.json())
      .then((data) => {
        // Karena API sekarang langsung mengembalikan array, kita langsung set datanya
        if (Array.isArray(data)) {
          setAllData(data);
        }
      })
      .catch((err) => console.error("Gagal fetch alumni:", err))
      .finally(() => setLoading(false));
  }, []);

  // DELETE DATA
  async function handleDelete(id) {
    if (!confirm("Yakin ingin menghapus data alumni ini?")) return;
    try {
      // Ubah endpoint agar sesuai dengan query ?id=...
      const res = await fetch(`/api/alumni?id=${id}`, { method: "DELETE" });

      if (res.ok) {
        // Jika status HTTP 200 (Berhasil)
        setAllData((prev) => prev.filter((a) => a._id !== id));
        toast.success("Data berhasil dihapus!");
      } else {
        toast.error("Gagal menghapus data");
      }
    } catch (err) {
      console.error("Gagal hapus alumni:", err);
      toast.error("Terjadi kesalahan sistem");
    }
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredAlumni =
    searchQuery.trim() === ""
      ? allData
      : allData.filter(
          (a) =>
            a.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.posisi.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.industri.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  const indexOfFirst = (currentPage - 1) * perPage;
  const indexOfLast = currentPage * perPage;
  const currentAlumni = filteredAlumni.slice(indexOfFirst, indexOfLast);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredAlumni.length / perPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Head>
        <title>Semua Alumni</title>
      </Head>

      <div className="content__page">
        {/* Title */}
        <div className="title__dashboard">
          <div>
            <h2>
              Semua <span>Alumni</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <Users size={20} />
            <span>/</span>
            <span>Alumni</span>
          </div>
        </div>

        {/* Table */}
        <div className="content__table">
          {/* Search */}
          <div className="content__search">
            <input
              type="text"
              placeholder="Cari berdasarkan nama, posisi, industri..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>NO</th>
                <th>Nama</th>
                <th>Angkatan</th>
                <th>Industri</th>
                <th>Posisi</th>
                <th>Edit / Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="no__content">
                    Memuat data...
                  </td>
                </tr>
              ) : currentAlumni.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no__content">
                    {searchQuery
                      ? "Data tidak ditemukan."
                      : "Belum ada data alumni."}
                  </td>
                </tr>
              ) : (
                currentAlumni.map((item, index) => (
                  <tr key={item._id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{item.nama}</td>
                    <td>{item.angkatan}</td>
                    <td>{item.industri}</td>
                    <td>{item.posisi}</td>
                    <td>
                      <div className="manage__content">
                        <Link href={`/alumni/edit/${item._id}`}>
                          <button>
                            <SquarePen size={18} />
                          </button>
                        </Link>
                        <Link href={"/alumni/delete/" + item._id}>
                          <button>
                            <Trash size={18} />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {currentAlumni.length > 0 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {pageNumbers
                .slice(
                  Math.max(currentPage - 3, 0),
                  Math.min(currentPage + 2, pageNumbers.length),
                )
                .map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={currentPage === number ? "active" : ""}
                  >
                    {number}
                  </button>
                ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === pageNumbers.length}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
