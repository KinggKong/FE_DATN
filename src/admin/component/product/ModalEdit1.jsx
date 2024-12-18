import { Modal } from "antd";
import { FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";

const ModalEdit1 = ({ isOpen, handleClose, title, handleSubmit, kichthuoc }) => {
  const [newSizeName, setNewSizeName] = useState("");

  const handleConfirmEdit = () => {
    handleSubmit(kichthuoc?.id, { tenKichThuoc: newSizeName.trim() }); // Cập nhật tên kích thước
  };

  useEffect(() => {
    if (kichthuoc) {
      setNewSizeName(kichthuoc.tenKichThuoc); // Sử dụng tên kích thước
    }
  }, [kichthuoc]);

  return (
    <Modal
      open={isOpen}
      title={
        <span className="flex">
          <FaEdit
            style={{ color: "green", marginRight: 8, fontSize: "1.5rem" }}
          />
          Chỉnh sửa {title} {/* Tiêu đề có thể được điều chỉnh nếu cần */}
        </span>
      }
      okType="primary"
      onOk={handleConfirmEdit}
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
      <input
        onChange={(e) => setNewSizeName(e.target.value)} // Thay đổi hàm setNewColorName thành setNewSizeName
        value={newSizeName}
        className="w-full border rounded-sm h-8 p-4"
      />
    </Modal>
  );
};

export default ModalEdit1;

