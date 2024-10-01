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
import ModalEdit from "../ModalEdit";

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
  const [valueSearch, setValueSearch] = useState();
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: currentPage - 1,
        pageSize,
        tenChatLieu: valueSearch, // Cập nhật tên tham số tìm kiếm
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
        description: `Deleted fabric material ${itemDelete.tenChatLieu} successfully!`, // Cập nhật tên chất liệu
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

  const handleConfirmEdit = async (id, updateChatLieu) => { // Cập nhật tên tham số
    try {
      console.log("Dữ liệu gửi đi:", updateChatLieu);
      await updateChatLieuVaiApi(id, updateChatLieu); // Cập nhật API gọi cho ChatLieuVai
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Cập nhật chất liệu ${updateChatLieu.tenChatLieu} thành công!`, // Cập nhật tên chất liệu
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

  const handleConfirmAdd = async (newChatLieuName) => { // Cập nhật tên tham số
    try {
      await createChatLieuVaiApi({ tenChatLieu: newChatLieuName }); // Cập nhật API gọi cho ChatLieuVai
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Thêm chất liệu ${newChatLieuName} thành công!`, // Cập nhật tên chất liệu
      });
      setIsModalAddOpen(false);
      setCurrentPage(1);
      await fetchData(); // Gọi fetchData sau khi thêm thành công
    } catch (error) {
      console.error("Failed to create new fabric material", error);
    }
  };

  useEffect(() => {
    fetchData(); // Gọi fetchData mỗi khi currentPage, pageSize, hoặc valueSearch thay đổi
  }, [fetchData]);

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
    },
    {
      title: "Chất liệu vải", // Cập nhật tiêu đề cột
      dataIndex: "tenChatLieuVai", // Cập nhật tên trường
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

  return (
    <>
      <TimKiem
        title={"Chất liệu vải"} // Cập nhật tiêu đề
        placeholder={"Nhập vào chất liệu mà bạn muốn tìm!"} // Cập nhật placeholder
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
        title={"Chất liệu vải"} // Cập nhật tiêu đề
        handleConfirm={handleConfirmDelete}
      />
      <ModalThemMoi
        isOpen={isModalAddOpen}
        handleClose={() => setIsModalAddOpen(false)}
        title={"Chất liệu vải"} // Cập nhật tiêu đề
        handleSubmit={handleConfirmAdd}
      />
      <ModalEdit
        title={"Chất liệu vải"} // Cập nhật tiêu đề
        isOpen={isModalEditOpen}
        handleClose={() => setIsModalEditOpen(false)}
        size={itemEdit}
        handleSubmit={handleConfirmEdit}
      />
    </>
  );
};

export default TableChatLieuVai;
