# pwix:modal

## ChangeLog

### 1.7.0-rc

    Release date: 

    - Accept button labels and non-standard button identifiers (todo #24)
    - Accept a property object for each button (todo #25, #26)
    - Fix race condition between stack management and modal life
    - Bump pwix:i18n version requirement
    - Bump pwix:jquery-ui version requirement
    - Obsoletize Modal.target() replaced with Modal.set() (todo #31) bumping candidate version number
    - Obsoletize Modal.beforeClose() replaced with Modal.set() (todo #30)
    - Obsoletize Modal.title() replaced with Modal.set() (todo #33)
    - Obsoletize Modal.setFooter() replaced with Modal.set() (todo #35)
    - Obsoletize Modal.setClasses() replaced with Modal.set() (todo #32)

### 1.6.0

    Release date: 2023- 7- 4

    - Upgrade pwix:layout version requirement to get layout.less constants
    - Rename globally exported pwixModal to Modal
    - Reorganize constants definitions to not pollute the global space
    - Provide mdBeforeClose parameter to leave the user a chance to prevent the close (todo #21)

### 1.5.4

    Release date: 2023- 6-22

    - Fix md-click to be triggered before modal is hidden
    - Fix jquery-ui import
    - Add lodash dependency
    - configure() now acts both as a getter and a setter
    - Define pwixModal.i18n.namespace() method (todo #20)

### 1.5.3

    Release date: 2023- 6-12

    - Fix modal positioning (on .modal-content class instead of .modal)

### 1.5.2

    Release date: 2023- 6-11

    - Fix defaults settings

### 1.5.1

    Release date: 2023- 6-11

    - Meteor packaging: add version constraint on pwix:jquery-ui

### 1.5.0

    Release date: 2023- 6-11

    - Define new pwixModal.configure() to handle verbosity levels (todo #16)
    - Define new 'mdVerticalPosition' parameter (todo #15)
    - Position dialogs on the top center of the view (todo #18)
    - Fix responsivity with large footer (todo #19)

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
- Last updated on 2023, July 4th
