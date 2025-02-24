import React, { useState, useEffect } from "react";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/equipment_categories");
                if (!response.ok) {
                    throw new Error("Kategori verileri alınamadı");
                }
                const data = await response.json();
                setCategories(data); // Gelen kategorileri state'e kaydet
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div>
            <h2>Kategoriler</h2>
            {error && <p style={{ color: "red" }}>Hata: {error}</p>}
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>{category.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
