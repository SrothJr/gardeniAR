import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ExplorePlants from './pages/ExplorePlants';
import PlantDetail from './pages/PlantDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExplorePlants />} />
        <Route path="/plants/:id" element={<PlantDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
