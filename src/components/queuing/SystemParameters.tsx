import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function SystemParameters({
  setServers,
  setCapacity,
  servers,
  capacity,
  queueType,
}) {
  const [capacityMinusOne, setCapacityMinusOne] = useState(
    capacity === "∞" ? "∞" : parseInt(capacity) - 1
  );

  useEffect(() => {
    setCapacityMinusOne(capacity === "∞" ? "∞" : parseInt(capacity) - 1);
  }, [capacity]);

  useEffect(() => {
    if (capacityMinusOne !== "∞") {
      setCapacity((capacityMinusOne as number) + 1);
    }
  }, [capacityMinusOne, setCapacity]);

  const handleInfinityClick = (setter) => {
    setter("∞");
  };

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    setter(value === "" ? "∞" : parseInt(value));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
      <div>
        <Label htmlFor="servers">Number of Servers (c)</Label>
        <div className="flex">
          <Input
            id="servers"
            value={servers === "∞" ? "" : servers}
            onChange={handleInputChange(setServers)}
            placeholder="∞"
            type="number"
          />
          <button onClick={() => handleInfinityClick(setServers)}>∞</button>
        </div>
      </div>
      {queueType === "D/D" && (
        <div>
          <Label htmlFor="capacityMinusOne">System Capacity - 1 (K-1)</Label>
          <div className="flex">
            <Input
              id="capacityMinusOne"
              value={capacityMinusOne === "∞" ? "" : capacityMinusOne}
              onChange={handleInputChange(setCapacityMinusOne)}
              placeholder="∞"
              type="number"
            />
            <button onClick={() => handleInfinityClick(setCapacityMinusOne)}>∞</button>
          </div>
        </div>
      )}
      <div>
        <Label htmlFor="capacity">System Capacity (K)</Label>
        <div className="flex">
          <Input
            id="capacity"
            value={capacity === "∞" ? "" : capacity}
            onChange={handleInputChange(setCapacity)}
            placeholder="∞"
            type="number"
          />
          <button onClick={() => handleInfinityClick(setCapacity)}>∞</button>
        </div>
      </div>
    </div>
  );
}
