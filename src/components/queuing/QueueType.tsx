import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function QueueType({ setQueueType }) {
  return (
    <div className="text-sm sm:text-base">
      <Label>Queue Type</Label>
      <RadioGroup
        defaultValue="D/D"
        onValueChange={(value) => setQueueType(value)}
        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="M/M" id="queue-mm" />
          <Label htmlFor="queue-mm">Markov/Markov (M/M)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="D/D" id="queue-dd" />
          <Label htmlFor="queue-dd">Deterministic/Deterministic (D/D)</Label>
        </div>
      </RadioGroup>
    </div>
  );
}