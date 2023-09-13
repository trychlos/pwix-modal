# pwix:modal - TODO

## Summary

1. [Todo](#todo)
2. [Done](#done)

---
## Todo

|   Id | Date       | Description and comment(s) |
| ---: | :---       | :---                       |
|   10 | 2023- 5- 2 | would it be relevant to also allow to keep a position ? |
|   38 |  |  |

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
|    6 | 2023- 2-19 | have a mdWidth parameter + the corresponding setWidth() method |
|      | 2023- 9-10 | cancelled as should rather be managed by a class |
|    7 | 2023- 2-19 | integrate pwix:bootbox into pwix:modal |
|      | 2023- 5-29 | no: this is the principle of a package to add features to other packages |
|      |            | instead, pwix:bootbox should rely on pwix:modal |
|    8 | 2023- 4-27 | when preparing 2.0, remove Modal.setTarget() obsolete method |
|      | 2023- 9-10 | will be done but no more a useful todo |
|    9 | 2023- 5- 2 | when managing mdSizeKey, have only one data with both width and height instead of two datas (this is for rgpd reasons as these two datas cannot be individually refused) |
|      | 2023- 5- 2 | done - see rationale in ChangeLog |
|   11 | 2023- 5- 2 | even with a static backdrop, we keep the header 'cross' close button - and escape also close the dialog.. so is it useful ? |
|      | 2023- 5- 2 | done with mdCloseByHeader and mdCloseByKeyboard parameters |
|   12 | 2023- 5-29 | the modal should be constraint to max width of the device |
|      | 2023- 5-29 | done - released with 1.3.1 |
|   13 | 2023- 6- 1 | review examples in the README to be up to date with obsoleted apis |
|      | 2023- 6-11 | done |
|   14 | 2023- 6- 1 | have an option so that the modal covers all the device screen (useful in XS and SM displays) |
|      | 2023- 6-11 | first try is not successful - see 'fullscreen' branch |
|      | 2023- 9-10 | done |
|   15 | 2023- 6- 7 | have an option so that the modal is centered on the viewport |
|      | 2023- 6-11 | done (mdVerticalPosition) |
|   16 | 2023- 6-10 | have a verbosity level to trace 'trying to find a modal while none is opened' |
|      | 2023- 6-11 | done |
|   17 | 2023- 6-10 | have a verbosity level to trace resizing |
|      | 2023- 9-10 | done |
|   18 | 2023- 6-10 | dialogs are now positioned on top left, while they used to be on top center |
|      | 2023- 6-11 | fixed |
|   19 | 2023- 6-11 | responsivity is deficient when footer is large |
|      | 2023- 6-11 | fixed |
|   20 | 2023- 6-12 | Have Modal.i18n.namespace() to let another package add a translation to this one |
|      | 2023- 6-22 | done |
|   21 | 2023- 6-15 | must leave to the caller a chance to prevent the close (any close: click on backdrop, header close, escape, cancel) |
|      | 2023- 7- 4 | done |
|   22 | 2023- 6-22 | md-foo div should be renamed md-hidden (and be hidden) |
|      | 2023- 7- 4 | done |
|   23 | 2023- 7- 4 | when preparing 2.0, remove obsolete Modal.knownButtons() |
|      | 2023- 9-10 | will be done but no more a useful todo |
|   24 | 2023- 7- 4 | should be more tolerant when the app set buttons (this is only text after all) |
|      | 2023- 7- 5 | accept labels distincts from ids |
|   25 | 2023- 7- 4 | the button which closes the modal (Cancel) should be a configuration option or a button option |
|      | 2023- 7- 5 | accept a properties object for each button |
|   26 | 2023- 7- 4 | added buttons (and ours) should have more options, at least an info to identify it |
|      | 2023- 7- 5 | accept a properties object for each button |
|   27 | 2023- 7- 5 | be verbose about stack push/pop |
|      | 2023- 9-10 | done |
|   28 | 2023- 9- 9 | Have an option to put a type on each provided button, and notably 'submit' on OK button |
|      | 2023- 9-13 | done |
|   29 | 2023- 9- 9 | provide additional classes for modal-content, modal-header, modal-body and modal-footer |
|      | 2023- 9-10 | done |
|   30 | 2023- 9-10 | obsolete Modal.beforeClose() method, replaced with a set() with option |
|      | 2023- 9-10 | done |
|   31 | 2023- 9-10 | obsolete Modal.target() method, replaced with a set() with option |
|      | 2023- 9-10 | done |
|   32 | 2023- 9-10 | obsolete Modal.setClasses() method, replaced with a set() with option |
|      | 2023- 9-10 | done |
|   33 | 2023- 9-10 | obsolete Modal.setTitle() method, replaced with a set() with option |
|      | 2023- 9-10 | done |
|   34 | 2023- 9-10 | obsolete Modal.setBody() method, replaced with a set() with option |
|      | 2023- 9-10 | done |
|   35 | 2023- 9-10 | obsolete Modal.setFooter() method, replaced with a set() with option |
|      | 2023- 9-10 | done |
|   36 | 2023- 9-10 | review the buttons management |
|      | 2023- 9-13 | buttons management is clarified |
|   37 | 2023- 9-10 | closeByBackdrop, closeByHeader, closeByKeyboard mdModal methods should also be setters + set() should have corresponding code |
|      | 2023- 9-10 | done |

---
P. Wieser
- Last updated on 2023, Sept. 12th
