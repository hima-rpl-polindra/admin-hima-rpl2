import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BadgeInfo, Trash2 } from "lucide-react";

export default function DeleteInformation() {
  const router = useRouter();

  const { id } = router.query;

  const [contentInformation, setContentInformation] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    } else {
      axios.get("/api/informations?id=" + id).then((response) => {
        setContentInformation(response.data);
      });
    }
  }, [id]);

  function goBack() {
    router.push("/information");
  }

  async function deletePosting() {
    await axios.delete("/api/informations?id=" + id);
    toast.success("delete successfully");
    goBack();
  }

  return (
    <>
      <Head>
        <title>Delete Informasi</title>
      </Head>
      <div className="set__content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Delete <span>{contentInformation?.title}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <BadgeInfo />
            <span>/</span> <span>Delete Informasi</span>
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
