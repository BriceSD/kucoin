import { Delta } from "../Delta";
import { Pair } from "../Pair";

export interface DrivingPort {
    compute(pair: Pair): Promise<Delta>;
}
