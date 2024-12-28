import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/projects">Projects</Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
