"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/src/components/dashboard/layout";
import {
  Badge,
  Group,
  Text,
  Avatar,
  TextInput,
  Select,
  Button,
  Paper,
  Title,
  Loader,
  Table,
  ActionIcon,
  Menu,
  Box,
  Pagination,
  NumberInput,
} from "@mantine/core";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash,
  Eye,
  MoreHorizontal,
} from "lucide-react";

// Product type from the Fake Store API
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Filter type
interface ProductFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: "",
    minPrice: 0,
    maxPrice: 1000,
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);

  // Fetch products from the Fake Store API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.map((product: Product) => product.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch products")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(
        (product) => product.category === filters.category
      );
    }

    // Price range filter
    result = result.filter(
      (product) =>
        product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    setFilteredProducts(result);
    setPage(1); // Reset to first page when filters change
  }, [filters, products]);

  // Handle pagination
  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setDisplayedProducts(filteredProducts.slice(start, end));
  }, [filteredProducts, page, pageSize]);

  // Update filters
  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: 0,
      maxPrice: 1000,
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[calc(100vh-120px)]">
          <Loader size="xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Paper p="xl" withBorder>
          <Text c="red" ta="center">
            Error: {error.message}
          </Text>
          <Button mt="md" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Paper>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box className="flex justify-between items-center mb-6">
        <Title order={2}>Products</Title>
        <Button leftSection={<Plus size={16} />}>Add Product</Button>
      </Box>

      <Paper withBorder p="md" radius="md" mb="lg">
        <Group position="apart" mb="md">
          <Text fw={500}>Filters</Text>
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
            onChange={(e) => updateFilter("search", e.target.value)}
          />

          <Select
            label="Category"
            placeholder="Select category"
            data={[
              { value: "", label: "All Categories" },
              ...categories.map((category) => ({
                value: category,
                label: category,
              })),
            ]}
            value={filters.category}
            onChange={(value) => updateFilter("category", value || "")}
          />

          <Box>
            <Text size="sm" fw={500} mb={8}>
              Price Range
            </Text>
            <Group grow>
              <NumberInput
                placeholder="Min"
                value={filters.minPrice}
                onChange={(value) => updateFilter("minPrice", value || 0)}
                min={0}
                max={filters.maxPrice}
              />
              <NumberInput
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(value) => updateFilter("maxPrice", value || 0)}
                min={filters.minPrice}
              />
            </Group>
          </Box>
        </div>
      </Paper>

      <Paper withBorder radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Product</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Rating</Table.Th>
              <Table.Th style={{ width: 100 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {displayedProducts.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text ta="center" py="lg">
                    No products found
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              displayedProducts.map((product) => (
                <Table.Tr key={product.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar src={product.image} size={40} radius="sm" />
                      <div>
                        <Text fw={500} size="sm" lineClamp={1}>
                          {product.title}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {product.description}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="blue">{product.category}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>${product.price.toFixed(2)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Text fw={500}>{product.rating.rate}</Text>
                      <Text size="xs" c="dimmed">
                        ({product.rating.count} reviews)
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => alert(`View product: ${product.title}`)}
                      >
                        <Eye size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        onClick={() => alert(`Edit product: ${product.title}`)}
                      >
                        <Edit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() =>
                          alert(`Delete product: ${product.title}`)
                        }
                      >
                        <Trash size={16} />
                      </ActionIcon>
                      <Menu position="bottom-end" withinPortal>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <MoreHorizontal size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            onClick={() =>
                              alert(`Duplicate product: ${product.title}`)
                            }
                          >
                            Duplicate
                          </Menu.Item>
                          <Menu.Item
                            onClick={() =>
                              alert(`Archive product: ${product.title}`)
                            }
                          >
                            Archive
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      <Group position="apart" mt="lg">
        <Text size="sm">
          Showing {displayedProducts.length} of {filteredProducts.length}{" "}
          products
        </Text>
        <Pagination
          total={Math.ceil(filteredProducts.length / pageSize)}
          value={page}
          onChange={setPage}
          withEdges
        />
      </Group>
    </DashboardLayout>
  );
}
