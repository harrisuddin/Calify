import React from "react";

export default function ColorRoundButton({
  text,
  otherClasses,
  colorA,
  colorB,
  textColor,
  href,
}) {
  return (
    <a
      href={href}
      className={
        "text-" +
        textColor +
        " round-button transform-up " +
        otherClasses +
        " bg-" +
        colorA +
        " hover:bg-" +
        colorB +
        " focus:bg-" +
        colorB
      }
    >
      {text}
    </a>
  );
}
