import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Nav from './components/Nav';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

//Componente que contém as rotas para as páginas do site, além da barra de navegação
//Será exportado para o index.tsx
function App() {
  return (
    <div className="App">
      <Router>
        {<Nav />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/list" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
      <ToastContainer/>
    </div>
  );
}

export default App;