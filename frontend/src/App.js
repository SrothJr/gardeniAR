import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ExplorePlants from './pages/ExplorePlants';
import PlantDetail from './pages/PlantDetail';
import WeedIdentifier from './components/WeedIdentifier';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExplorePlants />} />
        <Route path="/plants/:id" element={<PlantDetail />} />
        <Route path="/identify" element={<WeedIdentifier />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
