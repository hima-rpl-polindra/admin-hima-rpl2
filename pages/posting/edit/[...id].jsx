import Posting from "@/components/Contents/Posting";
import Head from "next/head";
import { useState, useEffect } from "react";
import { SquareLibrary } from "lucide-react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditPosting() {
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

  return (
    <>
      <Head>
        <title>Edit Posting Kegiatan</title>
      </Head>
      <div className="set__content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Edit <span>{contentPosting?.title}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <SquareLibrary /> <span>/</span> <span>Edit Posting Kegiatan</span>
          </div>
        </div>
        <div className="mt-3">
          {contentPosting && <Posting {...contentPosting} />}
        </div>
      </div>
    </>
  );
}
