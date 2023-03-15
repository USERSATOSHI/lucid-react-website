import "./App.css";
import "./components/default/index.css";
import Master from "./components/master/index.js";
import Navbar from "./components/nav/index.js";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/index.js";
import Search from "./pages/search/index.js";
function App() {
    return (
        <div className="App">
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search /> } />
                    {/* <Route path="/profile" element={<Profile />} /> */}
                </Routes>
            </div>
            <Master />
        </div>
    );
}

export default App;
