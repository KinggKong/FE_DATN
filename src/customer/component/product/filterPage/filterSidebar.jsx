import React, { useEffect, useState } from "react";
import { Collapse, Checkbox, Select, Slider } from "antd";
import { getAllDanhMucApi } from "../../../../api/DanhMucService";
import { getAllThuongHieuApi } from "../../../../api/ThuongHieuService";
import { getAllChatLieuDeApi } from "../../../../api/ChatLieuDeApi";
import { getAllChatLieuVaiApi } from "../../../../api/ChatLieuVaiApi";

const { Panel } = Collapse;

const FilterSidebar = ({ onFilter }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedChatLieuDe, setSelectedChatLieuDe] = useState([]);
    const [selectedChatLieuVai, setSelectedChatLieuVai] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [chatlieudes, setChatlieudes] = useState([]);
    const [chatlieuvais, setChatlieuvais] = useState([]);

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

    useEffect(() => {
        fetchCategories();
        fetchBrands();
        fetchChatLieuDe();
        fetchChatLieuVai();

    }, []);

    return (
        <div style={{ width: 250, padding: 16 }}>
            <Collapse defaultActiveKey={["1"]}>
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
                                    // Log các giá trị trước khi gọi onFilter
                                    console.log("Updated Categories:", updatedCategories);
                                    console.log("Price Range:", priceRange);
                                    console.log("Selected Brands:", selectedBrands);
                                    console.log("Selected ChatLieuDe:", selectedChatLieuDe);
                                    console.log("Selected ChatLieuVai:", selectedChatLieuVai);
                                    onFilter({
                                        categories: updatedCategories,
                                        priceRange,
                                        brands: selectedBrands,
                                        chatLieuDe: selectedChatLieuDe,
                                        chatLieuVai: selectedChatLieuVai,
                                    });

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
                        {chatlieudes.map((category) => (
                            <Checkbox
                                key={category.id}
                                onChange={(e) => {
                                    const updatedCategories = e.target.checked
                                        ? [...selectedChatLieuDe, category]
                                        : selectedChatLieuDe.filter((item) => item !== category);
                                    setSelectedChatLieuDe(updatedCategories);
                                    onFilter({
                                        categories: selectedCategories,
                                        priceRange,
                                        brands: selectedBrands,
                                        chatLieuDe: updatedCategories,
                                        chatLieuVai: selectedChatLieuVai,
                                    });
                                }}
                            >
                                {category.tenChatLieu}
                            </Checkbox>
                        ))}
                    </div>
                </Panel>
                {/* Chất liệu vải */}
                <Panel header="Chất liệu vải" key="3">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {chatlieuvais.map((category) => (
                            <Checkbox
                                key={category.id}
                                onChange={(e) => {
                                    const updatedCategories = e.target.checked
                                        ? [...selectedChatLieuVai, category]
                                        : selectedChatLieuVai.filter((item) => item !== category);
                                    setSelectedChatLieuVai(updatedCategories);
                                    onFilter({
                                        categories: selectedCategories,
                                        priceRange,
                                        brands: selectedBrands,
                                        chatLieuDe: selectedChatLieuDe,
                                        chatLieuVai: updatedCategories,
                                    });
                                }}
                            >
                                {category.tenChatLieuVai}
                            </Checkbox>
                        ))}
                    </div>
                </Panel>

                {/* Khoảng giá */}
                <Panel header="Khoảng giá" key="4">
                    <Slider
                        range
                        defaultValue={[0, 10000000]}
                        min={0}
                        max={10000000}
                        onChange={(value) => {
                            setPriceRange(value);
                            onFilter({
                                categories: selectedCategories,
                                priceRange: value,
                                brands: selectedBrands,
                                chatLieuDe: selectedChatLieuDe,
                                chatLieuVai: selectedChatLieuVai,
                            });
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
                            onFilter({
                                categories: selectedCategories,
                                priceRange,
                                brands: value,
                                chatLieuDe: selectedChatLieuDe,
                                chatLieuVai: selectedChatLieuVai,
                            });
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
