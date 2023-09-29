import { Delta } from "../../../domain/Delta";
import { Pair } from "../../../domain/Pair";

/**
 * Driving port exposing how to compute a Delta
 */
export interface DeltaPort {
    compute(pair: Pair): Promise<Delta>;
}
