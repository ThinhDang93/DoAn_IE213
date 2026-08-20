import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTheLoaiFilter,
  setTrangThaiFilter,
} from "../../../redux/reducers/FilmReducer";
import { getTheLoaiTags } from "../../../utils/filmFilter";

const TRANG_THAI_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "hot", label: "Hot" },
  { value: "dangChieu", label: "Đang chiếu" },
  { value: "sapChieu", label: "Sắp chiếu" },
];

const chipClass = (active) =>
  `px-3 py-1.5 rounded-full text-sm font-medium border transition ${
    active
      ? "bg-blue-600 text-white border-blue-600"
      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
  }`;

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
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {TRANG_THAI_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => dispatch(setTrangThaiFilter(opt.value))}
            className={chipClass(filters.trangThai === opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {theLoaiList.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch(setTheLoaiFilter(""))}
            className={chipClass(filters.theLoai === "")}
          >
            Tất cả thể loại
          </button>
          {theLoaiList.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => dispatch(setTheLoaiFilter(tag))}
              className={chipClass(filters.theLoai === tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilmFilter;
