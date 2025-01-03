import { useState } from "react";
import { useLoaderData, MetaFunction, useNavigate } from "@remix-run/react";
import { FormEvent } from "react";
import db, { type Category, type Rack } from "~/db";
import utils from "~/utils";

export const loader = async () => {
    const categories = await db.getCategories();
    const racks = await db.getRacks();
    return { categories, racks };
};

export const meta: MetaFunction = () => [
    { title: "My Mart - Restock" },
];

export default () => {
    const navigate = useNavigate();
    const { categories, racks } = useLoaderData<typeof loader>();
    const [activeMenu, setActiveMenu] = useState<"register" | "restock">("register");
    const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].name);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Rack | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    /* TODO: refactor, looks like a shit (2)
     */
    const [__LOCK_PAGE__, __SET_LOCK_PAGE__] = useState(false);

    const checkDuplicateProduct = (name: string, category: string): boolean => {
        return racks.some(rack => 
            rack.name.toLowerCase() === name.toLowerCase() &&
            rack.category.toLowerCase() === category.toLowerCase()
        );
    };

    const handleNewProduct = async (e: FormEvent<HTMLFormElement>) => {
        if (__LOCK_PAGE__) return;
        __SET_LOCK_PAGE__(true);

        e.preventDefault();
        setErrorMessage(""); // Reset error message

        const formElement = e.currentTarget;
        const formData = new FormData(formElement);

        const price = Number(formData.get("price"));
        const stock = Number(formData.get("stock"));
        const productName = formData.get("name")?.toString() || "";

        if (price < 0 || stock < 0) {
            alert("Price and stock cannot be negative");
            return;
        }

        // Check for duplicate product
        if (checkDuplicateProduct(productName, formData.get("category")?.toString() || selectedCategory)) {
            console.log(productName, formData.get("category")?.toString() || selectedCategory);
            setErrorMessage("INVALID (Barang Sudah Ada)");
            return;
        }

        const productData: Partial<Rack> = {
            category: formData.get("category")?.toString(),
            name: productName,
            price: price,
            stock: stock
        };

        try {
            await fetch("/api/v1/racks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            // Reset form and states
            formElement.reset();
            setShowNewCategoryInput(false);
            setErrorMessage("");
            navigate(`.${window.location.search}`);
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product");
        }

        __SET_LOCK_PAGE__(false);
    };

    const handleUpdateProduct = async (e: FormEvent<HTMLFormElement>) => {
        if (__LOCK_PAGE__) return;
        __SET_LOCK_PAGE__(true);

        e.preventDefault();
        setErrorMessage(""); // Reset error message
        
        if (!editingProduct) return;

        const formElement = e.currentTarget;
        const formData = new FormData(formElement);

        const price = Number(formData.get("price"));
        const stock = Number(formData.get("stock"));
        const newName = formData.get("name")?.toString() || "";

        if (price < 0 || stock < 0) {
            alert("Price and stock cannot be negative");
            return;
        }

        // Check for duplicate only if name is changed
        if (newName.toLowerCase() !== editingProduct.name.toLowerCase() && 
            checkDuplicateProduct(newName, selectedCategory)) {
            setErrorMessage("INVALID (Barang Sudah Ada)");
            return;
        }

        const updatedProduct = {
            ...editingProduct,
            name: newName,
            price: price,
            stock: stock,
        };

        try {
            await fetch(`/api/v1/racks`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedProduct),
            });

            formElement.reset();
            setEditingProduct(null);
            setErrorMessage("");
            navigate(`.${window.location.search}`);
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product");
        }

        __SET_LOCK_PAGE__(false);
    };

    const filteredRacks = racks.filter(
        rack => rack.category === selectedCategory
    );

    return (
        <div className="flex flex-col items-center justify-center text-white mt-8">
            <h1 className="text-3xl font-bold mt-10 mb-4">Restock Management</h1>

            {/* Menu Selection */}
            <div className="flex gap-4 mb-8">
                <button
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeMenu === "register"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-neutral-700 hover:bg-neutral-600"
                        }`}
                    onClick={() => {
                        setErrorMessage("");
                        setActiveMenu("register")
                    }}
                >
                    Register New Product
                </button>
                <button
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeMenu === "restock"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-neutral-700 hover:bg-neutral-600"
                        }`}
                    onClick={() => {
                        setErrorMessage("");
                        setActiveMenu("restock")
                    }}
                >
                    Restock Inventory
                </button>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
                <div className="w-full max-w-md mb-4 p-4 bg-red-500 text-white rounded-lg">
                    {errorMessage}
                </div>
            )}

            {/* Register New Product Form */}
            {activeMenu === "register" && (
                <form className="w-full max-w-md space-y-6" onSubmit={handleNewProduct}>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Category</label>
                        <div className="flex gap-2">
                            {!showNewCategoryInput ? (
                                <>
                                    <select
                                        className="w-full h-10 bg-neutral-800 text-gray-300 rounded-lg px-3 border border-neutral-700 focus:outline-none focus:border-blue-500"
                                        name="category"
                                        required
                                    >
                                        {categories.map((category: Category) => (
                                            <option key={category.name} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="px-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                        onClick={() => setShowNewCategoryInput(true)}
                                    >
                                        New
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input
                                        className="w-full h-10 bg-neutral-800 text-gray-300 rounded-lg px-3 border border-neutral-700 focus:outline-none focus:border-blue-500"
                                        name="category"
                                        type="text"
                                        placeholder="New Category Name"
                                        required
                                        onChange={(e) => e.target.value = utils.toCapitalCase(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="px-4 bg-neutral-600 hover:bg-neutral-700 rounded-lg transition-colors"
                                        onClick={() => setShowNewCategoryInput(false)}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Product Name</label>
                        <input
                            className="w-full h-10 bg-neutral-800 text-gray-300 rounded-lg px-3 border border-neutral-700 focus:outline-none focus:border-blue-500"
                            name="name"
                            type="text"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Price</label>
                        <input
                            className="w-full h-10 bg-neutral-800 text-gray-300 rounded-lg px-3 border border-neutral-700 focus:outline-none focus:border-blue-500"
                            name="price"
                            type="number"
                            min="0"
                            required
                            defaultValue={0}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Stock</label>
                        <input
                            className="w-full h-10 bg-neutral-800 text-gray-300 rounded-lg px-3 border border-neutral-700 focus:outline-none focus:border-blue-500"
                            name="stock"
                            type="number"
                            min="0"
                            required
                            defaultValue={0}
                        />
                    </div>

                    <button
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                        type="submit"
                    >
                        Register Product
                    </button>
                </form>
            )}

            {/* Restock Inventory Interface */}
            {activeMenu === "restock" && (
                <div className="w-full max-w-4xl">
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Select Category</label>
                        <select
                            className="w-full h-10 bg-neutral-800 text-gray-300 rounded-lg px-3 border border-neutral-700 focus:outline-none focus:border-blue-500"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            value={selectedCategory}
                        >
                            {categories.map((category: Category) => (
                                <option
                                    key={category.name}
                                    value={category.name}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCategory && (
                        <div className="bg-neutral-800 rounded-lg p-6">
                            <h3 className="text-xl font-medium mb-4">Products in {selectedCategory}</h3>
                            <div className="space-y-4">
                                {filteredRacks.map((rack) => (
                                    <div
                                        key={rack.id}
                                        className="bg-neutral-700 p-4 rounded-lg"
                                    >
                                        {editingProduct?.id === rack.id ? (
                                            <form onSubmit={handleUpdateProduct} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <input
                                                        name="name"
                                                        defaultValue={rack.name}
                                                        className="bg-neutral-800 p-2 rounded-lg border border-neutral-600 text-gray-300"
                                                        required
                                                    />
                                                    <input
                                                        name="price"
                                                        type="number"
                                                        min="0"
                                                        defaultValue={rack.price}
                                                        className="bg-neutral-800 p-2 rounded-lg border border-neutral-600 text-gray-300"
                                                        required
                                                    />
                                                    <input
                                                        name="stock"
                                                        type="number"
                                                        min="0"
                                                        defaultValue={rack.stock}
                                                        className="bg-neutral-800 p-2 rounded-lg border border-neutral-600 text-gray-300"
                                                        required
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="submit"
                                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="flex-1 px-4 py-2 bg-neutral-600 hover:bg-neutral-700 rounded-lg transition-colors"
                                                            onClick={() => {
                                                                setEditingProduct(null);
                                                                setErrorMessage("");
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                                <div className="font-medium">{rack.name}</div>
                                                <div>Price: {rack.price.toLocaleString()}</div>
                                                <div>Stock: {rack.stock}</div>
                                                <button
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                                    onClick={() => setEditingProduct(rack)}
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
