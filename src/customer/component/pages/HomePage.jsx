import React, { useState } from "react";

import Navigation from "../navigation/Navigation";
import { Outlet } from "react-router-dom";
import HomeFooter from "../footer/HomeFooter";

const App = () => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <div>
      <Navigation searchValue={searchValue} setSearchValue={setSearchValue}/>
      <Outlet  context={{ searchValue }} />
      <HomeFooter />
    </div>
  );
};

export default App;
