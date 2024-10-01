import { Modal } from "antd";
import { FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";

const ModalEdit2 = ({ isOpen, handleClose, title, handleSubmit, chatLieu }) => {
  const [newChatLieuName, setNewChatLieuName] = useState("");

  const handleConfirmEdit = () => {
    handleSubmit(chatLieu?.id, { tenChatLieuVai: newChatLieuName }); // Cập nhật tên chất liệu vải
  };

  useEffect(() => {
    if (chatLieu) {
      setNewChatLieuName(chatLieu.tenChatLieuVai); // Sử dụng tên chất liệu vải
    }
  }, [chatLieu]);

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
        onChange={(e) => setNewChatLieuName(e.target.value)} // Cập nhật hàm để thay đổi tên chất liệu
        value={newChatLieuName}
        className="w-full border rounded-sm h-8 p-4"
      />
    </Modal>
  );
};

export default ModalEdit2;
