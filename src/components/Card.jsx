import React from "react";

const Card = ({ icon: Icon, heading, result, bgColor }) => {
  return (
    <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300">
      <div className={`flex items-center justify-center w-14 h-14 rounded-full ${bgColor}`}>
        <Icon className="text-white text-2xl" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{result}</h1>
        <p className="text-gray-500">{heading}</p>
      </div>
    </div>
  );
};

export default Card;
