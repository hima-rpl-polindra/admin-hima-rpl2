import Dataloading from "@/components/DataLoader";
import useFetchData from "@/hooks/useFetchData";
import Link from "next/link";
import { useState } from "react";
import { Captions, SquarePen, Trash } from "lucide-react";
import Head from "next/head";

export default function DraftBlog() {
  // pagnation
  const [currentPage, setCurrentPage] = useState(1); // for page 1
  const [perPage] = useState(7);

  // search
  const [searchQuery, setSearchQuery] = useState("");

  // fetch blog data
  const { alldata: allData, loading } = useFetchData("/api/blogs");

  // function to handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // total number of blogs;
  const allBlog = allData.length;

  // filter all data based on search query
  const filteredBlogs =
    searchQuery.trim() === ""
      ? allData
      : allData.filter((blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // calculate index of the first blog displayed on the current page
  const indexOfFirstBlog = (currentPage - 1) * perPage;
  const indexofLastblog = currentPage * perPage;

  // Get the current page's blogs
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexofLastblog);

  const publishedBlogs = currentBlogs.filter((ab) => ab.status === "draft"); // for draft

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(allBlog / perPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Head>
        <title>Draf Blog</title>
      </Head>

      <div className="content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Draf <span>Blog</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <Captions /> <span>/</span> <span>Blog</span>
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
          <table className="">
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
                      <Dataloading />
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {publishedBlogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="no__content">
                        Tidak ada draf blog.
                      </td>
                    </tr>
                  ) : (
                    publishedBlogs.map((blog, index) => (
                      <tr key={blog._id}>
                        <td>{indexOfFirstBlog + index + 1}</td>
                        <td>
                          <img src={blog.images[0]} width={100} alt="image" />
                        </td>
                        <td>
                          <h3>{blog.title}</h3>
                        </td>
                        <td>
                          <div className="manage__content">
                            <Link href={`/blog/edit/${blog._id}`}>
                              <button>
                                <SquarePen />
                              </button>
                            </Link>
                            <Link href={`/blog/delete/${blog._id}`}>
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
        </div>
      </div>
    </>
  );
}
