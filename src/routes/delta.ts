import { Router, Request, Response } from 'express';
import { Pair, PairCreationError } from '../domain/Pair';
import { Token, TokenParseError } from '../domain/Token';
import { DeltaService, DeltaServiceError } from '../application/service/DeltaService';
import { DeltaPort } from '../application/port/driving/DeltaPort';
import { KucoinTransactionRepository } from '../infrastructure/repository/KucoinTransactionRepository';
import HttpClient from '../infrastructure/HttpClient';

const router = Router();
// TODO: Dependency injection ?
const deltaService: DeltaPort = new DeltaService(new KucoinTransactionRepository(new HttpClient()));

router.get('/', (req: Request, res: Response) => {
    res.status(200).send('');
});

/**
 * @api {get} /delta/:pair Request delta amount for given pair
 * @apiName GetDelta
 * @apiGroup Delta
 *
 * @apiParam {string} Token pair symbols separated by a dash
 * @apiParamExample {json} request_desc
 * {
     "data": {
         "pair": "BTC-ETH"
   }
 }
 *
 * @apiSuccess {number} amount Delta amount
 *
 * @apiSuccessExample {json} response_desc
 * HTTP/1.1 200 OK
 *  {
    "code": 200,
     "data": {
         "amount": 1
   }
 }
 *
 */
router.get('/:pair', async (req: Request, res: Response) => {
    const rawTokens = req.params.pair.split('-');
    if (rawTokens.length != 2) {
        res.status(400).send('Exactly 2 symbols are required');
    }
    try {
        let base = Token.parse(rawTokens[0]);
        let quote = Token.parse(rawTokens[1]);

        let pair = Pair.try_from(base, quote);

        let delta = await deltaService.compute(pair);

        console.log("Computed Delta : " + delta);
        res.json(delta.amount);
    } catch (e) {
        if (e instanceof TokenParseError) {
            console.error(e.getErrorMessages());
            res.status(400).send(e.message);
        } else if (e instanceof PairCreationError) {
            console.error(e.getErrorMessages());
            res.status(400).send(e.message);
        } else if (e instanceof DeltaServiceError) {
            console.error(e.getErrorMessages());
            res.status(500).send(e.message);
        }
        else {
            res.status(500).send("Something went wrong");
        }
    }
});



export default router;
