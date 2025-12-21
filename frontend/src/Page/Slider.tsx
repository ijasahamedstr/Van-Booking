import Carousel from "react-bootstrap/Carousel";
import { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


import demoVideo from "./Video/Srilanka.mp4";

const slides = [
  { id: 1, src: demoVideo },
  { id: 2, src: demoVideo },
];

function VideoSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  const handleSelect = (selectedIndex: number) => {
    // Pause all videos when slide changes
    videoRefs.current.forEach((video) => {
      if (video) video.pause();
    });

    setActiveIndex(selectedIndex);
  };

  /* ---------- Arrow Styles ---------- */
  const arrowWrapperStyle = {
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
  };

  const arrowIconStyle = {
    width: "26px",
    height: "26px",
    fill: "#fff",
  };

  const PrevArrow = (
    <div style={arrowWrapperStyle}>
      <svg viewBox="0 0 24 24" style={arrowIconStyle}>
        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
      </svg>
    </div>
  );

  const NextArrow = (
    <div style={arrowWrapperStyle}>
      <svg viewBox="0 0 24 24" style={arrowIconStyle}>
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
      </svg>
    </div>
  );

  return (
    <Carousel
      activeIndex={activeIndex}
      onSelect={handleSelect}
      interval={4000}
      pause="hover"
      nextIcon={NextArrow}
      prevIcon={PrevArrow}
      indicators
      slide
    >
      {slides.map((slide, index) => (
        <Carousel.Item key={index}>
          <video
            ref={(el) => {
              if (el) videoRefs.current[index] = el;
            }}
            className="d-block w-100"
            src={slide.src}
            autoPlay={activeIndex === index}
            muted
            loop
            playsInline
            style={{
              maxHeight: "600px",
              objectFit: "cover",
            }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default VideoSlider;
