"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { getDropDownValues } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { DataTableFacetedFilter } from "@/components/ui/facted-filter"
import { DataTablePagination } from "@/components/page-control"
import TestcaseExecutor from "@/app/testcases/testcaseExecutor"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { deleteTestcase, fetchallTestcase } from "../api"
import { toast } from "@/hooks/use-toast"

export type Testcase = {
  name: string;
  platform: string;
  area: string;
    
}



export default function TestcaseDataTable() {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data,setData] = useState<Testcase[]>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const columns: ColumnDef<Testcase>[] = [
  
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
      accessorKey: "name",
      header: "Testcase Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "platform",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Platform
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="uppercase">{row.getValue("platform")}</div>,
    },
      {
          accessorKey: "description",
          header: "description",
          cell: ({ row }) => <div className="lowercase">{row.getValue("description")}</div>,
      },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const testcase = row.original
        const handleAction = (action: string) => {
          switch (action) {
            case "edit":
              router.push(`/testcases/builder/${testcase.name}`)
              break
            case "delete":
              const response = deleteTestcase(testcase, testcase.name);
              if (!response) {
                throw new Error("No response");
              }
              else{
                setData(prevData => prevData.filter(item => item.name !== testcase.name));
                toast({
                  title: 'Testcase Deleted',
                })
              }
              break
            default:
              break
          }
        }
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Label onClick={() => handleAction("edit")}>Edit</Label>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Label onClick={() => handleAction("delete")}>Delete</Label>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
    const [loading, setLoading] = useState(true);
    let DJANGO_SERVER_URL = process.env.DJANGO_SERVER_URL;
    let DJANGO_SERVER_PORT = process.env.DJANGO_SERVER_PORT;
  
    const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchallTestcase();
      const result = await response.json();
  
      if (Array.isArray(result)) {
        const mappedTestcases : Testcase[] = result.map((testcase) => ({
            name: testcase.testcasename,
            platform: testcase.testplatform,
            area: testcase.area,
          }));
            setData(mappedTestcases);              
        } else {
          console.error("Unexpected response format", result);
          setData([]);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
  
      useEffect(() => {
          fetchData();
      }, []);

  return (
    <div className="p-4 w-full">
      <div className="flex items-center py-4 space-x-2">
        <Input
          placeholder="Search testcase..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Separator orientation="vertical" className="my-4"/>
        <div className="flex-1" >
          {table.getColumn("platform") &&(
            <DataTableFacetedFilter
            column={table.getColumn("platform")}
            title="platform"  
            options={getDropDownValues(data, "platform")}/>
          )}
          </div>
          <Button className="ml-auto items-end" onClick={() => router.push('/testcases/builder/new')}>
            Add Testcase
          </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {table.getFilteredSelectedRowModel().rows.length > 0}
      </div>
</div>
  )
}
