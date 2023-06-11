# pwix:modal - TODO

## Summary

1. [Todo](#todo)
2. [Done](#done)

---
## Todo

|   Id | Date       | Description and comment(s) |
| ---: | :---       | :---                       |
|    6 | 2023- 2-19 | have a mdWidth parameter + the corresponding setWidth() method |
|    8 | 2023- 4-27 | when preparing 2.0, remove pwixModal.setTarget() obsolete method |
|   10 | 2023- 5- 2 | would it be relevant to also allow to keep a position ? |
|   14 | 2023- 6- 1 | have an option so that the modal covers all the device screen (useful in XS and SM displays) |
|   16 | 2023- 6-10 | have a verbosity level to trace 'trying to find a modal while none is opened' |
|   17 | 2023- 6-10 | have a verbosity level to trace resizing |
|   20 |  |  |

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
|    5 | 2023- 2-19 | integrate pwix:modal-info into pwix:modal |
|      | 2023- 5-29 | no: this is the principle of a package to add features to other packages |
|      |            | instead, pwix:modal-info should rely on pwix:modal |
|    7 | 2023- 2-19 | integrate pwix:bootbox into pwix:modal |
|      | 2023- 5-29 | no: this is the principle of a package to add features to other packages |
|      |            | instead, pwix:bootbox should rely on pwix:modal |
|    9 | 2023- 5- 2 | when managing mdSizeKey, have only one data with both width and height instead of two datas (this is for rgpd reasons as these two datas cannot be individually refused) |
|      | 2023- 5- 2 | done - see rationale in ChangeLog |
|   11 | 2023- 5- 2 | even with a static backdrop, we keep the header 'cross' close button - and escape also close the dialog.. so is it useful ? |
|      | 2023- 5- 2 | done with mdCloseByHeader and mdCloseByKeyboard parameters |
|   12 | 2023- 5-29 | the modal should be constraint to max width of the device |
|      | 2023- 5-29 | done - released with 1.3.1 |
|   13 | 2023- 6- 1 | review examples in the README to be up to date with obsoleted apis |
|      | 2023- 6-11 | done |
|   15 | 2023- 6- 7 | have an option so that the modal is centered on the viewport |
|      | 2023- 6-11 | done (mdVerticalPosition) |
|   18 | 2023- 6-10 | dialogs are now positioned on top left, while they used to be on top center |
|      | 2023- 6-11 | fixed |
|   19 | 2023- 6-11 | responsivity is deficient when footer is large |
|      | 2023- 6-11 | fixed |

---
P. Wieser
- Last updated on 2023, May 29th
