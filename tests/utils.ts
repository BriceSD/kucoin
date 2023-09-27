import { Pair } from "../src/domain/Pair";
import { Token } from "../src/domain/Token";
export function generatePair(a: string, b: string): Pair{
    let t1 = Token.parse(a);
    let t2 = Token.parse(b);

    return Pair.from(t1, t2);
}
