import { Breadcrumbs, Anchor } from "@mantine/core";
import { ChevronRight, MoreHorizontal } from "lucide-react";

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  maxItems?: number;
}

export function Breadcrumb({
  items,
  separator = <ChevronRight size={16} />,
  className,
  maxItems,
}: BreadcrumbProps) {
  const visibleItems = maxItems ? items.slice(-maxItems) : items;
  const shouldShowEllipsis = maxItems && items.length > maxItems;

  const breadcrumbItems = visibleItems.map((item, index) => {
    const isLast = index === visibleItems.length - 1;

    if (item.href && !isLast) {
      return (
        <Anchor href={item.href} key={index} size="sm">
          {item.title}
        </Anchor>
      );
    }

    return (
      <span
        key={index}
        style={{ color: isLast ? "inherit" : "var(--mantine-color-dimmed)" }}
      >
        {item.title}
      </span>
    );
  });

  return (
    <Breadcrumbs separator={separator} className={className}>
      {shouldShowEllipsis && (
        <>
          <span style={{ display: "flex", alignItems: "center" }}>
            <MoreHorizontal size={16} />
          </span>
        </>
      )}
      {breadcrumbItems}
    </Breadcrumbs>
  );
}

export type { BreadcrumbItem, BreadcrumbProps };
