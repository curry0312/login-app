import { Routes, Route } from "react-router-dom";
import Username from "./pages/Username";
import Register from "./pages/Register";
import Password from "./pages/Password";
import Profile from "./pages/Profile";
import Recovery from "./pages/Recovery";
import Reset from "./pages/Reset";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Username />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/password" element={<Password />}/>
        <Route path="/Profile" element={<Profile />}/>
        <Route path="/Recovery" element={<Recovery />}/>
        <Route path="/Reset" element={<Reset />}/>
        <Route path="/*" element={<PageNotFound />}/>
      </Routes>
    </div>
  );
}

export default App;
