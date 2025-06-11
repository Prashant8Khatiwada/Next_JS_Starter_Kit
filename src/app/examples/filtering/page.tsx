"use client";

import type React from "react";

import {
  Title,
  Paper,
  Text,
  Grid,
  Card,
  Badge,
  Group,
  Select,
  TextInput,
  Button,
  ActionIcon,
  Image,
  Loader,
  Box,
  Checkbox,
  Collapse,
  MultiSelect,
  Stack,
  ScrollArea,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { Search, Filter, X, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useFilters } from "@/src/hooks/use-filters";
import { DashboardLayout } from "@/src/components/dashboard/layout";
import { AuthGuard } from "@/src/components/auth-guard";

// Enhanced Product type
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  fuelType?: string;
  bodyType?: string;
  transmission?: string;
  seats?: number;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  inStock: boolean;
  tags: string[];
}

interface ProductFilters {
  search: string;
  categories: string[];
  brands: string[];
  priceRanges: string[];
  fuelTypes: string[];
  bodyTypes: string[];
  transmissions: string[];
  seats: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  tags: string[];
}

// Enhanced mock data with automotive-style filters
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Maruti Swift",
    price: 650000,
    description: "Compact hatchback with excellent fuel efficiency",
    category: "Hatchback",
    brand: "Maruti",
    fuelType: "Petrol",
    bodyType: "Hatchback",
    transmission: "Manual",
    seats: 5,
    image:
      "https://images.unsplash.com/photo-1549399736-8e3c8b8b8b8b?w=300&h=200&fit=crop",
    rating: { rate: 4.2, count: 150 },
    inStock: true,
    tags: ["fuel-efficient", "compact", "reliable"],
  },
  {
    id: 2,
    title: "Tata Nexon EV",
    price: 1400000,
    description: "Electric SUV with modern features",
    category: "SUV",
    brand: "Tata",
    fuelType: "Electric",
    bodyType: "SUV",
    transmission: "Automatic",
    seats: 5,
    image:
      "https://images.unsplash.com/photo-1549399736-8e3c8b8b8b8b?w=300&h=200&fit=crop",
    rating: { rate: 4.5, count: 89 },
    inStock: true,
    tags: ["electric", "eco-friendly", "modern"],
  },
  {
    id: 3,
    title: "Hyundai Creta",
    price: 1200000,
    description: "Premium compact SUV",
    category: "SUV",
    brand: "Hyundai",
    fuelType: "Petrol",
    bodyType: "SUV",
    transmission: "Automatic",
    seats: 5,
    image:
      "https://images.unsplash.com/photo-1549399736-8e3c8b8b8b8b?w=300&h=200&fit=crop",
    rating: { rate: 4.3, count: 200 },
    inStock: true,
    tags: ["premium", "spacious", "comfortable"],
  },
  {
    id: 4,
    title: "Toyota Innova Crysta",
    price: 1800000,
    description: "7-seater MPV for families",
    category: "MPV",
    brand: "Toyota",
    fuelType: "Diesel",
    bodyType: "MPV",
    transmission: "Manual",
    seats: 7,
    image:
      "https://images.unsplash.com/photo-1549399736-8e3c8b8b8b8b?w=300&h=200&fit=crop",
    rating: { rate: 4.4, count: 120 },
    inStock: false,
    tags: ["family", "spacious", "reliable"],
  },
  {
    id: 5,
    title: "Mahindra Thar",
    price: 1500000,
    description: "Off-road SUV with 4WD",
    category: "SUV",
    brand: "Mahindra",
    fuelType: "Diesel",
    bodyType: "SUV",
    transmission: "Manual",
    seats: 4,
    image:
      "https://images.unsplash.com/photo-1549399736-8e3c8b8b8b8b?w=300&h=200&fit=crop",
    rating: { rate: 4.1, count: 95 },
    inStock: true,
    tags: ["off-road", "adventure", "rugged"],
  },
  {
    id: 6,
    title: "KIA Seltos",
    price: 1100000,
    description: "Feature-rich compact SUV",
    category: "SUV",
    brand: "KIA",
    fuelType: "Petrol",
    bodyType: "SUV",
    transmission: "Automatic",
    seats: 5,
    image:
      "https://images.unsplash.com/photo-1549399736-8e3c8b8b8b8b?w=300&h=200&fit=crop",
    rating: { rate: 4.2, count: 110 },
    inStock: true,
    tags: ["feature-rich", "stylish", "tech-savvy"],
  },
];

