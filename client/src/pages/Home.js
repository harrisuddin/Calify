import React, { useState } from "react";
import NavBar from "../components/NavBar";
import ColorRoundButton from "../components/ColorRoundButton";
import Link from "../components/Link";
import Modal from "../components/Modal";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <NavBar>
        <Link
          otherClasses=""
          href="#howtouse"
          color="gray-500"
          hoverColor="gray-900"
          focusColor="gray-900"
          text="How do I use it?"
        />
        {/* <Link
          otherClasses="mt-1 sm:mt-0 sm:ml-2 sm:mr-2"
          href="#"
          color="gray-500"
          hoverColor="gray-900"
          focusColor="gray-900"
          text="About Us"
        /> */}
        <Link
          otherClasses="mt-1 sm:mt-0 sm:mr-2"
          href="#"
          color="gray-500"
          hoverColor="gray-900"
          focusColor="gray-900"
          text="Login"
        />
        <ColorRoundButton
          text="Try it now!"
          textColor="white"
          colorA="brandBlue-A"
          colorB="brandBlue-B"
          otherClasses="mt-1 sm:mt-0 py-2 px-4 inline-block"
          href="#"
        />
        <Link
          otherClasses="mt-1 sm:mt-0 sm:ml-2 cursor-pointer"
          onClick={() => setShowModal(!showModal)}
          color="gray-500"
          hoverColor="gray-900"
          focusColor="gray-900"
          text="Settings"
          ariaLabel="Open the settings menu"
        />
      </NavBar>

      <div className="py-6 px-5 md:px-10 architect h-screen sm:py-24 flex items-center justify-center">
        <div className="">
          <h1 className="font-bold text-center text-gray-900 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-inter leading-tight">
            Connect your Spotify history to your Google calendar.
          </h1>
          <div className="flex items-center justify-center mt-4">
            <ColorRoundButton
              text="Try it now!"
              textColor="white"
              colorA="brandBlue-A"
              colorB="brandBlue-B"
              otherClasses="sm:text-xl py-2 px-4 sm:py-3 sm:px-6"
              href="#"
            />
            <a href='#' className="ml-4 text-gray-500 sm:text-xl border-2 border-solid border-gray-500 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full bg-transparent hover:border-gray-900 hover:text-gray-900 focus:text-gray-900 focus:border-gray-900 focus:outline-none shadow-md transform-up">
              Learn More
            </a>
          </div>
        </div>
      </div>
      <div
        className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden z-0"
        style={{ height: "70px", transform: "translateZ(0)"}}
      >
        <svg
          className="absolute bottom-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon
            className="text-gray-200 fill-current"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
      <div className="pb-32 px-3 sm:px-16 bg-gray-200 h-full">
        <h2
          id="howtouse"
          className="pt-16 text-center font-semibold text-2xl sm:text-3xl"
        >
          How do I use it?
        </h2>
        <div className="steps-container my-12">
          <div className="numberInCircle mx-auto shadow-lg">1</div>
          <h2 className="text-lg sm:text-2xl text-center sm:text-left font-medium p-2">
            Click try it now!
          </h2>
          <div className="mt-8 sm:mt-0 numberInCircle mx-auto shadow-lg">2</div>
          <h2 className="text-lg sm:text-2xl text-center sm:text-left font-medium p-2">
            Sign in with your Spotify and Google account.
          </h2>
          <div className="mt-8 sm:mt-0 numberInCircle mx-auto shadow-lg">3</div>
          <h2 className="text-lg sm:text-2xl text-center sm:text-left font-medium p-2">
            That's it! Your Spotify history will automatically add to your
            Google calendar.
          </h2>
        </div>
      </div>
      <Modal showModal={showModal} setShowModal={setShowModal}/>
    </div>
  );
}
