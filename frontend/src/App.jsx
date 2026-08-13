import { useState } from "react";
import Home from "./Pages/Home/Home";
import { navigateHistory } from "./utils/interceptor";
import {
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Detail from "./Pages/Detail/Detail";
import Booking from "./Pages/Booking/Booking";
import Ad_FilmManagement from "./Pages/Admin/Ad_FilmManagement";
import Ad_UserManagement from "./Pages/Admin/Ad_UserManagement";
import AddNewFilm from "./Pages/Admin/AddNewFilm";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import HomeTemplate from "./Pages/template/HomeTemplate";

const queryClient = new QueryClient();
const App = () => {
  return (
    <HistoryRouter history={navigateHistory}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          <Routes>
            <Route index element={<Home />}></Route>
            <Route path="/" element={<HomeTemplate />}>
              <Route path="detail">
                <Route path=":maPhim" element={<Detail />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="booking">
                <Route path=":maLichChieu" element={<Booking />} />
              </Route>
            </Route>
            <Route path="admin/film" element={<Ad_FilmManagement />}></Route>
            <Route path="admin/film/addnew" element={<AddNewFilm />}></Route>
            <Route
              path="admin/film/update/:maPhim"
              element={<AddNewFilm />}
            ></Route>
            <Route path="admin/user" element={<Ad_UserManagement />}></Route>
          </Routes>
        </QueryClientProvider>
      </Provider>
    </HistoryRouter>
  );
};

export default App;
