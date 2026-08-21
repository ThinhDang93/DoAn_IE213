import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSys } from "../../redux/reducers/CinemaSystemReducer";

const AllSystem = () => {
  const { System_ShowTime, Selected_System } = useSelector(
    (state) => state.CinemaSystemReducer
  );

  const dispatch = useDispatch();

  const systems = System_ShowTime?.heThongRapChieu || [];

  return (
    <div className="space-y-2 container">
      {systems.map((item) => {
        const isActive = item.maHeThongRap === Selected_System;

        return (
          <div
            key={item.maHeThongRap}
            onClick={() => dispatch(setSelectedSys(item.maHeThongRap))}
            className={`flex items-center p-3 rounded-lg cursor-pointer border transition ${
              isActive
                ? "bg-blue-50 border-blue-500 shadow-sm"
                : "bg-gray-50 border-transparent hover:bg-gray-100"
            }`}
          >
            <img
              src={item.logo}
              alt={item.tenHeThongRap}
              className="w-12 h-12 object-contain mr-3"
            />
            <span
              className={`font-medium ${
                isActive ? "text-blue-700" : "text-gray-800"
              }`}
            >
              {item.tenHeThongRap}
            </span>
          </div>
        );
      })}
    </div>
  );
};


export default AllSystem;
