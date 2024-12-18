import { useEffect, useState, useCallback } from "react";
import { Button, Flex, Table, Space, notification, Spin, Switch } from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";

import ModalThemMoi from "../ModalThemMoi";

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
        setLoading(true);
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
            //setCurrentPage(1);
            await fetchData();
        } catch (error) {
            console.error("Failed to create item", error);
            notification.error({
                message: "Error",
                description: "Failed to create item",
            });
        } finally {
            setLoading(false);
        }
    }


    // validate trùng tên
    const checkChatLieuDeExists = async (tenChatLieu) => {
        const params = { tenChatLieu };
        const res = await getAllChatLieuDeApi(params);
        return res.data.content.some((item) => item.tenChatLieu === tenChatLieu);
    };


    const handleConfirmUpdate = async (id, itemUpdate) => {
        setLoading(true);
        try {
            const isExif = await checkChatLieuDeExists(itemUpdate.tenChatLieu);
            if (isExif)  {
                notification.error({
                    message: "Error",
                    description: "Tên chất liệu đế đã tồn tại",
                });
                return;
            }
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
            notification.error({
                message: "Error",
                description: "Failed to update item",
            });
        } finally {
            setLoading(false);
        };
    };
    const handleConfirmDelete = async () => {
        setLoading(true);
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
            notification.error({
                message: "Error",
                description: "Failed to delete item",
            });
        } finally {
            setLoading(false);
        }

    };


    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                pageNumber: currentPage - 1,
                pageSize,
                tenChatLieuDe: valueSearch,
            };

            const res = await getAllChatLieuDeApi(params);
            if (res && res.data) {
                const dataWithKey = res.data.content.map((item,index) => ({
                    ...item,
                    key: item.id,
                    stt: currentPage === 1 ? index + 1 : (currentPage - 1) * pageSize + index + 1,
                }));

                setDataSource(dataWithKey);
                setTotalItems(res.data.totalElements);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch data",
            });

        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, valueSearch]);
    useEffect(() => {

        fetchData();
    }, [fetchData]);

    const handleStatusChange = async (record, checked) => {
        const updatedData = { ...record, trangThai: checked ? 1 : 0 };

        try {
            await updateChatLieuDeApi(record.id, updatedData);
            notification.success({
                message: "Cập nhật trạng thái thành công",
                description: `Trạng thái chất liệu đế  ${record.tenChatLieu} đã được ${checked ? "ngừng hoạt động" : "hoạt động"}!`,
            });
            await fetchData();
        } catch (error) {
            console.error("Failed to update status", error);
            notification.error({
                message: "Lỗi",
                description: "Không thể cập nhật trạng thái.",
            });
        }
    };



    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
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
            title: "Trạng thái",
            dataIndex: "trangThai",
            key: "trangThai",
            render: (text, record) => (
                <Switch
                    checked={text === 1} // Kiểm tra trạng thái (1 là hoạt động)
                    onChange={(checked) => handleStatusChange(record, checked ? 1 : 0)} // Cập nhật trạng thái chính xác
                />
            )
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

    // const start = () => {
    //     setLoading(true);
    //     // ajax request after empty completing
    //     setTimeout(() => {
    //         setSelectedRowKeys([]);
    //         setLoading(false);
    //     }, 1000);
    // };

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
            <Spin spinning={loading} tip="Loading...">
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
            </Spin>
        </>
    );
};

export default TableDeGiay;
