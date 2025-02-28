import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItemProps } from "@/types/testcaseTypes";

const selectItem: React.FC<SelectItemProps> = ({ label }: SelectItemProps) => {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select DUT" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.values(label).map((platform) => (
            <SelectItem key={platform} value={platform}>
              {platform}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default selectItem;