// Filter options with counts
const filterOptions = {
  priceRanges: [
    { value: "0-500000", label: "Under 5 lakh", count: 1 },
    { value: "500000-1000000", label: "5-10 lakh", count: 1 },
    { value: "1000000-1500000", label: "10-15 lakh", count: 3 },
    { value: "1500000-2000000", label: "15-20 lakh", count: 1 },
    { value: "2000000-999999999", label: "Above 20 lakh", count: 0 },
  ],
  brands: [
    { value: "Maruti", label: "Maruti", count: 1 },
    { value: "Tata", label: "Tata", count: 1 },
    { value: "Hyundai", label: "Hyundai", count: 1 },
    { value: "Toyota", label: "Toyota", count: 1 },
    { value: "Mahindra", label: "Mahindra", count: 1 },
    { value: "KIA", label: "KIA", count: 1 },
  ],
  fuelTypes: [
    { value: "Petrol", label: "Petrol", count: 3 },
    { value: "Diesel", label: "Diesel", count: 2 },
    { value: "Electric", label: "Electric", count: 1 },
    { value: "CNG", label: "CNG", count: 0 },
    { value: "Hybrid", label: "Hybrid", count: 0 },
  ],
  bodyTypes: [
    { value: "Hatchback", label: "Hatchback", count: 1 },
    { value: "SUV", label: "SUV", count: 4 },
    { value: "MPV", label: "MPV", count: 1 },
    { value: "Sedan", label: "Sedan", count: 0 },
  ],
  transmissions: [
    { value: "Manual", label: "Manual", count: 3 },
    { value: "Automatic", label: "Automatic", count: 3 },
  ],
  seats: [
    { value: "4", label: "4 Seater", count: 1 },
    { value: "5", label: "5 Seater", count: 4 },
    { value: "7", label: "7 Seater", count: 1 },
  ],
};

