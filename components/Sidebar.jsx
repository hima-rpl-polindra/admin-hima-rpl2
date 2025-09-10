import Link from "next/link";
import {
  LayoutDashboard,
  Captions,
  SquareLibrary,
  BadgeInfo,
  FolderCode,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Spinner from "@/components/Spinner";

export default function Sidebar({ sidebarOpen, handleSidebarOpen }) {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  const handleLinkClick = (link) => {
    setActiveLink((prevActive) => (prevActive === link ? null : link));
    setClicked(false);
  };

  useEffect(() => {
    // update active link state when the oage us reloaded
    setActiveLink(router.pathname);
  }, [router.pathname]);


  const { data: session } = useSession();


  if (session) {
    return (
      <>
        <div className={sidebarOpen ? "sidebar__left active" : "sidebar__left"}>
          <ul>
            <Link href="/">
              <li>
                <LayoutDashboard size={30} />
                <span>Dashboard</span>
              </li>
            </Link>
            <li
              className={
                activeLink === "/blog"
                  ? "sidebar__content__position"
                  : "sidebar__content__position"
              }
              onClick={() => handleLinkClick("/blog")}
            >
              <div className="sidebar__icon__position">
                <Captions size={30} />
                <span>Blog</span>
              </div>
              {activeLink === "/blog" && (
                <ul>
                  <Link href="/blog">
                    <li>Semua Blog</li>
                  </Link>
                  <Link href="/blog/draft">
                    <li>Draf Blog</li>
                  </Link>
                  <Link href="/blog/upload">
                    <li>Unggah Blog</li>
                  </Link>
                </ul>
              )}
            </li>
            <li
              className={
                activeLink === "/posting"
                  ? "sidebar__content__position"
                  : "sidebar__content__position"
              }
              onClick={() => handleLinkClick("/posting")}
            >
              <div className="sidebar__icon__position">
                <SquareLibrary size={30} />
                <span>Posting</span>
              </div>
              {activeLink === "/posting" && (
                <ul>
                  <Link href="/posting">
                    <li>Semua Posting Kegiatan</li>
                  </Link>
                  <Link href="/posting/draft">
                    <li>Draf Posting Kegiatan</li>
                  </Link>
                  <Link href="/posting/upload">
                    <li>Unggah Posting Kegiatan</li>
                  </Link>
                </ul>
              )}
            </li>
            <li
              className={
                activeLink === "/information"
                  ? "sidebar__content__position"
                  : "sidebar__content__position"
              }
              onClick={() => handleLinkClick("/information")}
            >
              <div className="sidebar__icon__position">
                <BadgeInfo size={30} />
                <span>Informasi</span>
              </div>
              {activeLink === "/information" && (
                <ul>
                  <Link href="/information">
                    <li>Semua Informasi</li>
                  </Link>
                  <Link href="/information/draft">
                    <li>Draf Informasi</li>
                  </Link>
                  <Link href="/information/upload">
                    <li>Unggah Informasi</li>
                  </Link>
                </ul>
              )}
            </li>
            <Link href="/credit">
              <li
                className={activeLink === "/credit" ? "navactive" : ""}
                onClick={() => {
                  handleLinkClick("/credit");
                }}
              >
                <FolderCode size={30} />
                <span>Kredit</span>
              </li>
            </Link>
          </ul>
          {loading ? (
            <Spinner />
          ) : (
            <button
              className="logout__button"
              onClick={async () => {
                setLoading(true);
                try {
                  await signOut({ redirect: false });
                  // Reset semua state sebelum redirect
                  setLoading(false);
                  setActiveLink("/");
                  setClicked(false);
                  router.push("/auth/signin");
                } catch (error) {
                  console.error("Logout error:", error);
                  setLoading(false);
                }
              }}
            >
              Logout
            </button>
          )}
        </div>
      </>
    );
  }
}
