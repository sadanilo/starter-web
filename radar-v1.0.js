(function () {
  "use strict";
  let resultCssId = "#resultado";

  //functions to help the code
  function htmlToElements(html) {
    var template = document.createElement("template");
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
  }

  function typingToElement(text, elem) {
    const EVENT_OPTIONS = { bubbles: true, cancelable: false, composed: true };
    const EVENTS = {
      BLUR: new Event("blur", EVENT_OPTIONS),
      CHANGE: new Event("change", EVENT_OPTIONS),
      INPUT: new Event("input", EVENT_OPTIONS),
    };
    elem.value = text;
    elem.dispatchEvent(EVENTS.INPUT);
  }

  //elements definitions
  let fillProcessResultButton = htmlToElements(`
  <button class="btn btn-info" type="button">Preencher</button>
  `);

  //elements functions
  fillProcessResultButton.onclick = async function (e) {
    e.preventDefault();
    let resultText = document.querySelector("body > div.modal.ng-isolate-scope.in > div > div > div.modal-header.ng-scope > h4").innerText;
    resultText = resultText.match(/(INDEFERIR|DEFERIR)/) ? resultText.match(/(INDEFERIR|DEFERIR)/)[0].trim() : "Resultado conforme processo: ";
    resultText = resultText == "INDEFERIR" ? "Indeferido conforme processo: " : resultText;
    resultText = resultText == "DEFERIR" ? "Deferido conforme processo: " : resultText;
    let clipboardText = await navigator.clipboard.readText();
    let parsedClipboard = JSON.parse(clipboardText);
    if (parsedClipboard) {
      typingToElement(`${resultText}${parsedClipboard.procNumber}`, document.querySelector(resultCssId));
    } else {
      typingToElement(`Informação completa do resutlado no processo`, document.querySelector(resultCssId));
    }
  };

  //dom manipulation
  waitForKeyElements(resultCssId, function (elem) {
    document
      .querySelector("body > div.modal.ng-isolate-scope.in > div > div > div.modal-body.ng-scope > div > div > div > ng-include > form > div > div")
      .prepend(fillProcessResultButton);
  });

})();
