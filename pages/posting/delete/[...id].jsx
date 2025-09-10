import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SquareLibrary, Trash2 } from "lucide-react";

export default function DeleteProduct() {
  const router = useRouter();

  const { id } = router.query;

  const [contentPosting, setContentPosting] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    } else {
      axios.get("/api/postings?id=" + id).then((response) => {
        setContentPosting(response.data);
      });
    }
  }, [id]);

  function goBack() {
    router.push("/posting");
  }

  async function deletePosting() {
    await axios.delete("/api/postings?id=" + id);
    toast.success("delete successfully");
    goBack();
  }

  return (
    <>
      <Head>
        <title>Delete Posting</title>
      </Head>
      <div className="set__content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Delete <span>{contentPosting?.title}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <SquareLibrary />
            <span>/</span> <span>Delete Posting</span>
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
              <button onClick={deletePosting} className="accept__button">
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
