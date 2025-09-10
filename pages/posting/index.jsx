import DataLoader from "@/components/DataLoader";
import useFetchData from "@/hooks/useFetchData";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { SquareLibrary, SquarePen, Trash } from "lucide-react";

export default function Postings() {
  // pagnation
  const [currentPage, setCurrentPage] = useState(1); // for page 1
  const [perPage] = useState(7);

  // search
  const [searchQuery, setSearchQuery] = useState("");

  // fetch posting data
  const { alldata: allData, loading } = useFetchData("/api/postings"); // fetch posting data

  // function to handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // total number of postings;
  const allPosting = allData.length;

  // filter all data based on search query
  const filteredPostings =
    searchQuery.trim() === ""
      ? allData
      : allData.filter((posting) =>
          posting.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // calculate index of the first blog displayed on the current page
  const indexOfFirstPosting = (currentPage - 1) * perPage;
  const indexofLastPosting = currentPage * perPage;

  // Get the current page's postings
  const currentPostings = filteredPostings.slice(
    indexOfFirstPosting,
    indexofLastPosting
  );

  const publishedPostings = currentPostings.filter(
    (ab) => ab.status === "publish"
  );

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(allPosting / perPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Head>
        <title>Semua Posting Kegiatan</title>
      </Head>
      <div className="content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Semua <span>Posting Kegiatan</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <SquareLibrary /> <span>/</span> <span>Posting Kegiatan</span>
          </div>
        </div>
        <div className="content__table">
          <div className="content__search">
            <input
              value={searchQuery}
              onChange={(ev) => setSearchQuery(ev.target.value)}
              type="text"
              placeholder="Cari berdasarkan judul"
            />
          </div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Gambar (Image)</th>
                <th>Judul (Title)</th>
                <th>Edit / Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <tr>
                    <td>
                      <DataLoader />
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {publishedPostings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="no__content">
                        Tidak ada posting kegiatan.
                      </td>
                    </tr>
                  ) : (
                    publishedPostings.map((posting, index) => (
                      <tr key={posting._id}>
                        <td>{indexOfFirstPosting + index + 1}</td>
                        <td>
                          <img
                            src={posting.images[0]}
                            width={100}
                            alt="image"
                          />
                        </td>
                        <td>
                          <h3>{posting.title}</h3>
                        </td>
                        <td>
                          <div className="manage__content">
                            <Link href={"/posting/edit/" + posting._id}>
                              <button>
                                <SquarePen />
                              </button>
                            </Link>
                            <Link href={"/posting/delete/" + posting._id}>
                              <button>
                                <Trash />
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </>
              )}
            </tbody>
          </table>
          {/* for pagination */}
          {publishedPostings.length === 0 ? (
            ""
          ) : (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previos
              </button>
              {pageNumbers
                .slice(
                  Math.max(currentPage - 3, 0),
                  Math.min(currentPage + 2, pageNumbers.length)
                )
                .map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`${currentPage === number ? "active" : ""}`}
                  >
                    {number}
                  </button>
                ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage.length < perPage}
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
