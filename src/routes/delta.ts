import { Router, Request, Response } from 'express';
import { Pair, PairCreationError } from '../domain/Pair';
import { Token, TokenParseError } from '../domain/Token';
import { DeltaService, DeltaServiceError } from '../application/service/DeltaService';
import { RepositoryCreationError, TransactionRepositoryFactory } from '../infrastructure/repository/TransactionRepositoryFactory';
import { DeltaPort } from '../domain/port/driving/DeltaPort';

const router = Router();
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('');
});

/**
 * @api {get} /delta/:exchange/:pair Request delta amount for given pair
 * @apiName GetDelta
 * @apiGroup Delta
 *
 * @apiParam {string} Exchange name to fetch transaction from
 * @apiParam {string} Token pair symbols separated by a dash, as in : BASE-QUOTE
 * @apiParamExample {json} request_desc
 * {
     "data": {
         "exchange": "kucoin"
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
         1
   }
 }
 *
 */
router.get('/:exchange/:pair', async (req: Request, res: Response) => {
    const rawTokens = req.params.pair.split('-');
    const rawExchange = req.params.exchange;
    if (rawTokens.length !== 2) {
        res.status(400).send('Exactly 2 symbols are required');
    }
    try {
        let base = Token.try_parse(rawTokens[0]);
        let quote = Token.try_parse(rawTokens[1]);
        let pair = Pair.try_from(base, quote);

        const exchange = TransactionRepositoryFactory.try_from(rawExchange);
        const deltaService: DeltaPort = new DeltaService(exchange);

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
        } else if (e instanceof RepositoryCreationError) {
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
