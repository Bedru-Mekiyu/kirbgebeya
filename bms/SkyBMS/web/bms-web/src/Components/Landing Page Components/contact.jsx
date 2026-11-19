import {
  faFacebook,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const initialState = {
  name: "",
  email: "",
  message: "",
};

export const Contact = (props) => {
  const [{ name, email, message }, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const clearState = () => setState({ ...initialState });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, message);

    // Handle form submission logic here (e.g., using emailjs)
    // Replace the commented-out emailjs code with your actual implementation

    // emailjs
    //   .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", e.target, "YOUR_PUBLIC_KEY")
    //   .then(
    //     (result) => {
    //       console.log(result.text);
    //       clearState();
    //     },
    //     (error) => {
    //       console.log(error.text);
    //     }
    //   );
  };

  return (
    <>
      <div id="contact" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="md:flex md:justify-between">
            <div className="md:w-1/2">
              <div className="section-title mb-8">
                {" "}
                {/* Increase bottom margin */}
                <h2 className="text-3xl font-bold text-blue-600">
                  Get In Touch
                </h2>
                <p className="text-gray-700">
                  Please fill out the form below to send us an email and we will
                  get back to you as soon as possible.
                </p>
              </div>
              <form name="sentMessage" onSubmit={handleSubmit}>
                <div className="md:flex md:space-x-4">
                  <div className="md:w-1/2 mb-4">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Your Name"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:w-1/2 mb-4">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Your Email"
                      required
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <textarea
                    name="message"
                    id="message"
                    className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:border-blue-500"
                    rows="4"
                    placeholder="Your Message"
                    required
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div className="md:w-1/2 self-center ml-10 mt-8 md:mt-0">
              <div className="contact-info">
                <div className="contact-item mb-8">
                  {" "}
                  {/* Increase bottom margin */}
                  <h3 className="text-xl font-bold text-blue-600">
                    Contact Info
                  </h3>
                  <div className="flex items-center text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    <span>
                      Kurtu Commercial Center, 5th Floor, Office No. F509
                    </span>
                  </div>
                </div>
                <div className="contact-item mb-8">
                  {" "}
                  {/* Increase bottom margin */}
                  <div className="flex items-center text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                    <span>+251-974967171</span>
                  </div>
                </div>
                <div className="contact-item mb-8">
                  {" "}
                  {/* Increase bottom margin */}
                  <div className="flex items-center text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    <a href="mailto:info@skylinkict.com">info@skylinkict.com</a>
                  </div>
                </div>
                <div className="social mt-4">
                  <ul>
                    <li className="inline-block mr-2">
                      <a
                        href={props.data ? props.data.facebook : "/"}
                        className="text-gray-700 hover:text-blue-500"
                      >
                        <FontAwesomeIcon icon={faFacebook} size="2x" />
                      </a>
                    </li>
                    <li className="inline-block mr-2">
                      <a
                        href={props.data ? props.data.twitter : "/"}
                        className="text-gray-700 hover:text-blue-500"
                      >
                        <FontAwesomeIcon icon={faTwitter} size="2x" />
                      </a>
                    </li>
                    <li className="inline-block mr-2">
                      <a
                        href={props.data ? props.data.youtube : "/"}
                        className="text-gray-700 hover:text-blue-500"
                      >
                        <FontAwesomeIcon icon={faYoutube} size="2x" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer" className="py-4 bg-gray-800 text-white text-center">
        <div className="container mx-auto">
          <p>
            &copy; {new Date().getFullYear()} Sky Link Technologies PLC. All
            Rights Reserved.
          </p>
        </div>
      </div>
    </>
  );
};
