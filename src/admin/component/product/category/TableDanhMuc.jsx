import { useCallback, useEffect, useState } from "react";
import { Button, Flex, Table, Space, notification, Spin } from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import ModalThemMoi from "../ModalThemMoi";
import {
  deleteDanhMucApi,
  getAllDanhMucApi,
  createDanhMucApi,
  updateDanhMucApi,
} from "../../../../api/DanhMucService";
import ModalEditCategory from "./ModalEditCAtegory";
import TimKiemCategory from "./TimKiemCategory";

const TableDanhMuc = () => {
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
        tenDanhMuc: valueSearch,
      };
      const res = await getAllDanhMucApi(params);
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
      await deleteDanhMucApi(itemDelete.id);
      notification.success({
        duration: 4,
        pauseOnHover: false,
        message: "Success",
        showProgress: true,
        description: `Deleted ${itemDelete.tenDanhMuc} successfully!`,
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

  const handleConfirmEdit = async (id, updateDanhMuc) => {
    try {
      console.log("Dữ liệu gửi đi:", updateDanhMuc); 
      await updateDanhMucApi(id, updateDanhMuc);
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Cập nhật danh muc ${updateDanhMuc.tenDanhMuc} thành công!`,
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
      await createDanhMucApi({ tenDanhMuc: newColorName });
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Thêm mới Danh mục ${newColorName} thành công!`,
      });
      setIsModalAddOpen(false);
      await fetchData();
      setCurrentPage(1);
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
      title: "Danh mục",
      dataIndex: "tenDanhMuc",
      key: "tenDanhMuc",
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
      <TimKiemCategory
        title={"Danh mục"}
        placeholder={"Nhập vào Danh mục của giày mà bạn muốn tìm !"}
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
        title={"Danh mục"}
        handleConfirm={handleConfirmDelete}
      />
      <ModalThemMoi
        isOpen={isModalAddOpen}
        handleClose={() => setIsModalAddOpen(false)}
        title={"Danh mục"}
        handleSubmit={handleConfirmAdd}
      />
      <ModalEditCategory
        title={"Danh mục"}
        isOpen={isModalEditOpen}
        handleClose={() => setIsModalEditOpen(false)}
        danhmuc={itemEdit}
        handleSubmit={handleConfirmEdit}
      />
      
    </Spin>
    
  );
};

export default TableDanhMuc;
;
