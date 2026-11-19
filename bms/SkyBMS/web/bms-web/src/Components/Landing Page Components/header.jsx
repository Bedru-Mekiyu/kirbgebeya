import React from "react";

export const Header = (props) => {
  return (
    <header
      id="header"
      className="relative bg-cover bg-center bg-gradient-to-r from-blue-600 via-blue-400 to-blue-700 text-white overflow-hidden"
    >
      <div className="absolute "></div>
      <div className="container mx-auto px-6 py-32">
        <div className="md:w-3/4 mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            {props.data ? props.data.title : "Loading"}
          </h2>
          <p className="text-lg mb-8">
            {props.data ? props.data.paragraph : "Loading"}
          </p>
          <a
            href="#features"
            className="bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 py-3 px-8 rounded-full uppercase tracking-wider text-sm font-semibold shadow-lg transition duration-300 ease-in-out inline-block"
          >
            Learn More
          </a>{" "}
        </div>
      </div>
    </header>
  );
};
