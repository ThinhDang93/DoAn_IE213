import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTheLoaiFilter,
  setTrangThaiFilter,
} from "../../../redux/reducers/FilmReducer";
import { getTheLoaiTags } from "../../../utils/filmFilter";

const TRANG_THAI_OPTIONS = [
  { value: "all", label: "Trạng thái chiếu" },
  { value: "hot", label: "Hot" },
  { value: "dangChieu", label: "Đang chiếu" },
  { value: "sapChieu", label: "Sắp chiếu" },
];

const selectClass =
  "pl-4 pr-4 py-2 min-w-[180px] rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer";

const FilmFilter = () => {
  const dispatch = useDispatch();
  const { arrFilm, filters } = useSelector((state) => state.FilmReducer);

  const theLoaiList = useMemo(() => {
    const set = new Set();
    arrFilm?.forEach((movie) => {
      getTheLoaiTags(movie.theLoai).forEach((tag) => set.add(tag));
    });
    return Array.from(set).sort();
  }, [arrFilm]);

  if (!arrFilm || arrFilm.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filters.theLoai}
          onChange={(e) => dispatch(setTheLoaiFilter(e.target.value))}
          className={selectClass}
        >
          <option value="">Chọn thể loại phim</option>
          {theLoaiList.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <select
          value={filters.trangThai}
          onChange={(e) => dispatch(setTrangThaiFilter(e.target.value))}
          className={selectClass}
        >
          {TRANG_THAI_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilmFilter;
