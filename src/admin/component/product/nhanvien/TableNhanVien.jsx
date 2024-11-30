import { useEffect, useState, useCallback } from "react";
import { Button, Flex, Table, Space, notification, Spin, Switch, Avatar } from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import ModalThemMoiNhanVien from "./ModalThemMoiNhanVien";
import TimKiem from "../TimKiem";
import { storage } from '../spct/firebaseConfig'; // Import tệp cấu hình Firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { getAllNhanVienApi, deleteNhanVienApi, updateNhanVienApi, createNhanVienApi } from "../../../../api/NhanVienApi";
import ModalEditNhanVien from "./ModalEditNhanVien";

const TableNhanVien = () => {
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
      const res = await getAllNhanVienApi(params);
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
      await deleteNhanVienApi(itemDelete.id);
      notification.success({
        message: "Success",
        description: `Xóa nhân viên ${itemDelete.ten} thành công!`,
      });
      setIsModalOpen(false);
      setDeletingItem(null);
      await fetchData();
    } catch (error) {
      console.error("Xóa nhân viên thất bại", error);
      notification.error({
        message: "Error",
        description: "Xóa nhân viên thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditItem(record);
    setIsModalEditOpen(true);
  };

  const handleConfirmEdit = async (id, updatedNhanVien, avatarFile) => {
    setLoading(true);
    try {
      let avatarUrl = updatedNhanVien.avatar;
      if (avatarFile) {
        avatarUrl = await uploadImageToFirebase(avatarFile);
      }
  
      const updatedNhanVienWithAvatar = { ...updatedNhanVien, avatar: avatarUrl };
  
      await updateNhanVienApi(id, updatedNhanVienWithAvatar);
  
      notification.success({
        message: "Success",
        description: `Cập nhật nhân viên ${updatedNhanVien.ten} thành công!`,
      });
  
      setIsModalEditOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Cập nhật nhân viên thất bại", error);
      notification.error({
        message: "Error",
        description: " Vui lòng nhập đầy đủ thông tin",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsModalAddOpen(true);
  };

  const handleConfirmAdd = async (newNhanVien, avatarFile) => {
    setLoading(true);
    try {
      let avatarUrl = '';
      if (avatarFile) {
        avatarUrl = await uploadImageToFirebase(avatarFile);
      }
  
      const newNhanVienWithAvatar = { ...newNhanVien, avatar: avatarUrl };
  
      await createNhanVienApi(newNhanVienWithAvatar);
  
      notification.success({
        message: "Success",
        description: `Thêm mới nhân viên ${newNhanVien.ten} thành công!`,
      });
  
      setIsModalAddOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Tạo nhân viên mới thất bại", error);
      notification.error({
        message: "Error",
        description: "Email, SĐT không được trùng nhau",
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
      title: "Tên nhân viên",
      dataIndex: "ten",
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
      title: "Địa chỉ",
      dataIndex: "diaChi",
    },
    {
      title: "Giới tính",
      dataIndex: "gioiTinh",
      render: (text) => (text ? 'Nam' : 'Nữ'),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: (text, record) => (
        <Switch
          checked={text === 1}
          onChange={async (checked) => {
            const updatedStatus = checked ? 1 : 0;
            const updatedNhanVien = { ...record, trangThai: updatedStatus };

            try {
              await updateNhanVienApi(record.id, updatedNhanVien);
              notification.success({
                message: "Cập nhật trạng thái thành công",
                description: `Nhân viên ${record.ten} đã ${checked ? "kích hoạt" : "vô hiệu hóa"}!`,
              });
              await fetchData();
            } catch (error) {
              console.error("Cập nhật trạng thái thất bại", error);
              notification.error({
                message: "Error",
                description: "Cập nhật trạng thái thất bại.",
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
        title={"Nhân viên"}
        placeholder={"Nhập vào tên nhân viên để tìm!"}
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
        title={"Nhân viên"}
        handleConfirm={handleConfirmDelete}
      />
      <ModalThemMoiNhanVien
        isOpen={isModalAddOpen}
        handleClose={() => setIsModalAddOpen(false)}
        title={"Nhân viên"}
        handleSubmit={handleConfirmAdd}
      />
      <ModalEditNhanVien
        title={"Nhân viên"}
        isOpen={isModalEditOpen}
        handleClose={() => setIsModalEditOpen(false)}
        nhanVien={itemEdit}
        handleSubmit={handleConfirmEdit}
      />
    </Spin>
  );
};

export default TableNhanVien;
