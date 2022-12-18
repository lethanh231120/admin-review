import React from "react";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { Routes, Route } from "react-router-dom";
import { PrivateRoute, PublicRouter } from "./routers";
import SignUp from "./pages/SignUp";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path='*' element={<PrivateRoute component={Main} />} />
        <Route path='sign-up' element={<PublicRouter component={SignUp} />} />
        <Route path='login' element={<PublicRouter component={SignIn} />} />
      </Routes>
    </div>
  );
}

export default App;
