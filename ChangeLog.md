# pwix:modal

## ChangeLog

### 1.4.2-rc

    Release date: 

    - Position dialogs on the top center of the view (todo #18)

### 1.4.1

    Release date: 2023- 5-29

    - Be more tolerant about language specification
    - mdButtons now accepts a string as specified in the README
    - Update the README adding the list of predefined buttons

### 1.4.0

    Release date: 2023- 5-29

    - Actually, adding a dependency is one of the reason to increment the minor version number which should have been done with 1.3.1, so this new version

### 1.3.1

    Release date: 2023- 5-29

    - Prevent the modal dialog to override the screen width (todo #12), introducing a new dependency on pwix:layout
    - Decrease the dialog margins on small devices for a better user experience

### 1.3.0

    Release date: 2023- 5- 2

    - mdOutsideClose parameter is renamed mdCloseByBackdrop
    - Define mdCloseByKeyboard and mdCloseByHeader parameters
    - mdSizeKey writes width and height in a single string
        
        Rationale: in the previous (erroneous) version mdSizeKey write two datas, for width and for height
        But RGPD states that user must be able to choose individual cookies in an informed manner, and:
        1) cookieManager didn't want link two datas to let the user choose the both of two, or none
        2) pwixModal didn't want write either width or height (too much work for small added value)
        so choice is taken to write both width and height in a single data - which is much more simple

### 1.2.1

    Release date: 2023- 5- 1

    - Remove jquery-ui npm dependency, keeping pwix:jquery-ui Meteor package requirement, as this later itself requires jquiry-ui npm

### 1.2.0

    Release date: 2023- 5- 1

    - Re-add jQueryUI dependency as needed to have resizable() and draggable() methods
    - Add mdSizeKey and mdOutsideClose parameters to pwixModal.run() method
    - Add pwixModal.target() getter/setter method
    - Obsolete pwixModal.setTarget() method

### 1.1.0

    Release date: 2023- 2-19

    - A deep rewriting under the hood, letting several modals be stacked
    - Add pwixModal.count() method

### 1.0.0

    Release date: 2023- 2- 2

    - Initial release

---
P. Wieser
- Last updated on 2023, May 29th
