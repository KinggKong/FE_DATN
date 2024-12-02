import React, { useEffect, useState } from "react";

import Navigation from "../navigation/Navigation";
import { Outlet } from "react-router-dom";
import HomeFooter from "../footer/HomeFooter";
import useCartStore from "../cart/useCartStore"; 

const App = () => {
  const [searchValue, setSearchValue] = useState("");
  const clearGuestCart = useCartStore((state) => state.clearGuestCart);

  useEffect(() => {
      // Gọi hàm clearGuestCart khi component được render
      clearGuestCart();
  }, [clearGuestCart]); // Chỉ gọi lại nếu clearGuestCart thay đổi

  return (
    <div>
      <Navigation searchValue={searchValue} setSearchValue={setSearchValue}/>
      <Outlet  context={{ searchValue }} />
      <HomeFooter />
    </div>
  );
};

export default App;
