import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const ModalConfirm = ({ isOpen, handleClose, title, handleConfirm }) => {
  return (
    <>
      <Modal
        open={isOpen}
        title={
          <span>
            <ExclamationCircleFilled
              style={{ color: "red", marginRight: 8, fontSize: "1.5rem" }}
            />
            Xác nhận
          </span>
        }
        okType="danger"
        onOk={handleConfirm}
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
        Bạn có chắc chắn muốn xóa {title} này không ?
      </Modal>
    </>
  );
};
export default ModalConfirm;
