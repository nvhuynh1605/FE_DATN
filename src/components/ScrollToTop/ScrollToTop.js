import React, { useState, useEffect } from "react";
import { BsChevronDoubleUp } from "react-icons/bs";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsVisible(scrollTop > 200); // Hiện nút khi cuộn xuống hơn 200px
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            padding: "16px",
            fontSize: "20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        >
          <BsChevronDoubleUp />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
