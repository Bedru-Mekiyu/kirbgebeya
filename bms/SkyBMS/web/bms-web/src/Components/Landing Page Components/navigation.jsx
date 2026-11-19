import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom"; // Assuming you are using React Router

export const Navigation = (props) => {
  return (
    <nav
      id="menu"
      className=" bg-gradient-to-r from-blue-600 via-blue-400 to-blue-700 shadow-lg "
    >
      <div className="container mx-auto px-6 py-4 ">
        <div className="flex items-center justify-between text-white">
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="block text-gray-400 hover:text-white focus:text-white focus:outline-none md:hidden"
            aria-label="Toggle navigation"
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
              />
            </svg>
          </button>

          {/* Logo or Brand Name */}
          <a href="#page-top" className="text-xl font-semibold text-white">
            SkyBMS
          </a>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#features"
              className="relative text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              <span className="relative">
                Features
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 origin-left"></span>
              </span>
            </a>
            {/* <a
              href="#about"
              className="relative text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              <span className="relative">
                About
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 origin-left"></span>
              </span>
            </a>
            <a
              href="#services"
              className="relative text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              <span className="relative">
                Services
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 origin-left"></span>
              </span>
            </a>
            <a
              href="#portfolio"
              className="relative text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              <span className="relative">
                Gallery
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 origin-left"></span>
              </span>
            </a>
            <a
              href="#testimonials"
              className="relative text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              <span className="relative">
                Testimonials
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 origin-left"></span>
              </span>
            </a>
            <a
              href="#team"
              className="relative text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              <span className="relative">
                Team
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 origin-left"></span>
              </span>
            </a>
            <a
              href="#contact"
              className="relative text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              <span className="relative">
                Contact
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 origin-left"></span>
              </span>
            </a> */}
          </div>

          {/* Sign In Button */}
          <div className="flex md:hidden">
            <Button component={Link} to="/login">
              <span className=" border-x-2 border-y-2 text-white hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                Sign In
              </span>
            </Button>
          </div>
          <div className="hidden md:flex">
            <Button component={Link} to="/login">
              <span className="  border-x-2 border-y-2 text-white hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                Sign In
              </span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
