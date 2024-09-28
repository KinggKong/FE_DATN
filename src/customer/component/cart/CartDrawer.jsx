import { Space, Button, Drawer } from "antd";
import { fake_product } from "../../data/fake_product";
import CardItemDrawer from "./CardItemDrawer";

const CartDrawer = ({ showDrawer, isOpenDrawer }) => {
  const item = fake_product.slice(0, 4);
  console.log([...item]);
  return (
    <>
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
            <Button type="primary" onClick={() => console.log("Thanh toán")}>
              Thanh toán
            </Button>
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
          <CardItemDrawer />
          <CardItemDrawer />
          <CardItemDrawer />
          <CardItemDrawer />
        </Space>
      </Drawer>
    </>
  );
};
export default CartDrawer;
