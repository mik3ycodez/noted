/**
 * Name: Michael Harris
 * Date: July 14, 2021
 * Section: CSE 154 AD
 *
 * This is the javascript file for the index.html webpage. Functionality includes adding
 * new subject dividers, adding and removing notes within a subject divider, and editing
 * a note.
 */

"use strict";
(function() {
  window.addEventListener("load", init);

  const HEX_BASE = 16;

  /**
   * Initialize script upon window loading.
   */
  function init() {
    let addNoteBtn = id("addnote");
    let addSubjectBtn = id("addsubject");
    let deleteNoteBtns = qsa(".deletenote");
    let editNoteBtns = qsa(".editnote");
    let saveNoteBtns = qsa(".savenote");

    addNoteBtn.addEventListener("click", addNote);
    addSubjectBtn.addEventListener("click", addSubject);

    for (let i = 0; i < deleteNoteBtns.length; i++) {
      deleteNoteBtns[i].addEventListener("click", deleteNote);
    }

    for (let i = 0; i < editNoteBtns.length; i++) {
      editNoteBtns[i].addEventListener("click", editNote);
    }

    for (let i = 0; i < saveNoteBtns.length; i++) {
      saveNoteBtns[i].addEventListener("click", saveNote);
    }
  }

  /**
   * Adds a new subject to the list of subjects within the select tag and the details tag
   * both in lexicographical order.
   */
  function addSubject() {
    let subjectInput = id("newsubject");
    let input = subjectInput.value;

    if (input !== "" && !summaryExists(input)) {
      let newOption = gen("option");
      let newDetails = gen("details");
      let newSummary = gen("summary");
      let newUL = gen("ul");

      newOption.textContent = input;
      newSummary.textContent = input;

      insertNewOption(newOption, input);
      insertNewSubject(newDetails, input);
      newDetails.appendChild(newSummary);
      newDetails.appendChild(newUL);
    }
    subjectInput.value = "";
  }

  /**
   * Helper method to insert a new subject option into the select tag in lexicographical order.
   * @param {object} newOption the new option tag to be inserted.
   * @param {string} input the given option to be added to the select tag.
   */
  function insertNewOption(newOption, input) {
    let subjectList = id("subjects");
    let options = subjectList.children;
    let newOptionPlaced = false;

    // Starting at 1 keeps "Unfiled" at the top
    if (options.length > 1) {
      for (let i = 1; i < options.length && !newOptionPlaced; i++) {
        if (input < options[i].textContent) {
          subjectList.insertBefore(newOption, options[i]);
          newOptionPlaced = true;
        }
      }
    }

    /*
     * This must be a separate check, do not "else if". This catches the case for
     * options.length !> 1 and
     * input belongs at end of list.
     */
    if (!newOptionPlaced) {
      subjectList.appendChild(newOption);
    }
  }

  /**
   * Helper method to insert a new subject details tag within the subject container in
   * lexicographical order.
   * @param {object} newDetails the new details tag to be inserted.
   * @param {string} input the given new subject value to sort by.
   */
  function insertNewSubject(newDetails, input) {
    let subjectContainer = id("subjectcontainer");
    let details = subjectContainer.children;
    let newDetailsPlaced = false;

    // Starting at 1 keeps "Unfiled" at the top
    if (details.length > 1) {
      for (let i = 1; i < details.length && !newDetailsPlaced; i++) {
        let detailSummaryText = details[i].firstElementChild.textContent;
        if (input < detailSummaryText) {
          subjectContainer.insertBefore(newDetails, details[i]);
          newDetailsPlaced = true;
        }
      }
    }

    /*
     * This must be a separate check, do not "else if". This catches the case for
     * details.length !> 1 and
     * input belongs at end of list.
     */
    if (!newDetailsPlaced) {
      subjectContainer.appendChild(newDetails);
    }
  }

  /**
   * Helper method to identify if a summary tag already exists for a new subject
   * added by the user.
   * @param {string} input the given value for the addSubject input field.
   * @returns {boolean} if the summary to add already exists (true) or not (false).
   */
  function summaryExists(input) {
    let summaries = qsa("summary");
    let subjectExist = false;
    for (let i = 0; i < summaries.length && !subjectExist; i++) {
      if (summaries[i].textContent === input) {
        subjectExist = true;
      }
    }
    return subjectExist;
  }

  /**
   * Adds a new note element to the DOM below the user input fields.
   */
  function addNote() {
    let summaries = qsa("summary");
    let selectedSubject = id("subjects").value;
    let nextSummaryULSibling = "";
    let summaryMatched = false;

    for (let i = 0; i < summaries.length && !summaryMatched; i++) {
      if (summaries[i].textContent === selectedSubject) {
        nextSummaryULSibling = summaries[i].nextElementSibling;
        let formData = getFormData();
        let newLI = buildNewNote(formData);
        nextSummaryULSibling.appendChild(newLI);
        resetFormState(formData[0], formData[1], formData[2], formData[5]);
        summaryMatched = true;
      }
    }
  }

  /**
   * Helper method to fully create the new note object to be added.
   * @param {array} formData the note data fields to build the note
   * @returns {object} the new note to be added
   */
  function buildNewNote(formData) {
    // Create the new tags
    let newLI = gen("li");
    let newArticle = gen("article");
    let newH2 = gen("h2");
    let newSpanP = gen("span");
    let newDateP = gen("p");
    let newHR = gen("hr");
    let newNoteContentP = gen("p");
    let newSpanBtn = gen("span");
    let newEditBtn = gen("button");
    let newDeleteBtn = gen("button");

    // Assign the attribute values
    newH2.textContent = formData[1].value;
    newDateP.textContent = formData[2].value;
    newNoteContentP.textContent = formData[5].value;
    buildNewButtonsForNewNote(newEditBtn, newDeleteBtn);

    // Assign style values
    newArticle.style.backgroundColor = formData[3].value;
    newArticle.style.color = formData[4].value;

    // Build New List Item
    newLI.appendChild(newArticle);
    newArticle.appendChild(newH2);
    newArticle.appendChild(newSpanP);
    newSpanP.appendChild(newDateP);
    newArticle.appendChild(newHR);
    newArticle.appendChild(newNoteContentP);
    newArticle.appendChild(newSpanBtn);
    newSpanBtn.appendChild(newEditBtn);
    newSpanBtn.appendChild(newDeleteBtn);

    return newLI;
  }

  /**
   * Helper method to build the new buttons to add to the new note.
   * @param {object} editBtn the new edit button to be created
   * @param {object} deleteBtn the new delete button to be created
   */
  function buildNewButtonsForNewNote(editBtn, deleteBtn) {
    editBtn.classList.add("editnote");
    editBtn.textContent = "Edit Note";
    editBtn.addEventListener("click", editNote);
    deleteBtn.classList.add("deletenote");
    deleteBtn.textContent = "Delete Note";
    deleteBtn.addEventListener("click", deleteNote);
  }

  /**
   * Helper method to obtain the form data and pass to the building functions.
   * @returns {array} the data from the form to build the note
   */
  function getFormData() {
    let noteSubject = id("subjects");
    let noteTitle = id("notetitle");
    let noteDate = id("notedate");
    let noteBGColor = id("notebgcolor");
    let noteTextColor = id("notetextcolor");
    let noteContent = id("notecontent");
    return [noteSubject, noteTitle, noteDate, noteBGColor, noteTextColor, noteContent];
  }

  /**
   * Helper method to reset form state after the new note is built and added.
   * @param {object} subject the noteSubject field to reset
   * @param {object} title the noteTitle field to reset
   * @param {object} date the noteDate field to reset
   * @param {object} content the noteContent field to reset
   */
  function resetFormState(subject, title, date, content) {
    subject.value = "Unfiled";
    title.value = "";
    date.value = "";
    content.value = "";
  }

  /**
   * Removes the note from the page.
   */
  function deleteNote() {
    let parent = this.parentNode.parentNode.parentNode;
    parent.remove();
  }

  /**
   * Changes the title, date, and text of a note into fields that allow the user to make changes.
   * Also updates the Edit Note button to a Save Note button to update the content of the note.
   */
  function editNote() {
    let note = this.parentNode.parentNode;
    let adjustTitle = note.querySelector("h2");
    let adjustDate = note.querySelector("article span > p");
    let adjustContent = note.querySelector("article > p");

    let newTitleInput = gen("input");
    let newDateInput = gen("input");
    let newContentTextarea = gen("textarea");

    newTitleInput.type = "text";
    newTitleInput.value = adjustTitle.textContent;
    newDateInput.type = "date";
    newDateInput.value = adjustDate.textContent;
    newContentTextarea.value = adjustContent.textContent;

    note.replaceChild(newTitleInput, adjustTitle);
    note.querySelector("article > span").replaceChild(newDateInput, adjustDate);
    note.replaceChild(newContentTextarea, adjustContent);
    addEditColorInputs(note);

    this.className = "savenote";
    this.textContent = "Save Note";
    this.removeEventListener("click", editNote);
    this.addEventListener("click", saveNote);
  }

  /**
   * Helper method to add the color chaning inputs when editing a note.
   * @param {object} parent the parent node from which to insert the color inputs
   */
  function addEditColorInputs(parent) {
    let bgColorLabel = gen("label");
    bgColorLabel.textContent = "Note Background Color:";

    let bgColorInput = gen("input");
    bgColorInput.className = "editbgcolorinput";
    bgColorInput.type = "color";
    bgColorInput.value = rgbToHex(parent.style.backgroundColor);

    let textColorLabel = gen("label");
    textColorLabel.textContent = "Note Text Color:";

    let textColorInput = gen("input");
    textColorInput.className = "edittextcolorinput";
    textColorInput.type = "color";
    textColorInput.value = rgbToHex(parent.style.color);

    parent.insertBefore(bgColorLabel, parent.lastElementChild);
    parent.insertBefore(bgColorInput, parent.lastElementChild);
    parent.insertBefore(textColorLabel, parent.lastElementChild);
    parent.insertBefore(textColorInput, parent.lastElementChild);
  }

  /**
   * Updates a note's changes made by a user.
   */
  function saveNote() {
    let note = this.parentNode.parentNode;
    let titleInput = note.querySelector("input");
    let dateInput = note.querySelector("article span > input");
    let contentTextarea = note.querySelector("article > textarea");
    let bgColorInput = note.querySelector(".editbgcolorinput");
    let textColorInput = note.querySelector(".edittextcolorinput");

    let newTitleHeading2 = gen("h2");
    let newDateP = gen("p");
    let newContentP = gen("p");

    note.style.backgroundColor = bgColorInput.value;
    note.style.color = textColorInput.value;
    newTitleHeading2.textContent = titleInput.value;
    newDateP.textContent = dateInput.value;
    newContentP.textContent = contentTextarea.value;

    note.replaceChild(newTitleHeading2, titleInput);
    note.querySelector("article > span").replaceChild(newDateP, dateInput);
    note.replaceChild(newContentP, contentTextarea);
    removeEditColorInputs(note);

    this.className = "editnote";
    this.textContent = "Edit Note";
    this.removeEventListener("click", saveNote);
    this.addEventListener("click", editNote);
  }

  /**
   * Helper method to remove the color changing inputs when editing a note.
   * @param {object} parent the parent node from which to remove the color inputs
   */
  function removeEditColorInputs(parent) {
    let children = parent.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child.tagName === "LABEL" || child.tagName === "INPUT") {
        parent.removeChild(child);
        i--;
      }
    }
  }

  /**
   * Assists in the conversion of an RGB color value to hex string.
   * @param {string} rgbValue the string to split and convert to a hex string
   * @returns {string} the hex string value for the given rgbValue
   */
  function rgbToHex(rgbValue) {
    if (!rgbValue) {
      rgbValue = "rgb(0,0,0)";
    }
    let rgbValuesSplit = rgbValue.split("(")[1].split(")")[0];
    let rgbValuesArray = rgbValuesSplit.split(",");
    let result = "#";
    for (let i = 0; i < rgbValuesArray.length; i++) {
      let newHex = parseInt(rgbValuesArray[i]).toString(HEX_BASE);
      if (newHex.length === 1) {
        newHex = "0" + newHex;
      }
      result += newHex;
    }
    return result;
  }

  /**
   * Helper method to return a newly created DOM object given a tag.
   * @param {string} tag the name of the new tag to create
   * @returns {object} a new DOM tag
   */
  function gen(tag) {
    return document.createElement(tag);
  }

  /**
   * Helper method to return the element associated with an ID.
   * @param {string} name the name of the ID to return.
   * @returns {object} the element associated to the idName
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Helper method to return the first element associated with a selector.
   * @param {string} selector the selector to return.
   * @returns {object} the first element associated with a selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Helper method to return an array of DOM objects associated with a selector.
   * @param {string} selectorForAll the DOM objects to return.
   * @returns {array} an array of DOM objects associated with a selector.
   */
  function qsa(selectorForAll) {
    return document.querySelectorAll(selectorForAll);
  }
})();