import React from "react";

export const Services = (props) => {
  return (
    <div id="services" className="py-20 text-center">
      <div className="container mx-auto">
        <div className="mx-auto mb-10">
          <h2 className="text-4xl font-bold">Our Services</h2>
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
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-8"
                >
                  <div className="p-6 border rounded-lg shadow-lg">
                    <i
                      className={`${d.icon} text-5xl text-blue-500 mb-4 mx-auto`}
                    ></i>
                    <div className="service-desc">
                      <h3 className="text-xl font-bold mb-2">{d.name}</h3>
                      <p className="text-gray-700">{d.text}</p>
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
