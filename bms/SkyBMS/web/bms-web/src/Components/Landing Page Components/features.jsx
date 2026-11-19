import React from "react";

export const Features = (props) => {
  return (
    <div id="features" className="py-20 text-center ">
      <div className="container mx-auto">
        <div className="mx-auto mb-10">
          <h2 className="text-4xl font-bold ">Features</h2>
        </div>
        <div className="flex flex-wrap justify-center">
          {props.data
            ? props.data.map((d, i) => (
                <div
                  key={`${d.title}-${i}`}
                  className="w-full sm:w-1/2 md:w-1/4 p-4"
                >
                  <i
                    className={`${d.icon} text-5xl text-blue-500 mb-4 mx-auto`}
                  ></i>
                  <h3 className="text-xl font-bold mb-2">{d.title}</h3>
                  <p className="text-gray-700">{d.text}</p>
                </div>
              ))
            : "Loading..."}
        </div>
      </div>
    </div>
  );
};
