import { useEffect, useState, useCallback } from "react";
import { Button, Flex, Table, Space, notification, Switch } from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalEditKhachHang from "./ModalEditKhachHang";
import ModalThemMoiKhachHang from "./ModalThemMoiKhachHang";
import TimKiem from "../TimKiem";
import {
    deleteKhachHangApi,
    getAllKhachHangApi,
    createKhachHangApi,
    updateKhachHangApi,
} from "../../../../api/KhachHangApi";

const TableKhachHang = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [itemDelete, setDeletingItem] = useState(null);
    const [itemEdit, setEditItem] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [valueSearch, setValueSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const validateKhachHang = (value) => {
        return value.length >= 3;
    };

    // Hàm lấy dữ liệu khách hàng
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                pageNumber: currentPage - 1,
                pageSize,
                ten: valueSearch,
            };
            const res = await getAllKhachHangApi(params);
            if (res && res.data) {
                const dataWithKey = res.data.content.map((item) => ({
                    ...item,
                    key: item.id,
                }));
                setDataSource(dataWithKey);
                setTotalItems(res.data.totalElements);
            }
        } catch (error) {
            console.error("Lấy dữ liệu khách hàng thất bại", error);
            notification.error({
                message: "Lỗi",
                description: "Không thể lấy dữ liệu khách hàng.",
            });
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, valueSearch]);

    // Kiểm tra khách hàng đã tồn tại hay chưa
    const checkKhachHangExists = async (ten) => {
        const params = { ten };
        const res = await getAllKhachHangApi(params);
        return res.data.content.some(item => item.ten === ten);
    };

    // Xử lý xoá khách hàng
    const handleDelete = (record) => {
        setDeletingItem(record);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteKhachHangApi(itemDelete.id);
            notification.success({
                duration: 4,
                pauseOnHover: false,
                message: "Thành công",
                showProgress: true,
                description: `Xoá khách hàng ${itemDelete.ten} thành công!`,
            });
            setIsModalOpen(false);
            setDeletingItem(null);
            setCurrentPage(1);
            await fetchData();
        } catch (error) {
            console.error("Xoá khách hàng thất bại", error);
            notification.error({
                message: "Lỗi",
                description: "Không thể xoá khách hàng.",
            });
        }
    };

    // Xử lý sửa khách hàng
    const handleEdit1 = (record) => {
        setEditItem(record);
        setIsModalEditOpen(true);
    };

    // Xử lý thay đổi trạng thái
    const handleStatusChange = async (record, checked) => {
        const updatedData = { ...record, trangThai: checked ? 1 : 0 };
        try {
            const response = await updateKhachHangApi(record.id, updatedData);
            if (response && response.data) {
                notification.success({
                    message: "Cập nhật trạng thái khách hàng thành công",
                    description: `Trạng thái của khách hàng ${record.ten} hiện tại là ${checked ? "Kích hoạt" : "Không kích hoạt"}!`,
                });
                await fetchData(); // Lấy lại dữ liệu sau khi thay đổi trạng thái
            } else {
                throw new Error("Không thể cập nhật trạng thái");
            }
        } catch (error) {
            console.error("Không thể cập nhật trạng thái", error);
            notification.error({
                message: "Lỗi",
                description: "Không thể cập nhật trạng thái.",
            });
        }
    };

    // Xử lý xác nhận chỉnh sửa khách hàng
    const handleConfirmEdit = async (id, updateKhachHang) => {
        // if (!validateKhachHang(updateKhachHang.ten)) {
        //     notification.error({
        //         message: "Lỗi",
        //         description: "Tên khách hàng phải có ít nhất 3 ký tự!",
        //     });
        //     return;
        // }

        const exists = await checkKhachHangExists(updateKhachHang.ten);
        if (exists) {
            notification.error({
                message: "Lỗi",
                description: "Khách hàng với tên này đã tồn tại!",
            });
            return;
        }

        try {
            await updateKhachHangApi(id, updateKhachHang);
            notification.success({
                duration: 4,
                pauseOnHover: false,
                showProgress: true,
                message: "Thành công",
                description: `Cập nhật khách hàng ${updateKhachHang.ten} thành công!`,
            });
            setIsModalEditOpen(false);
            setCurrentPage(1);
            await fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    // Xử lý thêm khách hàng mới
    const handleAdd = () => {
        setIsModalAddOpen(true);
    };

    // Xử lý xác nhận thêm khách hàng
    const handleConfirmAdd = async (newKhachHangName) => {
        // if (!validateKhachHang(newKhachHangName)) {
        //     notification.error({
        //         message: "Lỗi",
        //         description: "Tên khách hàng phải có ít nhất 3 ký tự!",
        //     });
        //     return;
        // }

        const exists = await checkKhachHangExists(newKhachHangName);
        if (exists) {
            notification.error({
                message: "Lỗi",
                description: "Khách hàng với tên này đã tồn tại!",
            });
            return;
        }

        try {
            await createKhachHangApi({ ten: newKhachHangName });
            notification.success({
                duration: 4,
                pauseOnHover: false,
                showProgress: true,
                message: "Thành công",
                description: `Thêm khách hàng ${newKhachHangName} thành công!`,
            });
            setIsModalAddOpen(false);
            setCurrentPage(1);
            await fetchData();
        } catch (error) {
            console.error("Thêm khách hàng thất bại", error);
            notification.error({
                message: "Lỗi",
                description: "Không thể tạo khách hàng mới.",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = [
        {
            title: "STT",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Ảnh đại diện",
            dataIndex: "avatar",
            key: "avatar",
            render: (avatar) => (
                avatar ? <img src={avatar} alt="avatar" style={{ width: 50, height: 50 }} /> : null
            ),
        },
        {
            title: "Mã KH",
            dataIndex: "ma",
            key: "ma",          
        },
        {
            title: "ID Tài khoàn",
            dataIndex: "idDiaChi",
            key: "idDiaChi",          
        },
        {
            title: "Tên khách hàng",
            dataIndex: "ten",
            key: "ten",
            showSorterTooltip: false,
        },
        
        {
            title: "Email",
            dataIndex: "email",
            key: "email",          
        },
        {
            title: "Số điện thoại",
            dataIndex: "sdt",
            key: "sdt",
        },
        {
            title: "Ngày sinh",
            dataIndex: "ngaySinh",
            key: "ngaySinh",
        },

        {
            title: "Địa chỉ",
            dataIndex: "idDiaChi",
            key: "idDiaChi",
            render: (idDiaChi) => {
                return idDiaChi ? `${idDiaChi}` : "Chưa có địa chỉ";
            },
        },
        {
            title: "Giới tính",
            dataIndex: "gioiTinh",
            key: "gioiTinh",
            render: (gioiTinh) => gioiTinh ? "Nam" : "Nữ",
        },

        {
            title: "Trạng thái",
            dataIndex: "trangThai",
            key: "trangThai",
            render: (text, record) => (
                <Switch
                    checked={text === 1} // 1 là trạng thái kích hoạt
                    onChange={(checked) => handleStatusChange(record, checked)} // Chuyển đổi trạng thái
                />
            ),
        },
        {
            title: "Thao tác",
            dataIndex: "thaotac",
            key: "thaotac",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit1(record)}>
                        <FaEdit className="size-5" />
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record)}>
                        <MdDelete className="size-5" />
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <TimKiem
                title={"Khách hàng"}
                placeholder={"Nhập vào tên khách hàng cần tìm!"}
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
                    loading={loading}
                />
            </Flex>
            <ModalEditKhachHang
                isOpen={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                title={"Khách hàng"}
                handleConfirm={handleConfirmDelete}
            />
            <ModalThemMoiKhachHang
                isOpen={isModalAddOpen}
                handleClose={() => setIsModalAddOpen(false)}
                title={"Khách hàng"}
                handleSubmit={handleConfirmAdd}
            />
            <ModalEditKhachHang
                title={"Khách hàng"}
                isOpen={isModalEditOpen}
                handleClose={() => setIsModalEditOpen(false)}
                khachhang={itemEdit}
                handleSubmit={handleConfirmEdit}
            />
        </>
    );
};

export default TableKhachHang;
