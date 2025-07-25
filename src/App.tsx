import Home from "./pages/Home";
import { Navigate, Route, Routes, Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import SlideBar from "./components/SlideBar";
import UserPage from "./pages/UserPage";
import Users from "./pages/Users";
import { logoutUser } from "./redux/userRedux";
import jwt_decode from "jwt-decode";
import Products from "./pages/Products";
import { useState, useEffect } from "react";
import MessageComponent from "./components/MesageComponent";
import Orders from "./pages/Orders";
import Invoice from "./pages/Invoice";
import Annoucment from "./pages/Annoucment";
import { RootState } from "./redux/store"; // Adjust path based on your structure

interface JwtPayload {
  exp: number;
}

// Only allows access if not logged in
function IsLogedin() {
  const user = useSelector((state: RootState) => state.user.currentUser);
  return user ? <Navigate to="/" /> : <Outlet />;
}

// Protects private routes
function PrivateRoute() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);

  if (!user?.accessToken) return <Navigate to="/login" />;

  try {
    const decoded = jwt_decode<JwtPayload>(user.accessToken);
    if (decoded.exp * 1000 < Date.now()) {
      dispatch(logoutUser());
      return <Navigate to="/login" />;
    }
  } catch (err) {
    console.error(err);
    dispatch(logoutUser());
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

function App() {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [isSlideBarOpen, setIsSlideBarOpen] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    setIsSlideBarOpen(false);
  }, [location.pathname]);

  return (
    <>
      {user && (
        <Navbar setSideBar={setIsSlideBarOpen} isOpen={isSlideBarOpen} />
      )}
      <div style={{ height: "100vh" }}>
        {user && <SlideBar isOpen={isSlideBarOpen} />}
        <Routes>
          <Route element={<IsLogedin />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<Users />} />
            <Route path="/user/:id" element={<UserPage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<Invoice />} />
            <Route path="/announcment" element={<Annoucment />} />
          </Route>
        </Routes>
        <MessageComponent />
      </div>
    </>
  );
}

export default App;
