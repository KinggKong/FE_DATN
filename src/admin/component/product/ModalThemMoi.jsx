import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const ModalThemMoi = ({ isOpen, handleClose, title, handleSubmit }) => {
  return (
    <>
      <Modal
        open={isOpen}
        title={
          <span>
            <ExclamationCircleFilled
              style={{ color: "red", marginRight: 8, fontSize: "1.5rem" }}
            />
            Thêm mới {title}
          </span>
        }
        okType="danger"
        onOk={handleSubmit}
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
        <input className="w-full"></input>
      </Modal>
    </>
  );
};
export default ModalThemMoi;
