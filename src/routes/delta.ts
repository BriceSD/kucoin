import { Router, Request, Response } from 'express';
import { Pair, PairCreationError } from '../domain/Pair';
import { Token, TokenParseError } from '../domain/Token';
const router = Router();
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('');
});
router.get('/:pair', async (req: Request, res: Response) => {
    const rawTokens = req.params.pair.split('-');
    if (rawTokens.length != 2) {
        res.status(400).send('Exactly 2 symbols are required');
    }
    try {
        let base = Token.parse(rawTokens[0]);
        let quote = Token.parse(rawTokens[1]);
        let pair = Pair.from(base, quote);
    } catch (error) {
        if (error instanceof TokenParseError) {
            console.log(error.getErrorMessages());
            res.status(400).send(error.message);
        } else if (error instanceof PairCreationError) {
            console.log(error.getErrorMessages());
            res.status(400).send(error.message);
        }
        else {
            res.status(500).send("Something went wrong");
        }
});
