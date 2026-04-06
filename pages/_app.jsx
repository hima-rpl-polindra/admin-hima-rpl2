import Loading from "@/components/Loading";
import ParentComponent from "@/components/ParentComponent";
import "@/styles/custom.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const authPages = ["/auth/signin", "/auth/signup"];
  const isAuthPage = authPages.includes(router.pathname);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  useEffect(() => {
    if (isAuthPage) {
      setSidebarOpen(false);
    }
  }, [isAuthPage]);

  const contentSidebarOpen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={poppins.className}>
      {loading ? (
        <div className="loading">
          <Loading />
        </div>
      ) : (
        <>
          <SessionProvider session={session}>
            {!isAuthPage && (
              <ParentComponent
                appOpen={sidebarOpen}
                appSidebarOpen={contentSidebarOpen}
              />
            )}
          </SessionProvider>
          <main>
            <div className={sidebarOpen ? "container" : "container active"}>
              <SessionProvider session={session}>
                <Component {...pageProps} />
              </SessionProvider>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
