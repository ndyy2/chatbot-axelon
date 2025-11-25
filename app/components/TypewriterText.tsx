import React, { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  text: string;
}

export const TypewriterText = ({ text }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const index = useRef(0);

  useEffect(() => {
    index.current = 0;
    setDisplayedText("");

    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
        if (index.current < text.length) {
          const newText = prev + text.charAt(index.current);
          index.current++;
          return newText;
        } else {
          clearInterval(intervalId);
          return prev;
        }
      });
    }, 12);

    return () => clearInterval(intervalId);
  }, [text]);

  return <span>{displayedText}</span>;
};
