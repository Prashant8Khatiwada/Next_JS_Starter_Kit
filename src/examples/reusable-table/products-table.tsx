"use client";

import { useState, useEffect } from "react";
import {
  DataTable,
  type DataTableColumn,
} from "@/src/components/data-table/data-table";
import { useDataTable } from "@/src/components/data-table/use-data-table";
import {
  Badge,
  Group,
  Text,
  TextInput,
  Select,
  RangeSlider,
  Button,
  Avatar,
} from "@mantine/core";
import { Search, Filter } from "lucide-react";

// Product type
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  image?: string;
}

// Filter type
interface ProductFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  status: string;
}

// Mock data
const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Sports",
];

// Mock products data
const allProducts: Product[] = [
  {
    id: "1",
    name: "Laptop",
    category: "Electronics",
    price: 999,
    stock: 45,
    status: "active",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Smartphone",
    category: "Electronics",
    price: 699,
    stock: 82,
    status: "active",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "T-shirt",
    category: "Clothing",
    price: 29,
    stock: 200,
    status: "active",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "4",
    name: "Jeans",
    category: "Clothing",
    price: 59,
    stock: 0,
    status: "inactive",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "5",
    name: "Novel",
    category: "Books",
    price: 15,
    stock: 112,
    status: "active",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "6",
    name: "Cookbook",
    category: "Books",
    price: 25,
    stock: 87,
    status: "active",
    image: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: "7",
    name: "Coffee Maker",
    category: "Home",
    price: 89,
    stock: 32,
    status: "active",
    image: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: "8",
    name: "Blender",
    category: "Home",
    price: 49,
    stock: 0,
    status: "inactive",
    image: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: "9",
    name: "Basketball",
    category: "Sports",
    price: 35,
    stock: 41,
    status: "active",
    image: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: "10",
    name: "Tennis Racket",
    category: "Sports",
    price: 129,
    stock: 28,
    status: "active",
    image: "https://i.pravatar.cc/150?img=10",
  },
];

// Mock API function
const fetchProducts = async (
  filters: ProductFilters,
  page: number,
  pageSize: number
): Promise<{ data: Product[]; total: number }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Apply filters
  let filteredProducts = [...allProducts];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
    );
  }

  if (filters.category && filters.category !== "All") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === filters.category
    );
  }

  if (filters.status) {
    filteredProducts = filteredProducts.filter(
      (product) => product.status === filters.status
    );
  }

  filteredProducts = filteredProducts.filter(
    (product) =>
      product.price >= filters.minPrice && product.price <= filters.maxPrice
  );

  // Apply pagination
  const total = filteredProducts.length;
  const start = (page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(start, start + pageSize);

  return { data: paginatedProducts, total };
};

export function ProductsTable() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Define columns
  const columns: DataTableColumn<Product>[] = [
    {
      key: "name",
      title: "Product",
      render: (product) => (
        <Group spacing="sm">
          {product.image && (
            <Avatar src={product.image} size={30} radius="xl" />
          )}
          <Text weight={500}>{product.name}</Text>
        </Group>
      ),
      sortable: true,
    },
    {
      key: "category",
      title: "Category",
      render: (product) => <Badge color="blue">{product.category}</Badge>,
      sortable: true,
    },
    {
      key: "price",
      title: "Price",
      render: (product) => (
        <Text weight={500}>${product.price.toFixed(2)}</Text>
      ),
      sortable: true,
    },
    {
      key: "stock",
      title: "Stock",
      render: (product) => (
        <Text color={product.stock === 0 ? "red" : undefined}>
          {product.stock}
        </Text>
      ),
      sortable: true,
    },
    {
      key: "status",
      title: "Status",
      render: (product) => (
        <Badge color={product.status === "active" ? "green" : "red"}>
          {product.status}
        </Badge>
      ),
      sortable: true,
    },
  ];

  // Initialize data table hook with mock data fetching function
  const {
    data,
    total,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    page,
    pageSize,
    changePage,
    changePageSize,
    loadData,
  } = useDataTable<Product, ProductFilters>({
    fetchData: fetchProducts,
    initialFilters: {
      search: "",
      category: "All",
      minPrice: 0,
      maxPrice: 1000,
      status: "",
    },
    initialPage: 1,
    initialPageSize: 5,
  });

  // Ensure data is loaded on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle CRUD operations
  const handleCreate = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    // In a real app, you would call an API to delete the product
    alert(`Delete product: ${product.name}`);
  };

  const handleView = (product: Product) => {
    // In a real app, you would navigate to the product details page
    alert(`View product: ${product.name}`);
  };

  // Custom actions
  const customActions = [
    {
      label: "Duplicate",
      onClick: (product: Product) => {
        alert(`Duplicate product: ${product.name}`);
      },
    },
    {
      label: "Archive",
      onClick: (product: Product) => {
        alert(`Archive product: ${product.name}`);
      },
      condition: (product: Product) => product.status === "active",
    },
  ];

  // Bulk actions
  const bulkActions = [
    {
      label: "Delete Selected",
      onClick: (products: Product[]) => {
        alert(`Delete ${products.length} products`);
      },
    },
    {
      label: "Mark as Active",
      onClick: (products: Product[]) => {
        alert(`Mark ${products.length} products as active`);
      },
    },
  ];

  // Handle price range change
  const handlePriceChange = (value: [number, number]) => {
    updateFilters({
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  // Custom filters component
  const FiltersComponent = (
    <div>
      <Group position="apart" mb="md">
        <Text weight={500}>Filters</Text>
        <Button
          variant="subtle"
          leftSection={<Filter size={16} />}
          onClick={resetFilters}
        >
          Reset
        </Button>
      </Group>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextInput
          label="Search"
          placeholder="Search products..."
          leftSection={<Search size={16} />}
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
        />

        <Select
          label="Category"
          placeholder="Select category"
          data={categories.map((category) => ({
            value: category,
            label: category,
          }))}
          value={filters.category}
          onChange={(value) => updateFilters({ category: value || "All" })}
        />

        <Select
          label="Status"
          placeholder="Select status"
          data={[
            { value: "", label: "All" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          value={filters.status}
          onChange={(value) => updateFilters({ status: value || "" })}
        />
      </div>

      <div className="mt-4">
        <Text size="sm" weight={500} mb="xs">
          Price Range
        </Text>
        <RangeSlider
          min={0}
          max={1000}
          step={10}
          value={[filters.minPrice, filters.maxPrice]}
          onChange={handlePriceChange}
          marks={[
            { value: 0, label: "$0" },
            { value: 500, label: "$500" },
            { value: 1000, label: "$1000" },
          ]}
          mb="sm"
        />
        <Group position="apart" mb="md">
          <Text size="xs">${filters.minPrice}</Text>
          <Text size="xs">${filters.maxPrice}</Text>
        </Group>
      </div>
    </div>
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      error={error}
      totalItems={total}
      getRowId={(product) => product.id}
      // CRUD operations
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
      // Custom actions
      actions={customActions}
      bulkActions={bulkActions}
      // Filters
      filtersComponent={FiltersComponent}
      // Export/Import
      onExport={() => alert("Export data")}
      onImport={() => alert("Import data")}
      // Pagination
      initialPage={page}
      initialPageSize={pageSize}
      pageSizeOptions={[5, 10, 25, 50]}
    />
  );
}
