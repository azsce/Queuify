import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InputParameters({ setArrivalRate, setServiceRate, arrivalRate, serviceRate, setArrivalTime, setServiceTime, arrivalTime, serviceTime }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
      <div>
        <Label htmlFor="arrival-rate">Arrival Rate (λ)</Label>
        <Input
          id="arrival-rate"
          value={arrivalRate}
          onChange={(e) => {
            setArrivalRate(e.target.value)
            if (e.target.value) {
              setArrivalTime(1 / parseFloat(e.target.value))
            }
          }}
          placeholder="Enter arrival rate"
        />
      </div>
      <div>
        <Label htmlFor="service-rate">Service Rate (μ)</Label>
        <Input
          id="service-rate"
          value={serviceRate}
          onChange={(e) => {
            setServiceRate(e.target.value)
            if (e.target.value) {
              setServiceTime(1 / parseFloat(e.target.value))
            }
          }}
          placeholder="Enter service rate"
        />
      </div>
      <div>
        <Label htmlFor="arrival-time">Arrival Time (1/λ)</Label>
        <Input
          id="arrival-time"
          value={arrivalTime}
          onChange={(e) => {
            setArrivalTime(e.target.value)
            if (e.target.value) {
              setArrivalRate(1 / parseFloat(e.target.value))
            }
          }}
          placeholder="Enter arrival time"
        />
      </div>
      <div>
        <Label htmlFor="service-time">Service Time (1/μ)</Label>
        <Input
          id="service-time"
          value={serviceTime}
          onChange={(e) => {
            setServiceTime(e.target.value)
            if (e.target.value) {
              setServiceRate(1 / parseFloat(e.target.value))
            }
          }}
          placeholder="Enter service time"
        />
      </div>
    </div>
  )
}