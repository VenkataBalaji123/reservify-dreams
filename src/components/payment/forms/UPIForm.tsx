
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UPIFormProps {
  upiId: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UPIForm = ({ upiId, onChange }: UPIFormProps) => {
  return (
    <div>
      <Label htmlFor="upiId">UPI ID</Label>
      <Input
        id="upiId"
        name="upiId"
        placeholder="username@upi"
        value={upiId}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default UPIForm;
