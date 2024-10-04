# pwix:modal

## ChangeLog

### 2.2.2-rc

    Release date: 

    - 

### 2.2.1

    Release date: 2024-10- 4

    - Fix configuration overrides

### 2.2.0

    Release date: 2024- 9- 6

    - Define XXL modal size on screens to be used on screens with very high resolution, thus bumping minor candidate version number

### 2.1.0

    Release date: 2024- 7-10

    - Have a closeByBackdrop configure option, bumping minor candidate version number
    - configure() is now a reactive data source

### 2.0.1

    Release date: 2024- 6- 8

    - Fix the breakpoints constants inclusion in stylesheet

### 2.0.0

    Release date: 2024- 6- 8

    - Define 'mdMoveTop' run parm and 'moveTop' set parm to ket the caller move the modal vertically only (bumping the candidate release number)
    - Replace obsolete pwix:layout v1 dependency with pwix:ui-layout v2, bummpring major candidate version number

### 1.10.0

    Release date: 2024- 5-24

    - Define 'bodyHeight' set() parameter to handle dynamic height contents
    - Add NEW button
    - mdBeforeClose() function now must return a Promise (bumping candidate version nunber)
    - New askClose() method to close the modal
    - Meteor 3.0 ready

### 1.9.0

    Release date: 2023-10-11

    - Fix buttonEnable() obsolete function (which should work anyway)
    - Fix buttons reactivity
    - Define Modal.C.ButtonExt.RESET special button identifier (bumping candidate version number)
    - Modal.set({ buttons: ... }) now also accepts new buttons as strings
    - Fix and improve buttons definition and reactivity
    - CANCEL and CLOSE buttons default to dismiss=true
    - Submit the modal on Enter, unless the event is said to not do

### 1.8.0

    Release date: 2023- 9-18

    - Define new 'md-ready' event (bumping candidate version number)
    - All events now receive also the parameters initially passed to Modal.run()
    - Obsolete Modal.buttonEnable() and Modal.setButtons()
    - Review and improve button management, notably changing the 'md-click' event data (todo #28, todo #36)
    - Use 'this' instead of Temmplate.currentData() inside of helpers and events
    - Restore Modal.target() as a pure getter
    - Define Modal.focus() method and mdAutoFocus/autoFocus parameters
    - Let the application add additional classes to main components of the modal

### 1.7.3

    Release date: 2023- 9-12

    - Back to Meteor 2.9.0

### 1.7.2

    Release date: 2023- 9-11

    - Fix default vertical positioning

### 1.7.1

    Release date: 2023- 9-11

    - Reset fullScreen default value, removing those used during the tests

### 1.7.0

    Release date: 2023- 9-10

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
    - Obsoletize Modal.setBody() replaced with Modal.set() (todo #34)
    - Define classesContent, classesBody, classesFooter and classesHeader to add classes to respective dialog parts (todo #29)
    - Be verbose when push into and pop from stack (todo #27)
    - Be verbose when resizing the modal (todo #17)
    - Let the dialog be displayed in full screen mode, an option which should be reserved to very special situation (todo #14)
    - Remove verticalPosition parameter, as it should rather be managed by a class
    - Bump Meteor version requirement
    - closeByBackdrop, closeByHeader, closeByKeyboard have now corresponding setters and are useable via Modal.set() (todo #37)

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
- Last updated on 2024, Oct. 4th
