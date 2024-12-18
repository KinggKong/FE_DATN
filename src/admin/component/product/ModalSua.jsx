import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";

const ModalSua = ({ isOpen, handleClose, title, handleSubmit, initialData }) => {
    const [ten, setTen] = useState("");

    // Sử dụng useEffect để cập nhật giá trị khi có dữ liệu ban đầu
    useEffect(() => {
        if (initialData) {
            setTen(initialData.tenChatLieu);
        }
    }, [initialData]);

    const onSubmit = () => {
        const updatedItem = { tenChatLieu: ten.trim(), trangThai: 1 };
        const id = initialData.id;
        handleSubmit(id, updatedItem);
    };

    return (
        <Modal
            open={isOpen}
            title={
                <span className="flex">
                    <FaEdit
                        style={{ color: "green", marginRight: 8, fontSize: "1.5rem" }}
                    />

                    Sửa {title}
                </span>
            }
            okType="danger"
            onOk={onSubmit}
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
             className="w-full border rounded-sm h-8 p-4"
              
                placeholder={`Nhập tên ${title}`}
                value={ten}
                onChange={(e) => setTen(e.target.value)}
            />
        </Modal>
    );
};

export default ModalSua;
