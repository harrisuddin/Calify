import React, { Component } from "react";
import NavBar from "../components/NavBar";
import ColorRoundButton from "../components/ColorRoundButton";

export default function Home() {
  return (
    <div className="">
      <NavBar />

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
            />
            <button className="ml-4 text-gray-500 sm:text-xl border-2 border-solid border-gray-500 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full bg-transparent hover:border-gray-900 hover:text-gray-900 focus:text-gray-900 focus:border-gray-900 focus:outline-none shadow-md transform-up">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div className="pt-12 pb-32 px-3 sm:px-16 bg-gray-200 h-full">
        <h2 id="howtouse" className="text-center font-semibold text-2xl sm:text-3xl">How do I use it?</h2>
        <div className="steps-container my-12">
          <div className="numberInCircle mx-auto shadow-lg">1</div>
          <h2 className="text-xl sm:text-2xl text-center sm:text-left font-semibold p-2">
            Click try it now!
          </h2>
          <div className="mt-8 sm:mt-0 numberInCircle mx-auto shadow-lg">2</div>
          <h2 className="text-xl sm:text-2xl text-center sm:text-left font-semibold p-2">
            Sign in with your Spotify and Google account.
          </h2>
          <div className="mt-8 sm:mt-0 numberInCircle mx-auto shadow-lg">3</div>
          <h2 className="text-xl sm:text-2xl text-center sm:text-left font-semibold p-2">
            That's it! Your Spotify history will automatically add to your Google calendar.
          </h2>
        </div>
      </div>
    </div>
  );
}
