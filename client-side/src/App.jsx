import "../src/styles/Allcomponent.scss";



import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/UserDashboard";
import DriverDashboard from "./components/DriverDashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="hero-sider">
        </div>
        <Routes>
          <Route path="*" element={<Login/>} />
          <Route path="/" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/user-dashboard" element={<UserDashboard/>} />
          <Route path="/driver-dashboard" element={<DriverDashboard/>} />
         
        </Routes>
      </BrowserRouter>

      <div></div>
    </>
  );
}

export default App;
