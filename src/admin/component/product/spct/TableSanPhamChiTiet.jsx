import React, { useCallback } from 'react';
import { Table, Switch, Space, Button, Row, Col, Select, Modal, Spin } from 'antd';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { AiFillEye } from "react-icons/ai";
import { PlusOutlined } from '@ant-design/icons';

import {
    getAllSanPhamChiTietApi, deleteSanPhamChiTietApi, getSanPhamChiTietByProductIdApi,
    updateSanPhamChiTietApi, createSanPhamChiTietApi, updateProductStautsApi,
    getSanPhamChiTietByIdMauSacAndIdKichThuocApi
} from '../../../../api/SanPhamChiTietAPI';

import { useEffect, useState } from 'react';
import { notification } from 'antd';
import ModalConfirm from '../ModalConfirm';
import DrawerEdit from './DrawerView';
import ModalEdit from './ModalEdit';
import { getSanPhamByIdApi, getAllSanPhamApi } from '../../../../api/SanPhamApi';
import DrawerAdd from './Drawer';
import { storage } from "./firebaseConfig"; // Import tệp cấu hình Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { getAllDanhMucApi } from "../../../../api/DanhMucService";
import { getAllThuongHieuApi } from "../../../../api/ThuongHieuService";
import { getAllChatLieuVaiApi } from "../../../../api/ChatLieuVaiApi";
import { getAllChatLieuDeApi } from "../../../../api/ChatLieuDeApi";
;
import DrawerView from './DrawerView';

