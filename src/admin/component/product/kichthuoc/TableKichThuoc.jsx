import { useEffect, useState, useCallback } from "react";
import { Button, Flex, Table, Space, notification, Switch } from "antd";
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
} from "../../../../api/KichThuocApi";
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

  const validateKichThuoc = (value) => {
    const numberValue = Number(value);
    return !isNaN(numberValue) && numberValue >= 35 && numberValue <= 47;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: currentPage - 1,
        pageSize,
        tenKichThuoc: valueSearch,
      };
      const res = await getAllKichThuocApi(params);
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

  const checkKichThuocExists = async (tenKichThuoc) => {
    const params = { tenKichThuoc };
    const res = await getAllKichThuocApi(params);
    return res.data.content.some(item => item.tenKichThuoc === tenKichThuoc);
  };

  const handleDelete = (record) => {
    setDeletingItem(record);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteKichThuocApi(itemDelete.id);
      notification.success({
        duration: 4,
        pauseOnHover: false,
        message: "Success",
        showProgress: true,
        description: `Deleted size ${itemDelete.tenKichThuoc} successfully!`,
      });
      setIsModalOpen(false);
      setDeletingItem(null);
      setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleEdit1 = (record) => {
    setEditItem(record);
    setIsModalEditOpen(true);
  };

  const handleStatusChange = async (record, checked) => {
    const updatedData = { ...record, trangThai: checked ? 1 : 0 };
    
    try {
      await updateKichThuocApi(record.id, updatedData);
      notification.success({
        message: "Cập nhật trạng thái thành công",
        description: `Trạng thái kích thước ${record.tenKichThuoc} đã được ${checked ? "ngừng hoạt động" : "hoạt động"}!`,
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

  const handleConfirmEdit = async (id, updateKichThuoc) => {
    if (!validateKichThuoc(updateKichThuoc.tenKichThuoc)) {
      notification.error({
        message: "Error",
        description: "Kích thước phải là số và nằm trong khoảng từ 35 đến 47!",
      });
      return;
    }

    const exists = await checkKichThuocExists(updateKichThuoc.tenKichThuoc);
    if (exists) {
      notification.error({
        message: "Error",
        description: "Kích thước này đã tồn tại!",  
      });
      return;
    }

    try {
      await updateKichThuocApi(id, updateKichThuoc);
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Cập nhật kích thước ${updateKichThuoc.tenKichThuoc} thành công!`,
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

  const handleConfirmAdd = async (newKichThuocName) => {
    if (!validateKichThuoc(newKichThuocName)) {
      notification.error({
        message: "Error",
        description: "Kích thước phải là số và nằm trong khoảng từ 35 đến 47!",
      });
      return;
    }

    const exists = await checkKichThuocExists(newKichThuocName);
    if (exists) {
      notification.error({
        message: "Error",
        description: "Kích thước này đã tồn tại!",
      });
      return;
    }

    try {
      await createKichThuocApi({ tenKichThuoc: newKichThuocName });
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Thêm kích thước ${newKichThuocName} thành công!`,
      });
      setIsModalAddOpen(false);
      setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Failed to create new size", error);
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
      title: "Kích thước",
      dataIndex: "tenKichThuoc",
      key: "tenKichThuoc",
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
          checked={text === 0} // 0 là hoạt động
          onChange={(checked) => handleStatusChange(record, !checked)} // Chuyển đổi trạng thái
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
        kichthuoc={itemEdit}
        handleSubmit={handleConfirmEdit}
      />
    </>
  );
};

export default TableKichThuoc;
