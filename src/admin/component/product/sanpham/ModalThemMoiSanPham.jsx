import { Modal, Row, Col, Input, Switch, Select } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useEffect } from "react";
const { TextArea } = Input;
import { useFormik } from "formik";
import * as Yup from "yup";

const ModalThemMoi = ({
  isOpen,
  handleClose,
  title,
  handleSubmit,
  dataDanhMuc,
  dataThuongHieu,
  dataChatLieuVai,
  dataChatLieuDe,
}) => {
  const validationSchema = Yup.object().shape({
    tenSanPham: Yup.string()
      .min(8, "Tên sản phẩm phải có ít nhất 8 kí tự")
      .required("Tên sản phẩm là bắt buộc"),
    idDanhMuc: Yup.number().required("Danh mục là bắt buộc"),
    idThuongHieu: Yup.number().required("Thương hiệu là bắt buộc"),
    idChatLieuVai: Yup.number().required("Chất liệu vải là bắt buộc"),
    idChatLieuDe: Yup.number().required("Chất liệu đế là bắt buộc"),
    moTa: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      tenSanPham: "",
      moTa: "",
      trangThai: 1,
      idDanhMuc: null,
      idThuongHieu: null,
      idChatLieuVai: null,
      idChatLieuDe: null,
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        open={isOpen}
        title={
          <span className="flex">
            <IoMdAddCircleOutline
              style={{ color: "green", marginRight: 8, fontSize: "1.5rem" }}
            />
            Thêm mới {title}
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
            />
            {formik.errors.tenSanPham && (
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
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Thương hiệu
            </label>
            <Select
              id="idThuongHieu"
              name="idThuongHieu"
              showSearch
              style={{
                width: "100%",
              }}
              value={formik.values.idThuongHieu}
              onChange={(value) => formik.setFieldValue("idThuongHieu", value)}
              placeholder="Chọn thương hiệu"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={dataThuongHieu?.map((thuongHieu) => ({
                value: thuongHieu.id,
                label: thuongHieu.tenThuongHieu,
              }))}
            />
            {formik.errors.idThuongHieu && (
              <div className="text-red-600">{formik.errors.idThuongHieu}</div>
            )}
          </Col>
          <Col span={11}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Danh mục
            </label>
            <Select
              id="idDanhMuc"
              name="idDanhMuc"
              showSearch
              style={{
                width: "100%",
              }}
              value={formik.values.idDanhMuc}
              onChange={(value) => formik.setFieldValue("idDanhMuc", value)}
              placeholder="Chọn danh mục"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={dataDanhMuc?.map((danhMuc) => ({
                value: danhMuc.id,
                label: danhMuc.tenDanhMuc,
              }))}
            />
            {formik.errors.idDanhMuc && (
              <div className="text-red-600">{formik.errors.idDanhMuc}</div>
            )}
          </Col>
        </Row>

        <Row className="flex justify-between mb-3">
          <Col span={11}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Chất liệu vải
            </label>
            <Select
              id="idChatLieuVai"
              name="idChatLieuVai"
              showSearch
              style={{
                width: "100%",
              }}
              value={formik.values.idChatLieuVai}
              onChange={(value) => formik.setFieldValue("idChatLieuVai", value)}
              placeholder="Chọn chất liệu vải"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={dataChatLieuVai?.map((vai) => ({
                value: vai.id,
                label: vai.tenChatLieuVai,
              }))}
            />
            {formik.errors.idChatLieuVai && (
              <div className="text-red-600">{formik.errors.idChatLieuVai}</div>
            )}
          </Col>
          <Col span={11}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Chất liệu đế
            </label>
            <Select
              id="idChatLieuDe"
              name="idChatLieuDe"
              showSearch
              style={{
                width: "100%",
              }}
              value={formik.values.idChatLieuDe}
              onChange={(value) => formik.setFieldValue("idChatLieuDe", value)}
              placeholder="Chọn chất liệu đế"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={dataChatLieuDe?.map((de) => ({
                value: de.id,
                label: de.tenChatLieu,
              }))}
            />
            {formik.errors.idChatLieuDe && (
              <div className="text-red-600">{formik.errors.idChatLieuDe}</div>
            )}
          </Col>
        </Row>

        <Row>
          <label className="text-sm block mb-2" htmlFor="">
            Mô tả
          </label>
          <TextArea
            id="moTa"
            name="moTa"
           
            placeholder="Mô tả sản phẩm"
            value={formik.values.moTa}
            onChange={formik.handleChange}
          />
        </Row>
      </Modal>
    </>
  );
};
export default ModalThemMoi;
