import { useEffect, useState, useCallback } from "react";
import { Button, Flex, Table, Space, notification, Spin } from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import ModalThemMoiSanPham from "./ModalThemMoiSanPham";
import TimKiem from "../TimKiem";
import { getAllSanPhamApi,deleteSanPhamApi } from "../../../../api/SanPhamApi";
import ModalEdit from "../ModalEdit";

const TableSanPham = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [itemDelete, setDeletingItem] = useState(null);
  const [itemEdit, setEditItem] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [valueSearch, setValueSearch] = useState();
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: currentPage - 1,
        pageSize,
        // tenMau: valueSearch,
      };
      const res = await getAllSanPhamApi(params);
      if (res && res.data) {
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

  const handleDelete = (record) => {
    setDeletingItem(record);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteMauSacApi(itemDelete.id);
      notification.success({
        message: "Success",
        duration: 4,
        showProgress: true,
        pauseOnHover: false,
        description: `Deleted ${itemDelete.tenMau} successfully!`,
      });
      setIsModalOpen(false);
      setDeletingItem(null);
      setCurrentPage(1);
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

  const handleConfirmEdit = async (id, updateMauSac) => {
    setLoading(true);
    try {
      await updateMauSacApi(id, updateMauSac);
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Cập nhật màu sắc ${updateMauSac.tenMau} thành công!`,
      });
      setIsModalEditOpen(false);
      // setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Failed to update color", error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Failed to update color",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsModalAddOpen(true);
  };

  const handleConfirmAdd = async (newColorName) => {
    setLoading(true);
    try {
      await createMauSacApi({ tenMau: newColorName });
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm màu sắc ${newColorName} thành công!`,
      });
      setIsModalAddOpen(false);
      // setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Failed to create new color", error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Failed to create new color",
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
      title: "Tên giày",
      dataIndex: "tenSanPham",
      showSorterTooltip: false,
    },
    {
      title: "Danh mục",
      dataIndex: ["danhMuc", "tenDanhMuc"],
    },
    {
      title: "Thương hiệu",
      dataIndex: ["thuongHieu", "tenThuongHieu"],
    },
    {
      title: "Chất liệu vải",
      dataIndex: ["chatLieuVai", "tenChatLieuVai"],
    },
    {
      title: "Chất liệu đế",
      dataIndex: ["chatLieuDe", "tenChatLieu"],
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
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

  return (
    <Spin spinning={loading} tip="Loading...">
      <TimKiem
        title={"Sản Phẩm"}
        placeholder={"Nhập vào tên của giày mà bạn muốn tìm !"}
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
        title={"Màu sắc"}
        handleConfirm={handleConfirmDelete}
      />
      <ModalThemMoiSanPham
        isOpen={isModalAddOpen}
        handleClose={() => setIsModalAddOpen(false)}
        title={"sản phẩm"}
        handleSubmit={handleConfirmAdd}
      />
      <ModalEdit
        title={"Màu sắc"}
        isOpen={isModalEditOpen}
        handleClose={() => setIsModalEditOpen(false)}
        mausac={itemEdit}
        handleSubmit={handleConfirmEdit}
      />
    </Spin>
  );
};

export default TableSanPham;
