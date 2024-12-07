
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function ArrivalProcess({ setArrivalProcess }) {
  return (
    <div>
      <Label>Arrival Process</Label>
      <RadioGroup
        defaultValue="M"
        onValueChange={(value) => setArrivalProcess(value)}
        className="flex space-x-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="M" id="arrival-m" />
          <Label htmlFor="arrival-m">Markov (M)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="D" id="arrival-d" />
          <Label htmlFor="arrival-d">Deterministic (D)</Label>
        </div>
      </RadioGroup>
    </div>
  )
}