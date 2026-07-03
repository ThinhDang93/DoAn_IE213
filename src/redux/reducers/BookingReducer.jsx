import { createSlice } from "@reduxjs/toolkit";
import { http } from "../../utils/interceptor";

const initialState = {
  thongTinPhim: {},
  danhSachGhe: [],
  gheDangChon: [],
};

const BookingReducer = createSlice({
  name: "BookingReducer",
  initialState,
  reducers: {
    setInFoFilmAction: (state, action) => {
      state.thongTinPhim = action.payload.thongTinPhim;
      state.danhSachGhe = action.payload.danhSachGhe;
    },
    toggleSeat: (state, action) => {
      const maGhe = action.payload;
      if (state.gheDangChon.includes(maGhe)) {
        state.gheDangChon = state.gheDangChon.filter((g) => g !== maGhe);
      } else {
        state.gheDangChon.push(maGhe);
      }
    },
    clearSeat: (state) => {
      state.gheDangChon = [];
    },
  },
});

export const { setInFoFilmAction, toggleSeat, clearSeat } =
  BookingReducer.actions;

export default BookingReducer.reducer;

export const getAllBookingDatabyIDActionThunk = (maLichChieu) => {
  return async (dispatch) => {
    const res = await http.get(
      `/api/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`
    );
    const action = setInFoFilmAction(res.data.content);
    dispatch(action);
  };
};
