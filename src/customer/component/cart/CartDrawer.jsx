import { Space, Button, Drawer } from "antd";
import useCartStore from "./useCartStore";
import CardItemDrawer from "./CardItemDrawer";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const CartDrawer = ({ showDrawer, isOpenDrawer }) => {
  const { cart, removeFromCart, updateCartPrices, clearCart, updateQuantity, fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart(1);
  }
    , []);
  return (
    <Drawer
      title="Giỏ hàng"
      onClose={() => showDrawer(!isOpenDrawer)}
      open={isOpenDrawer}
      width={500}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button type="default" onClick={() => console.log("Xem giỏ hàng")}>
            Xem giỏ hàng
          </Button>
          <Link to={"payment"} >
            <Button type="primary" onClick={() => showDrawer(!isOpenDrawer)}>
              Thanh toán
            </Button>
          </Link>

        </div>
      }
    >
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: "flex",
        }}
      >
        {cart.length > 0 ? (
          cart.map((product) => (
            <CardItemDrawer
              key={product.id}
              product={product}
              onQuantityChange={(id, delta) =>
                updateQuantity(id, delta)
              }
              onRemove={removeFromCart}
            />
          ))
        ) : (
          <p>Giỏ hàng của bạn đang trống</p>
        )}
      </Space>
    </Drawer>
  );
};

export default CartDrawer;
