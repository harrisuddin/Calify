import React from "react";
import NavBar from "../components/NavBar";

export default function Error() {
  // get the error message from the URL
  let error = new URLSearchParams(window.location.search).get("e");

  return (
    <>
      <NavBar/>

      <div className="py-6 px-5 md:px-10 architect h-screen sm:py-24 flex items-center justify-center">
        <div>
          <h1 className="font-bold text-center text-gray-900 text-2xl sm:text-4xl md:text-5xl font-inter leading-tight">
            {error}
          </h1>
        </div>
      </div>
    </>
  );
}
