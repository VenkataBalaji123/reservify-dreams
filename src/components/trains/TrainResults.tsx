
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const SAMPLE_TRAINS = [
  { id: 1, name: 'Rajdhani Express', from: 'Delhi', to: 'Mumbai', departure: '06:00', arrival: '22:00', price: 2500 },
  { id: 2, name: 'Shatabdi Express', from: 'Chennai', to: 'Bangalore', departure: '08:00', arrival: '14:00', price: 1800 },
  { id: 3, name: 'Duronto Express', from: 'Kolkata', to: 'Delhi', departure: '15:30', arrival: '04:30', price: 2200 },
];

const TrainResults = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {SAMPLE_TRAINS.map((train) => (
        <Card key={train.id} className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold">{train.name}</h3>
              <p className="text-sm text-gray-600">
                {train.from} → {train.to}
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium">{train.departure} - {train.arrival}</p>
              <p className="text-sm text-gray-600">Duration: 8h</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-lg font-bold">₹{train.price}</p>
              <Button onClick={() => navigate(`/trains/${train.id}/seats`)}>
                Select Seats
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TrainResults;
