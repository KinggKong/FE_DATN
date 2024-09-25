import { useEffect, useState } from "react";
import { Button, Flex, Table, Space } from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import axios from "axios";
import ModalThemMoi from "../ModalThemMoi";
import { CgAdd } from "react-icons/cg";
import ModalSua from "../ModalSua";
import TimKiem from "../TimKiem";


const TableDeGiay = ({ searchTerm }) => {
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

    const handleConfirmAdd = (newItem) => {
        const dataToSend = {
            tenChatLieu: newItem.ten,
            trangThai: 1
        }
        axios.post("http://localhost:8080/api/v1/chatlieudes", dataToSend)
        .then(response => {
            
            setIsModalAddOpen(false); // Đóng modal sau khi thêm thành công
            getData(currentPage, pageSize); // Tải lại danh sách với dữ liệu mới
        })
        .catch(error => {
            console.error("Error adding new item: ", error);
        });
       
    };

    const handleConfirmUpdate = (updatedItem) => {
        const dataToSend = {
            tenChatLieu: updatedItem.ten,
            trangThai: 1
        }
        axios.put(`http://localhost:8080/api/v1/chatlieudes/${itemUpdate.id}`, dataToSend)
        .then(response => {
            setIsModalUpdateOpen(false); // Đóng modal sau khi thêm thành công
            getData(currentPage, pageSize); // Tải lại danh sách với dữ liệu mới
        })
        .catch(error => {
            console.error("Error updating item: ", error);
        });
    };
    const handleConfirmDelete = () => {
        axios.delete(`http://localhost:8080/api/v1/chatlieudes/${itemDelete.id}`)
        .then (response => {
            getData(currentPage, pageSize); // Tải lại danh sách với dữ liệu mới
            setIsModalOpen(false); // Đóng modal
            setDeletingItem(null); // Reset lại trạng thái
        })
        .catch(error => {
            console.error("Error deleting item: ", error);
        });
        // Thực hiện xóa ở đây
        console.log("da xoa phan tu", itemDelete);
      
    };

    const getData = (page, pageSize) => {
        axios
            .get(
                `http://localhost:8080/api/v1/chatlieudes?page=${page}&size=${pageSize}&search=${searchTerm}`
            )
            .then(function (response) {
                const dataWithKey = response.data.data.map((item) => ({
                    ...item,
                    key: item._id,
                }));
                setDataSource(dataWithKey);
                setTotalItems(response.data.totalPassengers);
            });
    };

    useEffect(() => {
        getData(currentPage, pageSize, searchTerm); // Gọi hàm getData với searchTerm
    }, [currentPage, pageSize, searchTerm]);
    
    // useEffect(() => {
    //     getData(currentPage, pageSize);
    // }, [currentPage, pageSize]);

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
            dataIndex: "created_at",
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

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <>
            <Flex gap="middle" className="mt-4" vertical>
                <Flex align="center" gap="middle">
                    <Button
                        type="primary"
                        onClick={start}
                        disabled={!hasSelected}
                        loading={loading}
                    >
                        Xóa
                    </Button>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}

                    <button
                        onClick={handleAdd}
                        className="w-40 flex items-center justify-center
         px-3 py-2 text-slate-700 rounded-lg hover:bg-yellow-400 hover:text-slate-900 bg-green-600 text-white"
                    >
                        <CgAdd className="mr-2" /> <span>Thêm mới</span>
                    </button>
                </Flex>

                <Table
                    rowSelection={rowSelection}
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
