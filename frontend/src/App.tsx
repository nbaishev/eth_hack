import AppToolbar from './components/UI/AppToolbar/AppToolbar';
import { Route, Routes } from 'react-router-dom';
import Register from './features/users/Register';
import Login from './features/users/Login';
import './App.css';
import Home from './pages/Home.tsx';
import Footer from './components/UI/footer/Footer.tsx';
import GlacierPage from './pages/GlacierPage.tsx';

const App = () => {
  return (
    <>
      <AppToolbar />
      <main>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/glacier/:id" element={<GlacierPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/examples" element={<Home />} />
          <Route path="/calculator" element={<Home />} />
          <Route path="*" element={<h1>Not found</h1>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
