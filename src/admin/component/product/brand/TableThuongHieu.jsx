import { useCallback, useEffect, useState } from "react";
import { Button, Flex, Table, Space, notification, Spin} from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import ModalThemMoi from "../ModalThemMoi";
import {
  deleteThuongHieuApi,
  getAllThuongHieuApi,
  createThuongHieuApi,
  updateThuongHieuApi,
} from "../../../../api/ThuongHieuService";
import ModalEditBrand from "./ModalEditBrand";
import TimKiemBrand from "./TimKiemBrand";

const TableThuongHieu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [itemDelete, setDeletingItem] = useState(null);
  const [itemEdit, setEditItem] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [valueSearch, setValueSearch] = useState();
  const [loading, setLoading] = useState(false);


  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: currentPage - 1,
        pageSize,
        tenThuongHieu: valueSearch,
      };
      const res = await getAllThuongHieuApi(params);
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
    try {
      await deleteThuongHieuApi(itemDelete.id);
      notification.success({
        duration: 4,
        pauseOnHover: false,
        message: "Success",
        showProgress: true,
        description: `Deleted ${itemDelete.tenThuongHieu} successfully!`,
      });
      setIsModalOpen(false);
      setDeletingItem(null);
      await fetchData();
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleEdit = (record) => {
    setEditItem(record);
    setIsModalEditOpen(true);
  };

  const handleConfirmEdit = async (id, updateThuongHieu) => {
    try {
      console.log("Dữ liệu gửi đi:", updateThuongHieu); 
      await updateThuongHieuApi(id, updateThuongHieu);
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Cập nhật thương hiệu ${updateThuongHieu.tenThuongHieu} thành công!`,
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

  const handleConfirmAdd = async (newColorName) => {
    try {
      await createThuongHieuApi({ tenThuongHieu: newColorName });
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Thêm mới thương hiệu ${newColorName} thành công!`,
      });
      setIsModalAddOpen(false);
      setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Failed to create new color", error);
    }
  };


  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Thương Hiệu",
      dataIndex: "tenThuongHieu",
      key: "tenThuongHieu",
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
    <Spin spinning={loading}>
      <TimKiemBrand
        title={"Thương hiệu"}
        placeholder={"Nhập vào thương hiệu của giày mà bạn muốn tìm !"}
        values={setValueSearch}
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
            pageSizeOptions: ["5","10", "20", "50", "100"],
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
        title={"Thương hiệu"}
        handleConfirm={handleConfirmDelete}
      />
      <ModalThemMoi
        isOpen={isModalAddOpen}
        handleClose={() => setIsModalAddOpen(false)}
        title={"Thương hiệu"}
        handleSubmit={handleConfirmAdd}
      />
      <ModalEditBrand
        title={"Thương hiệu"}
        isOpen={isModalEditOpen}
        handleClose={() => setIsModalEditOpen(false)}
        thuonghieu={itemEdit}
        handleSubmit={handleConfirmEdit}
      />
    </Spin>
  );
};

export default TableThuongHieu;
