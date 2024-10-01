import { useEffect, useState, useCallback } from "react";
import { Button, Flex, Table, Space, notification } from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import ModalThemMoi from "../ModalThemMoi";
import TimKiem from "../TimKiem";
import {
  deleteChatLieuVaiApi,
  getAllChatLieuVaiApi,
  createChatLieuVaiApi,
  updateChatLieuVaiApi,
} from "../../../../api/ChatLieuVaiApi"; // Cập nhật API import cho ChatLieuVai
import ModalEdit2 from "../ModalEdit2"; // Import modal edit mới

const TableChatLieuVai = () => {
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
        tenChatLieuVai: valueSearch, // Cập nhật tên tham số tìm kiếm
      };
      const res = await getAllChatLieuVaiApi(params); // Cập nhật API gọi cho ChatLieuVai
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
      await deleteChatLieuVaiApi(itemDelete.id); // Cập nhật API gọi cho ChatLieuVai
      notification.success({
        duration: 4,
        pauseOnHover: false,
        message: "Success",
        showProgress: true,
        description: `Deleted material ${itemDelete.tenChatLieuVai} successfully!`, // Cập nhật tên chất liệu vải
      });
      setIsModalOpen(false);
      setDeletingItem(null);
      setCurrentPage(1);
      await fetchData(); // Gọi fetchData sau khi xóa thành công
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleEdit = (record) => {
    setEditItem(record);
    setIsModalEditOpen(true);
  };

  const handleConfirmEdit = async (id, updateChatLieuVai) => {
    try {
      console.log("Dữ liệu gửi đi:", updateChatLieuVai);
      await updateChatLieuVaiApi(id, updateChatLieuVai); // Cập nhật API gọi cho ChatLieuVai
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Cập nhật chất liệu vải ${updateChatLieuVai.tenChatLieuVai} thành công!`, // Cập nhật tên chất liệu vải
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

  const handleConfirmAdd = async (newChatLieuName) => {
    try {
      await createChatLieuVaiApi({ tenChatLieuVai: newChatLieuName }); // Cập nhật API gọi cho ChatLieuVai
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Thêm chất liệu vải ${newChatLieuName} thành công!`, // Cập nhật tên chất liệu vải
      });
      setIsModalAddOpen(false);
      setCurrentPage(1);
      await fetchData(); // Gọi fetchData sau khi thêm thành công
    } catch (error) {
      console.error("Failed to create new material", error);
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
      title: "Chất liệu vải",
      dataIndex: "tenChatLieuVai", // Cập nhật tên trường
      key: "tenChatLieuVai", // Thêm key cho mỗi cột
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
    <>
      <TimKiem
        title={"Chất liệu vải"}
        placeholder={"Nhập vào chất liệu vải mà bạn muốn tìm!"}
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
        title={"Chất liệu vải"}
        handleConfirm={handleConfirmDelete}
      />
      <ModalThemMoi
        isOpen={isModalAddOpen}
        handleClose={() => setIsModalAddOpen(false)}
        title={"Chất liệu vải"}
        handleSubmit={handleConfirmAdd}
      />
      <ModalEdit2
        title={"Chất liệu vải"}
        isOpen={isModalEditOpen}
        handleClose={() => setIsModalEditOpen(false)}
        chatLieu={itemEdit} // Đổi tên từ kích thước thành chatLieu
        handleSubmit={handleConfirmEdit}
      />
    </>
  );
};

export default TableChatLieuVai;
