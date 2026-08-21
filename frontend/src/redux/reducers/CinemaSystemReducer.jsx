import { createSlice } from "@reduxjs/toolkit";
import { http } from "../../utils/interceptor";

const initialState = {
  System_ShowTime: null,
  Selected_System: null,
  CinemaDetaibyFilm: [],
};

const CinemaSystemReducer = createSlice({
  name: "CinemaSystemReducer",
  initialState,
  reducers: {
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

export const { setShowTime, setSelectedSys } = CinemaSystemReducer.actions;

export default CinemaSystemReducer.reducer;

export const getAllShowTimebyIDActionThunk = (maPhim) => {
  return async (dispatch) => {
    const res = await http.get(
      `/api/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`
    );
    const action = setShowTime(res.data.content);
    dispatch(action);
  };
};
