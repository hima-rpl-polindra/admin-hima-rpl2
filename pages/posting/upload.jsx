import Posting from "@/components/Contents/Posting";
import { SquareLibrary } from "lucide-react";
export default function UploadPosting() {
  return (
    <>
      <div className="set__content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Unggah <span>Posting Kegiatan</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <SquareLibrary /> <span>/</span>{" "}
            <span>Unggah Posting Kegiatan</span>
          </div>
        </div>
        <div className="set__content">
          {/* Component Posting */}
          <Posting />
        </div>
      </div>
    </>
  );
}
