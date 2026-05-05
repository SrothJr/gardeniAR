import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import ExplorePlants from './pages/ExplorePlants';
import PlantDetail from './pages/PlantDetail';
import Identify from './pages/Identify';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Forum from './pages/forum/Forum';
import PostDetail from './pages/forum/PostDetail';
import CreatePost from './pages/forum/CreatePost';
import Checklist from './pages/Checklist';
import SoilTest from './pages/SoilTest';
import Cart from './pages/Cart';
import Payment from './pages/Payment';

import CareGuides from './pages/CareGuides';
import CareGuideDetail from './pages/CareGuideDetail';
import PlantTracker from './pages/PlantTracker';
import DiseaseDetection from './pages/DiseaseDetection';
import CropSuggestions from './pages/CropSuggestions';
import Companions from './pages/Companions';
import Share from './pages/Share';
import Profile from './pages/Profile';
import Premium from './pages/Premium';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          
          <Route path="/explore" element={
            <Layout>
              <ExplorePlants />
            </Layout>
          } />

          <Route path="/care-guides" element={
            <Layout>
              <CareGuides />
            </Layout>
          } />

          <Route path="/care-guides/:id" element={
            <Layout>
              <CareGuideDetail />
            </Layout>
          } />

          <Route path="/plants/:id" element={
            <Layout>
              <PlantDetail />
            </Layout>
          } />

          <Route path="/identify" element={
            <Layout>
              <Identify />
            </Layout>
          } />

          <Route path="/forum" element={
            <Layout>
              <Forum />
            </Layout>
          } />

          <Route path="/forum/:id" element={
            <Layout>
              <PostDetail />
            </Layout>
          } />

          <Route path="/forum/create" element={
            <Layout>
              <CreatePost />
            </Layout>
          } />

          <Route path="/checklist" element={
            <Layout>
              <Checklist />
            </Layout>
          } />

          <Route path="/soil" element={
            <Layout>
              <SoilTest />
            </Layout>
          } />

          <Route path="/cart" element={
            <Layout>
              <Cart />
            </Layout>
          } />

          <Route path="/payment" element={
            <Layout>
              <Payment />
            </Layout>
          } />

          <Route path="/ar-tracker" element={
            <Layout>
              <PlantTracker />
            </Layout>
          } />

          <Route path="/disease-detection" element={
            <Layout>
              <DiseaseDetection />
            </Layout>
          } />

          <Route path="/crop-suggestions" element={
            <Layout>
              <CropSuggestions />
            </Layout>
          } />

          <Route path="/companions" element={
            <Layout>
              <Companions />
            </Layout>
          } />

          <Route path="/share" element={
            <Layout>
              <Share />
            </Layout>
          } />

          <Route path="/profile" element={
            <Layout>
              <Profile />
            </Layout>
          } />

          <Route path="/premium" element={
            <Layout>
              <Premium />
            </Layout>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
