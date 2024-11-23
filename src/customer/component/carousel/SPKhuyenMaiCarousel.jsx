import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CardItem from "../card/CardItem";

const SPKhuyenMaiCarousel = ({data}) => {

 

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const cardItems = Array.isArray(data) ? data.slice(0, 9) : [];
  console.log("cartitems:",cardItems);

  return (
    <div className="w-[1300px] mx-auto ">
      <Carousel
        className="h-50 mt-1 mb-10"
        responsive={responsive}
        itemClass="carousel-item-padding-20"
        autoPlay={true} 
        autoPlaySpeed={3000}
        infinite={true}
      >
        {cardItems.map((product, index) => (
          <div key={index}>
            <CardItem product={product} key={product.id} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default SPKhuyenMaiCarousel;
