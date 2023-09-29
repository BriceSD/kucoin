import { Router, Request, Response } from 'express';
import { Pair, PairCreationError } from '../domain/Pair';
import { Token, TokenParseError } from '../domain/Token';
import { DeltaService, DeltaServiceError } from '../application/service/DeltaService';
import { TransactionRepositoryAdapter } from '../infrastructure/repository/TransactionRepositoryAdapter';
import { DeltaPort } from '../application/port/driving/DeltaPort';

const router = Router();
const deltaService: DeltaPort = new DeltaService(new TransactionRepositoryAdapter());

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

        let delta = await deltaService.compute(pair);

        console.log("Computed Delta : " + delta);
        res.json(delta.amount);
    } catch (e) {
        if (e instanceof TokenParseError) {
            console.log(e.getErrorMessages());
            res.status(400).send(e.message);
        } else if (e instanceof PairCreationError) {
            console.log(e.getErrorMessages());
            res.status(400).send(e.message);
        } else if (e instanceof DeltaServiceError) {
            console.log(e.getErrorMessages());
            res.status(500).send(e.message);
        }
        else {
            res.status(500).send("Something went wrong");
        }
    }
});



export default router;
