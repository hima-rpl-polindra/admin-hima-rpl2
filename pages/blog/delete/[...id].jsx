import Blog from "@/components/Contents/Blog";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Captions, Trash2 } from "lucide-react";

export default function DeleteBlog() {
  const router = useRouter();

  const { id } = router.query;

  const [contentBlog, setContentBlog] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    } else {
      axios.get("/api/blogs?id=" + id).then((response) => {
        setContentBlog(response.data);
      });
    }
  }, [id]);

  function goBack() {
    router.push("/blog");
  }

  async function deleteBlog() {
    await axios.delete("/api/blogs?id=" + id);
    toast.success("delete successfully");
    goBack();
  }

  return (
    <>
      <Head>
        <title>Delete Blog</title>
      </Head>
      <div className="set__content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Delete <span>{contentBlog?.title}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <Captions />
            <span>/</span> <span>Delete Blog</span>
          </div>
        </div>
        <div className="delete__content">
          <div className="delete__content__card">
            <Trash2 size={50} color="#f1d00a" />
            <p className="delete__content__info">Hmm..Yakin Gak?</p>
            <p className="delete__content__desc">
              Kalau kamu hapus konten di website ini, bakal kehapus permanen.
            </p>
            <div className="confirm__button">
              <button onClick={deleteBlog} className="accept__button">
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
