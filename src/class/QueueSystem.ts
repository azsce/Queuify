import { Customer, TimeLineData } from "@/types/Simulation";
import { Fraction } from "@/types/math";

export abstract class QueueSystem {
  arrivalRate: number;
  serviceRate: number;
  servers: number;
  capacity: number;
  initialCustomers?: number;
  arrivalRateFraction: Fraction;
  serviceRateFraction: Fraction;

  arrivalTime: number;
  serviceTime: number;

  firstBalkTime?: number;
  transientTime?: number;

  timeSpecialValue?: number;

  lambdaTi: number;
  lambdaTiFloored: number;
  muTi: number;
  muTiFloored: number;

  timeLineData: TimeLineData[];
  customers?: Customer[];
}
