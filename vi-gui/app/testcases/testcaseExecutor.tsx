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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { useEffect, useState } from "react";
import { LoadingButton } from "../../components/ui/loadingbutton";
import { Label } from "../../components/ui/label";
import { fetchTestcase } from "../api";
import { MultipleSelectorControlledProps } from "@/types/testcaseTypes";
//import { getTestcase } from "../graphql";

const TestcaseExecutor: React.FC<MultipleSelectorControlledProps> = ({
  params,
}) => {
  //const graphdata = getTestcase();
  const [options, setOptions] = useState<{ label: any; value: any }[]>([]);
  const [Device, setDevice] = useState<string>();
  const [value, setValue] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const OPTIONS: Option[] = [];
  let DJANGO_SERVER_URL = process.env.DJANGO_SERVER_URL;
  let DJANGO_SERVER_PORT = process.env.DJANGO_SERVER_PORT;

  const fetchData = async () => {
    setLoading(true);
    try {
      const dresponse = await fetch(
        "http://localhost:8000/api/dut/profile/get/",
      ); 
      const result = await fetchTestcase("Openwrt");
      const dres = await dresponse.json();
      console.log(dres)
      if (Array.isArray(result)) {
        const mappedTestcases: Option[] = result.map((testcase) => ({
          label: testcase.testcasename,
          value: testcase.testcasename,
        }));
        setValue(mappedTestcases);
      } else {
        console.error("Unexpected response format", result);
        setValue([]);
      }
      if (Array.isArray(dres)) {
        const mappedTestcases = dres.map((item) => ({
          label: item.profilename,
          value: item.profilename,
        }));
        setOptions(mappedTestcases);
      } else {
        console.error("Unexpected response format", result);
        setOptions([]);
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
  const optionSchema = z.object({
    label: z.string(),
    value: z.string(),
  });

  const FormSchema = z.object({
    value: z.array(optionSchema).min(1),
    selectDevice: z.string().min(1, { message: "Select a profile" }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    const exedata = {
      Testcase: data.value.length > 0 ? data.value[0].value : "",
      profile: data.selectDevice,
    };
    const response = await fetch(
      `http://${DJANGO_SERVER_URL}:${DJANGO_SERVER_PORT}/api/testcase/execute/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exedata),
      },
    );
    if (!response.ok) {
      throw new Error("No response");
    } else {
      console.log(response);
    }
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Test Case Execution in Progress",
        //description: (
        //  <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //  </pre>
        //),
      });
    }, 100);
  };

  return (
    <Form {...form}>
      <Label>Test Case Executor</Label>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="selectDevice"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  {...field}
                  value={Device}
                  onValueChange={(value) => {
                    setDevice(value);
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger className="w-1/3">
                    <SelectValue placeholder="Select Device" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.length === 0 ? (
                      <SelectItem value="no-results">
                        No devices found
                      </SelectItem>
                    ) : (
                      options.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MultipleSelector
                  {...field}
                  options={value}
                  defaultOptions={OPTIONS}
                  className="w-2/3 space-y-6"
                  placeholder="Select Test Script"
                  hidePlaceholderWhenSelected
                  emptyIndicator={
                    <p className="w-2/3 space-y-6">no results found.</p>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={loading} type="submit">
          Execute
        </LoadingButton>
      </form>
    </Form>
  );
};
export default TestcaseExecutor;
