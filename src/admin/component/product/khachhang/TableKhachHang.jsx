import { useEffect, useState, useCallback } from "react";
import { Button, Flex, Table, Space, notification, Spin, Switch, Avatar } from "antd";
import { Tag } from 'antd';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import ModalThemMoiKhachHang from "./ModalThemMoiKhachHang";
import TimKiem from "../TimKiem";
import { storage } from '../spct/firebaseConfig'; // Import tệp cấu hình Firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { getAllKhachHangApi, deleteKhachHangApi, updateKhachHangApi, createKhachHangApi } from "../../../../api/KhachHangApi";
import ModalEditKhachHang from "./ModalEditKhachHang";

const TableKhachHang = () => {
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
        ten: valueSearch,
      };
      const res = await getAllKhachHangApi(params);
      if (res && res.data && res.data.content) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataSource(dataWithKey);
        setTotalItems(res.data.totalElements);
      }
    } catch (error) {
      console.error("Lấy dữ liệu thất bại", error);
      notification.error({
        message: "Error",
        description: "Lấy dữ liệu thất bại",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, valueSearch]);

  // Hàm tải ảnh lên Firebase và trả về URL ảnh
  const uploadImageToFirebase = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `images/${file.name}`); // Tạo tham chiếu tới vị trí lưu trữ trong Firebase
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Theo dõi tiến trình tải lên
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Có thể thêm xử lý theo dõi tiến trình tại đây nếu cần
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error); // Xử lý lỗi nếu có
        },
        () => {
          // Khi tải lên thành công, lấy URL của ảnh
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // Trả về URL ảnh
          });
        }
      );
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
      await deleteKhachHangApi(itemDelete.id);
      notification.success({
        message: "Success",
        duration: 4,
        showProgress: true,
        pauseOnHover: false,
        description: `Xóa khách hàng ${itemDelete.ten} thành công!`,
      });
      setIsModalOpen(false);
      setDeletingItem(null);
      await fetchData();
    } catch (error) {
      console.error("Xóa khách hàng thất bại", error);
      notification.error({
        message: "Error",
        duration: 4,
        showProgress: true,
        pauseOnHover: false,
        description: "Xóa khách hàng thất bại",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (record) => {
    setEditItem(record);
    setIsModalEditOpen(true);
  };

  const handleConfirmEdit = async (id, updatedKhachHang, avatarFile) => {
    setLoading(true);
    try {
      // Kiểm tra trùng mã khách hàng, email và số điện thoại
      const existingKhachHang = dataSource.find(
        (item) =>
          (item.id !== id && item.ma === updatedKhachHang.ma) ||
          (item.id !== id && item.email === updatedKhachHang.email) ||
          (item.id !== id && item.sdt === updatedKhachHang.sdt)
      );

      if (existingKhachHang) {
        // Thông báo nếu có trùng lặp
        notification.error({
          message: "Lỗi",
          description: "Mã khách hàng, Email hoặc SĐT đã tồn tại",
        });
        return; // Dừng việc cập nhật
      }

      // Nếu có ảnh mới, tải lên Firebase và lấy URL
      let avatarUrl = updatedKhachHang.avatar;
      if (avatarFile) {
        avatarUrl = await uploadImageToFirebase(avatarFile); // Tải lên Firebase và lấy URL
      }

      // Cập nhật thông tin khách hàng
      const updatedKhachHangWithAvatar = { ...updatedKhachHang, avatar: avatarUrl };

      // Gửi dữ liệu lên API để cập nhật khách hàng
      await updateKhachHangApi(id, updatedKhachHangWithAvatar);

      notification.success({
        message: "Success",
        description: `Updated customer ${updatedKhachHang.ten} successfully!`,
      });

      setIsModalEditOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Failed to update customer", error);
      notification.error({
        message: "Error",
        description: "Có lỗi khi cập nhật khách hàng",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleAdd = () => {
    setIsModalAddOpen(true);
  };

  const handleConfirmAdd = async (newKhachHang, avatarFile) => {
    setLoading(true);
    try {
      // Kiểm tra trùng mã khách hàng, email và số điện thoại
      const existingKhachHang = dataSource.find(
        (item) =>
          item.ma === newKhachHang.ma ||
          item.email === newKhachHang.email ||
          item.sdt === newKhachHang.sdt
      );

      if (existingKhachHang) {
        // Thông báo nếu có trùng lặp
        notification.error({
          message: "Lỗi",
          description: "Mã khách hàng, Email hoặc SĐT đã tồn tại",
        });
        return; // Dừng việc thêm mới khách hàng
      }

      // Tải ảnh lên Firebase (nếu có file ảnh)
      let avatarUrl = '';
      if (avatarFile) {
        avatarUrl = await uploadImageToFirebase(avatarFile); // Tải lên Firebase và lấy URL
      }

      // Tạo đối tượng khách hàng mới
      const newKhachHangWithAvatar = { ...newKhachHang, avatar: avatarUrl };

      // Gửi dữ liệu lên API tạo khách hàng mới
      await createKhachHangApi(newKhachHangWithAvatar);

      notification.success({
        message: "Success",
        description: `Added new customer ${newKhachHang.ten} successfully!`,
      });

      setIsModalAddOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Failed to create new customer", error);
      notification.error({
        message: "Error",
        description: "Có lỗi khi thêm khách hàng mới",
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
      title: "Hình ảnh",
      dataIndex: "avatar",
      render: (avatarUrl) => (
        avatarUrl ? (
          <Avatar src={avatarUrl} alt="avatar" size={64} />
        ) : (
          <Avatar icon="user" size={64} />
        )
      ),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "ten",
    },
    {
      title: "Mã khách hàng",
      dataIndex: "ma",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "sdt",
    },
    {
      title: "Ngày sinh",
      dataIndex: "ngaySinh",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Giới tính",
      dataIndex: "gioiTinh",
      render: (text) => (text ? 'Nam' : 'Nữ'), // Giới tính là boolean, true = Nam, false = Nữ
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: (text, record) => (
        <Switch
          checked={text === 1}
          onChange={async (checked) => {
            const updatedStatus = checked ? 1 : 0;
            const updatedKhachHang = { ...record, trangThai: updatedStatus };

            try {
              await updateKhachHangApi(record.id, updatedKhachHang);
              notification.success({
                message: "Updated status successfully",
                description: `Customer ${record.ten} has been ${checked ? "activated" : "deactivated"}!`,
              });
              await fetchData(); // Refresh data
            } catch (error) {
              console.error("Failed to update customer status", error);
              notification.error({
                message: "Error",
                description: "Failed to update status.",
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
        title={"Khách hàng"}
        placeholder={"Nhập vào tên khách hàng để tìm!"}
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
        title={"Khách hàng"}
        handleConfirm={handleConfirmDelete}
      />
      <ModalThemMoiKhachHang
        isOpen={isModalAddOpen}
        handleClose={() => setIsModalAddOpen(false)}
        title={"Khách hàng"}
        handleSubmit={handleConfirmAdd}
      />
      <ModalEditKhachHang
        title={"Khách hàng"}
        isOpen={isModalEditOpen}
        handleClose={() => setIsModalEditOpen(false)}
        khachHang={itemEdit}
        handleSubmit={handleConfirmEdit}
      />
    </Spin>
  );
};

export default TableKhachHang;