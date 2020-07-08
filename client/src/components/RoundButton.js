import React from "react";

export default function RoundButton({ text, otherClasses, textColor }) {
  // const gradient = {
  //     'background-image': 'linear-gradient(#00bcff, #0092c7)'
  // }

  return (
    <button
      className={
        "text-" +
        textColor +
        " font-bold rounded-full focus:outline-none shadow-sm transform-up ease-transition " +
        otherClasses
      }
    >
      {text}
    </button>
  );
}
