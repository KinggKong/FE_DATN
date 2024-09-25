import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useState } from "react";

const ModalThemMoi = ({ isOpen, handleClose, title, handleSubmit }) => {
  const [newColorName,setNewColorName] = useState();

  const handleConfirmAdd = () => {
    handleSubmit(newColorName);
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
            Thêm mới {title}
          </span>
        }
        
        okType="danger"
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
        <input className="w-full"></input>
        
         <input
          className="w-full mt-4"
          placeholder={`Nhập tên ${title}`}
          value={ten}
          onChange={(e) => setTen(e.target.value)}
        />
      </Modal>
    </>
  );
};
export default ModalThemMoi;
