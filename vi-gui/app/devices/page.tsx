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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { deletedev, deleteTestcase, fetchclientdev } from "@/app/api"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export type Device = {
  name: string;
  platform: string;
  wanip: string;
  devtype: string;
}

export default function DeviceDataTable() {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data,setData] = useState<Device[]>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const columns: ColumnDef<Device>[] = [
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
      header: "Device Name",
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
        accessorKey: "wanip",
        header: "WAN IP",
        cell: ({ row }) => <div className="lowercase">{row.getValue("wanip")}</div>,
    },
    {
      accessorKey: "devtype",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Device Type
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="uppercase">{row.getValue("devtype")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const device = row.original
        const handleAction = (action: string) => {
          const devicetype = device.devtype.toLowerCase()
          switch (action) {
            case "edit":
              router.push(`/devices/${devicetype}/${device.name}`)
              break
            case "delete":
              const response = deletedev(device,devicetype,device.name);
              if (!response) {
                throw new Error("No response");
              }
              else{
                setData(prevData => prevData.filter(item => item.name !== device.name));
                toast({
                  title: 'Device Deleted',
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
  
    const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchclientdev("client");
      const dutresponse = await fetchclientdev("dut");
      const result = await response;
      const dutresult = await dutresponse;
      console.log(result,dutresult)
      if (Array.isArray(result) && Array.isArray(dutresult)) {
        const devices : Device[] = [
          ...result.map((device) => ({
            name: device.devicename,
            platform: device.deviceplatform,
            wanip: device.wanip,
            devtype: "Client",
          })),
          ...dutresult.map((device) => ({
            name: device.dutname,
            platform: device.dutplatform,
            wanip: device.wanip,
            devtype: "DUT",
          }))];
            setData(devices);
          console.log(data)           
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
          placeholder="Search client device..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Separator orientation="vertical" className="my-4"/>
        <div className="flex-1 space-x-2">
          {table.getColumn("platform") &&(
            <DataTableFacetedFilter
            column={table.getColumn("platform")}
            title="platform"  
            options={getDropDownValues(data, "platform")}/>
          )}
          {table.getColumn("devtype") && (
            <DataTableFacetedFilter
            column={table.getColumn("devtype")}
            title="devtype"  
            options={getDropDownValues(data, "devtype")}/>
          )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
            <Button className="ml-auto items-end" >
                Add Device
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/devices/client/new">Client</Link>
                </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/devices/dut/new">DUT</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
         
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
