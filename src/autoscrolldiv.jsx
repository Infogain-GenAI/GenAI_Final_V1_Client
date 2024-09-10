import React, { useRef, useEffect } from "react";
import "./App.css";
import { Popover } from "react-bootstrap";

const AutoScrollDiv = ({ children, popupVisible }) => {
  const divRef = useRef(null);

  useEffect(() => {
    if (!popupVisible && divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [children, popupVisible]);

  return (
    <div
      className={`chatsettingselement ${popupVisible ? "" : "show-scrollbar"}`}
      ref={divRef}
    >
      {children}
    </div>
  );
};

export default AutoScrollDiv;
