import { useEffect, useState } from "react";
import { Button, Flex, Table, Space } from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConfirm from "../ModalConfirm";
import axios from "axios";
import ModalThemMoi from "../ModalThemMoi";

const TableKichThuoc = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [itemDelete, setDeletingItem] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleEdit = () => {};

  const handleDelete = (record) => {
    console.log(record);
    setDeletingItem(record);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setIsModalAddOpen(true);
  };

  const handleConfirmAdd = () => {
    setIsModalAddOpen(false);
  };

  const handleConfirmDelete = () => {
    // Thực hiện xóa ở đây
    console.log("da xoa phan tu", itemDelete);
    setIsModalOpen(false); // Đóng modal
    setDeletingItem(null); // Reset lại trạng thái
  };

  const getData = (page, pageSize) => {
    axios
      .get(
        `https://api.instantwebtools.net/v1/passenger?page=${page}&size=${pageSize}`
      )
      .then(function (response) {
        const dataWithKey = response.data.data.map((item) => ({
          ...item,
          key: item._id,
        }));
        setDataSource(dataWithKey);
        setTotalItems(response.data.totalPassengers);
      });
  };

  useEffect(() => {
    getData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
    },
    {
      title: "Kích thước",
      dataIndex: "name",
      showSorterTooltip: false,
    },
    {
      title: "Ngày tạo",
      dataIndex: "trips",
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

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      <Flex gap="middle" className="mt-4" vertical>
        <Flex align="center" gap="middle">
          <Button
            type="primary"
            onClick={start}
            disabled={!hasSelected}
            loading={loading}
          >
            Xóa
          </Button>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
        </Flex>

        <Table
          rowSelection={rowSelection}
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
        title={"kích thước"}
        handleConfirm={handleConfirmDelete}
      />
      <ModalThemMoi
        isOpen={isModalAddOpen}
        handleClose={() => setIsModalAddOpen(false)}
        title={"kích thước"}
        handleSubmit={handleConfirmAdd}
      />
    </>
  );
};

export default TableKichThuoc;
