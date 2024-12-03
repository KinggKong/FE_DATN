// {/* <Form
//               style={{ width: "100%" }}
//               form={form}
//               layout="vertical"
//               onFinish={(values) => console.log("Form values:", values)}
//             >
//               <Form.Item
//                 name="fullName"
//                 label="Họ và Tên"
//                 rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
//               >
//                 <Input placeholder="Nhập họ và tên" />
//               </Form.Item>
//               <Form.Item
//                 name="phoneNumber"
//                 label="Số điện thoại"
//                 rules={[
//                   { required: true, message: "Vui lòng nhập số điện thoại" },
//                   {
//                     pattern: /^[0-9]{10}$/,
//                     message: "Số điện thoại không hợp lệ",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Nhập số điện thoại" />
//               </Form.Item>
//               <Form.Item
//                 name="email"
//                 label="Email"
//                 rules={[
//                   { required: true, message: "Vui lòng nhập email" },
//                   { type: "email", message: "Email không hợp lệ" },
//                 ]}
//               >
//                 <Input placeholder="Nhập email" />
//               </Form.Item>
//               <Form.Item
//                 name="address"
//                 label="Địa chỉ"
//                 rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
//               >
//                 <Input placeholder="Nhập địa chỉ" />
//               </Form.Item>

//               {/* Wrap these items in a flex container */}
//               <div style={{ display: "flex", gap: "8px" }}>
//                 <Form.Item
//                   name="city"
//                   label="Tỉnh/Thành phố"
//                   rules={[
//                     { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
//                   ]}
//                   style={{ flex: 1 }}
//                 >
//                   <Select
//                     placeholder="Chọn tỉnh/thành phố"
//                     value={selectedProvince}
//                     onChange={handleProvinceChange}
//                   >
//                     <Option value="">Chọn thành phố</Option>
//                     {renderOptions(provinces)}
//                   </Select>
//                 </Form.Item>

//                 <Form.Item
//                   name="district"
//                   label="Quận/Huyện"
//                   rules={[
//                     { required: true, message: "Vui lòng chọn quận/huyện" },
//                   ]}
//                   style={{ flex: 1 }}
//                 >
//                   <Select
//                     placeholder="Chọn quận/huyện"
//                     value={selectedDistrict}
//                     onChange={handleDistrictChange}
//                     disabled={!selectedProvince}
//                   >
//                     <Option value="">Chọn huyện/Xã</Option>
//                     {renderOptions(districts)}
//                   </Select>
//                 </Form.Item>

//                 <Form.Item
//                   name="ward"
//                   label="Phường/Xã"
//                   rules={[
//                     { required: true, message: "Vui lòng chọn phường/xã" },
//                   ]}
//                   style={{ flex: 1 }}
//                 >
//                   <Select
//                     placeholder="Chọn phường/xã"
//                     value={selectedWard}
//                     onChange={handleWardChange}
//                     disabled={!selectedDistrict}
//                   >
//                     <Option value="">Chọn xã</Option>
//                     {renderOptions(wards)}
//                   </Select>
//                 </Form.Item>
//               </div>

//               <Form.Item name="note" label="Ghi chú">
//                 <Input.TextArea
//                   placeholder="Ghi chú thêm (không bắt buộc)"
//                   rows={3}
//                 />
//               </Form.Item>
//               <Form.Item>
//                 <Button type="primary" htmlType="submit">
//                   Xác nhận
//                 </Button>
//               </Form.Item>
//             </Form> */}