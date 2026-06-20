import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddTask from "./pages/AddTask";


function App(){

return (

<BrowserRouter>

<Routes>

<Route path="/register" element={<Register />} />

<Route path="/login" element={<Login />} />

<Route path="/" element={<Dashboard />} />

<Route path="/add" element={<AddTask />} />

</Routes>

</BrowserRouter>

)

}

export default App;