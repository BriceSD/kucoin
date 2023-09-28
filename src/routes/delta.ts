import { Router, Request, Response } from 'express';
import { Pair, PairCreationError } from '../domain/Pair';
import { Token, TokenParseError } from '../domain/Token';
const router = Router();
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('');
});
router.get('/:pair', async (req: Request, res: Response) => {
            res.status(500).send("Something went wrong");
});
