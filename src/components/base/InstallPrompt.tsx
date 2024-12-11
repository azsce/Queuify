"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button{" "}
          <Image
            src="/share-icon.png"
            alt="share icon"
            width={20}
            height={20}
            style={{ verticalAlign: "middle" }}
          />
          and then &quot;Add to Home Screen&quot;
          <Image
            src="/plus-icon.png"
            alt="plus icon"
            width={20}
            height={20}
            style={{ verticalAlign: "middle" }}
          />
          .
        </p>
      )}
    </div>
  );
}

export default InstallPrompt;
