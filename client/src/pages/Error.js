import React from "react";
import NavBar from "../components/NavBar";
import ColorRoundButton from "../components/ColorRoundButton";
import Link from "../components/Link";

export default function Error() {
  // get the error message from the URL
  let error = new URLSearchParams(window.location.search).get("e");

  return (
    <>
      <NavBar>
        <Link
          otherClasses=""
          href="#howtouse"
          color="gray-500"
          hoverColor="gray-900"
          focusColor="gray-900"
          text="How do I use it?"
        />
        <Link
          otherClasses="mt-1 sm:mt-0 sm:ml-2"
          href="#"
          color="gray-500"
          hoverColor="gray-900"
          focusColor="gray-900"
          text="About Us"
        />
        <Link
          otherClasses="mt-1 sm:mt-0 sm:ml-2 sm:mr-2"
          href="#"
          color="gray-500"
          hoverColor="gray-900"
          focusColor="gray-900"
          text="Something"
        />
        <ColorRoundButton
          text="Try it now!"
          textColor="white"
          colorA="brandBlue-A"
          colorB="brandBlue-B"
          otherClasses="mt-1 sm:mt-0 py-2 px-4"
        />
      </NavBar>

      <div className="py-6 px-5 md:px-10 architect h-screen sm:py-24 flex items-center justify-center">
        <div>
          <h1 className="font-bold text-center text-gray-900 text-2xl sm:text-4xl md:text-5xl font-inter leading-tight">
            {error}
          </h1>
          {/* <div className="flex items-center justify-center mt-4">
            <ColorRoundButton
              text="Try it now!"
              textColor="white"
              colorA="brandBlue-A"
              colorB="brandBlue-B"
              otherClasses="sm:text-xl py-2 px-4 sm:py-3 sm:px-6"
            />
            <button className="ml-4 text-gray-500 sm:text-xl border-2 border-solid border-gray-500 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full bg-transparent hover:border-gray-900 hover:text-gray-900 focus:text-gray-900 focus:border-gray-900 focus:outline-none shadow-md transform-up">
              Learn More
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
}
