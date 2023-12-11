"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    name: "ORDERS",
    path: "/orders",
  },
  {
    name: "ITEMS",
    path: "/items",
  },
];

function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row justify-between w-full bg-white items-center px-4 py-2">
      <Image
        src="/images/saltbox-logo.png"
        height={50}
        width={200}
        alt="saltbox logo"
      />

      <div className="flex flex-row gap-x-5 text-primary font-semibold">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={`${
              pathname === route.path ? "border-b-2 border-primary" : ""
            }`}
          >
            {route.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
