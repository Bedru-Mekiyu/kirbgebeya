import React from "react";
import { Image } from "./image"; // Assuming Image is imported correctly and capitalized

export const Gallery = (props) => {
  return (
    <div id="portfolio" className="py-20 text-center">
      <div className="container mx-auto">
        <div className="mx-auto mb-10">
          <h2 className="text-4xl font-bold">Gallery</h2>
          <p className="text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed
            dapibus leonec.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`}>
                  <Image
                    title={d.title}
                    largeImage={d.largeImage}
                    smallImage={d.smallImage}
                  />
                </div>
              ))
            : "Loading..."}
        </div>
      </div>
    </div>
  );
};
