import { useEffect, useState } from "react";
import { Button, Flex, Table, Space, notification } from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import ModalThemMoi from "../ModalThemMoi";
import TimKiem from "../TimKiem";
import {
  deleteMauSacApi,
  getAllMauSacApi,
  createMauSacApi,
  updateMauSacApi,
} from "../../../../api/MauSacApi";
import ModalEdit from "../ModalEdit";

const TableMauSac = () => {
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
 
  const handleDelete = (record) => {
    setDeletingItem(record);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMauSacApi(itemDelete.id);
      notification.success({
        duration: 4,
        pauseOnHover: false,
        message: "Success",
        showProgress: true,
        description: `Deleted ${itemDelete.tenMau} successfully!`,
      });
      setIsModalOpen(false);
      setDeletingItem(null);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleEdit = (record) => {
    setEditItem(record);
    setIsModalEditOpen(true);
  };

  const handleConfirmEdit = async (id, updateMauSac) => {
    try {
      console.log("Dữ liệu gửi đi:", updateMauSac); // Kiểm tra dữ liệ
      await updateMauSacApi(id, updateMauSac);
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Cập nhật màu sắc ${updateMauSac.tenMau} thành công!`,
      });
      setIsModalEditOpen(false);
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = () => {
    setIsModalAddOpen(true);
  };

  const handleConfirmAdd = async (newColorName) => {
    try {
      await createMauSacApi({ tenMau: newColorName });
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Thêm màu sắc ${newColorName} thành công!`,
      });
      setIsModalAddOpen(false);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to create new color", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        pageNumber: currentPage - 1,
        pageSize,
        tenMau: valueSearch,
      };
      const res = await getAllMauSacApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataSource(dataWithKey);
        setTotalItems(res.data.totalElements);
      }
    };
    fetchData();
  }, [currentPage, pageSize, valueSearch]);

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
    },
    {
      title: "Màu sắc",
      dataIndex: "tenMau",
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
        title={"Màu sắc"}
        placeholder={"Nhập vào màu của giày mà bạn muốn tìm !"}
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
      <ModalThemMoi
        isOpen={isModalAddOpen}
        handleClose={() => setIsModalAddOpen(false)}
        title={"Màu sắc"}
        handleSubmit={handleConfirmAdd}
      />
      <ModalEdit
        title={"Màu sắc"}
        isOpen={isModalEditOpen}
        handleClose={() => setIsModalEditOpen(false)}
        mausac={itemEdit}
        handleSubmit={handleConfirmEdit}
      />
    </>
  );
};

export default TableMauSac;
