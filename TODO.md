# pwix:modal - TODO

## Summary

1. [Todo](#todo)
2. [Done](#done)

---
## Todo

|   Id | Date       | Description and comment(s) |
| ---: | :---       | :---                       |
|    5 | 2023- 2-19 | integrate pwix:modal-info into pwix:modal |
|    6 | 2023- 2-19 | have a mdWidth parameter + the corresponding setWidth() method |
|    7 | 2023- 2-19 | integrate pwix:bootbox into pwix:modal |
|    8 | 2023- 4-27 | when preparing 2.0, remove pwixModal.setTarget() obsolete method |
|   10 | 2023- 5- 2 | would it be relevant to also allow to keep a position ? |
|   12 |  | |

---
## Done

|   Id | Date       | Description and comment(s) |
| ---: | :---       | :---                       |
|    1 | 2023- 2-19 | Remove jQuery-UI dependency |
|      | 2023- 2-19 | done |
|    2 | 2023- 2-19 | Be able have several stacked modals |
|      | 2023- 2-19 | done |
|    3 | 2023- 2-19 | Use a class-like API |
|      | 2023- 2-19 | done |
|    4 | 2023- 2-19 | Make sure events are directed to actual target, maybe by identifying it |
|      | 2023- 2-19 | Events hold the originating modal id |
|      | 2023- 2-19 | done |
|    9 | 2023- 5- 2 | when managing mdSizeKey, have only one data with both width and height instead of two datas (this is for rgpd reasons as these two datas cannot be individually refused) |
|      | 2023- 5- 2 | done - see rationale in ChangeLog |
|   11 | 2023- 5- 2 | even with a static backdrop, we keep the header 'cross' close button - and escape also close the dialog.. so is it useful ? |
|      | 2023- 5- 2 | done with mdCloseByHeader and mdCloseByKeyboard parameters |

---
P. Wieser
- Last updated on 2023, May 1st
