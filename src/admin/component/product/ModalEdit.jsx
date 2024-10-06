import { Modal } from "antd";
import { FaEdit } from "react-icons/fa";
import { useState,useEffect } from "react";

const ModalEdit = ({ isOpen, handleClose, title, handleSubmit, mausac }) => {
  const [newColorName, setNewColorName] = useState("");

  const handleConfirmEdit = () => {
    handleSubmit(mausac?.id, { tenMau: newColorName });
  };

  useEffect(() => {
    if (mausac) {
      setNewColorName(mausac.tenMau); 
    }
  }, [mausac]);

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
          onChange={(e) => setNewColorName(e.target.value)}
          value={newColorName}
          className="w-full border rounded-sm h-8 p-4"
        ></input>
      </Modal>
    </>
  );
};
export default ModalEdit;

