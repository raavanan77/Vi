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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loadingbutton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface DUTProps {
    dutname: string;
    clientlist: string[];
}

const AddDUTProfiles: React.FC<DUTProps> = ({ dut }: any) => {
  const [dutName, setDutName] = useState<DUTProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
    const FormSchema = z.object({
      dutname: z.string().min(1, { message: "Device name is required" }),
      clientlist: z.boolean().default(false).optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
  });

  
  return(
    <div className="justify-center">
      <Card>
        <Label>{dut ? "Edit DUT Profile" : "Add DUT Profile"}</Label>
        <Form {...form}>
          <form className="space-y-6 gap-6">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select DUT" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Apple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          </form>
        </Form>
      </Card>
    </div>
    )
}

export default AddDUTProfiles;