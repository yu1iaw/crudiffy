"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TTableRow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ModalDialog } from "./modal-dialog";
import { RightSheet } from "./right-sheet";
import { DashboardTableRow } from "./table-row";


export const columns: ColumnDef<TTableRow>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <div className="lowercase max-w-[450px] whitespace-nowrap overflow-hidden text-ellipsis">{row.getValue("description")}</div>,
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Amount
                        <ArrowUpDown />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount")) || 0;

            return <div className="text-center font-medium">{amount.toFixed(2)}</div>
        },
    },
]


export const DashboardTable = ({ data, setOptimisticData }: { data: TTableRow[], setOptimisticData: (action: any) => void }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [editMode, setEditMode] = useState(false);


    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
    })


    const selectedItems = table.getFilteredSelectedRowModel().rows;

    useEffect(() => {
        !selectedItems.length && setEditMode(false);
    }, [!!selectedItems.length])

    const selectedList = selectedItems.map(r => ({ id: r.original.id, date: r.original.date, index: r.original.categoryIndex, category: r.original.category }));

    const toggleSelected = () => {
        table.getSelectedRowModel().rows.forEach(r => r.toggleSelected())
    }

    return (
        <div className="relative flex flex-col min-h-[359px] w-full bg-white rounded-md p-2">
            <RightSheet setOptimisticData={setOptimisticData}>
                <Button
                    size="icon"
                    className="absolute w-14 h-14 right-0 top-[50%] translate-x-[43%] -translate-y-[110%] rounded-full bg-[#a385e0] hover:bg-[#9b74e9] transition shadow-md z-50 [&_svg]:size-6"
                >
                    <Plus color="white" />
                </Button>
            </RightSheet>
            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-300/30">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className={cn({ 'w-[60px]': header.id === "select", 'w-[150px]': header.id === "amount" })}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <DashboardTableRow
                                    key={row.id}
                                    row={row}
                                    editMode={editMode}
                                    setOptimisticData={setOptimisticData}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No expenses yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-1 items-end justify-between pt-4 pb-2">
                <div className="w-44 text-sm text-muted-foreground">
                    {selectedItems.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                {selectedItems.length > 0 && (
                    <div className="space-x-3">
                        <ModalDialog
                            toggleSelected={toggleSelected}
                            selectedToDelete={selectedList}
                            setOptimisticData={setOptimisticData}
                        >
                            <Button
                                size="sm"
                                variant="destructive"
                                className="w-[60px]"
                            >
                                Delete
                            </Button>
                        </ModalDialog>
                        <Button
                            size="sm"
                            className="w-[60px]"
                            onClick={() => setEditMode(true)}
                        >
                            Edit
                        </Button>
                    </div>
                )}
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
