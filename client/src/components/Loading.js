import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-green-400 animate-bounce" />
        <div className="w-4 h-4 rounded-full bg-green-400 animate-bounce [animation-delay:-.3s]" />
        <div className="w-4 h-4 rounded-full bg-green-400 animate-bounce [animation-delay:-.5s]" />
      </div>
    </div>
  );
}