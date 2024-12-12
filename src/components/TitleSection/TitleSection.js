import React from "react";
import { Link } from "react-router-dom";

function TitleSection({ title, dataCategory }) {

  return (
    <div className="flex justify-between mb-2 px-0 items-center">
      <h1 className="font-semibold text-2xl">{title}</h1>
      <div className="link-title font-medium text-base text-[#002868]">
        <Link to={`/category?tab=${dataCategory?._id}`}>See more</Link>
      </div>
    </div>
  );
}

export default TitleSection;
