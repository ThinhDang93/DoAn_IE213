import { createSlice } from "@reduxjs/toolkit";
import { http } from "../../utils/interceptor";

const initialState = {
  arrFilm: [],
  filmDetail: {},
  filmEdit: {},
};

const FilmReducer = createSlice({
  name: "FilmReducer",
  initialState,
  reducers: {
    setFilmAction: (state, action) => {
      state.arrFilm = action.payload;
    },
    setFilmDetaiAction: (state, action) => {
      state.filmDetail = action.payload;
    },
    setFilmEditAction: (state, action) => {
      state.filmEdit = action.payload;
    },
  },
});

export const { setFilmAction, setFilmDetaiAction, setFilmEditAction } =
  FilmReducer.actions;

export default FilmReducer.reducer;

export const getAllFilmAPIActionThunk = () => {
  return async (dispatch) => {
    const res = await http.get("/api/QuanLyPhim/LayDanhSachPhim");
    const actionPayload = setFilmAction(res.data.content);
    dispatch(actionPayload);
  };
};

export const getFilmDetailbyIDActionThunk = (maPhim) => {
  return async (dispatch) => {
    const res = await http.get(
      `/api/QuanLyPhim/LayThongTinPhim?MaPhim=${maPhim}`
    );
    const action = setFilmDetaiAction(res.data.content);
    dispatch(action);
  };
};

export const getFilmEditlbyIDActionThunk = (maPhim) => {
  return async (dispatch) => {
    const res = await http.get(
      `/api/QuanLyPhim/LayThongTinPhim?MaPhim=${maPhim}`
    );
    const actionThunk = setFilmEditAction(res.data.content);
    dispatch(actionThunk);
  };
};
