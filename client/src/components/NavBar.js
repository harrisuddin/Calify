import React, { useState, useEffect } from "react";
import Link from "./Link";
// import { Link as Route } from "react-router-dom";
import ColorRoundButton from "./ColorRoundButton";

const NavBar = () => {
  const [isOpen, setOpen] = useState(false);
  const [notScrolled, setScrolled] = useState(true);

  function isScrolling() {
    setScrolled(window.pageYOffset === 0);
  }

  // This will check if the user has scrolled any amount.
  // If so, set notScrolled to false.
  useEffect(() => {
    function watchScroll() {
      window.addEventListener("scroll", isScrolling);
    }
    watchScroll();
    return () => {
      window.removeEventListener("scroll", isScrolling);
    };
  }, []);

  return (
    <nav
      className={
        "sm:flex sm:justify-between sm:items-center px-2 sm:px-8 sm:py-2 fixed w-full " +
        (notScrolled ? "sm:bg-transparent bg-white" : "bg-white shadow-md")
      }
    >
      <div className="flex items-center justify-between px-2 py-3 sm:p-0">
        <div className="flex items-center">
          {/* <img className="inline w-16 h-16" src={require('../assets/transparent.png')} alt="Memento Logo"/>*/}
          {/* <h1 className="inline text-gray-500 font-bold hover:text-gray-900">
            SpotCal
          </h1> */}
          <Link
            otherClasses=""
            href="#"
            color="gray-500"
            hoverColor="gray-900"
            focusColor="gray-900"
            text="Calify"
          />
        </div>
        <div className="sm:hidden">
          <button
            onClick={() => setOpen(!isOpen)}
            type="button"
            className="block text-gray-500 hover:text-gray-900 focus:text-gray-900 focus:outline-none"
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  fill-rule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fill-rule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {
        <nav
          className={
            "px-4 pt-2 pb-4 sm:flex sm:p-0 items-center " +
            (isOpen ? "block" : "hidden")
          }
        >
          <Link
            otherClasses=""
            href="#"
            color="gray-500"
            hoverColor="gray-900"
            focusColor="gray-900"
            text="Features"
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
        </nav>
      }
    </nav>
  );
};

export default NavBar;
