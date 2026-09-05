import React from "react";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/home" className="brand-logo">

      <span className="brand-icon">
        ▶
      </span>

      <span className="brand-text">
        BOOK<span>2</span>WATCH
      </span>

    </Link>
  );
}

export default Logo;