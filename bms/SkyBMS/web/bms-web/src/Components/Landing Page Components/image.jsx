import React from "react";

export const Image = ({ title, largeImage, smallImage }) => {
  return (
    <div className="relative">
      <div className="portfolio-item relative">
        <div className="hover:bg-gray-100">
          <a
            href={largeImage}
            title={title}
            data-lightbox-gallery="gallery1"
            className="block"
          >
            <div className="absolute inset-0 flex items-center justify-center hover:text-white transition duration-300 ease-in-out opacity-0 hover:opacity-100">
              <h4 className="text-xl font-bold">{title}</h4>
            </div>
            <img
              src={smallImage}
              className="object-cover w-full h-auto"
              alt={title}
            />
          </a>
        </div>
      </div>
    </div>
  );
};
