import logo from './logo.svg';
import Company from "./pages/company/Company"
import Mapping from "./pages/mapping/Mapping"
import Landing from "./pages/landing/Landing"
import Login from "./pages/login/Login"

import './App.css';

import {
  BrowserRouter,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";

function Navbar() {
  function NavItem({name,path}) {
    return <li className="Navitem">
      <a className="Navitem" href={path}>
      <h1>{name}</h1>
      </a>
    </li>
  }

  return (
    <ul className="Navbar">
      <NavItem name="Company" path="/company"/>
      <NavItem name="Sign In" path="/sign_in"/>
      <NavItem name="Pricing" path="/pricing"/>
    </ul>
  )
}

function App() {
  return (
    <div className="app">
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/mapping" element={<Mapping/>}/>
          <Route path="/company" element={<Company/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
