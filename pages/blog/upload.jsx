import Blog from "@/components/Contents/Blog";
import { Captions } from 'lucide-react';
import Head from "next/head";
export default function UploadBlog() {
  return (
    <>
      <div className="set__content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Unggah <span>Blog</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <Captions /> <span>/</span> <span>Unggah Blog</span>
          </div>
        </div>
        <div className="set__content">
          {/* Component Blog */}
          <Blog />
        </div>
      </div>
    </>
  );
}
