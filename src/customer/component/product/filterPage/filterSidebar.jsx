import React, { useState } from "react";
import { Collapse, Checkbox, Select, Slider, Button } from "antd";

const { Panel } = Collapse;

const FilterSidebar = ({ onFilter }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [selectedBrands, setSelectedBrands] = useState([]);

    const categories = ["Electronics", "Clothing", "Books"];
    const brands = ["Apple", "Samsung", "Sony"];

    const handleApplyFilters = () => {
        const filters = {
            categories: selectedCategories,
            priceRange,
            brands: selectedBrands,
        };
        onFilter(filters);
    };

    return (
        <div style={{ width: 250, padding: 16 }}>
            <Collapse defaultActiveKey={["1"]}>
                <Panel header="Danh mục" key="1">
                    {categories.map((category) => (
                        <Checkbox
                            key={category}
                            onChange={(e) =>
                                setSelectedCategories((prev) =>
                                    e.target.checked
                                        ? [...prev, category]
                                        : prev.filter((item) => item !== category)
                                )
                            }
                        >
                            {category}
                        </Checkbox>
                    ))}
                </Panel>
                <Panel header="Khoảng giá" key="2">
                    <Slider
                        range
                        defaultValue={[0, 10000000]}
                        min={0}
                        max={10000000}
                        onChange={(value) => setPriceRange(value)}
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
                <Panel header="Thương hiệu" key="3">
                    <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Select Brands"
                        onChange={(value) => setSelectedBrands(value)}
                    >
                        {brands.map((brand) => (
                            <Select.Option key={brand} value={brand}>
                                {brand}
                            </Select.Option>
                        ))}
                    </Select>
                </Panel>
            </Collapse>
            {/* <Button type="primary" onClick={handleApplyFilters} style={{ marginTop: 16 }}>
        Apply Filters
      </Button> */}
        </div>
    );
};

export default FilterSidebar;
