

import { useEffect, useState, useCallback } from "react";
import { Button, Flex, Table, Space, notification } from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import ModalThemMoi from "../ModalThemMoi";
import TimKiem from "../TimKiem";
import {
  deleteKichThuocApi,
  getAllKichThuocApi,
  createKichThuocApi,
  updateKichThuocApi,
} from "../../../../api/KichThuocApi"; // Cập nhật API import cho KichThuoc
import ModalEdit from "../ModalEdit1";

const TableKichThuoc = () => {
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: currentPage - 1,
        pageSize,
        tenKichThuoc: valueSearch, // Cập nhật tên tham số tìm kiếm
      };
      const res = await getAllKichThuocApi(params); // Cập nhật API gọi cho KichThuoc
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

  const handleDelete = (record) => {
    setDeletingItem(record);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteKichThuocApi(itemDelete.id); // Cập nhật API gọi cho KichThuoc
      notification.success({
        duration: 4,
        pauseOnHover: false,
        message: "Success",
        showProgress: true,
        description: `Deleted size ${itemDelete.tenKichThuoc} successfully!`, // Cập nhật tên kích thước
      });
      setIsModalOpen(false);
      setDeletingItem(null);
      setCurrentPage(1);
      await fetchData(); // Gọi fetchData sau khi xóa thành công
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleEdit1 = (record) => {
    setEditItem(record);
    setIsModalEditOpen(true);
  };

  const handleConfirmEdit = async (id, updateKichThuoc) => { // Cập nhật tên tham số
    try {
      console.log("Dữ liệu gửi đi:", updateKichThuoc);
      await updateKichThuocApi(id, updateKichThuoc); // Cập nhật API gọi cho KichThuoc
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Cập nhật kích thước ${updateKichThuoc.tenKichThuoc} thành công!`, // Cập nhật tên kích thước
      });
      setIsModalEditOpen(false);
      setCurrentPage(1);
      await fetchData(); // Gọi fetchData sau khi cập nhật thành công
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = () => {
    setIsModalAddOpen(true);
  };

  const handleConfirmAdd = async (newKichThuocName) => { // Cập nhật tên tham số
    try {
      await createKichThuocApi({ tenKichThuoc: newKichThuocName }); // Cập nhật API gọi cho KichThuoc
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Thêm kích thước ${newKichThuocName} thành công!`, // Cập nhật tên kích thước
      });
      setIsModalAddOpen(false);
      setCurrentPage(1);
      await fetchData(); // Gọi fetchData sau khi thêm thành công
    } catch (error) {
      console.error("Failed to create new size", error);
    }
  };

  useEffect(() => {
    fetchData(); // Gọi fetchData mỗi khi currentPage, pageSize, hoặc valueSearch thay đổi
  }, [fetchData]);

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id", // Thêm key cho mỗi cột
    },
    {
      title: "Kích thước",
      dataIndex: "tenKichThuoc", // Cập nhật tên trường
      key: "tenKichThuoc", // Thêm key cho mỗi cột
      showSorterTooltip: false,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt", // Thêm key cho mỗi cột
    },
    {
      title: "Thao tác",
      dataIndex: "thaotac",
      key: "thaotac", // Thêm key cho mỗi cột
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
        title={"Kích thước"}
        placeholder={"Nhập vào kích thước mà bạn muốn tìm!"}
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
      <ModalConfirm
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        title={"Kích thước"}
        handleConfirm={handleConfirmDelete}
      />
      <ModalThemMoi
        isOpen={isModalAddOpen}
        handleClose={() => setIsModalAddOpen(false)}
        title={"Kích thước"}
        handleSubmit={handleConfirmAdd}
      />
      <ModalEdit
        title={"Kích thước"}
        isOpen={isModalEditOpen}
        handleClose={() => setIsModalEditOpen(false)}
        kichthuoc={itemEdit} // Đổi tên từ size thành kichthuoc
        handleSubmit={handleConfirmEdit}
      />
    </>
  );
};

export default TableKichThuoc;
