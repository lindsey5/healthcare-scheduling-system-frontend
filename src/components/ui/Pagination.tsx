import { type Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/utils";

interface PaginationButtonProps {
    onClick: () => void;
    disabled?: boolean;
    tooltip?: string;
    children: React.ReactNode;
    className?: string;
}

export const PaginationButton = ({
    onClick,
    disabled = false,
    tooltip,
    children,
    className = "",
}: PaginationButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "group relative flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200",
                disabled
                    ? "cursor-not-allowed border-green-100 bg-gray-100 text-gray-400 opacity-60"
                    : "cursor-pointer border-gray-200 bg-white text-[#1E3D15] shadow-sm hover:border-[#1E3D15] hover:bg-green-50 hover:shadow",
                className
            )}
        >
            {tooltip && !disabled && (
                <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-[#1E3D15] px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {tooltip}
                </span>
            )}

            {children}
        </button>
    );
};

interface PaginationControlsProps<T> {
    table: Table<T>;
    total: number;
}

export const PaginationControls = <T,>({
    table,
    total,
}: PaginationControlsProps<T>) => {
    const { pageIndex, pageSize } = table.getState().pagination;
    const pageCount = table.getPageCount();

    const delta = 2;

    const getPageNumbers = () => {
        const range: (number | string)[] = [];
        const left = Math.max(0, pageIndex - delta);
        const right = Math.min(pageCount - 1, pageIndex + delta);

        for (let i = 0; i < pageCount; i++) {
            if (
                i === 0 ||
                i === pageCount - 1 ||
                (i >= left && i <= right)
            ) {
                range.push(i);
            } else if (range[range.length - 1] !== "...") {
                range.push("...");
            }
        }

        return range;
    };

    const startRow = total === 0 ? 0 : pageIndex * pageSize + 1;
    const endRow = Math.min((pageIndex + 1) * pageSize, total);

    return (
        <div className="mt-6 flex flex-col gap-4 rounded-b-xl border-t border-gray-100 bg-green-50/40 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="font-medium">Rows per page</span>

                <select
                    value={pageSize}
                    onChange={(e) =>
                        table.setPageSize(Number(e.target.value))
                    }
                    className="rounded-lg border bg-white px-3 py-2 text-sm text-[#1E3D15] outline-none transition-all"
                >
                    {[5, 10, 20, 50, 100].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>

                <span>
                    Showing{" "}
                    <span className="font-semibold text-[#1E3D15]">
                        {startRow}
                    </span>{" "}
                    -{" "}
                    <span className="font-semibold text-[#1E3D15]">
                        {endRow}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-[#1E3D15]">
                        {total}
                    </span>
                </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                <PaginationButton
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    tooltip="Previous"
                >
                    <ChevronLeft size={18} />
                </PaginationButton>

                {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                        <button
                            key={index}
                            onClick={() => table.setPageIndex(page)}
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-200",
                                page === pageIndex
                                    ? "border-[#1E3D15] bg-[#1E3D15] text-white shadow"
                                    : "border-gray-200 bg-white text-[#1E3D15] hover:bg-green-100 hover:border-green-400"
                            )}
                        >
                            {page + 1}
                        </button>
                    ) : (
                        <span
                            key={index}
                            className="px-2 text-gray-400"
                        >
                            ...
                        </span>
                    )
                )}

                <PaginationButton
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    tooltip="Next"
                >
                    <ChevronRight size={18} />
                </PaginationButton>
            </div>
        </div>
    );
};