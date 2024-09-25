import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const ModalConfirm = ({ isOpen, handleClose, title, handleConfirm }) => {
  const handleOk = () => {
    // Hiển thị modal xác nhận khi nhấn OK
    Modal.confirm({
      title: "Bạn có chắc chắn?",
      content: "Bạn có chắc muốn thực hiện hành động này?",
      onOk() {
        console.log("Xác nhận hành động thành công");
        handleConfirm();
        handleClose();
      },
      onCancel() {
        console.log("Hủy hành động");
      },
    });
  };
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
        onOk={handleOk}
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
