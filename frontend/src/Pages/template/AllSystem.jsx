import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSystemActionThunk,
  setSelectedSys,
} from "../../redux/reducers/CinemaSystemReducer";

const AllSystem = () => {
  const { System, Selected_System } = useSelector(
    (state) => state.CinemaSystemReducer
  );

  const dispatch = useDispatch();

  const getAllSystem = () => {
    const actionThunk = getAllSystemActionThunk();
    dispatch(actionThunk);
  };

  useEffect(() => {
    getAllSystem();
  }, [dispatch]);

  return (
    <div className="space-y-4 container">
      {System?.map((item) => (
        <div
          onClick={() => dispatch(setSelectedSys(item.maHeThongRap))}
          className="flex items-center p-3 rounded-lg cursor-pointer"
        >
          <img
            src={item.logo}
            alt={item.tenHeThongRap}
            className="w-12 h-12 object-contain mr-3"
          />
          <span className="font-medium">{item.tenHeThongRap}</span>
        </div>
      ))}
    </div>
  );
};

export default AllSystem;
