import Information from "@/components/Contents/Information";
import { BadgeInfo } from "lucide-react";
export default function UploadInformation() {
  return (
    <>
      <div className="set__content__page">
        <div className="title__dashboard">
          <div>
            <h2>
              Unggah <span>Informasi</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="marker">
            <BadgeInfo /> <span>/</span> <span>Unggah Informasi</span>
          </div>
        </div>
        <div className="set__content">
          {/* Component Information */}
          <Information />
        </div>
      </div>
    </>
  );
}
