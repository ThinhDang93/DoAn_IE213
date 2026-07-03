import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFilmAPIActionThunk } from "../../../redux/reducers/FilmReducer";
import { NavLink } from "react-router-dom";
import { http } from "../../../utils/interceptor";
import { DeleteFilmAPI } from "../../../API/APIFilm";

const MovieManager = () => {
  const { arrFilm } = useSelector((state) => state.FilmReducer);

  const dispatch = useDispatch();

  const getAllfilm = () => {
    const action = getAllFilmAPIActionThunk();
    dispatch(action);
  };

  useEffect(() => {
    getAllfilm();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản lý phim</h2>
        <NavLink
          to={"/admin/film/addnew"}
          className={
            "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          }
        >
          + Thêm phim
        </NavLink>
      </div>

      {/* Thanh search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm phim..."
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border rounded-lg">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Mã phim</th>
              <th className="px-4 py-3">Hình ảnh</th>
              <th className="px-4 py-3">Tên phim</th>
              <th className="px-4 py-3">Mô tả</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {arrFilm?.map((item) => (
              <tr key={item.maPhim} className="border-b">
                <td className="px-4 py-3">{item.maPhim}</td>
                <td className="px-4 py-3">
                  <img
                    src={item.hinhAnh}
                    alt={item.tenPhim}
                    className="w-full h-24 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3">{item.tenPhim}</td>
                <td className="px-4 py-3">{item.moTa}</td>
                <td className="px-4 py-3 space-x-2">
                  <div className="flex">
                    <NavLink
                      to={`/admin/film/update/${item.maPhim}`}
                      className="text-green-700 hover:text-white  border-2 border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                    >
                      Cập nhật
                    </NavLink>
                    <button
                      type="button"
                      className="text-red-700 hover:text-white border-2 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                      onClick={async () => {
                        if (
                          window.confirm("Bạn có muốn xoá phim này không ?")
                        ) {
                          await DeleteFilmAPI(item.maPhim);
                          await getAllfilm();
                        }
                      }}
                    >
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovieManager;
