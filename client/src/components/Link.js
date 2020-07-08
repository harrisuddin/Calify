import React from 'react';

function Link({href, color, hoverColor, focusColor, text, otherClasses}) {
  return (
    <a href={href} className={"ease-transition focus:outline-none block px-2 py-1 font-semibold text-" + color + " hover:text-" + hoverColor + " focus:text-" + focusColor + " " + otherClasses}>
      {text}
    </a>
  )
}

export default Link;