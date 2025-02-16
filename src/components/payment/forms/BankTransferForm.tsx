
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BankTransferFormProps {
  formData: {
    accountNumber: string;
    ifscCode: string;
    accountName: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BankTransferForm = ({ formData, onChange }: BankTransferFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          name="accountNumber"
          placeholder="Enter account number"
          value={formData.accountNumber}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="ifscCode">IFSC Code</Label>
        <Input
          id="ifscCode"
          name="ifscCode"
          placeholder="ABCD0123456"
          value={formData.ifscCode}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="accountName">Account Holder Name</Label>
        <Input
          id="accountName"
          name="accountName"
          placeholder="John Doe"
          value={formData.accountName}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};

export default BankTransferForm;
