import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Search from './pages/Search';
import CareerPath from './pages/CareerPath';
import MapPage from './pages/Map';
import Accessible from './pages/Accessible';
import SkillCard from './pages/SkillCard';
import Admin from './pages/Admin';
import Audit from './pages/Audit';
import Login from './pages/Login';
import Clusters from './pages/Clusters';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/career-path" element={<CareerPath />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/accessible" element={<Accessible />} />
        <Route path="/skillcard" element={<SkillCard />} />
        <Route path="/clusters" element={<Clusters />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}
