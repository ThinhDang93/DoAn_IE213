import { configureStore } from "@reduxjs/toolkit";
import FilmReducer from "./reducers/FilmReducer";
import CinemaSystemReducer from "./reducers/CinemaSystemReducer";
import BookingReducer from "./reducers/BookingReducer";

export const store = configureStore({
  reducer: {
    FilmReducer,
    CinemaSystemReducer,
    BookingReducer,
  },
});
