import DataLoader from "@/components/DataLoader";
import useFetchData from "@/hooks/useFetchData";
import Link from "next/link";
import { useState } from "react";
import { BadgeInfo, SquarePen, Trash } from "lucide-react";
import Head from "next/head";

export default function Informations() {
  // pagnation
  const [currentPage, setCurrentPage] = useState(1); // for page 1
  const [perPage] = useState(7);

  // search
  const [searchQuery, setSearchQuery] = useState("");

  // fetch information data
  const { alldata: allData, loading } = useFetchData("/api/informations"); // fetch information data

  // function to handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // total number of informatios;
  const allInformations = allData.length;

  // filter all data based on search query
  const filteredInformations =
    searchQuery.trim() === ""
      ? allData
      : allData.filter((information) =>
          information.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // calculate index of the first information displayed on the current page
  const indexOfFirstInformation = (currentPage - 1) * perPage;
  const indexofLastInformation = currentPage * perPage;

  // Get the current page's informations
  const currentInformations = filteredInformations.slice(
    indexOfFirstInformation,
    indexofLastInformation
  );

  const publishedInformations = currentInformations.filter(
    (ab) => ab.status === "publish"
  );

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(allInformations / perPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Head>
        <title>Semua Informasi</title>
      </Head>
      <div className="content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Semua <span>Informasi</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <BadgeInfo /> <span>/</span> <span>Informasi</span>
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
                  {publishedInformations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="no__content">
                        Tidak ada informasi.
                      </td>
                    </tr>
                  ) : (
                    publishedInformations.map((information, index) => (
                      <tr key={information._id}>
                        <td>{indexOfFirstInformation + index + 1}</td>
                        <td>
                          <img
                            src={information.images[0]}
                            width={100}
                            alt="image"
                          />
                        </td>
                        <td>
                          <h3>{information.title}</h3>
                        </td>
                        <td>
                          <div className="manage__content">
                            <Link href={"/information/edit/" + information._id}>
                              <button>
                                <SquarePen />
                              </button>
                            </Link>
                            <Link
                              href={"/information/delete/" + information._id}
                            >
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
          {publishedInformations.length === 0 ? (
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
