"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  Pagination,
  Text,
  Group,
  ActionIcon,
  Button,
  Loader,
  Paper,
  Box,
  Menu,
  Tooltip,
  Checkbox,
  Center,
} from "@mantine/core";
import {
  Edit,
  Trash,
  Plus,
  MoreHorizontal,
  Download,
  Upload,
  Eye,
} from "lucide-react";
import { usePagination } from "@/src/hooks/use-pagination";

export interface DataTableColumn<T> {
  key: string;
  title: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  minWidth?: string | number;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  isLoading?: boolean;
  error?: Error | null;
  totalItems?: number;
  onRowClick?: (item: T) => void;
  getRowId: (item: T) => string | number;

  // CRUD operations
  onCreate?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;

  // Custom actions
  actions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
    condition?: (item: T) => boolean;
  }[];

  // Bulk actions
  bulkActions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: (items: T[]) => void;
  }[];

  // Filters component - this allows for custom filters per table instance
  filtersComponent?: React.ReactNode;

  // Export/Import
  onExport?: () => void;
  onImport?: () => void;

  // Pagination
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  error = null,
  totalItems = 0,
  onRowClick,
  getRowId,
  onCreate,
  onEdit,
  onDelete,
  onView,
  actions = [],
  bulkActions = [],
  filtersComponent,
  onExport,
  onImport,
  initialPage = 1,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  );
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { page, pageSize, totalPages, goToPage, changePageSize } =
    usePagination({
      initialPage,
      initialPageSize,
      total: totalItems || data.length,
    });

  // Reset selected rows when data changes
  useEffect(() => {
    setSelectedRows(new Set());
  }, [data]);

  // Handle row selection
  const toggleRowSelection = (id: string | number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((item) => getRowId(item))));
    }
  };

  // Handle sort
  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  // Get selected items
  const getSelectedItems = (): T[] => {
    return data.filter((item) => selectedRows.has(getRowId(item)));
  };

  // Render table header
  const renderHeader = () => {
    return (
      <Table.Thead>
        <Table.Tr>
          {bulkActions.length > 0 && (
            <Table.Th style={{ width: "40px" }}>
              <Checkbox
                checked={data.length > 0 && selectedRows.size === data.length}
                onChange={toggleSelectAll}
              />
            </Table.Th>
          )}

          {columns.map((column) => (
            <Table.Th
              key={column.key}
              style={{
                width: column.width || "auto",
                minWidth: column.minWidth || "150px",
              }}
              className={
                column.sortable
                  ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  : ""
              }
              onClick={
                column.sortable ? () => handleSort(column.key) : undefined
              }
            >
              <Group justify="flex-start" gap="xs">
                {column.title}
                {sortBy === column.key && (
                  <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </Group>
            </Table.Th>
          ))}

          {(onEdit || onDelete || onView || actions.length > 0) && (
            <Table.Th style={{ width: "80px" }}>Actions</Table.Th>
          )}
        </Table.Tr>
      </Table.Thead>
    );
  };

  // Render table body
  const renderBody = () => {
    if (isLoading) {
      return (
        <Table.Tbody>
          <Table.Tr>
            <Table.Td
              colSpan={
                columns.length +
                (bulkActions.length > 0 ? 1 : 0) +
                (onEdit || onDelete || actions.length > 0 ? 1 : 0)
              }
            >
              <Center py="xl">
                <Loader />
              </Center>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      );
    }

    if (error) {
      return (
        <Table.Tbody>
          <Table.Tr>
            <Table.Td
              colSpan={
                columns.length +
                (bulkActions.length > 0 ? 1 : 0) +
                (onEdit || onDelete || actions.length > 0 ? 1 : 0)
              }
            >
              <Text color="red" ta="center" py="lg">
                Error: {error.message}
              </Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      );
    }

    if (data.length === 0) {
      return (
        <Table.Tbody>
          <Table.Tr>
            <Table.Td
              colSpan={
                columns.length +
                (bulkActions.length > 0 ? 1 : 0) +
                (onEdit || onDelete || actions.length > 0 ? 1 : 0)
              }
            >
              <Text ta="center" py="lg">
                No data found
              </Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      );
    }

    return (
      <Table.Tbody>
        {data.map((item, index) => {
          const id = getRowId(item);
          return (
            <Table.Tr
              key={id}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              className={`${
                onRowClick
                  ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  : ""
              } ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
              }`}
            >
              {bulkActions.length > 0 && (
                <Table.Td onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedRows.has(id)}
                    onChange={() => toggleRowSelection(id)}
                  />
                </Table.Td>
              )}

              {columns.map((column) => (
                <Table.Td key={`${id}-${column.key}`}>
                  {column.render
                    ? column.render(item, index)
                    : (item as any)[column.key]}
                </Table.Td>
              ))}

              {(onEdit || onDelete || onView || actions.length > 0) && (
                <Table.Td onClick={(e) => e.stopPropagation()}>
                  <Group gap={4} justify="flex-start">
                    {onView && (
                      <Tooltip label="View">
                        <ActionIcon onClick={() => onView(item)} size="sm">
                          <Eye size={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}

                    {onEdit && (
                      <Tooltip label="Edit">
                        <ActionIcon onClick={() => onEdit(item)} size="sm">
                          <Edit size={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}

                    {onDelete && (
                      <Tooltip label="Delete">
                        <ActionIcon
                          color="red"
                          onClick={() => onDelete(item)}
                          size="sm"
                        >
                          <Trash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}

                    {actions.length > 0 && (
                      <Menu position="bottom-end" withinPortal>
                        <Menu.Target>
                          <ActionIcon size="sm">
                            <MoreHorizontal size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          {actions.map((action, i) =>
                            action.condition ? (
                              action.condition(item) && (
                                <Menu.Item
                                  key={i}
                                  leftSection={action.icon}
                                  onClick={() => action.onClick(item)}
                                >
                                  {action.label}
                                </Menu.Item>
                              )
                            ) : (
                              <Menu.Item
                                key={i}
                                leftSection={action.icon}
                                onClick={() => action.onClick(item)}
                              >
                                {action.label}
                              </Menu.Item>
                            )
                          )}
                        </Menu.Dropdown>
                      </Menu>
                    )}
                  </Group>
                </Table.Td>
              )}
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    );
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4">
        <Group justify="space-between">
          <Group>
            {onCreate && (
              <Button leftSection={<Plus size={16} />} onClick={onCreate}>
                Add New
              </Button>
            )}

            {selectedRows.size > 0 && bulkActions.length > 0 && (
              <Menu position="bottom-start" withinPortal>
                <Menu.Target>
                  <Button variant="outline">
                    {selectedRows.size} selected
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {bulkActions.map((action, i) => (
                    <Menu.Item
                      key={i}
                      leftSection={action.icon}
                      onClick={() => action.onClick(getSelectedItems())}
                    >
                      {action.label}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>

          <Group>
            {onExport && (
              <Button
                variant="outline"
                leftSection={<Download size={16} />}
                onClick={onExport}
              >
                Export
              </Button>
            )}

            {onImport && (
              <Button
                variant="outline"
                leftSection={<Upload size={16} />}
                onClick={onImport}
              >
                Import
              </Button>
            )}
          </Group>
        </Group>

        {/* Filters */}
        {filtersComponent && (
          <Paper withBorder p="md" mt="md">
            {filtersComponent}
          </Paper>
        )}
      </div>

      {/* Table */}
      <Paper withBorder>
        <Box style={{ overflowX: "auto" }}>
          <Table
            className="bg-[#FCFCFC] w-full"
            verticalSpacing={"lg"}
            striped
            highlightOnHover
          >
            {renderHeader()}
            {renderBody()}
          </Table>
        </Box>
      </Paper>

      {/* Pagination */}
      {totalPages > 1 && (
        <Group justify="space-between" mt="md">
          <Text size="sm">
            Showing {Math.min(pageSize, data.length)} of{" "}
            {totalItems || data.length} items
          </Text>

          <Group gap="xs">
            <select
              value={pageSize}
              onChange={(e) => changePageSize(Number(e.target.value))}
              className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm p-1"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>

            <Pagination
              total={totalPages}
              value={page}
              onChange={goToPage}
              withEdges
            />
          </Group>
        </Group>
      )}
    </div>
  );
}
