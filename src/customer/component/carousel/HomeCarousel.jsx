import React from "react";
import { Carousel } from "antd";
const contentStyle = {
  margin: 0,
  height: "600px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
  width: "100%",
};

const HomeCarousel = () => (
  <>
    <Carousel
      arrows
      infinite={true}
      autoplay={true}
      speed={500}
      pauseOnHover={false}
    >
      <div>
        <img
          style={contentStyle}
          src="\src\assets\images\carousel\carousel1.jpg"
          alt=""
        />
      </div>
      <div>
        <img
          style={contentStyle}
          src="\src\assets\images\carousel\carousel2.jpg"
          alt=""
        />
      </div>
      <div>
        <img
          style={contentStyle}
          src="\src\assets\images\carousel\carousel3.jpg"
          alt=""
        />
      </div>
      <div>
        <img
          style={contentStyle}
          src="\src\assets\images\carousel\carousel5.jpg"
          alt=""
        />
      </div>
    </Carousel>
  </>
);
export default HomeCarousel;
