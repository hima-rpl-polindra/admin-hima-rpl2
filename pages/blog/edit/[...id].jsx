import Blog from "@/components/Contents/Blog";
import Head from "next/head";
import axios from "axios";
import { useState, useEffect } from "react";
import { Captions } from "lucide-react";
import { useRouter } from "next/router";
import LoginLayout from "@/components/LoginLayout";

export default function EditBlog() {
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
  return (
    <>
      <Head>
        <title>Edit Blog</title>
      </Head>
      <div className="set__content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Edit <span>{contentBlog?.title}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <Captions /> <span>/</span> <span>Edit Blog</span>
          </div>
        </div>
        <div className="mt-3">{contentBlog && <Blog {...contentBlog} />}</div>
      </div>
    </>
  );
}
