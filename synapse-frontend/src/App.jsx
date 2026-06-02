import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Manager from './pages/Manager';
import Player from './pages/Player';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;