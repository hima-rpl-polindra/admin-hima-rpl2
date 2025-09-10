import { useState } from "react";
import { useSession } from "next-auth/react";
import { AlignRight, Minimize, Maximize } from "lucide-react";
import Link from "next/link";

export default function Header({ handleSidebarOpen }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const { data: session } = useSession();

  return (
    <>
      <header className="header">
        <div className="logo">
          {session && <h1>Admin</h1>}
          {session && (
            <div className="sidebar__open" onClick={handleSidebarOpen}>
              <AlignRight />
            </div>
          )}
        </div>
        <div className="mize">
          <div onClick={toggleFullScreen}>
            {isFullscreen ? <Minimize /> : <Maximize />}
          </div>
        </div>
      </header>
    </>
  );
}
