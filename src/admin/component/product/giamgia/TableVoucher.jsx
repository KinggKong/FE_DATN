import { useEffect, useState, useCallback } from "react";
import { Button, Flex, Table, Space, notification, Spin } from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import ModalThemMoiVoucher from "./ModalThemMoiVoucher"; 
import TimKiem from "../TimKiem";
import { getAllVoucherApi, deleteVoucherApi, updateVoucherApi, createVoucherApi } from "../../../../api/VoucherApi"; 
import ModalEdit3 from "./ModalEdit3";

const TableVoucher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [itemDelete, setDeletingItem] = useState(null);
  const [itemEdit, setEditItem] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [valueSearch, setValueSearch] = useState(""); // Khởi tạo là chuỗi rỗng
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: currentPage - 1,
        pageSize,
        tenVoucher: valueSearch, // Thêm giá trị tìm kiếm vào params
      };
      const res = await getAllVoucherApi(params);
      console.log("API Response:", res.data); // Log toàn bộ dữ liệu

      if (res && res.data && res.data.content) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
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

  // Theo dõi sự thay đổi của valueSearch và gọi fetchData
  useEffect(() => {
    setCurrentPage(1); // Reset lại trang khi tìm kiếm
    fetchData();
  }, [valueSearch]);

  const handleDelete = (record) => {
    setDeletingItem(record);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteVoucherApi(itemDelete.id);
      notification.success({
        message: "Success",
        duration: 4,
        showProgress: true,
        pauseOnHover: false,
        description: `Deleted voucher ${itemDelete.maVoucher} successfully!`,
      });
      setIsModalOpen(false);
      setDeletingItem(null);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete item", error);
      notification.error({
        message: "Error",
        duration: 4,
        showProgress: true,
        pauseOnHover: false,
        description: "Failed to delete item",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditItem(record);
    setIsModalEditOpen(true);
  };

  const handleConfirmEdit = async (id, updateVoucher) => {
    setLoading(true);
    try {
      await updateVoucherApi(id, updateVoucher);
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Cập nhật voucher ${updateVoucher.maVoucher} thành công!`,
      });
      setIsModalEditOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Failed to update voucher", error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Failed to update voucher",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsModalAddOpen(true);
  };

  const handleConfirmAdd = async (newVoucher) => {
    console.log("New Voucher Data:", newVoucher); // Thêm dòng này để kiểm tra dữ liệu

    setLoading(true);
    try {
      await createVoucherApi(newVoucher);
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm voucher ${newVoucher.maVoucher} thành công!`,
      });
      setIsModalAddOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Failed to create new voucher", error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Failed to create new voucher",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
    },
    {
      title: "Tên voucher", 
      dataIndex: "tenVoucher", 
    },
    {
      title: "Mã voucher",
      dataIndex: "maVoucher",
    },
    {
      title: "Giá trị giảm", 
      dataIndex: "giaTriGiam", 
    },
    {
      title: "Giá trị đơn hàng tối thiểu",
      dataIndex: "giaTriDonHangToiThieu",
    },
    {
      title: "Giá trị giảm tối đa",
      dataIndex: "giaTriGiamToiDa",
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "ngayBatDau",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "ngayKetThuc",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: (text) => (text === 1 ? "Hoạt động" : "Không hoạt động"),
    },
    {
      title: "Hình thức giảm",
      dataIndex: "hinhThucGiam", 
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

  return (
    <Spin spinning={loading} tip="Loading...">
      <TimKiem
        title={"Voucher"}
        placeholder={"Nhập vào tên voucher mà bạn muốn tìm!"}
        valueSearch={setValueSearch} // Giữ nguyên để nhận giá trị tìm kiếm
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
        title={"Voucher"}
        handleConfirm={handleConfirmDelete}
      />
      <ModalThemMoiVoucher
        isOpen={isModalAddOpen}
        handleClose={() => setIsModalAddOpen(false)}
        title={"voucher"}
        handleSubmit={handleConfirmAdd}
      />
      <ModalEdit3
        title={"Voucher"}
        isOpen={isModalEditOpen}
        handleClose={() => setIsModalEditOpen(false)}
        voucher={itemEdit}
        handleSubmit={handleConfirmEdit}
      />
    </Spin>
  );
};

export default TableVoucher;
