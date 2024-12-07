import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function ServiceProcess({ setServiceProcess }) {
  return (
    <div>
      <Label>Service Process</Label>
      <RadioGroup
        defaultValue="D"
        onValueChange={(value) => setServiceProcess(value)}
        className="flex space-x-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="M" id="service-m" />
          <Label htmlFor="service-m">Markov (M)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="D" id="service-d" />
          <Label htmlFor="service-d">Deterministic (D)</Label>
        </div>
      </RadioGroup>
    </div>
  )
}