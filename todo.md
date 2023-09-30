Goal of the app : 
Given a token pair (BTC-ETH != ETH-BTC ??), fetch the public trade history and compute the delta index.

1. Make a simple backend server
1. Make an API endpoint that accept a token pair.
    1. Parse input (token pair = domain data).
    1. Fetch Kucoin API for public trade history of given pair.
        1. Parse response (trade = domain data ?).
    1. Compute cumulative delta state (domain)
    1. Store delta (|& public history ?) in cache ? If so, if new request for same pair, can we resume operation from last one computed in cache (ie from a transaction number)?
    1. Return delta to caller (callback or sync ? how long does it take to process everything ?)


# Technical
## My endpoint
* Wrong data load in user request -> 400
* Issue with Kucoin API -> 500 + explicit logs for debugging/apm

## Kucoin endpoint
* Use market endpoint (no account needed) : https://docs.kucoin.com/#get-trade-histories
* Can't request for more that the last minute or so
* Direct HTTP call or Kucoin SDK ?
    - direct = simpler, smaller app (less dependencies), we only need 1 endpoint but SDK = all endpoint
    - SDK = less risky if API changes (at least if SDK is updated), only JS (no TS)

## Todo
[~] Add unit/integration tests
[~] Add tracing/log
[X] Add CI
[X] Add endpoint documentation
[X] Add domain "library" documentation
[X] Unit test TransactionRepositoryAdapter, refactor it first and test weird deserialized inputs
[X] check on unit tests name/comment (too much copy pasta, risk of mistakes)
[X] Add install + run + tests + doc generation in the readme
[ ] Set timeouts on external requests (really needed if only http?)
[ ] Dependency injection of services/repositories

## Questions
Who can use my API ? Everyone, no account, should we add a req limit ?
Should we store the public history of a given pair ? We trade network usage for disk usage.
Should we store delta for a given pair ? We trade computing time for disk usage. API should become much faster.

# Domain
## Important "objects"
* Token
* Token pair
* Token pair transaction
* Token pair transaction book
* Token pair Delta

# Possible improvements 
Process pairs in batch when app usage is low, store informations (with last transaction number), then when the user call our API we only need to process new data instead of everything since the beggining of times
    * Not needed since the kucoin response is very small (order of magnitude of 10-100 transactions)
