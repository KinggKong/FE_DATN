import React, { useEffect, useState } from "react";
import { Collapse, Checkbox, Select, Slider  } from "antd";
import { getAllDanhMucApi } from "../../../../api/DanhMucService";
import { getAllThuongHieuApi } from "../../../../api/ThuongHieuService";
import { getAllChatLieuDeApi } from "../../../../api/ChatLieuDeApi";
import { getAllChatLieuVaiApi } from "../../../../api/ChatLieuVaiApi";
import { getMaxPriceApi } from "../../../../api/SanPhamChiTietAPI";


import "../../../../assets/style/cssFilterProduct.css";

const { Panel } = Collapse;

const FilterSidebar = ({ onFilter }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedChatLieuDe, setSelectedChatLieuDe] = useState([]);
    const [selectedChatLieuVai, setSelectedChatLieuVai] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [chatlieudes, setChatlieudes] = useState([]);
    const [chatlieuvais, setChatlieuvais] = useState([]);
    const [maxPrice, setMaxPrice] = useState(0);
     

    const fetchCategories = async () => {
        try {
            const res = await getAllDanhMucApi();
            const validCategories = res.data.content.filter(category => category.trangThai === 1); // Lọc các category có trạng thái = 1
            setCategories(validCategories);
        } catch (error) {
            console.error("Failed to fetch categories: ", error);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await getAllThuongHieuApi();
            const validBrands = res.data.content.filter(brand => brand.trangThai === 1); // Lọc các brand có trạng thái = 1
            setBrands(validBrands);
        } catch (error) {
            console.error("Failed to fetch brands: ", error);
        }
    };

    const fetchChatLieuDe = async () => {
        try {
            const res = await getAllChatLieuDeApi();
            const validChatLieuDe = res.data.content.filter(chatLieuDe => chatLieuDe.trangThai === 1); // Lọc các chatLieuDe có trạng thái = 1
            setChatlieudes(validChatLieuDe);
        } catch (error) {
            console.error("Failed to fetch chatlieudes: ", error);
        }
    };

    const fetchChatLieuVai = async () => {
        try {
            const res = await getAllChatLieuVaiApi();
            const validChatLieuVai = res.data.content.filter(chatLieuVai => chatLieuVai.trangThai === 1); // Lọc các chatLieuVai có trạng thái = 1
            setChatlieuvais(validChatLieuVai);
        } catch (error) {
            console.error("Failed to fetch chatlieuvais: ", error);
        }
    };
    
    const fetchMaxPrice = async () => {
        try {
            const res = await getMaxPriceApi();
            const maxPrice = res.data +100000;
            setMaxPrice(maxPrice);
        } catch (error) {
            console.error("Failed to fetch max price: ", error);
        }
    };
            


    useEffect(() => {
        fetchCategories();
        fetchBrands();
        fetchChatLieuDe();
        fetchChatLieuVai();
        fetchMaxPrice();
    }, []);
    const handleFilterChange = () => {
        const filterRequest = {
            danhMucs: selectedCategories.map((item) => item.id),
            chatLieuDes: selectedChatLieuDe.map((item) => item.id),
            chatLieuVais: selectedChatLieuVai.map((item) => item.id),
            thuongHieu: selectedBrands, // Lấy thương hiệu đầu tiên
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
           
        };

        // Gọi callback onFilter với dữ liệu đã chuẩn bị
        onFilter(filterRequest);
    };

    useEffect(() => {
        handleFilterChange();
    }, [selectedCategories, selectedChatLieuDe, selectedChatLieuVai, selectedBrands, priceRange]);

    return (
        <div style={{ width: 250, padding: 16 }}>
            <Collapse defaultActiveKey={["1","2","3","4","5"]}>
            <h3 style={{ fontWeight: "bold", marginBottom: "16px" }}> BỘ LỌC TÌM KIẾM</h3>
                 {/* Danh mục */}
                 <Panel header="Danh mục" key="1">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {categories.map((category) => (
                            <Checkbox
                                key={category.id}
                                onChange={(e) => {
                                    const updatedCategories = e.target.checked
                                        ? [...selectedCategories, category]
                                        : selectedCategories.filter((item) => item !== category);
                                    setSelectedCategories(updatedCategories);
                                    handleFilterChange();
                                }}
                            >
                                {category.tenDanhMuc}
                            </Checkbox>
                        ))}
                    </div>
                </Panel>
                {/* Chất liệu đế */}
                <Panel header="Chất liệu đế" key="2">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {chatlieudes.map((chatLieuDe) => (
                            <Checkbox
                                key={chatLieuDe.id}
                                onChange={(e) => {
                                    const updatedChatLieuDe = e.target.checked
                                        ? [...selectedChatLieuDe, chatLieuDe]
                                        : selectedChatLieuDe.filter((item) => item !== chatLieuDe);
                                    setSelectedChatLieuDe(updatedChatLieuDe);
                                    handleFilterChange();
                                }}
                            >
                                {chatLieuDe.tenChatLieu}
                            </Checkbox>
                        ))}
                    </div>
                </Panel>

                {/* Chất liệu vải */}
                <Panel header="Chất liệu vải" key="3">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {chatlieuvais.map((chatLieuVai) => (
                            <Checkbox
                                key={chatLieuVai.id}
                                onChange={(e) => {
                                    const updatedChatLieuVai = e.target.checked
                                        ? [...selectedChatLieuVai, chatLieuVai]
                                        : selectedChatLieuVai.filter((item) => item !== chatLieuVai);
                                    setSelectedChatLieuVai(updatedChatLieuVai);
                                    handleFilterChange();
                                }}
                            >
                                {chatLieuVai.tenChatLieuVai}
                            </Checkbox>
                        ))}
                    </div>
                </Panel>

                {/* Khoảng giá */}
                <Panel header="Khoảng giá" key="4">
                    <Slider
                        range
                        defaultValue={[0, maxPrice]}
                        min={0}
                        max={maxPrice}
                        onChange={(value) => {
                            setPriceRange(value);
                            handleFilterChange();
                        }}
                    />
                    <div>
                        Giá:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(priceRange[0])}{" "}
                        -{" "}
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(priceRange[1])}
                    </div>
                </Panel>

                {/* Thương hiệu */}
                <Panel header="Thương hiệu" key="5">
                    <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Chọn thương hiệu"
                        onChange={(value) => {
                            setSelectedBrands(value);
                            handleFilterChange();
                        }}
                    >
                        {brands.map((brand) => (
                            <Select.Option key={brand.id} value={brand.id}>
                                {brand.tenThuongHieu}
                            </Select.Option>
                        ))}
                    </Select>
                </Panel>
            </Collapse>
           
        </div>
    );
};

export default FilterSidebar;
