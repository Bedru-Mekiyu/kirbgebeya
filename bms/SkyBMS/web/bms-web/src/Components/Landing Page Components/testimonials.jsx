import React from "react";

export const Testimonials = (props) => {
  return (
    <div id="testimonials" className="py-20">
      <div className="container mx-auto">
        <div className="mx-auto mb-10 text-center">
          <h2 className="text-4xl font-bold">What our clients say</h2>
        </div>
        <div className="flex flex-wrap justify-center">
          {props.data
            ? props.data.map((d, i) => (
                <div
                  key={`${d.name}-${i}`}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-8"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                    <div className="p-4">
                      <div className="flex items-center mb-4">
                        <div className="testimonial-image flex-shrink-0 mr-4">
                          <img
                            src={d.img}
                            alt={d.name}
                            className="rounded-full w-12 h-12 object-cover"
                          />
                        </div>
                        <div className="testimonial-content">
                          <p className="text-gray-700">"{d.text}"</p>
                          <div className="text-sm text-gray-600">
                            {" "}
                            - {d.name}
                          </div>
                        </div>
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
