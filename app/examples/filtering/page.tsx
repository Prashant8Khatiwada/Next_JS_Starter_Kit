"use client"

import { AuthGuard } from "@/components/auth-guard"
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
  RangeSlider,
  ActionIcon,
  Image,
  Loader,
  Box,
} from "@mantine/core"
import { useState, useEffect } from "react"
import { useFilters } from "@/hooks/use-filters"
import { Search, Filter, X, Star } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/layout"

// Product type from Fake Store API
interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

interface ProductFilters {
  search: string
  category: string
  minPrice: number
  maxPrice: number
  minRating: number
}

export default function FilteringPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize filters
  const { filters, setFilter, updateFilters, resetFilters, removeFilter } = useFilters<ProductFilters>({
    initialFilters: {
      search: "",
      category: "",
      minPrice: 0,
      maxPrice: 1000,
      minRating: 0,
    },
  })

  // Fetch products from Fake Store API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://fakestoreapi.com/products")
        const data = await response.json()
        setProducts(data)

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((product: Product) => product.category))]
        setCategories(uniqueCategories)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch products"))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters
  useEffect(() => {
    if (!products.length) return

    let result = [...products]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower),
      )
    }

    // Category filter
    if (filters.category) {
      result = result.filter((product) => product.category === filters.category)
    }

    // Price range filter
    result = result.filter((product) => product.price >= filters.minPrice && product.price <= filters.maxPrice)

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((product) => product.rating.rate >= filters.minRating)
    }

    setFilteredProducts(result)
  }, [filters, products])

  // Handle price range change
  const handlePriceChange = (value: [number, number]) => {
    updateFilters({
      minPrice: value[0],
      maxPrice: value[1],
    })
  }

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <Loader size="xl" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard>
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
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <Title order={2} mb="lg">
          Advanced Filtering Example
        </Title>

        <Grid>
          <Grid.Col span={12} md={3}>
            <Paper withBorder p="md" radius="md" className="sticky top-4">
              <Title order={4} mb="md">
                Filters
              </Title>

              <Box className="space-y-4">
                <TextInput
                  label="Search"
                  placeholder="Search products..."
                  leftSection={<Search size={16} />}
                  value={filters.search}
                  onChange={(e) => setFilter("search", e.target.value)}
                />

                <Select
                  label="Category"
                  placeholder="Select category"
                  data={[
                    { value: "", label: "All Categories" },
                    ...categories.map((category) => ({ value: category, label: category })),
                  ]}
                  value={filters.category}
                  onChange={(value) => setFilter("category", value || "")}
                />

                <Box>
                  <Text size="sm" fw={500} mb="xs">
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
                </Box>

                <Box>
                  <Text size="sm" fw={500} mb="xs">
                    Minimum Rating
                  </Text>
                  <RangeSlider
                    min={0}
                    max={5}
                    step={0.5}
                    value={[filters.minRating, 5]}
                    onChange={([min]) => setFilter("minRating", min)}
                    marks={[
                      { value: 0, label: "0" },
                      { value: 2.5, label: "2.5" },
                      { value: 5, label: "5" },
                    ]}
                  />
                </Box>

                <Button leftSection={<X size={16} />} variant="subtle" onClick={resetFilters} fullWidth mt="md">
                  Reset Filters
                </Button>
              </Box>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12} md={9}>
            <Paper withBorder p="md" radius="md" mb="lg">
              <Group position="apart">
                <Text>
                  Showing {filteredProducts.length} of {products.length} products
                </Text>

                <Group>
                  {filters.search && (
                    <Badge
                      rightSection={
                        <ActionIcon size="xs" radius="xl" onClick={() => removeFilter("search")}>
                          <X size={10} />
                        </ActionIcon>
                      }
                    >
                      Search: {filters.search}
                    </Badge>
                  )}

                  {filters.category && (
                    <Badge
                      rightSection={
                        <ActionIcon size="xs" radius="xl" onClick={() => setFilter("category", "")}>
                          <X size={10} />
                        </ActionIcon>
                      }
                    >
                      Category: {filters.category}
                    </Badge>
                  )}

                  {filters.minRating > 0 && (
                    <Badge
                      rightSection={
                        <ActionIcon size="xs" radius="xl" onClick={() => setFilter("minRating", 0)}>
                          <X size={10} />
                        </ActionIcon>
                      }
                    >
                      Rating: ≥ {filters.minRating}
                    </Badge>
                  )}
                </Group>
              </Group>
            </Paper>

            {filteredProducts.length === 0 ? (
              <Paper withBorder p="xl" radius="md" ta="center">
                <Text size="lg" fw={500} mb="md">
                  No products found
                </Text>
                <Text c="dimmed">Try adjusting your filters</Text>
                <Button variant="subtle" leftSection={<Filter size={16} />} onClick={resetFilters} mt="md">
                  Reset Filters
                </Button>
              </Paper>
            ) : (
              <Grid>
                {filteredProducts.map((product) => (
                  <Grid.Col key={product.id} span={12} sm={6} lg={4}>
                    <Card withBorder p="lg" radius="md">
                      <Card.Section h={200} py="md" style={{ backgroundColor: "white" }}>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          height={160}
                          fit="contain"
                        />
                      </Card.Section>

                      <Group position="apart" mt="md" mb="xs">
                        <Text fw={500} lineClamp={1}>
                          {product.title}
                        </Text>
                        <Badge color="blue">${product.price.toFixed(2)}</Badge>
                      </Group>

                      <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                        {product.description}
                      </Text>

                      <Group position="apart">
                        <Badge color="green">{product.category}</Badge>
                        <Group gap={5}>
                          <Star size={16} className="text-yellow-500" />
                          <Text size="sm">
                            {product.rating.rate} ({product.rating.count})
                          </Text>
                        </Group>
                      </Group>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Grid.Col>
        </Grid>
      </DashboardLayout>
    </AuthGuard>
  )
}
