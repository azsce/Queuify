
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SystemParameters({ setServers, setCapacity, servers, capacity }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="servers">Number of Servers (c)</Label>
        <Input
          id="servers"
          value={servers}
          onChange={(e) => setServers(e.target.value)}
          placeholder="∞"
        />
      </div>
      <div>
        <Label htmlFor="capacity">System Capacity (K)</Label>
        <Input
          id="capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="∞"
        />
      </div>
    </div>
  )
}