import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type PaginationState, type Row, type Table } from "@tanstack/react-table"
import { PaginationControls } from "./Pagination";
import { cn } from "../../utils/utils";

type TableRowProps<T> = {
    row: Row<T>;
    onRowClick?: (row: T) => void;
};

const TableRow = <T,>({ row, onRowClick }: TableRowProps<T>) => {
    return (
        <tr
            onClick={(e) => {
                e.stopPropagation();
                onRowClick?.(row.original);
            }}
            className={cn(
                "border-b border-gray-100 transition-all duration-200",
                row.index % 2 === 0 ? "bg-white" : "bg-green-50/40",
                onRowClick && "cursor-pointer hover:bg-green-100"
            )}
        >
            {row.getVisibleCells().map((cell) => {
                const align =
                    (cell.column.columnDef.meta as any)?.align || "left";

                return (
                    <td
                        key={cell.id}
                        className={`min-w-30 px-4 py-3 text-${align} text-sm text-gray-700`}
                    >
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                    </td>
                );
            })}
        </tr>
    );
};

const TableRows = <T,>({
    table,
    onRowClick,
}: {
    table: Table<T>;
    onRowClick?: (row: T) => void;
}) => {
    return (
        <tbody>
            {table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    row={row}
                    onRowClick={onRowClick}
                />
            ))}
        </tbody>
    );
};

const TableColumns = <T,>({ table }: { table: Table<T> }) => {
    return (
        <thead className="sticky top-0 z-5">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr
                    key={headerGroup.id}
                    className="bg-[#1E3D15] shadow-sm"
                >
                    {headerGroup.headers.map((header) => {
                        const align =
                            (header.column.columnDef.meta as any)?.align || "left";

                        return (
                            <th
                                key={header.id}
                                className="sticky top-0 border-b border-green-800 bg-[#1E3D15] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white"
                                style={{ textAlign: align }}
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </th>
                        );
                    })}
                </tr>
            ))}
        </thead>
    );
};

type TableSkeletonProps = {
    columns: number;
    rows?: number;
};

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
    columns,
    rows = 10,
}) => {
    return (
        <div className="min-h-0 flex-grow flex flex-col animate-pulse">
            <div className="overflow-auto flex-grow rounded-xl border border-green-200 bg-white shadow-sm">
                <table className="w-full border-collapse">
                    {/* Header */}
                    <thead className="bg-[#1E3D15]">
                        <tr>
                            {Array.from({ length: columns }).map((_, idx) => (
                                <th
                                    key={idx}
                                    className="px-4 py-4"
                                >
                                    <div className="mx-auto h-4 w-3/4 rounded bg-green-300/40" />
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {Array.from({ length: rows }).map((_, rowIdx) => (
                            <tr
                                key={rowIdx}
                                className={
                                    rowIdx % 2 === 0
                                        ? "bg-white"
                                        : "bg-green-50/40"
                                }
                            >
                                {Array.from({ length: columns }).map((_, colIdx) => (
                                    <td
                                        key={colIdx}
                                        className="border-b border-green-100 px-4 py-4"
                                    >
                                        <div className="h-4 w-full rounded bg-green-200" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

type CustomTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];         
    totalPages?: number;
    pagination?: PaginationState;
    setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
    isLoading: boolean;
    showPagination: boolean;
    total?: number;
    noDataMessage?: string;
    className?: string;
    onRowClick?: (row : T) => void;
};

const CustomizedTable = <T,>({
    data,
    totalPages,
    pagination,
    setPagination,
    columns,
    isLoading,
    showPagination,
    total,
    className,
    noDataMessage = "No Data Available",
    onRowClick,
}: CustomTableProps<T>) => {
    const table = useReactTable({
        data,
        columns,
        pageCount: totalPages,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    const rows = table.getRowModel().rows;
    const cols = table.getAllColumns().length;

    return (
        <div
            className={cn(
                "min-h-0 flex flex-grow flex-col rounded-xl border border-gray-300 bg-white shadow-sm",
                className
            )}
        >
            {rows.length < 1 && !isLoading ? (
                <div className="flex flex-1 flex-col items-center justify-center py-24">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <svg
                            className="h-8 w-8 text-[#1E3D15]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 17v-2a4 4 0 014-4h7M3 7h18M5 7v10a2 2 0 002 2h5"
                            />
                        </svg>
                    </div>

                    <h3 className="text-lg font-semibold text-[#1E3D15]">
                        No Records Found
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        {noDataMessage}
                    </p>
                </div>
            ) : isLoading ? (
                <TableSkeleton columns={cols} />
            ) : (
                <>
                    <div className="flex-grow overflow-auto rounded-xl">
                        <table className="w-full border-separate border-spacing-0 text-sm">
                            <TableColumns table={table} />
                            <TableRows
                                table={table}
                                onRowClick={onRowClick}
                            />
                        </table>
                    </div>

                    {showPagination && rows.length > 0 && (
                        <PaginationControls
                            total={total || 0}
                            table={table}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default CustomizedTable;