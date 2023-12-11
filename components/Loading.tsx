import Image from "next/image";
import React from "react";

function Loading() {
  return (
    <div className="z-50 flex h-screen w-screen items-center justify-center bg-white">
      <div className="relative flex flex-col items-center justify-center">
        <Image
          src="/images/saltbox-logo.png"
          height={50}
          width={200}
          alt="saltbox logo"
          className="logo-animation"
        />
      </div>
    </div>
  );
}

export default Loading;
