import { Modal } from "antd";
import { FaEdit } from "react-icons/fa";
import { useState,useEffect } from "react";

const ModalEditCategory = ({ isOpen, handleClose, title, handleSubmit, danhmuc }) => {
  const [newDanhMucName, setNewDanhMucName] = useState("");

  const handleConfirmEdit = () => {
    handleSubmit(danhmuc?.id, { tenDanhMuc: newDanhMucName });
  };

  useEffect(() => {
    if (danhmuc) {
      setNewDanhMucName(danhmuc.tenDanhMuc); 
    }
  }, [danhmuc]);

  return (
    <>
      <Modal
        open={isOpen}
        title={
          <span className="flex">
            <FaEdit
              style={{ color: "green", marginRight: 8, fontSize: "1.5rem" }}
            />
            Chỉnh sửa {title}
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
          onChange={(e) => setNewDanhMucName(e.target.value)}
          value={newDanhMucName}
          className="w-full border rounded-sm h-8 p-4"
        ></input>
      </Modal>
    </>
  );
};
export default ModalEditCategory;
