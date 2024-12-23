
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
import { toast } from '@/hooks/use-toast';
import MultipleSelector, { Option } from '@/components/ui/multiselect';
import { useEffect, useState } from 'react';
import { LoadingButton } from './ui/loadingbutton';


const MultipleSelectorWithForm = () => {

  const [value, setValue] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const OPTIONS: Option[] = [];
  
  const fetchData = async () => {
  setLoading(true);
  console.log('env',process.env.DJANGO_SERVER_URL);
  try {
    const response = await fetch(
      `http://172.16.0.192:8000/api/testcase/fetch/Linux?format=json`,
    );
    if (!response.ok) {
      throw new Error("No response");
    }
    const result = await response.json();
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
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async(data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    const response = await fetch(
      "http://172.16.0.192:8000/api/testcase/execute/",{
        method:'POST',
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    if (!response.ok) {
      throw new Error("No response");
    }
    else{
      console.log(response)
    }
    console.log("Data:",data)
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
                  placeholder="Select Test Script"
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
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
