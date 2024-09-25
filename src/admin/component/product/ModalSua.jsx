import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";

const ModalSua = ({ isOpen, handleClose, title, handleSubmit, initialData }) => {
    const [ten, setTen] = useState("");

    // Sử dụng useEffect để cập nhật giá trị khi có dữ liệu ban đầu
    useEffect(() => {
        if (initialData) {
            setTen(initialData.tenChatLieu); // Giả sử `initialData` chứa thuộc tính `ten`
        }
    }, [initialData]);

    const onSubmit = () => {
        const updatedItem = { ten: ten };
        handleSubmit(updatedItem);
    };

    return (
        <Modal
            open={isOpen}
            title={
                <span>
                    <ExclamationCircleFilled
                        style={{ color: "red", marginRight: 8, fontSize: "1.5rem" }}
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
                className="w-full mt-4"
                placeholder={`Nhập tên ${title}`}
                value={ten}
                onChange={(e) => setTen(e.target.value)}
            />
        </Modal>
    );
};

export default ModalSua;
