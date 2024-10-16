import { Modal, Row, Col, Input, Switch, Select, Form, Upload,Image } from "antd";
import { CheckOutlined, CloseOutlined,PlusOutlined } from "@ant-design/icons";

import { FaEdit } from "react-icons/fa";
import { useEffect,useState  } from "react";
const { TextArea } = Input;
import { useFormik } from "formik";
import * as Yup from "yup";
import { storage } from "./firebaseConfig"; // Import tệp cấu hình Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const ModalEdit = ({
    isOpen,
    handleClose,
    title,
    handleSubmit,
    product,

}) => {
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [hinhAnhNew, setHinhAnhNew] = useState([]);
    const validationSchema = Yup.object().shape({
        soLuong: Yup.number()
            .typeError("Số lượng phải là một số")
            .min(0, "Số lượng không được âm")
            .required("Số lượng là bắt buộc"), // Nếu bạn muốn bắt buộc
        giaBan: Yup.number()
            .typeError("Giá bán phải là một số")
            .min(0, "Giá bán không được âm")
            .required("Giá bán là bắt buộc"),

    });

    const formik = useFormik({
        initialValues: {
            soLuong: product?.soLuong || 0,
            giaBan: product?.giaBan || 0,
            tenSanPham: product?.tenSanPham || "",
            tenKichThuoc: product?.tenKichThuoc || "",
            tenMauSac: product?.tenMauSac || "",
            trangThai: product?.trangThai,
            id_mauSac: product?.id_mauSac || "",
            id_kichThuoc: product?.id_kichThuoc || "",
            id_sanPham: product?.id_sanPham || "",
            hinhAnhList: product?.hinhAnhList || [],
            hinhAnh: product?.hinhAnhList || [],
            
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            const adjustedValues = {
                ...values,
                hinhAnh: hinhAnhNew, // Chỉ gửi URL
            };
            console.log(adjustedValues);
            handleSubmit(product?.id, adjustedValues);
        },
    });

    const uploadImageToFirebase = async (image) => {
        const imgRef = ref(storage, `images/${uuidv4()}`);
        await uploadBytes(imgRef, image);
        return await getDownloadURL(imgRef);
      };
      
      const handleUploadChange = async ({ fileList }) => {
        
          
        const newFileList = await Promise.all(
            fileList.map(async (file) => {
                // Kiểm tra nếu file chưa được upload (chưa có URL)
                if (!file.url && !file.firebaseUrl) {
                    // Upload ảnh lên Firebase
                    const firebaseUrl = await uploadImageToFirebase(file.originFileObj);
                    // Gán URL vào file object
                    return {
                        ...file,
                        firebaseUrl, // Lưu URL từ Firebase
                        url: firebaseUrl // Cập nhật để có thể xem trước
                    };
                }
                return file;
            })
        );
        formik.setFieldValue("hinhAnh", newFileList); // Cập nhật lại giá trị cho formik
        setHinhAnhNew(newFileList.map(file => file.url)); // Lưu chỉ URL vào hinhAnh
        console.log(newFileList);
        
    };
    // const handleUploadChange = async ({ fileList }) => {
    //     const newFileList = await Promise.all(
    //         fileList.map(async (file) => {
    //             if (!file.originFileObj) {
    //                 console.error("File object is missing:", file);
    //                 return null; // Hoặc trả về file hiện tại
    //             }
    
    //             // Tạo đối tượng file để hiển thị
    //             const fileWithUrl = {
    //                 uid: file.uid || `rc-upload-${Date.now()}`, // Tạo uid nếu không có
    //                 name: file.name,
    //                 status: 'done', // Có thể là 'done' nếu bạn đã upload thành công
    //                 url: URL.createObjectURL(file.originFileObj) // Sử dụng originFileObj
    //             };
    
    //             // Kiểm tra nếu file chưa được upload (chưa có URL)
    //             if (!file.url && !file.firebaseUrl) {
    //                 // Upload ảnh lên Firebase
    //                 const firebaseUrl = await uploadImageToFirebase(file.originFileObj);
    //                 // Gán URL vào file object
    //                 return {
    //                     ...fileWithUrl,
    //                     firebaseUrl, // Lưu URL từ Firebase
    //                     url: firebaseUrl // Cập nhật để có thể xem trước
    //                 };
    //             }
    
    //             return fileWithUrl; // Trả về fileWithUrl đã tạo
    //         })
    //     );
    
    //     // Lọc các giá trị null nếu có
    //     const validFileList = newFileList.filter(file => file !== null);
        
    //     formik.setFieldValue("hinhAnh", validFileList); // Cập nhật lại giá trị cho Formik
    //     setHinhAnhNew(validFileList.map(file => file.url)); // Lưu chỉ URL vào hinhAnh
    //     console.log(validFileList);
    // };
    //   }    
    
    const uploadButton = (
        <button
          style={{
            border: 0,
            background: 'none',
          }}
          type="button"
        >
          <PlusOutlined />
          <div
            style={{
              marginTop: 8,
            }}
          >
            Upload
          </div>
        </button>
      );

    useEffect(() => {
        if (!isOpen) {
            formik.resetForm(); // Reset lại form khi modal đóng
        }
    }, [isOpen]);

    return (
        <>
            <Modal
                open={isOpen}
                title={
                    <span className="flex">
                        <FaEdit
                            style={{ color: "green", marginRight: 8, fontSize: "1.5rem" }}
                        />
                        Chỉnh sửa {title}
                    </span>
                }
                width={1000}
                okType="primary"
                onOk={formik.handleSubmit}
                onCancel={handleClose}
                footer={(_, { OkBtn, CancelBtn }) => (
                    <>
                        <CancelBtn />
                        <OkBtn />
                    </>
                )}
                keyboard={false}
                maskClosable={false}
            >
                <Row className="flex justify-between mb-3">
                    <Col span={11}>
                        <label className="text-sm inline-block mb-2" htmlFor="">
                            <span className="text-red-600">*</span> Tên sản phẩm
                        </label>
                        <Input
                            id="tenSanPham"
                            name="tenSanPham"
                            value={formik.values.tenSanPham}
                            onChange={formik.handleChange}
                            placeholder="Nhập vào tên sản phẩm"
                            disabled
                        />
                        {formik.touched.tenSanPham && formik.errors.tenSanPham && (
                            <div className="text-red-600">{formik.errors.tenSanPham}</div>
                        )}
                    </Col>
                    <Col span={11}>
                        <label className="text-sm block mb-2" htmlFor="">
                            Hoạt động
                        </label>
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            defaultChecked
                            checked={formik.values.trangThai === 1}
                            onChange={(checked) =>
                                formik.setFieldValue("trangThai", checked ? 1 : 0)
                            }
                        />
                    </Col>
                </Row>

                <Row className="flex justify-between mb-3">
                    <Col span={11}>
                        <label className="text-sm inline-block mb-2" htmlFor="">
                            <span className="text-red-600">*</span> Số lượng
                        </label>
                        <Input
                            id="soLuong"
                            name="soLuong"
                            value={formik.values.soLuong}
                            onChange={formik.handleChange}
                            placeholder="Nhập vào số lượng"
                        />
                        {formik.touched.soLuong && formik.errors.soLuong && (
                            <div className="text-red-600">{formik.errors.soLuong}</div>
                        )}
                    </Col>
                    <Col span={11}>
                        <label className="text-sm inline-block mb-2" htmlFor="">
                            <span className="text-red-600">*</span> Giá bán
                        </label>
                        <Input
                            id="giaBan"
                            name="giaBan"
                            value={formik.values.giaBan}
                            onChange={formik.handleChange}
                            placeholder="Nhập vào giá bán"
                        />
                        {formik.touched.giaBan && formik.errors.giaBan && (
                            <div className="text-red-600">{formik.errors.giaBan}</div>
                        )}
                    </Col>
                </Row>
                <Row className="flex justify-between mb-3">
                    <Upload
                        
                        listType="picture-card"
                        fileList={formik.values.hinhAnh}
                        onChange={handleUploadChange}
                        
                        onPreview={(file) => {
                            // Thiết lập ảnh xem trước
                            setPreviewImage(file.url || file.preview); // Sử dụng preview nếu không có url
                            setPreviewOpen(true);
                        }}
                    >
                        {formik.values.hinhAnh.length >= 6 ? null : uploadButton}
                    </Upload>
                    {previewImage && (
                        <Image
                            wrapperStyle={{
                                display: 'none',
                            }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}

                </Row>





            </Modal>
        </>
    );
};

export default ModalEdit;
