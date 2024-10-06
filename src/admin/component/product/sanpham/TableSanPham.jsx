import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Flex,
  Table,
  Space,
  notification,
  Spin,
  Col,
  Row,
  Select,
  Switch,
} from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import ModalThemMoiSanPham from "./ModalThemMoiSanPham";
import TimKiem from "../TimKiem";
import {
  getAllSanPhamApi,
  deleteSanPhamApi,
  updateSanPhamApi,
  createSanPhamApi,
  updateProductStautsApi,
} from "../../../../api/SanPhamApi";
import { getAllDanhMucApi } from "../../../../api/DanhMucService";
import { getAllThuongHieuApi } from "../../../../api/ThuongHieuService";
import { getAllChatLieuVaiApi } from "../../../../api/ChatLieuVaiApi";
import { getAllChatLieuDeApi } from "../../../../api/ChatLieuDeApi";
import ModalEditSanPham from "./ModalEditSanPham";

const TableSanPham = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [itemDelete, setDeletingItem] = useState(null);
  const [productEdit, setProductEdit] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [dataDanhMuc, setDataDanhMuc] = useState([]);
  const [dataThuongHieu, setDataThuongHieu] = useState([]);
  const [dataChatLieuVai, setDatChatLieuVai] = useState([]);
  const [dataChatLieuDe, setDataChatLieuDe] = useState([]);

  const [valueSearch, setValueSearch] = useState();
  const [idDanhMuc, setIdDanhMuc] = useState();
  const [idThuongHieu, setIdThuongHieu] = useState();
  const [idChatLieuVai, setIdChatLieuVai] = useState();
  const [idChatLieuDe, setIdChatLieuDe] = useState();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: currentPage - 1,
        pageSize,
        idDanhMuc,
        idThuongHieu,
        idChatLieuVai,
        idChatLieuDe,
        tenSanPham: valueSearch,
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
      console.error("Failed to fetch data san pham", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data san pham",
      });
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    idDanhMuc,
    idThuongHieu,
    idChatLieuVai,
    idChatLieuDe,
    valueSearch,
  ]);

  const fetchDataDanhMuc = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const res = await getAllDanhMucApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataDanhMuc(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch data danh muc", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data danh muc",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDataThuongHieu = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const res = await getAllThuongHieuApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataThuongHieu(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch data thuong hieu", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data thuong hieu",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDataChatLieuDe = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const res = await getAllChatLieuDeApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataChatLieuDe(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch data chat lieu de", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data chat lieu de",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDataChatLieuVai = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const res = await getAllChatLieuVaiApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDatChatLieuVai(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch data chat lieu vai", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data chat lieu vai",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataDanhMuc();
    fetchDataThuongHieu();
    fetchDataChatLieuDe();
    fetchDataChatLieuVai();
    fetchData();
  }, [fetchData]);

  const handleDelete = (record) => {
    setDeletingItem(record);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteSanPhamApi(itemDelete.id);
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Xóa sản phẩm thành công !`,
      });
      setIsModalOpen(false);
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
    setProductEdit(record);
    setIsModalEditOpen(true);
  };

  const handleConfirmEdit = async (id, updateProduct) => {
    setLoading(true);
    try {
      await updateSanPhamApi(id, updateProduct);
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Cập nhật sản phẩm ${updateProduct.tenSanPham} thành công!`,
      });
      setIsModalEditOpen(false);
      // setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Failed to update san pham", error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Failed to update san pham",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsModalAddOpen(true);
  };

  const handleConfirmAdd = async (newProduct) => {
    setLoading(true);
    try {
      await createSanPhamApi(newProduct);
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm sản phẩm thành công!`,
      });
      setIsModalAddOpen(false);
      // setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Failed to create sản phẩm", error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Failed to create sản phẩm",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (id, isActive) => {
    setLoading(true);
    try {
      const newStatus = isActive ? 1 : 0;
      await updateProductStautsApi(id, newStatus);
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Cập nhật trạng thái sản phẩm thành công!`,
      });
      setIsModalEditOpen(false);
      // setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Failed to update san pham", error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Failed to update trạng thái sản phẩm",
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
      render: (_, record) => (
        <Switch
          checked={record.trangThai == 1}
          onChange={(checked) => handleChangeStatus(record.id, checked)}
        />
      ),
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
      <Row className="flex justify-between mb-3 mt-3">
        <Col span={5}>
          <label className="text-sm block mb-2" htmlFor="">
            Thương hiệu
          </label>
          <Select
            showSearch
            style={{
              width: "100%",
            }}
            placeholder="-----------------------------------"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            value={idThuongHieu}
            onChange={(value) => {
              setIdThuongHieu(value);
            }}
            options={[
              { value: "", label: "-----------------------------------" },
              ...dataThuongHieu?.map((thuongHieu) => ({
                value: thuongHieu.id,
                label: thuongHieu.tenThuongHieu,
              })),
            ]}
          />
        </Col>
        <Col span={5}>
          <label className="text-sm block mb-2" htmlFor="">
            Danh mục
          </label>
          <Select
            showSearch
            style={{
              width: "100%",
            }}
            value={idDanhMuc}
            onChange={(value) => {
              setIdDanhMuc(value);
            }}
            placeholder="-----------------------------------"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[
              { value: "", label: "-----------------------------------" },
              ...dataDanhMuc?.map((danhMuc) => ({
                value: danhMuc.id,
                label: danhMuc.tenDanhMuc,
              })),
            ]}
          />
        </Col>
        <Col span={5}>
          <label className="text-sm block mb-2" htmlFor="">
            Chất liệu vải
          </label>
          <Select
            showSearch
            style={{
              width: "100%",
            }}
            value={idChatLieuVai}
            onChange={(value) => {
              setIdChatLieuVai(value);
            }}
            placeholder="-----------------------------------"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[
              { value: "", label: "-----------------------------------" },
              ...dataChatLieuVai?.map((vai) => ({
                value: vai.id,
                label: vai.tenChatLieuVai,
              })),
            ]}
          />
        </Col>
        <Col span={5}>
          <label className="text-sm block mb-2" htmlFor="">
            Chất liệu đế
          </label>
          <Select
            showSearch
            style={{
              width: "100%",
            }}
            value={idChatLieuDe}
            onChange={(value) => {
              setIdChatLieuDe(value);
            }}
            placeholder="-----------------------------------"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[
              { value: "", label: "-----------------------------------" },
              ...dataChatLieuDe?.map((de) => ({
                value: de.id,
                label: de.tenChatLieu,
              })),
            ]}
          />
        </Col>
      </Row>
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
        title={"sản phẩm"}
        handleConfirm={handleConfirmDelete}
      />
      <ModalThemMoiSanPham
        isOpen={isModalAddOpen}
        handleClose={() => setIsModalAddOpen(false)}
        title={"sản phẩm"}
        handleSubmit={handleConfirmAdd}
        dataDanhMuc={dataDanhMuc}
        dataThuongHieu={dataThuongHieu}
        dataChatLieuVai={dataChatLieuVai}
        dataChatLieuDe={dataChatLieuDe}
      />
      <ModalEditSanPham
        handleClose={() => setIsModalEditOpen(false)}
        isOpen={isModalEditOpen}
        title={"Sản phẩm"}
        product={productEdit}
        handleSubmit={handleConfirmEdit}
        dataDanhMuc={dataDanhMuc}
        dataThuongHieu={dataThuongHieu}
        dataChatLieuVai={dataChatLieuVai}
        dataChatLieuDe={dataChatLieuDe}
      />
    </Spin>
  );
};

export default TableSanPham;