const TableSanPhamChiTiet = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dataSource, setDataSource] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingDrawerAdd, setLoadingDrawerAdd] = useState(false);

    const [itemDelete, setDeletingItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenEdit, setOpenEdit] = useState(false);
    const [dataEdit, setDataEdit] = useState([]);
    const [productEdit, setProductEdit] = useState(null);
    const [open, setOpen] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [productView, setProductView] = useState(null);
    const [dataView, setDataView] = useState([]);

    const [idDanhMuc, setIdDanhMuc] = useState();
    const [idThuongHieu, setIdThuongHieu] = useState();
    const [idChatLieuVai, setIdChatLieuVai] = useState();
    const [idChatLieuDe, setIdChatLieuDe] = useState();
    const [idSanPham, setIdSanPham] = useState();
    const [dataSanPham, setDataSanPham] = useState([]);
    const [dataDanhMuc, setDataDanhMuc] = useState([]);
    const [dataThuongHieu, setDataThuongHieu] = useState([]);
    const [dataChatLieuVai, setDatChatLieuVai] = useState([]);
    const [dataChatLieuDe, setDataChatLieuDe] = useState([]);


    //fetch data filter
    const fetchDataSanPham = async () => {
        setLoading(true);
        try {
            const params = {
                pageNumber: 0,
                pageSize: 100,
            };
            const res = await getAllSanPhamApi(params);
            if (res && res.data) {
                const dataWithKey = res.data.content.map((item) => ({
                    ...item,
                    key: item.id,
                }));
                setDataSanPham(dataWithKey);
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
    };
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




    const handleChangeStatus = async (id, checked) => {
        console.log(id, checked);
        setLoading(true);
        try {
            const newStatus = checked ? 1 : 0;
            await updateProductStautsApi(id, newStatus);
            notification.success({
                message: "Success",
                duration: 4,
                pauseOnHover: false,
                showProgress: true,
                description: `Cập nhật trạng thái sản phẩm chi tiết thành công!`,
            });

            await fetchData();
        } catch (error) {
            console.error("Failed to update san pham chi tiết", error);
            notification.error({
                message: "Error",
                duration: 4,
                pauseOnHover: false,
                showProgress: true,
                description: "Failed to update trạng thái sản phẩm chi tiết",
            });
        } finally {
            setLoading(false);
        }
    }

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'tenSanPham',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'hinhAnhList',
            render: (hinhAnhList) => {
                if (hinhAnhList && hinhAnhList.length > 0) {
                    return <img src={hinhAnhList[0].url} alt="Hình ảnh sản phẩm" style={{ height: '100px', width: 'auto' }} />;
                }
                return <span>Không có hình ảnh</span>; // Hiển thị nếu không có hình ảnh
            },
        },
        {
            title: 'Tên màu',
            dataIndex: 'tenMauSac',
        },
        {
            title: 'Tên kích thước',
            dataIndex: 'tenKichThuoc',
        },
        {
            title: 'Số lượng còn lại',
            dataIndex: 'soLuong',
            sorter: {
                compare: (a, b) => a.soLuong - b.soLuong,
                multiple: 3,
            },
            render: (soLuong) => `${soLuong} đôi`,
        },
        {
            title: 'Giá gốc',
            dataIndex: 'giaBan',
            sorter: {
                compare: (a, b) => a.giaBan - b.giaBan,
                multiple: 2,
            },
            render: (giaBan) => giaBan.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: 'Giá khuyến mãi',
            dataIndex: 'giaBanSauKhiGiam',
            sorter: {
                compare: (a, b) => a.giaBan - b.giaBan,
                multiple: 2,
            },
            render: (giaBan) => giaBan.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        // {
        //     title: 'Ngày tạo',
        //     dataIndex: 'createdAt',
        //     sorter: {
        //         compare: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        //         multiple: 1,
        //     },
        // },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            render: (_, record) => (
                <Switch
                    checked={record.trangThai == 1}
                    onChange={(checked) => handleChangeStatus(record.id, checked)}
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
                    <Button type="link">
                        <AiFillEye className="size-5" onClick={() => showDrawerView(record)} />
                    </Button>
                </Space>
            ),
        },
    ];
    const fetchData = useCallback(async () => {
        const params = {
            pageNumber: currentPage - 1,
            pageSize,
            idDanhMuc,
            idThuongHieu,
            idChatLieuVai,
            idChatLieuDe,
            idSanPham,

        };

        const res = await getAllSanPhamChiTietApi(params);
        if (res && res.data) {
            const dataWithKey = res.data.content.map((item) => ({
                ...item,
                key: item.id,
            }));

            setDataSource(dataWithKey);
            setTotalItems(res.data.totalElements);
        }
    }, [currentPage,
        pageSize,
        idDanhMuc,
        idThuongHieu,
        idChatLieuVai,
        idChatLieuDe,
        idSanPham,
    ]);

    useEffect(() => {
        fetchDataDanhMuc();
        fetchDataThuongHieu();
        fetchDataChatLieuDe();
        fetchDataChatLieuVai();
        fetchDataSanPham();
        fetchData();
    }, [fetchData]);
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const handleConfirmEdit = async (id, updateProduct) => {
        setLoading(true);
        console.log(updateProduct);
        // //Check mỗi sản phẩm cần ít nhất 1 ảnh
        // const isAllProductsHaveImage = updateProduct.hinhAnh && updateProduct.hinhAnh.length > 0;

        try {
            // if (!isAllProductsHaveImage) {
            //     notification.error({
            //         duration: 4,
            //         pauseOnHover: false,
            //         message: "Error",
            //         description: "Mỗi sản phẩm chi tiết cần ít nhất 1 ảnh!",
            //     });
            //     return;
            // }
            await updateSanPhamChiTietApi(id, updateProduct);
            notification.success({
                message: "Success",
                duration: 4,
                pauseOnHover: false,
                showProgress: true,
                description: `Cập nhật sản phẩm ${updateProduct.tenSanPham} thành công!`,
            });
            setOpenEdit(false);
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
    const handleConfirmDelete = async () => {
        setLoading(true);
        try {
            await deleteSanPhamChiTietApi(itemDelete.id);
            notification.success({
                message: "Success",
                duration: 4,
                pauseOnHover: false,
                showProgress: true,
                description: `Xóa sản phẩm chi tiết thành công !`,
            });
            setIsModalOpen(false);
            await fetchData();
        } catch (error) {
            console.error("Failed to delete item product", error);
            notification.error({
                message: "Error",
                duration: 4,
                showProgress: true,
                pauseOnHover: false,
                description: "Failed to delete item product",
            });
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = (record) => {
        setDeletingItem(record);
        setIsModalOpen(true);
    };
    const handleEdit = (record) => {
        console.log(record);
        setProductEdit(record);
        setOpenEdit(true);

    };
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const showDrawerView = (record) => {
        console.log(record);
        const fetchDataView = async () => {
            const res = await getSanPhamByIdApi(record.id_sanPham);
            const res1 = await getSanPhamChiTietByProductIdApi(record.id_sanPham);
            console.log(res1.data.content);
            console.log(res.data);
            setDataView(res1.data.content);
            setProductView(res.data);
        };
        fetchDataView();

        setOpenView(true);
    };
    const onCloseView = () => {
        setOpenView(false);
    };
    //hàm tải ảnh lên firebase
    const uploadImageToFirebase = async (image) => {
        const imgRef = ref(storage, `images/${uuidv4()}`);
        await uploadBytes(imgRef, image);
        return await getDownloadURL(imgRef);
    };

    const handleAddProduct = async (tableData) => {

        console.log(tableData);
        if (!tableData || tableData.length === 0) {
            notification.error({
                duration: 4,
                pauseOnHover: false,
                message: "Error",
                description: "Không có dữ liệu để thêm sản phẩm!",
            });
            return;
        }



        try {
            // setLoading(true);
            //Check mỗi sản phẩm cần ít nhất 1 ảnh
            const isAllProductsHaveImage = tableData.every((item) => item.image && item.image.length > 0);
            if (!isAllProductsHaveImage) {
                notification.error({
                    duration: 4,
                    pauseOnHover: false,
                    message: "Error",
                    description: "Mỗi sản phẩm chi tiết cần ít nhất 1 ảnh!",
                });
                return;
            }

            //check giá nhỏ hơn 500 triệu
            const isAllProductsHavePrice = tableData.every((item) => item.giaBan < 500000000);
            if (!isAllProductsHavePrice) {
                notification.error({
                    duration: 4,
                    pauseOnHover: false,
                    message: "Error",
                    description: "Giá sản phẩm phải nhỏ hơn 500 triệu!",
                });
                return;
            }
            setLoadingDrawerAdd(true);
            const checkPromises = tableData.map(async (item) => {
                const params = {
                    idSp: item.id_sanPham,
                    idMauSac: item.id_mauSac,
                    idKichThuoc: item.id_kichThuoc,
                };


                const response = await getSanPhamChiTietByIdMauSacAndIdKichThuocApi(params);
                return response.data; // Trả về sản phẩm chi tiết nếu đã tồn tại, null nếu không tồn tại
            });

            const checkResults = await Promise.all(checkPromises);
            const existingItems = checkResults.filter(item => item != null); // Lọc các sản phẩm chi tiết đã tồn tại


            if (existingItems.length > 0) {
                // Nếu có sản phẩm chi tiết đã tồn tại, hiển thị confirm
                Modal.confirm({
                    title: "Sản phẩm đã tồn tại!",
                    content: "Sản phẩm chi tiết đã tồn tại. Bạn có muốn cập nhật hay tiếp tục thêm không?",
                    okText: "Cập nhật",
                    cancelText: "Huỷ",
                    onOk: async () => {
                        await addOrUpdateProducts(tableData); // Gọi hàm thêm hoặc cập nhật sản phẩm ở đây
                    },
                    onCancel: () => {
                        console.log("User cancelled the operation");
                    }
                });
            } else {
                await addOrUpdateProducts(tableData); // Nếu không có sản phẩm tồn tại, gọi hàm thêm
            }
        } catch (error) {
            console.error("Failed to add product", error);
            notification.error({
                duration: 4,
                pauseOnHover: false,
                message: "Error",
                description: "Thêm sản phẩm thất bại!",
            });
        } finally {
            setLoading(false);
            setLoadingDrawerAdd(false);
        }
    };
    const addOrUpdateProducts = async (tableData) => {
        const uploadPromises = tableData.map(async (item) => {
            const uploadedImageUrls = item.image && item.image.length > 0
                ? await Promise.all(item.image.map(uploadImageToFirebase))
                : [];
            return {
                ...item,
                hinhAnh: uploadedImageUrls,
            };
        });


        const updatedTableData = await Promise.all(uploadPromises);
        console.log(updatedTableData);
        await createSanPhamChiTietApi(updatedTableData);


        notification.success({
            duration: 4,
            pauseOnHover: false,
            message: "Success",
            showProgress: true,
            description: "Thêm sản phẩm thành công!",
        });

        await fetchData();
        setOpen(false);
    };
    return (
        <div>
            {loading ? (
                <Spin size="large" />
            ) : (<>

                <label className="text-sm block mb-2 mt-2" htmlFor="">
                    Sản phẩm
                </label>
                <Row className="flex items-center justify-between mb-3 mt-3">
                    <Col span={16}>

                        <Select
                            showSearch
                            style={{
                                width: "100%",
                            }}
                            placeholder="Tất cả sản phẩm"
                            optionFilterProp="label"
                            // filterSort={(optionA, optionB) =>
                            //     (optionA?.label ?? "")
                            //         .toLowerCase()
                            //         .localeCompare((optionB?.label ?? "").toLowerCase())
                            // }
                            value={idSanPham}
                            onChange={(value) => {
                                setIdSanPham(value);
                            }}
                            options={[
                                { value: "", label: "Tất cả sản phẩm" },
                                ...dataSanPham?.map((sanPham) => ({
                                    value: sanPham.id,
                                    label: sanPham.tenSanPham,
                                })),
                            ]}
                        />
                    </Col>
                    <Col span={6} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                            Thêm mới sản phẩm chi tiết
                        </Button>
                    </Col>
                </Row>

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
                            placeholder="Tất cả thương hiệu"
                            optionFilterProp="label"
                            // filterSort={(optionA, optionB) =>
                            //     (optionA?.label ?? "")
                            //         .toLowerCase()
                            //         .localeCompare((optionB?.label ?? "").toLowerCase())
                            // }
                            value={idThuongHieu}
                            onChange={(value) => {
                                setIdThuongHieu(value);
                            }}
                            options={[
                                { value: "", label: "Tất cả thương hiệu" },
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
                            placeholder="Tất cả danh mục"
                            optionFilterProp="label"
                            // filterSort={(optionA, optionB) =>
                            //     (optionA?.label ?? "")
                            //         .toLowerCase()
                            //         .localeCompare((optionB?.label ?? "").toLowerCase())
                            // }
                            options={[
                                { value: "", label: "Tất cả danh mục" },
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
                            placeholder="Tất cả chất vải"
                            optionFilterProp="label"
                            // filterSort={(optionA, optionB) =>
                            //     (optionA?.label ?? "")
                            //         .toLowerCase()
                            //         .localeCompare((optionB?.label ?? "").toLowerCase())
                            // }
                            options={[
                                { value: "", label: "Tất cả chất vải" },
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
                            placeholder="Tất cả chất đế"
                            optionFilterProp="label"
                            // filterSort={(optionA, optionB) =>
                            //     (optionA?.label ?? "")
                            //         .toLowerCase()
                            //         .localeCompare((optionB?.label ?? "").toLowerCase())
                            // }
                            options={[
                                { value: "", label: "Tất cả chất đế" },
                                ...dataChatLieuDe?.map((de) => ({
                                    value: de.id,
                                    label: de.tenChatLieu,
                                })),
                            ]}
                        />
                    </Col>
                </Row>
                <ModalConfirm
                    isOpen={isModalOpen}
                    handleClose={() => setIsModalOpen(false)}
                    title={"sản phẩm chi tiết"}
                    handleConfirm={handleConfirmDelete}
                />
                <DrawerView
                    isOpen={openView}
                    onClose={() => setOpenView(false)}
                    product={productView}
                    productDetails={dataView}
                />
                <ModalEdit
                    isOpen={isOpenEdit}
                    handleClose={() => setOpenEdit(false)}
                    product={productEdit}
                    handleSubmit={handleConfirmEdit}
                />
                <DrawerAdd
                    isOpen={open}
                    handleClose={onClose}
                    handleAddProduct={handleAddProduct}
                    loadingDrawer={loadingDrawerAdd}
                />
                <Table columns={columns} dataSource={dataSource} onChange={onChange}
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
                    }} />



            </>
            )}

        </div>



    );
};
export default TableSanPhamChiTiet;