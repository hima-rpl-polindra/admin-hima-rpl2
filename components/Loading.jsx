import React, { useEffect } from "react";

export default function Loading() {
  useEffect(() => {
    // Add external script after component is mounted
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <dotlottie-player
        src="https://lottie.host/e5d40fe4-e36f-4c34-b438-fa6495043c84/cAlEMYoswG.json"
        background="transparent"
        speed="1"
        style={{ width: "300px", height: "300px" }}
        direction="1"
        playMode="normal"
        loop
        autoplay
      ></dotlottie-player>
    </div>
  );
}
