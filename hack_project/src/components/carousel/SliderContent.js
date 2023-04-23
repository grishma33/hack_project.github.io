import React from "react";

const Slidercontent = ({ activeIndex, imageSlider }) => {
    return (
        <section>
            {imageSlider.map((slide, index) => (
                <div
                    key={index}
                    className={
                        index === activeIndex ? "slides active" : "inactive"
                    }
                >
                    <img className="slide-image" src={slide.imagePath} alt="" />
                    <h2 className="slide-title">{slide.title}</h2>
                    <h3 className="slide-text">{slide.subtitle}</h3>
                </div>
            ))}
        </section>
    );
};

export default Slidercontent;
