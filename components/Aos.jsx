import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Aos() {
  // for aos
  useEffect(() => {
    AOS.init();
  }, []);
}
