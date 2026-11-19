import React from "react";

export const Team = (props) => {
  return (
    <div id="team" className="py-20 text-center">
      <div className="container mx-auto">
        <div className="mx-auto mb-10">
          <h2 className="text-4xl font-bold">Meet the Team</h2>
          <p className="text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed
            dapibus leonec.
          </p>
        </div>
        <div className="flex flex-wrap justify-center">
          {props.data
            ? props.data.map((d, i) => (
                <div
                  key={`${d.name}-${i}`}
                  className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 px-4 mb-8"
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={d.img}
                      alt={d.name}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300 ease-in-out">
                      <div className="text-white text-center">
                        <h4 className="text-xl font-bold">{d.name}</h4>
                        <p>{d.job}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : "Loading..."}
        </div>
      </div>
    </div>
  );
};
