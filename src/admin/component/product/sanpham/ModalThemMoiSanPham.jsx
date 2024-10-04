import { Modal, Row, Col, Input, Switch, Select } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useState } from "react";
const { TextArea } = Input;

const ModalThemMoi = ({ isOpen, handleClose, title, handleSubmit }) => {
  const [newColorName, setNewColorName] = useState();

  const handleConfirmAdd = () => {
    handleSubmit(newColorName);
  };

  return (
    <>
      <Modal
        open={isOpen}
        title={
          <span className="flex">
            <IoMdAddCircleOutline
              style={{ color: "green", marginRight: 8, fontSize: "1.5rem" }}
            />
            Thêm mới {title}
          </span>
        }
        width={1000}
        okType="primary"
        onOk={handleConfirmAdd}
        onCancel={handleClose}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
        keyboard={false}
        maskClosable={false}
      >
        <Row className="flex justify-between mb-3">
          <Col span={11}>
            <label className="text-sm inline-block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Tên sản phẩm
            </label>
            <Input placeholder="Nhập vào tên sản phẩm" />
          </Col>
          <Col span={11}>
            <label className="text-sm block mb-2" htmlFor="">
              Hoạt động
            </label>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked
            />
          </Col>
        </Row>

        <Row className="flex justify-between mb-3">
          <Col span={11}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Thương hiệu
            </label>
            <Select
              showSearch
              style={{
                width: "100%",
              }}
              placeholder="Chọn thương hiệu"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  value: "1",
                  label: "Nike",
                },
                {
                  value: "2",
                  label: "Adidas",
                },
                {
                  value: "3",
                  label: "Puma",
                },
              ]}
            />
          </Col>
          <Col span={11}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Danh mục
            </label>
            <Select
              showSearch
              style={{
                width: "100%",
              }}
              placeholder="Chọn danh mục"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  value: "1",
                  label: "Chạy bộ",
                },
                {
                  value: "2",
                  label: "Gym",
                },
                {
                  value: "3",
                  label: "Bóng rổ",
                },
                {
                  value: "4",
                  label: "Bóng đá",
                },
                {
                  value: "5",
                  label: "Tennis",
                },
              ]}
            />
          </Col>
        </Row>

        <Row className="flex justify-between mb-3">
          <Col span={11}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Chất liệu vải
            </label>
            <Select
              showSearch
              style={{
                width: "100%",
              }}
              placeholder="Chọn chất liệu vải"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  value: "1",
                  label: "Cotton",
                },
                {
                  value: "2",
                  label: "Da",
                },
                {
                  value: "3",
                  label: "Nhung",
                },
              ]}
            />
          </Col>
          <Col span={11}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Chất liệu đế
            </label>
            <Select
              showSearch
              style={{
                width: "100%",
              }}
              placeholder="Chọn chất liệu đế"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  value: "1",
                  label: "Sắt",
                },
                {
                  value: "2",
                  label: "Cao su",
                },
                {
                  value: "3",
                  label: "Nhựa",
                },
                {
                  value: "4",
                  label: "Gỗ",
                },
                {
                  value: "5",
                  label: "Bê tông",
                },
              ]}
            />
          </Col>
        </Row>

        <Row>
          <label className="text-sm block mb-2" htmlFor="">
            Mô tả
          </label>
          <TextArea maxLength={100} placeholder="Mô tả sản phẩm" />
        </Row>
      </Modal>
    </>
  );
};
export default ModalThemMoi;
