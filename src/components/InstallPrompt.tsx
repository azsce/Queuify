"use client";

import React, { useEffect, useState } from "react";

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
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
          <img
            src="share-icon.png"
            alt="share icon"
            style={{ verticalAlign: "middle" }}
          />
          and then "Add to Home Screen"
          <img
            src="plus-icon.png"
            alt="plus icon"
            style={{ verticalAlign: "middle" }}
          />
          .
        </p>
      )}
    </div>
  );
}

export default InstallPrompt;
