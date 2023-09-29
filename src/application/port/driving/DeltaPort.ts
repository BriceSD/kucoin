import { Delta } from "../../../domain/Delta";
import { Pair } from "../../../domain/Pair";

export interface DeltaPort {
    compute(pair: Pair): Promise<Delta>;
}
