import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Leader from "./pages/Leader";
import Friends from "./pages/Friends";
import Tasks from "./pages/Tasks";
import AirDrop from "./pages/Airdrop";
import Login from "./pages/Login";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/toplist" element={<Leader />} />
          <Route exact path="/friends" element={<Friends />} />
          <Route exact path="/tasks" element={<Tasks />} />
          <Route exact path="/airdrop" element={<AirDrop />} />
        </Routes>

        <Header />
      </Router>
    </>
  );
}

export default App;