export default function FilteringPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    budget: true,
    brand: true,
    fuelType: true,
    bodyType: false,
    transmission: false,
    seats: false,
  });

  // Initialize filters
  const { filters, setFilter, updateFilters, resetFilters, removeFilter } =
    useFilters<ProductFilters>({
      initialFilters: {
        search: "",
        categories: [],
        brands: [],
        priceRanges: [],
        fuelTypes: [],
        bodyTypes: [],
        transmissions: [],
        seats: [],
        minPrice: 0,
        maxPrice: 3000000,
        minRating: 0,
        inStockOnly: false,
        tags: [],
      },
    });

  // Apply filters
  useEffect(() => {
    setLoading(true);

    // Simulate API delay
    const timer = setTimeout(() => {
      let result = [...products];

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (product) =>
            product.title.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.brand.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower)
        );
      }

      // Brand filter
      if ((filters.brands ?? []).length > 0) {
        result = result.filter((product) =>
          filters.brands?.includes(product.brand)
        );
      }

      // Price range filter
      if ((filters.priceRanges ?? []).length > 0) {
        result = result.filter((product) => {
          return filters?.priceRanges?.some((range) => {
            const [min, max] = range.split("-").map(Number);
            return product.price >= min && product.price <= max;
          });
        });
      }

      // Fuel type filter
      if ((filters.fuelTypes ?? []).length > 0) {
        result = result.filter(
          (product) =>
            product.fuelType &&
            (filters.fuelTypes ?? []).includes(product.fuelType)
        );
      }

      // Body type filter
      if ((filters.bodyTypes ?? []).length > 0) {
        result = result.filter(
          (product) =>
            product.bodyType &&
            (filters.bodyTypes ?? []).includes(product.bodyType)
        );
      }

      // Transmission filter
      if ((filters.transmissions ?? []).length > 0) {
        result = result.filter(
          (product) =>
            product.transmission &&
            (filters.transmissions ?? []).includes(product.transmission)
        );
      }

      // Seats filter
      if ((filters.seats ?? []).length > 0) {
        result = result.filter(
          (product) =>
            product.seats && filters?.seats?.includes(product.seats.toString())
        );
      }

      // Price range filter (slider)
      result = result.filter(
        (product) =>
          product.price >= (filters.minPrice ?? 0) &&
          product.price <= (filters.maxPrice ?? 3000000)
      );

      // Rating filter
      if ((filters.minRating ?? 0) > 0) {
        result = result.filter(
          (product) => product.rating.rate >= (filters.minRating ?? 0)
        );
      }

      // In stock filter
      if (filters.inStockOnly) {
        result = result.filter((product) => product.inStock);
      }

      // Tags filter
      if ((filters.tags ?? []).length > 0) {
        result = result.filter((product) =>
          (filters.tags ?? []).some((tag) => product.tags.includes(tag))
        );
      }

      setFilteredProducts(result);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, products]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxFilter = (
    filterKey: keyof ProductFilters,
    value: string
  ) => {
    const currentValues = filters[filterKey] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    setFilter(filterKey, newValues);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if ((filters.brands?.length ?? 0) > 0) count++;
    if ((filters.priceRanges?.length ?? 0) > 0) count++;
    if ((filters.fuelTypes?.length ?? 0) > 0) count++;
    if ((filters.bodyTypes?.length ?? 0) > 0) count++;
    if ((filters.transmissions?.length ?? 0) > 0) count++;
    if ((filters.seats?.length ?? 0) > 0) count++;
    if ((filters.minRating ?? 0) > 0) count++;
    if (filters.inStockOnly) count++;
    if ((filters.tags?.length ?? 0) > 0) count++;
    return count;
  };
  const FilterSection = ({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }) => (
    <Paper withBorder p="md" radius="md" mb="sm">
      <Group
        justify="apart"
        className="cursor-pointer"
        onClick={() => toggleSection(sectionKey)}
      >
        <Text fw={500}>{title}</Text>
        {openSections[sectionKey] ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}
      </Group>
      <Collapse in={openSections[sectionKey]}>
        <Box mt="md">{children}</Box>
      </Collapse>
    </Paper>
  );

  const CheckboxFilterGroup = ({
    options,
    filterKey,
    searchable = false,
  }: {
    options: Array<{ value: string; label: string; count: number }>;
    filterKey: keyof ProductFilters;
    searchable?: boolean;
  }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredOptions = searchable
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    return (
      <Box>
        {searchable && (
          <TextInput
            placeholder="Search..."
            leftSection={<Search size={14} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb="sm"
            size="xs"
          />
        )}
        <ScrollArea.Autosize mah={200}>
          <Stack>
            {filteredOptions.map((option) => (
              <Checkbox
                key={option.value}
                label={
                  <Group justify="apart" style={{ width: "100%" }}>
                    <Text size="sm">{option.label}</Text>
                    <Text size="xs" c="dimmed">
                      ({option.count})
                    </Text>
                  </Group>
                }
                checked={(filters[filterKey] as string[]).includes(
                  option.value
                )}
                onChange={() => handleCheckboxFilter(filterKey, option.value)}
                disabled={option.count === 0}
              />
            ))}
          </Stack>
        </ScrollArea.Autosize>
      </Box>
    );
  };

  if (loading && filteredProducts.length === 0) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <Loader size="xl" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <Title order={2} mb="lg">
          Advanced Filtering System
        </Title>

        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Box className="sticky top-4">
              <Paper withBorder p="md" radius="md" mb="lg">
                <Group justify="apart" mb="md">
                  <Title order={4}>
                    Filters{" "}
                    {getActiveFiltersCount() > 0 &&
                      `(${getActiveFiltersCount()})`}
                  </Title>
                  <Button
                    variant="subtle"
                    leftSection={<X size={16} />}
                    onClick={resetFilters}
                    size="xs"
                  >
                    Clear All
                  </Button>
                </Group>

                <TextInput
                  placeholder="Search vehicles..."
                  leftSection={<Search size={16} />}
                  value={filters.search}
                  onChange={(e) => setFilter("search", e.target.value)}
                  mb="md"
                />

                <Checkbox
                  label="In Stock Only"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilter("inStockOnly", e.target.checked)}
                  mb="md"
                />
              </Paper>

              <FilterSection title="Budget" sectionKey="budget">
                <CheckboxFilterGroup
                  options={filterOptions.priceRanges}
                  filterKey="priceRanges"
                />
              </FilterSection>

              <FilterSection title="Brand" sectionKey="brand">
                <CheckboxFilterGroup
                  options={filterOptions.brands}
                  filterKey="brands"
                  searchable
                />
              </FilterSection>

              <FilterSection title="Fuel Type" sectionKey="fuelType">
                <CheckboxFilterGroup
                  options={filterOptions.fuelTypes}
                  filterKey="fuelTypes"
                />
              </FilterSection>

              <FilterSection title="Body Type" sectionKey="bodyType">
                <CheckboxFilterGroup
                  options={filterOptions.bodyTypes}
                  filterKey="bodyTypes"
                />
              </FilterSection>

              <FilterSection title="Transmission" sectionKey="transmission">
                <CheckboxFilterGroup
                  options={filterOptions.transmissions}
                  filterKey="transmissions"
                />
              </FilterSection>

              <FilterSection title="Seats" sectionKey="seats">
                <CheckboxFilterGroup
                  options={filterOptions.seats}
                  filterKey="seats"
                />
              </FilterSection>

              <Paper withBorder p="md" radius="md">
                <Text fw={500} mb="md">
                  Advanced Filters
                </Text>

                <Text size="sm" mb="xs">
                  Minimum Rating
                </Text>
                <Select
                  placeholder="Any rating"
                  data={[
                    { value: "0", label: "Any rating" },
                    { value: "3", label: "3+ stars" },
                    { value: "4", label: "4+ stars" },
                    { value: "4.5", label: "4.5+ stars" },
                  ]}
                  value={(filters.minRating ?? 0).toString()}
                  onChange={(value) =>
                    setFilter("minRating", Number(value) || 0)
                  }
                  mb="md"
                />

                <MultiSelect
                  label="Tags"
                  placeholder="Select tags"
                  data={[
                    { value: "fuel-efficient", label: "Fuel Efficient" },
                    { value: "electric", label: "Electric" },
                    { value: "premium", label: "Premium" },
                    { value: "family", label: "Family" },
                    { value: "off-road", label: "Off-road" },
                    { value: "compact", label: "Compact" },
                    { value: "spacious", label: "Spacious" },
                  ]}
                  value={filters.tags}
                  onChange={(value) => setFilter("tags", value)}
                  searchable
                  clearable
                />
              </Paper>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 9 }}>
            <Paper withBorder p="md" radius="md" mb="lg">
              <Group justify="apart">
                <Text>
                  {loading
                    ? "Loading..."
                    : `Showing ${filteredProducts.length} of ${products.length} vehicles`}
                </Text>

                <Group>
                  {/* Active filter badges */}
                  {filters?.brands?.map((brand) => (
                    <Badge
                      key={brand}
                      rightSection={
                        <ActionIcon
                          size="xs"
                          radius="xl"
                          onClick={() => handleCheckboxFilter("brands", brand)}
                        >
                          <X size={10} />
                        </ActionIcon>
                      }
                    >
                      Brand: {brand}
                    </Badge>
                  ))}

                  {filters?.fuelTypes?.map((fuel) => (
                    <Badge
                      key={fuel}
                      rightSection={
                        <ActionIcon
                          size="xs"
                          radius="xl"
                          onClick={() =>
                            handleCheckboxFilter("fuelTypes", fuel)
                          }
                        >
                          <X size={10} />
                        </ActionIcon>
                      }
                    >
                      Fuel: {fuel}
                    </Badge>
                  ))}
                </Group>
              </Group>
            </Paper>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : filteredProducts.length === 0 ? (
              <Paper withBorder p="xl" radius="md" ta="center">
                <Text size="lg" fw={500} mb="md">
                  No vehicles found
                </Text>
                <Text c="dimmed">Try adjusting your filters</Text>
                <Button
                  variant="subtle"
                  leftSection={<Filter size={16} />}
                  onClick={resetFilters}
                  mt="md"
                >
                  Reset Filters
                </Button>
              </Paper>
            ) : (
              <Grid>
                {filteredProducts.map((product) => (
                  <Grid.Col key={product.id} span={12}>
                    <Card withBorder p="lg" radius="md" h="100%">
                      <Card.Section
                        h={200}
                        py="md"
                        style={{ backgroundColor: "white" }}
                      >
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          height={160}
                          fit="cover"
                        />
                      </Card.Section>

                      <Group justify="apart" mt="md" mb="xs">
                        <Text fw={500} lineClamp={1}>
                          {product.title}
                        </Text>
                        <Badge color={product.inStock ? "green" : "red"}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </Group>

                      <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                        {product.description}
                      </Text>

                      <Group justify="apart" mb="md">
                        <Text fw={700} size="lg">
                          ₹{(product.price / 100000).toFixed(1)}L
                        </Text>
                        <Group gap={5}>
                          <Star size={16} className="text-yellow-500" />
                          <Text size="sm">
                            {product.rating.rate} ({product.rating.count})
                          </Text>
                        </Group>
                      </Group>

                      <Group justify="apart" mb="md">
                        <Badge variant="light">{product.brand}</Badge>
                        <Badge variant="light">{product.fuelType}</Badge>
                        <Badge variant="light">{product.seats} Seats</Badge>
                      </Group>

                      <Group gap={4} mb="md">
                        {product.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} size="xs" variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </Group>

                      <Button fullWidth variant="light">
                        View Details
                      </Button>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Grid.Col>
        </Grid>
      </DashboardLayout>
    </AuthGuard>
  );
}
