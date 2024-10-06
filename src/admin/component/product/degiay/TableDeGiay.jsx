import { useEffect, useState } from "react";
import { Button, Flex, Table, Space, notification } from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import axios from "axios";
import ModalThemMoi from "../ModalThemMoi";
import { CgAdd } from "react-icons/cg";
import ModalSua from "../ModalSua";

import {
    getAllChatLieuDeApi,
    deleteChatLieuDeApi,
    createChatLieuDeApi,
    updateChatLieuDeApi,
} from "../../../../api/ChatLieuDeApi";
import TimKiem from "../TimKiem";

const TableDeGiay = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [itemUpdate, setUpdateItem] = useState(null);
    const [itemDelete, setDeletingItem] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [valueSearch, setValueSearch] = useState();


    const handleEdit = (record) => {
        setUpdateItem(record);
        console.log(record);
        setIsModalUpdateOpen(true);
    };

    const handleDelete = (record) => {
        console.log(record);
        setDeletingItem(record);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setIsModalAddOpen(true);
    };

    const handleConfirmAdd = async (newItem) => {
        try {
            await createChatLieuDeApi({ tenChatLieu: newItem, trangThai: 1 });
            notification.success({
                duration: 4,
                pauseOnHover: false,
                message: "Success",
                showProgress: true,
                description: `Thêm thành cong!`,
            });
            setIsModalAddOpen(false);
            setCurrentPage(1);
            await fetchData();
        } catch (error) {
            console.error("Failed to create item", error);
        }

    }



    const handleConfirmUpdate = async (id, itemUpdate) => {
        try {
            await updateChatLieuDeApi(id, itemUpdate);
            notification.success({
                duration: 4,
                pauseOnHover: false,
                message: "Success",
                showProgress: true,
                description: `Cập nhật thành công chất liệu ${itemUpdate.tenChatLieu}!`,
            });
            setIsModalUpdateOpen(false);
            setCurrentPage(1);
            await fetchData();

        } catch
        (error) {
            console.error("Failed to update item", error);
        };
    }
    const handleConfirmDelete = async () => {
        try {
            await deleteChatLieuDeApi(itemDelete.id);
            notification.success({
                duration: 4,
                pauseOnHover: false,
                message: "Success",
                showProgress: true,
                description: `Xóa thành công chất liệu ${itemDelete.tenChatLieu}!`,
            });
            setIsModalOpen(false);
            setDeletingItem(null);
            setCurrentPage(1);
            await fetchData();
        } catch (error) {
            console.error("Failed to delete item", error);
        }

    };


    const fetchData = async () => {
        const params = {
            pageNumber: currentPage - 1,
            pageSize,
            tenChatLieuDe: valueSearch,
        };

        const res = await getAllChatLieuDeApi(params);
        if (res && res.data) {
            const dataWithKey = res.data.content.map((item) => ({
                ...item,
                key: item.id,
            }));

            setDataSource(dataWithKey);
            setTotalItems(res.data.totalElements);
        }
    };
    useEffect(() => {

        fetchData();
    }, [fetchData]);



    const columns = [
        {
            title: "STT",
            dataIndex: "id",
        },
        {
            title: "Loại đế",
            dataIndex: "tenChatLieu",
            showSorterTooltip: false,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
        },
        {
            title: "Thao tác",
            dataIndex: "thaotac",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>
                        <FaEdit className="size-5" />
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record)}>
                        <MdDelete className="size-5" />
                    </Button>
                </Space>
            ),
        },
    ];

    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    const onSelectChange = (newSelectedRowKeys) => {
        console.log("selectedRowKeys changed: ", newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // const rowSelection = {
    //     selectedRowKeys,
    //     onChange: onSelectChange,
    // };

    // const hasSelected = selectedRowKeys.length > 0;

    return (
        <>
            <TimKiem
                title={"Chất liệu đế"}
                placeholder={"Nhập vào chất liệu đế của giày mà bạn muốn tìm !"}
                valueSearch={setValueSearch}
                handleAddOpen={handleAdd}
            />
            <Flex gap="middle" className="mt-4" vertical>


                <Table

                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalItems,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50", "100"],
                        onChange: (page, pageSize) => {
                            setCurrentPage(page);
                            setPageSize(pageSize);
                        },
                    }}
                />
            </Flex>

            <ModalConfirm
                isOpen={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                title={"đế giày"}
                handleConfirm={handleConfirmDelete}
            />
            <ModalThemMoi
                isOpen={isModalAddOpen}
                handleClose={() => setIsModalAddOpen(false)}
                title={"đế giày"}
                handleSubmit={handleConfirmAdd}
            />
            <ModalSua
                isOpen={isModalUpdateOpen}
                handleClose={() => setIsModalUpdateOpen(false)}
                title={"đế giày"}
                handleSubmit={handleConfirmUpdate}
                initialData={itemUpdate}
            />
        </>
    );
};

export default TableDeGiay;
