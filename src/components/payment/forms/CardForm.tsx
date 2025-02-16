
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CardFormProps {
  formData: {
    cardNumber: string;
    cardExpiry: string;
    cardCvv: string;
    cardName: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CardForm = ({ formData, onChange }: CardFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={formData.cardNumber}
          onChange={onChange}
          maxLength={16}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cardExpiry">Expiry Date</Label>
          <Input
            id="cardExpiry"
            name="cardExpiry"
            placeholder="MM/YY"
            value={formData.cardExpiry}
            onChange={onChange}
            maxLength={5}
            required
          />
        </div>
        <div>
          <Label htmlFor="cardCvv">CVV</Label>
          <Input
            id="cardCvv"
            name="cardCvv"
            type="password"
            placeholder="123"
            value={formData.cardCvv}
            onChange={onChange}
            maxLength={3}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="cardName">Cardholder Name</Label>
        <Input
          id="cardName"
          name="cardName"
          placeholder="John Doe"
          value={formData.cardName}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};

export default CardForm;
