import Head from "next/head";
import Aos from "@/components/Aos";
export default function Credit() {
  return (
    <>
      <Head>
        <title>Kredit</title>
      </Head>
      <Aos />
      <div className="credit__page">
        <div className="credit__page__content">
          <div className="credit__page__details" data-aos="zoom-out">
            <img
              src="/img/logo-himarpl.png"
              alt="logo-hima-rpl"
              data-aos="flip-left"
              data-aos-easing="ease-out-cubic"
            />
            <div className="w-full" data-aos="fade-up">
              <h2>
                HIMA-RPL <br /> SUBDIVISI TEKNOLOGI 24/25
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
