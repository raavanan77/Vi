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
import { Save, CircleOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loadingbutton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { addorupdateDevice,getSingleDevice } from "@/app/api";
import { Button } from "@/components/ui/button";

interface Params {
  devtype: string;
  device: string;
}

interface DUTProps {
    dutname: string;
    username: string;
    password: string;
    serial: string;
    baudrate: BigInteger;
    wanip: string;
    waniface: string;
    sshport: BigInteger;
    dutplatform: string;
    extaprops: JSON;
}
  
const DUTParams = {"DUT Name":"dutname",
  "DUT Platform [OS]":"dutplatform",
  "Username" : "username",
  "Password" : "password",
  "Serial Port" : "serial",
  "Baudrate" : "baudrate",
  "Wan IP Address" : "wanip",
  "WAN Interface Name":"waniface",
  "SSH Port":"sshport",
  "Extra Properties":"extaprops"}

interface DeviceProps {
  devicename: string;
  username: string;
  password: string;
  wanip: string;
  sshport: number;
  rpcport: number;
  deviceplatform: string;
  laniface: string;
  waniface: string;
  wlaniface: string;
  extaprops: JSON;
}

const DeviceParams = {"Device Name":"devicename",
  "Username" : "username",
  "Password" : "password",
  "Wan IP Address" : "wanip",
  "SSH Port":"sshport",
  "RPC Port":"rpcport",
  "Device Platform [OS]":"deviceplatform",
  "LAN Interface Name":"laniface",
  "WAN Interface Name":"waniface",
  "WLAN Interface Name":"wlaniface",
  "Extra Properties":"extaprops"
}

const AddDevice: React.FC<Params> = ({devtype,device}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRouter();
  const deviceparam = devtype === "client" ? DeviceParams : DUTParams;
  const FormSchema = z.object({
    devicename: z.string().min(1, { message: "Device name is required" }),
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    wanip: z.string().min(1, { message: "WAN IP is required" }),
    sshport: z.string().min(2, { message: "Invalid SSH port" }).optional(),
    rpcport: z.string().min(2, { message: "Invalid RPC port" }),
    deviceplatform: z.string().min(1, { message: "Device platform is required" }),
    laniface: z.string().min(1, { message: "LAN interface is required" }).optional(),
    waniface: z.string().min(1, { message: "WAN interface is required" }).optional(),
    wlaniface: z.string().nullable().optional(),
    extaprops: z.string().nullable().optional(),
  });

  const FormSchemaDUT = z.object({
    dutname: z.string().min(1, { message: "DUT name is required" }),
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    serial: z.string().optional(),
    baudrate: z.string().regex(/^\d+$/, { message: "Invalid baudrate" }).optional(),
    wanip: z.string().min(1, { message: "WAN IP is required" }),
    sshport: z.string().regex(/^\d+$/, { message: "Invalid SSH port" }).optional(),
    dutplatform: z.string().min(1, { message: "DUT platform is required" }),
    waniface: z.string().optional(),
    extaprops: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema | typeof FormSchemaDUT>>({
    resolver: zodResolver(devtype === "client" ? FormSchema : FormSchemaDUT),
  });

  const getdev = async () => {
    try {
      const response = await getSingleDevice(devtype,device);

      if (!response.ok) {
        throw new Error('Failed to fetch test case');
      }
      const result = await response.json();
      
      if (result) {
        if (devtype === "client"){
          const clientProps: DeviceProps = {
            devicename: result.devicename,
            username: result.username,
            password: result.password,
            wanip: result.wanip,
            sshport: result.sshport,
            rpcport: result.rpcport,
            deviceplatform: result.deviceplatform,
            laniface: result.laniface,
            waniface: result.waniface,
            wlaniface: result.wlaniface,
            extaprops: result.extaprops
          };
            return clientProps
          }else{
            const DUTprops: DUTProps = {
              dutname: result.dutname,
              username: result.username,
              password: result.password,
              wanip: result.wanip,
              serial: result.serial,
              baudrate: result.baudrate,
              sshport: result.sshport,
              dutplatform: result.dutplatform,
              waniface: result.waniface,
              extaprops: result.extaprops
            };
              return DUTprops
          }
        }
        
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to get device details`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (device === "new") {
      form.reset();
    } else {
        getdev().then(deviceData => {
          if (deviceData) {
            form.reset(deviceData);
          }
        });
    }
  }, [device, form]);


  const onSubmit = async (data: z.infer<typeof FormSchemaDUT | typeof FormSchema>) => {
    console.log("Submit")
    setLoading(true);
    
    const response = await addorupdateDevice(devtype, data, device);
    console.log("Response: ", response);
    if (!response.ok) {
      setLoading(false);
      toast({
        title: "Failed to add device",
        description: `${response.statusText}`,
      });
    }
    else{
      setLoading(false);
      form.reset();
      route.back()
      toast({
        title: device === "new" ? "Device Added" : "Device Updated",
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
      <Label>{device === "new" ? `Add ${devtype} device` : `Edit ${devtype} device`}</Label>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 gap-6"
      >
        <div>
        <Table className="min-h-[100vh] rounded-xl md:min-h-min">
          <TableHeader className="rounded-t-xl">
            <TableRow>
              <TableCell className="font-semibold text-xl bg-slate-500">
                Properties
              </TableCell>
              <TableCell className="font-semibold text-xl bg-slate-500">
                Value
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deviceparam && Object.entries(deviceparam).map(([label, param]) => (
              <TableRow key={param}>
                <TableCell>{label}</TableCell>
                <TableCell>{renderFormField(param, Input)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
        <div className="mt-8 space-x-2">
            <Button type="submit">
                <Save className="w-5 h-5 mr-2" />
              {device === "new" ? "Add Device" : "Update Device"}
            </Button>
            <Button type="button" onClick={() => route.back()}>
              <CircleOff className="mr-2"/>Cancel
            </Button>
        </div>
      </form>
    </Form>
    </Card>
    </div>
  );
};

export default AddDevice;
