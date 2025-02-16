
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaymentMethodType } from "@/types/payment";
import { CreditCard, Building, Smartphone } from 'lucide-react';

interface PaymentMethodSelectorProps {
  method: PaymentMethodType;
  onMethodChange: (value: PaymentMethodType) => void;
}

const PaymentMethodSelector = ({ method, onMethodChange }: PaymentMethodSelectorProps) => {
  return (
    <RadioGroup
      defaultValue={method}
      onValueChange={(value) => onMethodChange(value as PaymentMethodType)}
      className="grid grid-cols-2 gap-4"
    >
      <div>
        <RadioGroupItem
          value="credit_card"
          id="credit_card"
          className="peer sr-only"
        />
        <Label
          htmlFor="credit_card"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <CreditCard className="mb-2 h-6 w-6" />
          Credit Card
        </Label>
      </div>
      <div>
        <RadioGroupItem
          value="debit_card"
          id="debit_card"
          className="peer sr-only"
        />
        <Label
          htmlFor="debit_card"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <CreditCard className="mb-2 h-6 w-6" />
          Debit Card
        </Label>
      </div>
      <div>
        <RadioGroupItem
          value="upi"
          id="upi"
          className="peer sr-only"
        />
        <Label
          htmlFor="upi"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <Smartphone className="mb-2 h-6 w-6" />
          UPI
        </Label>
      </div>
      <div>
        <RadioGroupItem
          value="bank_transfer"
          id="bank_transfer"
          className="peer sr-only"
        />
        <Label
          htmlFor="bank_transfer"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <Building className="mb-2 h-6 w-6" />
          Bank Transfer
        </Label>
      </div>
    </RadioGroup>
  );
};

export default PaymentMethodSelector;
