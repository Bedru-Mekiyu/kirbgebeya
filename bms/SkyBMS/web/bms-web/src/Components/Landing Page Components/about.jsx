import React from "react";

export const About = (props) => {
  return (
    <div id="about" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <img
              src="img/about.jpg"
              className="w-full rounded-lg shadow-lg"
              alt="About Us"
            />
          </div>
          <div className="w-full md:w-1/2">
            <div className="about-text">
              <h2 className="text-3xl font-bold mb-4">About Us</h2>
              <p className="text-gray-800 mb-4">
                {props.data ? props.data.paragraph : "loading..."}
              </p>
              <h3 className="text-xl font-bold mb-2">Why Choose Us?</h3>
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 mb-4">
                  <ul className="list-disc list-inside">
                    {props.data
                      ? props.data.Why.map((d, i) => (
                          <li key={`${d}-${i}`} className="text-gray-800">
                            {d}
                          </li>
                        ))
                      : "loading"}
                  </ul>
                </div>
                <div className="w-full md:w-1/2 mb-4">
                  <ul className="list-disc list-inside">
                    {props.data
                      ? props.data.Why2.map((d, i) => (
                          <li key={`${d}-${i}`} className="text-gray-800">
                            {d}
                          </li>
                        ))
                      : "loading"}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
