import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const PaymentSuccess = () => {
    const [showCard, setShowCard] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowCard(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center px-4 py-24">
                <div
                    className={`max-w-lg w-full bg-white rounded-3xl shadow-2xl p-12 text-center transform transition-all duration-700 ${showCard ? "opacity-100 scale-100" : "opacity-0 scale-90"
                        }`}
                >
                    {/* Illustration */}
                    <div className="w-32 h-32 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-5xl animate-bounce">🎉</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Success! Your Payment is Complete
                    </h1>

                    {/* Subtext */}
                    <p className="text-gray-700 text-lg mb-10">
                        We appreciate your contribution. Your support helps us reach more people and make a real impact.
                        <br />
                        You can track your donation status from your account.
                    </p>

                    {/* Call-to-Action */}
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-2xl shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        Go to Dashboard <FaArrowRight className="ml-3" />
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
