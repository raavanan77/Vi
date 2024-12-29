import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectDropProps {
  params : any
}

const SelectDrop : React.FC<SelectDropProps> = ( {params}) => {
  return (
    <div className=" w-1/4 space-y-6">
      <Select>
        <SelectTrigger id="select-23">
          <SelectValue placeholder="Select Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="s1">{params.id}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectDrop;