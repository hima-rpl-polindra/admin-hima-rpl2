import Information from "@/components/Contents/Information";
import Head from "next/head";
import { useState, useEffect } from "react";
import { BadgeInfo } from "lucide-react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditInformation() {
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

  return (
    <>
      <Head>
        <title>Edit Informasi</title>
      </Head>
      <div className="set__content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Edit <span>{contentInformation?.title}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <BadgeInfo /> <span>/</span> <span>Edit Informasi</span>
          </div>
        </div>
        <div className="mt-3">
          {contentInformation && <Information {...contentInformation} />}
        </div>
      </div>
    </>
  );
}
