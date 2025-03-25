import React from "react";

const Footer = () => {
  return (
    <footer className="footer footer-center p-4 shadow-inner">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()}{" "}
          <span className="font-semibold">iStreams Cloud</span>. Designed with
          by ❤️ All rights reserved
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
