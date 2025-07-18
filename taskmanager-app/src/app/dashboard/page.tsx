import React from "react";

const page = () => {
  return (
    <div>
      <div className="bg-white">
        <div className="container px-6 md:px-20 mx-auto md:w-3/4">
          <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl">
            Dashboard
          </h1>

          <div className="grid grid-cols-1 gap-8 mt-6 xl:mt-12 xl:gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="w-full p-8 space-y-8 text-center bg-blue-300 rounded-lg">
              <p className="font-medium uppercase">Projects</p>
              <h2 className="text-5xl font-bold uppercase">20</h2>
              <p className="font-medium">Per month</p>
            </div>

            <div className="w-full p-8 space-y-8 text-center bg-blue-300 rounded-lg">
              <p className="font-medium uppercase">Tasks</p>
              <h2 className="text-5xl font-bold uppercase">30</h2>
              <p className="font-medium">Per month</p>
            </div>

            <div className="w-full p-8 space-y-8 text-center bg-blue-300 rounded-lg">
              <p className="font-medium uppercase">Users</p>
              <h2 className="text-5xl font-bold uppercase">50</h2>
              <p className="font-medium">Per month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
