
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import * as React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import MultipleSelector, { Option } from '@/components/ui/multiselect';
import { useEffect, useState } from 'react';
import { LoadingButton } from './ui/loadingbutton';
import { Label } from './ui/label';

interface MultipleSelectorControlledProps {
  params: any;
}

const MultipleSelectorWithForm : React.FC<MultipleSelectorControlledProps> = ({ params }) => {
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
    const response = await fetch(
      `http://${DJANGO_SERVER_URL}:${DJANGO_SERVER_PORT}/api/testcase/fetch/${params.id}?format=json`,
    );
    const dresponse = await fetch(
      `http://${DJANGO_SERVER_URL}:${DJANGO_SERVER_PORT}/api/device/get/${params.id}?format=json`,
    );
    if (!response.ok) {
      throw new Error("No response");
    }
    const result = await response.json();
    const dres = await dresponse.json();

    if (Array.isArray(result)) {
      const mappedTestcases: Option[] = result.map((testcase) => ({
          label: testcase.testcaseName,
          value: testcase.testcaseName,
        }));
          setValue(mappedTestcases);              
      } else {
        console.error("Unexpected response format", result);
        setValue([]);
      }
      if (Array.isArray(dres)) {
        const mappedTestcases = dres.map((device) => ({
            label: device.DeviceName,
            value: device.DeviceName,
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

  const optionSchema = z.object({
    label: z.string(),
    value: z.string(),
  });
  
  const FormSchema = z.object({
    value: z.array(optionSchema).min(1),
    selectDevice: z.string().min(1, { message: "Select a device" }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async(data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    const exedata = {Testcase: data.value.length > 0 ? data.value[0].value : '',
      Device: data.selectDevice
    }
    const response = await fetch(
      `http://${DJANGO_SERVER_URL}:${DJANGO_SERVER_PORT}/api/testcase/execute/`,{
        method:'POST',
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exedata),
      });
    if (!response.ok) {
      throw new Error("No response");
    }
    else{
      console.log(response)
    }
    console.log("Data:",data.value[0]['value'])
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Test Case Execution in Progress',
        //description: (
        //  <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //  </pre>
        //),
      });
    }, 100);
  }

  useEffect(() => {
    fetchData();
  }, []);

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
                  onValueChange={(value) => {setDevice(value);
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger id="select-field">
                    <SelectValue placeholder="Select Device" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.length === 0 ? (
                      <SelectItem value="no-results">No devices found</SelectItem>
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
                    <p className="w-2/3 space-y-6">
                      no results found.
                    </p>
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
export default MultipleSelectorWithForm;
