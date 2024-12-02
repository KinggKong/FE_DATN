import { useEffect, useState, useCallback } from "react";
import { Button, Flex, Table, Space, notification, Spin, Switch } from "antd";
import { Tag } from 'antd';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import ModalThemMoiVoucher from "./ModalThemMoiVoucher";
import TimKiem from "../TimKiem";
import { getAllVoucherApi, deleteVoucherApi, updateVoucherApi, createVoucherApi } from "../../../../api/VoucherApi";
import ModalEdit3 from "./ModalEdit3";

const TableVoucher = () => {
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
        tenVoucher: valueSearch,
      };
      const res = await getAllVoucherApi(params);
      if (res && res.data && res.data.content) {
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

  const checkVoucherExists = async (value, type, excludeId) => {
    const params = {
      tenVoucher: type === 'name' ? value : undefined,
      maVoucher: type === 'code' ? value : undefined
    };
  
    const res = await getAllVoucherApi(params);
  
    return res.data.content.some(item => {
      if (type === 'name') {
        return item.tenVoucher === value && item.id !== excludeId;
      } else if (type === 'code') {
        return item.maVoucher === value && item.id !== excludeId;
      }
      return false;
    });
  };
  

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
    fetchData();
  }, [valueSearch]);

  const handleDelete = (record) => {
    setDeletingItem(record);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteVoucherApi(itemDelete.id);
      notification.success({
        message: "Success",
        duration: 4,
        showProgress: true,
        pauseOnHover: false,
        description: `Deleted voucher ${itemDelete.maVoucher} successfully!`,
      });
      setIsModalOpen(false);
      setDeletingItem(null);
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

  const validateVoucher = (voucher) => {
    if (!voucher.tenVoucher.trim()) {
      notification.error({
        message: "Lỗi",
        description: "Tên voucher không được để trống!",
      });
      return false;
    }
    if (!voucher.maVoucher.trim()) {
      notification.error({
        message: "Lỗi",
        description: "Mã voucher không được để trống!",
      });
      return false;
    }
    return true;
  };

  const handleConfirmEdit = async (id, updateVoucher) => {
    setLoading(true);
    try {
      if (!validateVoucher(updateVoucher)) {
        setLoading(false);
        return;
      }
  
      if (!updateVoucher.hinhThucGiam || !updateVoucher.giaTriGiam ||
        !updateVoucher.giaTriDonHangToiThieu || !updateVoucher.giaTriGiamToiDa ||
        !updateVoucher.ngayBatDau || !updateVoucher.ngayKetThuc) {
        notification.error({
          message: "Lỗi",
          description: "Tất cả các trường không được để trống!",
        });
        setLoading(false);
        return;
      }
  
      // Kiểm tra giá trị giảm tối đa không được lớn hơn giá trị đơn hàng tối thiểu
      if (updateVoucher.giaTriGiamToiDa > updateVoucher.giaTriDonHangToiThieu) {
        notification.error({
          message: "Lỗi",
          description: "Giá trị giảm tối đa không được lớn hơn giá trị đơn hàng tối thiểu!",
        });
        setLoading(false);
        return;
      }
  
      if (updateVoucher.loaiGiaTriGiam === '%' &&
        (updateVoucher.giaTriGiam <= 0 || updateVoucher.giaTriGiam >= 100)) {
        notification.error({
          message: "Lỗi",
          description: "Giá trị giảm theo phần trăm phải lớn hơn 0 và nhỏ hơn 100!",
        });
        setLoading(false);
        return;
      }
  
      // Kiểm tra tên và mã voucher, nhưng loại trừ voucher hiện tại bằng cách truyền thêm id
      const existsByName = await checkVoucherExists(updateVoucher.tenVoucher, 'name', id);
      const existsByCode = await checkVoucherExists(updateVoucher.maVoucher, 'code', id);
  
      if (existsByName) {
        notification.error({
          message: "Lỗi",
          description: "Tên voucher này đã tồn tại!",
        });
        setLoading(false);
        return;
      }
  
      if (existsByCode) {
        notification.error({
          message: "Lỗi",
          description: "Mã voucher này đã tồn tại!",
        });
        setLoading(false);
        return;
      }
  
      await updateVoucherApi(id, updateVoucher);
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Cập nhật voucher ${updateVoucher.maVoucher} thành công!`,
      });
      setIsModalEditOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Failed to update voucher", error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Failed to update voucher",
      });
    } finally {
      setLoading(false);
    }
  };
  


  const handleAdd = () => {
    setIsModalAddOpen(true);
  };

  const handleConfirmAdd = async (newVoucher) => {

    setLoading(true);
    try {
      if (!validateVoucher(newVoucher)) {
        setLoading(false);
        return;
      }

      if (newVoucher.loaiGiaTriGiam === '%' && (newVoucher.giaTriGiam <= 0 || newVoucher.giaTriGiam >= 100)) {
        notification.error({
          message: "Lỗi",
          description: "Giá trị giảm theo phần trăm phải lớn hơn 0 và nhỏ hơn 100!",
        });
        setLoading(false);
        return;
      }

      // Kiểm tra giá trị giảm tối đa không được lớn hơn giá trị đơn hàng tối thiểu
      if (newVoucher.giaTriGiamToiDa > newVoucher.giaTriDonHangToiThieu) {
        notification.error({
          message: "Lỗi",
          description: "Giá trị giảm tối đa không được lớn hơn giá trị đơn hàng tối thiểu!",
        });
        setLoading(false);
        return;
      }

      const existsByName = await checkVoucherExists(newVoucher.tenVoucher, 'name');
      const existsByCode = await checkVoucherExists(newVoucher.maVoucher, 'code');

      if (existsByName) {
        notification.error({
          message: "Lỗi",
          description: "Tên voucher này đã tồn tại!",
        });
        setLoading(false);
        return;
      }

      if (existsByCode) {
        notification.error({
          message: "Lỗi",
          description: "Mã voucher này đã tồn tại!",
        });
        setLoading(false);
        return;
      }

      await createVoucherApi(newVoucher);
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm voucher ${newVoucher.maVoucher} thành công!`,
      });
      setIsModalAddOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Failed to create new voucher", error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Failed to create new voucher",
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
      title: "Tên voucher",
      dataIndex: "tenVoucher",
    },
    {
      title: "Mã voucher",
      dataIndex: "maVoucher",
    },
    {
      title: "Hình thức giảm",
      dataIndex: "hinhThucGiam",
      render: (text) => {
        return (
          <Tag color="green" key={text}>
            {text}
          </Tag>
        );
      }
    },
    {
      title: "Giá trị giảm",
      dataIndex: "giaTriGiam",
      render: (text, record) => {
        if (record.hinhThucGiam === '%') {
          return (
            <Tag color="green" key={text}>
              {text} %
            </Tag>
          );
        } else if (record.hinhThucGiam === 'VNĐ') {
          return (
            <Tag color="green" key={text}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)}
            </Tag>
          );
        }
        return text;
      }
    },
    {
      title: "Giá trị đơn hàng tối thiểu",
      dataIndex: "giaTriDonHangToiThieu",
      render: (text) => {
        return (
          <Tag color="green" key={text}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)}
          </Tag>
        );
      }
    },
    {
      title: "Giá trị giảm tối đa (VNĐ)",
      dataIndex: "giaTriGiamToiDa",
      render: (text) => {
        return (
          <Tag color="green" key={text}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)}
          </Tag>
        );
      }
    },

    {
      title: "Số lượng",
      dataIndex: "soLuong",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "ngayBatDau",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "ngayKetThuc",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: (text, record) => (
        <Switch
          checked={text === 1}
          onChange={async (checked) => {
            const updatedStatus = checked ? 1 : 0;
            const updatedVoucher = { ...record, trangThai: updatedStatus };

            try {
              await updateVoucherApi(record.id, updatedVoucher);
              notification.success({
                message: "Cập nhật trạng thái thành công",
                description: `Voucher ${record.maVoucher} đã được ${checked ? "kích hoạt" : "tắt"}!`,
              });
              await fetchData(); // Cập nhật lại danh sách
            } catch (error) {
              console.error("Failed to update voucher status", error);
              notification.error({
                message: "Lỗi",
                description: "Không thể cập nhật trạng thái voucher.",
              });
            }
          }}
        />
      ),
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
        title={"Voucher"}
        placeholder={"Nhập vào tên voucher mà bạn muốn tìm!"}
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
        title={"Voucher"}
        handleConfirm={handleConfirmDelete}
      />
      <ModalThemMoiVoucher
        isOpen={isModalAddOpen}
        handleClose={() => setIsModalAddOpen(false)}
        title={"Voucher"}
        handleSubmit={handleConfirmAdd}
      />
      <ModalEdit3
        title={"Voucher"}
        isOpen={isModalEditOpen}
        handleClose={() => setIsModalEditOpen(false)}
        voucher={itemEdit}
        handleSubmit={handleConfirmEdit}
      />
    </Spin>
  );
};

export default TableVoucher;
