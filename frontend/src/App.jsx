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
import Profile from "./Pages/Profile/Profile";
import Ad_FilmManagement from "./Pages/Admin/Ad_FilmManagement";
import Ad_UserManagement from "./Pages/Admin/Ad_UserManagement";
import Ad_CinemaManagement from "./Pages/Admin/Ad_CinemaManagement";
import Ad_ShowtimeManagement from "./Pages/Admin/Ad_ShowtimeManagement";
import Ad_BookingManagement from "./Pages/Admin/Ad_BookingManagement";
import AddNewFilm from "./Pages/Admin/AddNewFilm";
import AddNewUser from "./Pages/Admin/AddNewUser";
import AddNewShowtime from "./Pages/Admin/AddNewShowtime";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import HomeTemplate from "./Pages/template/HomeTemplate";
import ProtectedRoute from "./utils/ProtectedRoute";

const queryClient = new QueryClient();

const adminOnly = (element) => (
  <ProtectedRoute roles={["QuanTri"]}>{element}</ProtectedRoute>
);

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
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="admin/film" element={adminOnly(<Ad_FilmManagement />)} />
            <Route
              path="admin/film/addnew"
              element={adminOnly(<AddNewFilm />)}
            />
            <Route
              path="admin/film/update/:maPhim"
              element={adminOnly(<AddNewFilm />)}
            />

            <Route path="admin/user" element={adminOnly(<Ad_UserManagement />)} />
            <Route
              path="admin/user/addnew"
              element={adminOnly(<AddNewUser />)}
            />
            <Route
              path="admin/user/update/:taiKhoan"
              element={adminOnly(<AddNewUser />)}
            />

            <Route
              path="admin/cinema"
              element={adminOnly(<Ad_CinemaManagement />)}
            />

            <Route
              path="admin/showtime"
              element={adminOnly(<Ad_ShowtimeManagement />)}
            />
            <Route
              path="admin/showtime/addnew"
              element={adminOnly(<AddNewShowtime />)}
            />
            <Route
              path="admin/showtime/update/:maLichChieu"
              element={adminOnly(<AddNewShowtime />)}
            />

            <Route
              path="admin/booking"
              element={adminOnly(<Ad_BookingManagement />)}
            />
          </Routes>
        </QueryClientProvider>
      </Provider>
    </HistoryRouter>
  );
};

export default App;
