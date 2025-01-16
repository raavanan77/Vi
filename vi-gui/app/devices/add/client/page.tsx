"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loadingbutton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { addorupdateDevice } from "@/app/api";

interface DeviceProps {
  devicename: string;
  hostname: string;
  password: string;
  wanip: string;
  sshport: BigInteger;
  rpcport: BigInteger;
  deviceplatform: string;
  laniface: string;
  waniface: string;
  wlaniface: string;
  extaprops: JSON;
}

const DeviceParams = {"Device Name":"devicename",
  "Hostname" : "hostname",
  "Password" : "password",
  "Wan IP Address" : "wanip",
  "SSH Port":"sshport",
  "RPC Port":"rpcport",
  "Device Platform [OS]":"deviceplatform",
  "LAN Interface Name":"laniface",
  "WAN Interface Name":"waniface",
  "WLAN Interface Name":"wlaniface",
  "Extra Properties":"extaprops"}

interface AddDeviceProps {
  device?: DeviceProps;
}

const AddDevice: React.FC<AddDeviceProps> = ({ device }: any) => {
  const [loading, setLoading] = useState<boolean>(false);

  const FormSchema = z.object({
    devicename: z.string().min(1, { message: "Device name is required" }),
    hostname: z.string().min(1, { message: "Hostname is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    wanip: z.string().min(1, { message: "WAN IP is required" }),
    sshport: z.string().regex(/^\d+$/, { message: "Invalid SSH port" }).optional(),
    rpcport: z.string().regex(/^\d+$/, { message: "Invalid RPC port" }),
    deviceplatform: z.string().min(1, { message: "Device platform is required" }),
    laniface: z.string().min(1, { message: "LAN interface is required" }).optional(),
    waniface: z.string().min(1, { message: "WAN interface is required" }).optional(),
    wlaniface: z.string().min(1, { message: "WLAN interface is required" }).optional(),
    extaprops: z.string().min(1, { message: "External properties are required" }).optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (device) {
      form.reset(device); // Prefill form with the device data
    }
  }, [device, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const response = await addorupdateDevice(data, device);
    console.log("Response: ", response);
    if (!response.ok) {
      setLoading(false);
      toast({
        title: "Failed to add device",
        description: "Device already exists",
      });
    }
    else{
      setLoading(false);
      form.reset();
      toast({
        title: device ? "Device Updated" : "Device Added",
      });
    }
    
  };

  const renderFormField = (name: any, Component: React.ElementType) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            {Component === Input ? (
              <Component
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange} // Handle input changes
              />
            ) : (
              <Component
                {...field}
                checked={field.value}
                onCheckedChange={field.onChange} // Handle checkbox change
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="flex items-center justify-center">
    <Card className="w-2/4 space-y-4 p-2 shadow-lg rounded-lg">
    <Form {...form}>
      <Label>{device ? "Edit Device" : "Add Device"}</Label>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 gap-6"
      >
        <Table className="min-h-[100vh] rounded-xl md:min-h-min">
          <TableHeader className="rounded-t-xl">
            <TableRow>
              <TableCell className="font-semibold text-xl bg-slate-500">
                Contents
              </TableCell>
              <TableCell className="font-semibold text-xl bg-slate-500">
                Value
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DeviceParams && Object.entries(DeviceParams).map(([label, param]) => (
              <TableRow key={param}>
                <TableCell>{label}</TableCell>
                <TableCell>{renderFormField(param, Input)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <LoadingButton className="w-1/3" loading={loading} type="submit">
          {device ? "Update Device" : "Add Device"}
        </LoadingButton>
      </form>
    </Form>
    </Card>
    </div>
  );
};

export default AddDevice;
