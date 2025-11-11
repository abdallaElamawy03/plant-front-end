import Register from "./components/Register";
import Login from "./components/Login";
import Community from "./components/Community";
import Dashboard from "./components/Dashboard";
import SoilAnalysis from "./components/SoilAnalysis";
import PlantDiagnosis from "./components/PlantDiagnosis";
import Profile from "./components/Profile";
import Layout from "./components/Layout";
import Editor from "./components/Editor";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";
import Lounge from "./components/Lounge";
import LinkPage from "./components/LinkPage";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import { Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
const roles = {
  Admin: "Admin",
  user: "user",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        {/* alluser allowed public files  */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[roles.Admin, roles.user]} />}
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/soil" element={<SoilAnalysis />} />
            <Route path="/diagnosis" element={<PlantDiagnosis />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/community" element={<Community />} />
          </Route>

          <Route
            element={<RequireAuth allowedRoles={[roles.Editor, roles.Admin]} />}
          >
            <Route path="lounge" element={<Lounge />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
