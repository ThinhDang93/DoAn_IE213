import { createSlice } from "@reduxjs/toolkit";
import { http } from "../../utils/interceptor";

const initialState = {
  System: [],
  System_ShowTime: null,
  Selected_System: null,
  CinemaDetaibyFilm: [],
};

const CinemaSystemReducer = createSlice({
  name: "CinemaSystemReducer",
  initialState,
  reducers: {
    setSystem: (state, action) => {
      state.System = action.payload;
    },

    setShowTime: (state, action) => {
      state.System_ShowTime = action.payload;
      if (action.payload.heThongRapChieu?.length > 0) {
        state.Selected_System = action.payload.heThongRapChieu[0].maHeThongRap;
        state.CinemaDetaibyFilm = action.payload.heThongRapChieu[0].cumRapChieu;
      }
    },

    setSelectedSys: (state, action) => {
      state.Selected_System = action.payload;
      if (state.System_ShowTime) {
        const found = state.System_ShowTime.heThongRapChieu.find(
          (sys) => sys.maHeThongRap === action.payload
        );
        state.CinemaDetaibyFilm = found ? found.cumRapChieu : [];
      }
    },
  },
});

export const { setSystem, setShowTime, setSelectedSys } =
  CinemaSystemReducer.actions;

export default CinemaSystemReducer.reducer;

export const getAllSystemActionThunk = () => {
  return async (dispatch) => {
    const res = await http.get("/api/QuanLyRap/LayThongTinHeThongRap");
    const actionPayload = setSystem(res.data.content);
    dispatch(actionPayload);
  };
};

export const getAllShowTimebyIDActionThunk = (maPhim) => {
  return async (dispatch) => {
    const res = await http.get(
      `/api/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`
    );
    const action = setShowTime(res.data.content);
    dispatch(action);
  };
};
