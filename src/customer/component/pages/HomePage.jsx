import React from "react";

import Navigation from "../navigation/Navigation";
import { Outlet } from "react-router-dom";
import HomeFooter from "../footer/HomeFooter";

const App = () => {
  return (
    <div>
      <Navigation />
      <Outlet />
      <HomeFooter />
    </div>
  );
};

export default App;
