import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../src/app/globals.css";

// Définissez une interface pour le type d'objet dans le tableau images
interface Image {
  src: string;
  alt: string;
}

interface CarrouselleProps {
  images: Image[];
}

const Carrouselle: React.FC<CarrouselleProps> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {images.map((image: Image, index: number) => (
        <div key={index}>
          <img src={image.src} alt={image.alt} style={{ width:"100%",height:"650px" }} />
        </div>
      ))}
    </Slider> 
  );
};

export default Carrouselle;
