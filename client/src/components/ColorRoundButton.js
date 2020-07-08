import React from 'react';
import RoundButton from './RoundButton';

export default function ColorRoundButton({text, otherClasses, colorA, colorB, textColor}) {
    return (
        //<RoundButton text={text} textColor={textColor} otherClasses={otherClasses + " bg-" + colorA + " hover:bg-" + colorB + " focus:bg-" + colorB}/>
        <button className={
            "text-" +
            textColor +
            " round-button transform-up " +
            otherClasses + " bg-" + colorA + " hover:bg-" + colorB + " focus:bg-" + colorB
        }> 
            {text}
        </button>
    );
}