import { Modal } from "antd";
import { FaEdit } from "react-icons/fa";
import { useState,useEffect } from "react";

const ModalEditBrand = ({ isOpen, handleClose, title, handleSubmit, thuonghieu }) => {
  const [newThuongHieuName, setNewThuongHieuName] = useState("");

  const handleConfirmEdit = () => {
    handleSubmit(thuonghieu?.id, { tenThuongHieu: newThuongHieuName });
  };

  useEffect(() => {
    if (thuonghieu) {
      setNewThuongHieuName(thuonghieu.tenThuongHieu); 
    }
  }, [thuonghieu]);

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
          onChange={(e) => setNewThuongHieuName(e.target.value)}
          value={newThuongHieuName}
          className="w-full border rounded-sm h-8 p-4"
        ></input>
      </Modal>
    </>
  );
};
export default ModalEditBrand;
