import { useEffect, useState, useCallback } from "react";
import { Button, Flex, Table, Space, notification, Switch } from "antd";
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
} from "../../../../api/ChatLieuVaiApi";
import ModalEdit2 from "../ModalEdit2";

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
        tenChatLieuVai: valueSearch,
      };
      const res = await getAllChatLieuVaiApi(params);
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

  const checkChatLieuVaiExists = async (tenChatLieuVai) => {
    const params = { tenChatLieuVai };
    const res = await getAllChatLieuVaiApi(params);
    return res.data.content.some(item => item.tenChatLieuVai === tenChatLieuVai);
  };

  const handleDelete = (record) => {
    setDeletingItem(record);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteChatLieuVaiApi(itemDelete.id);
      notification.success({
        duration: 4,
        pauseOnHover: false,
        message: "Success",
        showProgress: true,
        description: `Deleted material ${itemDelete.tenChatLieuVai} successfully!`,
      });
      setIsModalOpen(false);
      setDeletingItem(null);
      setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleEdit = (record) => {
    setEditItem(record);
    setIsModalEditOpen(true);
  };

  const handleConfirmEdit = async (id, updateChatLieuVai) => {
    // Kiểm tra tên chất liệu
    if (!updateChatLieuVai.tenChatLieuVai.trim()) {
      notification.error({
        message: "Error",
        description: "Tên chất liệu không được để trống!",
      });
      return;
    }

    const exists = await checkChatLieuVaiExists(updateChatLieuVai.tenChatLieuVai);
    if (exists) {
      notification.error({
        message: "Error",
        description: "Chất liệu vải này đã tồn tại!",
      });
      return;
    }

    try {
      await updateChatLieuVaiApi(id, updateChatLieuVai);
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Cập nhật chất liệu vải ${updateChatLieuVai.tenChatLieuVai} thành công!`,
      });
      setIsModalEditOpen(false);
      setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = () => {
    setIsModalAddOpen(true);
  };

  const handleConfirmAdd = async (newChatLieuName) => {
    // Kiểm tra tên chất liệu
    if (!newChatLieuName.trim()) {
      notification.error({
        message: "Error",
        description: "Tên chất liệu không được để trống!",
      });
      return;
    }

    const exists = await checkChatLieuVaiExists(newChatLieuName);
    if (exists) {
      notification.error({
        message: "Error",
        description: "Chất liệu vải này đã tồn tại!",
      });
      return;
    }

    try {
      await createChatLieuVaiApi({ tenChatLieuVai: newChatLieuName });
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Thêm chất liệu vải ${newChatLieuName} thành công!`,
      });
      setIsModalAddOpen(false);
      setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Failed to create new material", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (record, checked) => {
    const updatedData = { ...record, trangThai: checked ? 0 : 1 };
    
    try {
      await updateChatLieuVaiApi(record.id, updatedData);
      notification.success({
        message: "Cập nhật trạng thái thành công",
        description: `Trạng thái chất liệu vải ${record.tenChatLieuVai} đã được ${checked ? "kích hoạt" : "tắt"}!`,
      });
      await fetchData(); // Cập nhật lại danh sách
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
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Chất liệu vải",
      dataIndex: "tenChatLieuVai",
      key: "tenChatLieuVai",
      showSorterTooltip: false,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (text, record) => (
        <Switch
          checked={text === 0}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "thaotac",
      key: "thaotac",
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
        chatLieu={itemEdit}
        handleSubmit={handleConfirmEdit}
      />
    </>
  );
};

export default TableChatLieuVai;
