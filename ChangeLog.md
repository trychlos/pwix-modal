# pwix:modal - ChangeLog

| Version | Release    | Content |
| ---:    | :---       | :---    |
| 1.2.2   | 2023- 5- 2 | mdSizeKey writes width and height in a single string |
|         |            | Rationale: in the previous (erroneous) version mdSizeKey write two datas, for width and for height |
|         |            | But RGPD states that user must be able to choose individual cookies in an informed manner |
|         |            | and 1) cookieManager didn't want link two datas to let the user choose the both of two, or none |
|         |            | and 2) pwixModal didn't want write either width or height (too much work for small added value) |
|         |            | so choice is taken to write both width and height in a single data - which is much more simple |
| 1.2.1   | 2023- 5- 1 | Remove jquery-ui npm dependency, keeping pwix:jquery-ui Meteor package requirement, as this later itself requires jquiry-ui npm |
| 1.2.0   | 2023- 5- 1 | Re-add jQueryUI dependency as needed to have resizable() and draggable() methods |
|         |            | Add mdSizeKey and mdOutsideClose parameters to pwixModal.run() method |
|         |            | Add pwixModal.target() getter/setter method |
|         |            | Obsolete pwixModal.setTarget() method |
| 1.1.0   | 2023- 2-19 | A deep rewriting under the hood, letting several modals be stacked |
|         |            | add pwixModal.count() method |
|         |            | Remove jQueryUI dependency |
| 1.0.0   | 2023- 2- 2 | Initial release |

---
P. Wieser
- Last updated on 2023, May 1st
