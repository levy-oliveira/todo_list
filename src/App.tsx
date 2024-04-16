import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Nav from './components/Nav';

//Componente que contém as rotas para as páginas do site, além da barra de navegação
//Será exportado para o index.tsx
function App() {
  return (
    <div className="App">
      <Router>
        {<Nav />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;