import { Router, Request, Response } from 'express';
import { Pair, PairCreationError } from '../domain/Pair';
import { Token, TokenParseError } from '../domain/Token';
import { DeltaService, DeltaServiceError } from '../application/service/DeltaService';
import { TransactionRepositoryAdapter } from '../infrastructure/repository/TransactionRepositoryAdapter';
import { DrivingPort } from '../domain/port/DrivingPort';

const router = Router();
const deltaService: DrivingPort = new DeltaService(new TransactionRepositoryAdapter());

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

        res.json(delta.amount);
    } catch (error) {
        if (error instanceof TokenParseError) {
            console.log(error.getErrorMessages());
            res.status(400).send(error.message);
        } else if (error instanceof PairCreationError) {
            console.log(error.getErrorMessages());
            res.status(400).send(error.message);
        } else if (error instanceof DeltaServiceError) {
            console.log(error.getErrorMessages());
            res.status(500).send(error.message);
        }
        else {
            res.status(500).send("Something went wrong");
        }
    }
});



export default router;
