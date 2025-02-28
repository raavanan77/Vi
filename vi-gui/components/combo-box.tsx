"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TestMethod } from "@/types/testcaseTypes";

interface frameworks {
  value: string;
  label: string;
}

const ComboMenu: React.FC<frameworks> = ({ params }: any) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<frameworks[]>([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? params.label : "Select framework..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {params.map((params: any) => (
                <CommandItem
                  key={params.value}
                  value={params.value}
                  onSelect={(currentValue) => {
                    //setValue(currentValue)
                    setOpen(false);
                  }}
                >
                  {params.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === params.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { ComboMenu };
