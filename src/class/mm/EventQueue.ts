import Customer from "./Customer";

type Event = {
  time: number;
  type: "arrival" | "departure";
  customer?: Customer;
  server?: Server;
};

class EventQueue {
  events: Event[] = [];

  addEvent(event: Event) {
    this.events.push(event);
    this.events.sort((a, b) => a.time - b.time);
  }

  getNextEvent(): Event | undefined {
    return this.events.shift();
  }
}

export default EventQueue;
export type { Event };
