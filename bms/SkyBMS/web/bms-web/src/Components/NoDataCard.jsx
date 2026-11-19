import React from "react";

const NoDataCard = ({ title, message }) => {
  return (
    <div className="flex justify-center rounded">
      <div className="max-w-sm w-full   rounded-lg p-4">
        <h2 className="text-lg font-bold mb-2 text-red-500">{title}</h2>
        <p className=" text-red-500 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default NoDataCard;
