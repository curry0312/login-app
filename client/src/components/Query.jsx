import React from "react";
import { Link } from "react-router-dom";

export default function Query({query, linkText, link}) {
  return (
    <div className="flex justify-center gap-5">
      <span className="text-gray-500">{query}</span>
      <Link className="text-red-500 underline hover:text-red-400" to={link}>
        {linkText}
      </Link>
    </div>
  );
}
