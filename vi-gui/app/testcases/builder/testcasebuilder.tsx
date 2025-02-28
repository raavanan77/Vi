"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle, MinusCircle, Save, CircleOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { editTestcase, getTestcase } from "@/app/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Enums and Types remain the same
enum TestPlatform {
  RDKB = "RDKB",
  OpenWrt = "Openwrt",
}

enum TestArea {
  Sanity = "Sanity",
  Functional = "Functional",
  Performance = "Performance",
  UnitTest = "Unit Test",
}

enum TestTarget {
  DUT = "DUT",
  Client = "Client",
}

enum TestMethod {
  ExecuteSerialCommand = "execute_serial_command",
  ExecuteSSHCommand = "execute_ssh_command",
  ExecuteClientCommand = "execute_client_cmd",
}

interface TestStep {
  target: TestTarget;
  method: TestMethod;
  param: string;
  expectedResult: string;
  breakOnFailure: boolean;
  postWaitInSecs?: number;
  retryOnFail?: number;
}

type TestPlatOS = {
  RDKB: "RDKB";
  OpenWrt: "OpenWrt";
};

interface TestCase {
  testcasename: string;
  testplatform: TestPlatform;
  testarea: TestArea;
  description: string;
  testcasedetails: {
    [key: `step${number}`]: TestStep;
  };
}

interface TestStepProps {
  param?: any; // Optional name for editing mode
}

