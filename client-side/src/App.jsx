import "../src/styles/heroComponent.scss";
import "../src/styles/sider.scss";

import Movies from "./components/Movies";
import HeroComponent from "./components/HeroComponent";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sider from "./components/Sider";
function App() {
  return (
    <>
      <BrowserRouter>
        <div className="hero-sider">
          <Sider />
        </div>
        <Routes>
          <Route path="*" element={ <HeroComponent />} />
          <Route path="/" element={<HeroComponent />} />
          <Route path="/search" element={<Movies />} />
        </Routes>
      </BrowserRouter>

      <div></div>
    </>
  );
}

export default App;