const TestCaseBuilder: React.FC<TestStepProps> = ({ param }) => {
  const { toast } = useToast();
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(!!param);
  const [testCase, setTestCase] = useState<TestCase>({
    testcasename: "",
    testplatform: TestPlatform.RDKB,
    testarea: TestArea.Sanity,
    description: "",
    testcasedetails: {},
  });
  const [isclient, setisclient] = useState(false);
  const [stepCount, setStepCount] = useState<number>(1);

  useEffect(() => {
    if (param === "new") {
      setIsEditMode(false);
      setLoading(false);
    } else if (param) {
      fetchTestCase();
    }
  }, [param]);

  const fetchTestCase = async () => {
    try {
      const response = await getTestcase(param);

      if (!response.ok) {
        throw new Error("Failed to fetch test case");
      }
      const result = await response.json();

      if (result) {
        console.log("Test case", result);
        const mappedTestcases: TestCase = {
          testcasename: result.testcasename,
          testplatform: result.testplatform as TestPlatform,
          testarea: result.testarea as TestArea,
          description: result.description,
          testcasedetails: result.testcasedetails,
        };
        setTestCase(mappedTestcases);
        const stepsCount = Object.keys(mappedTestcases.testcasedetails).length;
        setStepCount(stepsCount || 1);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch test case`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setTestCase((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStepChange = (
    stepNumber: number,
    field: keyof TestStep,
    value: any,
    client: boolean,
  ) => {
    setisclient(client);
    setTestCase((prev) => ({
      ...prev,
      testcasedetails: {
        ...prev.testcasedetails,
        [`step${stepNumber}`]: {
          ...prev.testcasedetails[`step${stepNumber}`],
          [field]: field === "breakOnFailure" ? value === "true" : value,
        },
      },
    }));
  };

  const addStep = () => {
    setStepCount((prev) => prev + 1);
  };

  const removeStep = (stepToRemove: number) => {
    setTestCase((prev) => {
      const newTestCaseDetails = { ...prev.testcasedetails };
      delete newTestCaseDetails[`step${stepToRemove}`];

      // Reorder remaining steps
      const reorderedDetails: typeof newTestCaseDetails = {};
      let newIndex = 1;

      Object.entries(newTestCaseDetails)
        .sort(([a], [b]) => parseInt(a.slice(4)) - parseInt(b.slice(4)))
        .forEach(([_, value]) => {
          reorderedDetails[`step${newIndex}`] = value;
          newIndex++;
        });

      return {
        ...prev,
        testcasedetails: reorderedDetails,
      };
    });

    setStepCount((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    console.log("Edit", isEditMode);
    try {
      const response = await editTestcase(testCase, param, isEditMode);

      if (!response.ok) {
        throw new Error("Failed to save test case");
      }
      toast({
        title: "Success",
        description: `Test case ${isEditMode ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save test case`,
        variant: "destructive",
      });
    }
    route.back();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="space-y-4 mb-8 shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Test Case" : "Create New Test Case"}
      </h1>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="block text-sm font-medium mb-1">
            Test Case Name
          </Label>
          <Input
            type="text"
            name="testcasename"
            className="w-full p-2 border rounded"
            value={testCase.testcasename}
            onChange={handleBasicInfoChange}
          />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-1">Platform</Label>
          <Select
            name="testplatform"
            defaultValue={testCase.testplatform}
            onValueChange={(value) =>
              setTestCase((prev) => ({ ...prev, testplatform: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select DUT Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(TestPlatform).map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-sm font-medium mb-1">Test Area</Label>
          <select
            name="testarea"
            className="w-full p-2 border rounded"
            value={testCase.testarea}
            onChange={handleBasicInfoChange}
          >
            {Object.values(TestArea).map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <Label className="block text-sm font-medium mb-1">Describtion</Label>
          <Input
            type="text"
            name="description"
            className="w-full p-2 border rounded"
            value={testCase.description}
            onChange={handleBasicInfoChange}
          />
        </div>
      </div>

      {/* Test Steps */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Test Steps</h2>
          <Button onClick={addStep}>
            <PlusCircle className="w-5 h-5 mr-1" />
            Add Step
          </Button>
        </div>

        {[...Array(stepCount)].map((_, index) => (
          <div key={index} className="border p-4 rounded-lg relative">
            <div className="absolute top-2 right-2">
              {stepCount > 1 && (
                <Button onClick={() => removeStep(index + 1)}>
                  <MinusCircle className="w-5 h-5" />
                </Button>
              )}
            </div>

            <h3 className="font-medium mb-4">Step {index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium mb-1">Target</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={
                    testCase.testcasedetails[`step${index + 1}`]?.target || ""
                  }
                  onChange={(e) =>
                    handleStepChange(
                      index + 1,
                      "target",
                      e.target.value as TestTarget,
                      e.target.value !== "DUT" ? true : false,
                    )
                  }
                >
                  <option value="">Select Target</option>
                  {Object.values(TestTarget).map((target) => (
                    <option key={target} value={target}>
                      {target}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="block text-sm font-medium mb-1">Method</Label>

                <select
                  className="w-full p-2 border rounded"
                  value={
                    testCase.testcasedetails[`step${index + 1}`]?.method || ""
                  }
                  onChange={(e) =>
                    handleStepChange(
                      index + 1,
                      "method",
                      e.target.value as TestMethod,
                      false,
                    )
                  }
                >
                  <option value="">Select Method</option>
                  {Object.values(TestMethod).map((method) => (
                    <option key={method} value={method}>
                      {method
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <Label className="block text-sm font-medium mb-1">
                  Parameter
                </Label>
                <Input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={
                    testCase.testcasedetails[`step${index + 1}`]?.param || ""
                  }
                  onChange={(e) =>
                    handleStepChange(index + 1, "param", e.target.value, false)
                  }
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-1">
                  Expected Result
                </Label>
                <Input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={
                    testCase.testcasedetails[`step${index + 1}`]
                      ?.expectedResult || ""
                  }
                  onChange={(e) =>
                    handleStepChange(
                      index + 1,
                      "expectedResult",
                      e.target.value,
                      false,
                    )
                  }
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-1">
                  Post Wait (seconds)
                </Label>
                <Input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={
                    testCase.testcasedetails[`step${index + 1}`]
                      ?.postWaitInSecs || ""
                  }
                  onChange={(e) =>
                    handleStepChange(
                      index + 1,
                      "postWaitInSecs",
                      parseInt(e.target.value),
                      false,
                    )
                  }
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-1">
                  Retry on Fail
                </Label>
                <Input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={
                    testCase.testcasedetails[`step${index + 1}`]?.retryOnFail ||
                    ""
                  }
                  onChange={(e) =>
                    handleStepChange(
                      index + 1,
                      "retryOnFail",
                      parseInt(e.target.value),
                      false,
                    )
                  }
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-1">
                  Break on Failure
                </Label>
                <select
                  className="w-full p-2 border rounded"
                  value={
                    testCase.testcasedetails[
                      `step${index + 1}`
                    ]?.breakOnFailure?.toString() || "false"
                  }
                  onChange={(e) =>
                    handleStepChange(
                      index + 1,
                      "breakOnFailure",
                      e.target.value,
                      false,
                    )
                  }
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-x-2">
        <Button onClick={handleSubmit}>
          <Save className="w-5 h-5 mr-2" />
          {isEditMode ? "Update Test Case" : "Save Test Case"}
        </Button>
        <Button onClick={() => route.back()}>
          <CircleOff className="mr-2" />
          Cancel
        </Button>
      </div>
    </Card>
  );
};

export default TestCaseBuilder;
