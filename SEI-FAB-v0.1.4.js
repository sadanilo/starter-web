//version 0.1.4
//skip type check for report and read full text to find plate and fine
//Global Variables
const EVENT_OPTIONS = { bubbles: true, cancelable: false, composed: true };
const EVENTS = {
  FOCUS: new Event("focus", EVENT_OPTIONS),
  BLUR: new Event("blur", EVENT_OPTIONS),
  SUBMIT: new Event("submit", EVENT_OPTIONS),
  CHANGE: new Event("change", EVENT_OPTIONS),
  INPUT: new Event("input", EVENT_OPTIONS),
  KEYUP: new Event("keyup", EVENT_OPTIONS),
  KEYPRESS: new Event("keypress", EVENT_OPTIONS),
  KEYDOWN: new Event("keydown", EVENT_OPTIONS),
  MOUSEDOWN: new Event("mousedown", EVENT_OPTIONS),
};

//Functios Definitions

//Converts string of html into actual elements
function htmlToElements(html) {
  var template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

//Enclosed Json parse with try/catch
function tryParseJSONObject(jsonString) {
  try {
    let o = JSON.parse(jsonString);
    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) {
    return false;
  }
  return false;
}

//Create CSS used for this tampering
function createFabMarkup() {
  let fabCSS = document.createElement("style");
  fabCSS.innerHTML = `  
  .adminActions {
    position: fixed;
    bottom: 30px; right: 42.5px;
  }  
  .adminButton {
    height: 60px;
    width: 60px;
    background-color: rgb(60, 179, 113, .8);
    border-radius: 50%;
    display: block;
    color: #fff;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .adminButton i {
    font-size: 22px;
  }

  .adminButtons {
    position: absolute;
    width: 100%;
    bottom: 120%;
    text-align: center;
  }

  .adminButtonsLeft {
    position: absolute;
    height: 100%;
    width: 100%;
    bottom: 2%;
    right: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    align-content: space-between;
    flex-wrap:wrap;
    flex-direction: column;
    justify-content: space-between;
  }

  .adminButtons a {
    display: block;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    text-decoration: none;
    margin: 10px auto 0;
    line-height: 1;
    color: #fff;
    opacity: 0;
    visibility: hidden;
    position: relative;
    box-shadow: 0 0 5px 1px rgba(51, 51, 51, .3);
  }   

  .adminButtonsLeft a {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    text-decoration: none;
    margin: 10px auto 0;
    line-height: 1;
    color: #fff;
    opacity: 0;
    visibility: hidden;
    position: relative;
    box-shadow: 0 0 5px 1px rgba(51, 51, 51, .3);
  }   

  .adminButtons a:hover, .adminButtonsLeft a:hover {
    transform: scale(1.05);
  }

  .adminButtons a:nth-child(1) {background-color: #ff5722; transition: opacity .2s ease-in-out .3s, transform .15s ease-in-out;}
  .adminButtons a:nth-child(2) {background-color: #03a9f4; transition: opacity .2s ease-in-out .25s, transform .15s ease-in-out;}
  .adminButtons a:nth-child(3) {background-color: #f44336; transition: opacity .2s ease-in-out .2s, transform .15s ease-in-out;}
  .adminButtons a:nth-child(4) {background-color: #4CAF50; transition: opacity .2s ease-in-out .15s, transform .15s ease-in-out;}

  .adminButtonsLeft a:nth-child(1) {background-color: #ff5722; transition: opacity .2s ease-in-out .3s, transform .15s ease-in-out;}
  .adminButtonsLeft a:nth-child(2) {background-color: #03a9f4; transition: opacity .2s ease-in-out .25s, transform .15s ease-in-out;}
  .adminButtonsLeft a:nth-child(3) {background-color: #f44336; transition: opacity .2s ease-in-out .2s, transform .15s ease-in-out;}
  .adminButtonsLeft a:nth-child(4) {background-color: #4CAF50; transition: opacity .2s ease-in-out .15s, transform .15s ease-in-out;}

  .adminActions a i {
    font-size: 22px;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  }

  input.adminToggle {
    -webkit-appearance: none;
    position: absolute;
    border-radius: 50%;
    top: 0; left: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;
    z-index: 2;
    transition: box-shadow .2s ease-in-out;
    box-shadow: 0 3px 5px 1px rgba(51, 51, 51, .3);
  }

  input.adminToggle:hover {
    box-shadow: 0 3px 6px 2px rgba(51, 51, 51, .3);
  }

  input.adminToggle:checked ~ .adminButtons a {
    opacity: 1;
    visibility: visible;
  }

  input.adminToggle:checked ~ .adminButtonsLeft a {
    opacity: 1;
    visibility: visible;
  }
  
  .toastie {
    position: absolute;
    bottom: 20%;
    right: 20%;
    margin: 0;
    padding: 0;
    background-color: bisque;
    font-family: "Calibri", "Arial", sans-serif;
    font-size: 100%;
    color: black;
  }
  .message {
    width: 240px;
    min-height: 100%;
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 30px;
    background-color: #007bff;
    box-shadow: 5px 5px 5px #ccc;
    transition: all .8s ease-in-out;
  }
  .message > p{
    color:#FFF;
    font-size: 1.5em;
    line-height: 1em;
  }
  .message.show {
    visibility: visible;
    opacity: 1;
  }
  .close {
    position: absolute;
    box-sizing: border-box;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    background-color: white;
    cursor: pointer;
  }
  .close::after {
    font-size: 16px;
    font-weight: bold;
  }`;
  let fab = htmlToElements(`
  <div class="adminActions">
    <input type="checkbox" name="adminToggle" class="adminToggle" />
    <a class="adminButton" href="#!"><i class="fa fa-copy"></i></a>
    <div class="adminButtons">
      <a id="copyAction" href="#" title="Copiar Processo e Data de Abertura"><i class="fa fa-calendar"></i></a>
      <a id="copyFinePlate" href="#" title="Copiar Auto e Placa"><i class="fa fa-car"></i></a>
      <a id="copyActionDate" href="#" title="Copiar Data de Deferimento ou Indeferimento"><i class="fa fa-calendar-day"></i></a>
      <a id="openDetran402" href="#" title="Copiar Auto e Placa"><i class="fa fa-external-link-square-alt"></i></a>
    </div>
  </div>`);

  let toast = htmlToElements(`
    <div class='toastie'>
    <div class="message">
      <p></p>
      <button class="close">X</button>
    </div>
  </div>`);

  toast.querySelector(".close").addEventListener("click", (e) => {
    toast.querySelector(".message").classList.remove("show");
  });

  fab.querySelector("#copyAction").onclick = async function (e) {
    e.preventDefault();
    let data = {};
    data.procNumber = document
      .querySelector("#ifrVisualizacao")
      .contentWindow.document.querySelector("#capaProcessoPro > div:nth-child(3) > div.data > a.newLink").innerText;
    data.procDateOpen = document
      .querySelector("#ifrVisualizacao")
      .contentWindow.document.querySelector("#capaProcessoPro > div:nth-child(4) > div.data > a").innerText;
    data.info = document
      .querySelector("#ifrVisualizacao")
      .contentWindow.document.querySelector("#capaProcessoPro > div:nth-child(6) > div.data > a").innerText;

    data.plate = data.info.match(/[A-Za-z]{3}[0-9]{1}[A-ZA-Za-z0-9]{1}[0-9]{2}(?![0-9])/)
      ? data.info.match(/[A-Za-z]{3}[0-9]{1}[A-ZA-Za-z0-9]{1}[0-9]{2}(?![0-9])/)[0]
      : "";

    data.fine = data.info.match(/[A-Za-z]{2,3}[0-9]{7,8}/) ? data.info.match(/[A-Za-z]{2,3}[0-9]{7,8}/)[0] : "";
    delete data.info;

    let savedObj = tryParseJSONObject(await navigator.clipboard.readText());
    if (savedObj) {
      savedObj.procNumber = data.procNumber;
      savedObj.procDateOpen = data.procDateOpen;
      savedObj.plate = savedObj.plate ? savedObj.plate : data.plate;
      savedObj.fine = savedObj.fine ? savedObj.fine : data.fine;
      await navigator.clipboard.writeText(JSON.stringify(savedObj));
    } else {
      await navigator.clipboard.writeText(JSON.stringify(data));
      savedObj = data;
    }
    document.querySelector(
      ".toastie > .message > p"
    ).innerText = `Processo: ${savedObj.procNumber}\n\nPlaca: ${savedObj.plate}\n\nAuto: ${savedObj.fine}\n\nData Abertura: ${savedObj.procDateOpen}`;
    document.querySelector(".toastie > .message").classList.add("show");
  };

  fab.querySelector("#copyActionDate").onclick = async function (e) {
    e.preventDefault();
    let data = {};
    let iframeDocumento = document.querySelector("#ifrVisualizacao");
    let iframeArvore = iframeDocumento.contentWindow.document.querySelector("#ifrArvoreHtml");
    let dateFinal = iframeArvore.contentWindow.document
      .querySelector("body table:nth-child(2) > tbody > tr > td:nth-child(2) > p")
      .innerText.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
    data.dateFinal = dateFinal[0];
    let typeOfProccess = "";
    typeOfProccess = iframeArvore.contentWindow.document.querySelector("body > p.Texto_Justificado_Recuo_Primeira_Linha").innerText;
    data.typeOfProccess = typeOfProccess.match(/\s(INDEFERIR|DEFERIR|NÃO CONHECER)\s/)
      ? typeOfProccess.match(/\s(INDEFERIR|DEFERIR|NÃO CONHECER)\s/)[0].trim()
      : false;
    if (!data.typeOfProccess) {
      typeOfProccess = iframeArvore.contentWindow.document.querySelector("body > p:nth-child(5).Texto_Justificado_Recuo_Primeira_Linha").innerText;

      data.typeOfProccess = typeOfProccess.match(/(INDEFERIR|INDEFERIMENTO|DEFERIR|NÃO CONHECER)/)
        ? typeOfProccess.match(/(INDEFERIR|INDEFERIMENTO|DEFERIR|NÃO CONHECER)/)[0].trim()
        : false;
    }
    let savedObj = tryParseJSONObject(await navigator.clipboard.readText());
    if (savedObj) {
      savedObj.dateFinal = data.dateFinal;
      savedObj.typeOfProccess = data.typeOfProccess;
      await navigator.clipboard.writeText(JSON.stringify(savedObj));
    } else {
      await navigator.clipboard.writeText(JSON.stringify(data));
      savedObj = data;
    }
    document.querySelector(
      ".toastie > .message > p"
    ).innerText = `Processo: ${savedObj.procNumber}\n\nPlaca: ${savedObj.plate}\n\nAuto: ${savedObj.fine}\n\nData Abertura: ${savedObj.procDateOpen}\n\nData Final: ${savedObj.dateFinal}\n\nDecisão: ${savedObj.typeOfProccess}`;
    document.querySelector(".toastie > .message").classList.add("show");
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //Copy fine plate
  ///////////////////////////////////////////////////////////////////////////////////////////////
  fab.querySelector("#copyFinePlate").onclick = async function (e) {
    e.preventDefault();
    let data = {};
    let fine, plate;
    let iframeDocumento = document.querySelector("#ifrVisualizacao");
    let iframeArvore = iframeDocumento.contentWindow.document.querySelector("#ifrArvoreHtml");

    let fineFinal = iframeArvore.contentWindow.document.body.innerText.match(/[A-Za-z]{2,3}[0-9]{7,8}/)
      ? iframeArvore.contentWindow.document.body.innerText.match(/[A-Za-z]{2,3}[0-9]{7,8}/)[0]
      : "";
    let plateFinal = iframeArvore.contentWindow.document.body.innerText.match(/[A-Za-z]{3}[\-]*[0-9]{1}[A-ZA-Za-z0-9]{1}[0-9]{2}(?![0-9])/)
      ? iframeArvore.contentWindow.document.body.innerText.match(/[A-Za-z]{3}[\-]*[0-9]{1}[A-ZA-Za-z0-9]{1}[0-9]{2}(?![0-9])/)[0]
      : "";

    data.fine = fineFinal;
    data.plate = plateFinal;

    let savedObj = tryParseJSONObject(await navigator.clipboard.readText());

    if (savedObj) {
      savedObj.plate = plateFinal;
      savedObj.fine = fineFinal;
      await navigator.clipboard.writeText(JSON.stringify(savedObj));
    } else {
      await navigator.clipboard.writeText(JSON.stringify(data));
      savedObj = data;
    }

    document.querySelector(
      ".toastie > .message > p"
    ).innerText = `Processo: ${savedObj.procNumber}\n\nPlaca: ${savedObj.plate}\n\nAuto: ${savedObj.fine}\n\nData Abertura: ${savedObj.procDateOpen}\n\nData Final: ${savedObj.dateFinal}`;
    document.querySelector(".toastie > .message").classList.add("show");
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //End Copy fine plate
  ///////////////////////////////////////////////////////////////////////////////////////////////

  fab.querySelector("#openDetran402").onclick = async function (e) {
    e.preventDefault();
    let savedObj = tryParseJSONObject(await navigator.clipboard.readText());
    window.open(
      `https://sistemas.detran.pi.gov.br/renainf-web/restrito/consulta/baseNacional/infracao/porPlaca/consulta.jsf?placa=${savedObj.plate}&auto=${savedObj.fine}&action=${savedObj.typeOfProccess}`,
      "_blank"
    );
  };
  return { fabCSS, fab, toast };
}

//Create and Add send to Juridical Department button

function sendToDepartament(departament) {
  let iframeInput = document.querySelector("#txtUnidade");
  iframeInput.value = departament;
  iframeInput.dispatchEvent(EVENTS.CHANGE);
  iframeInput.dispatchEvent(EVENTS.INPUT);
  iframeInput.dispatchEvent(EVENTS.KEYUP);
  iframeInput.dispatchEvent(EVENTS.KEYDOWN);

  setTimeout(function () {
    document.querySelector("#divInfraAjaxtxtUnidade > ul > li").dispatchEvent(EVENTS.MOUSEDOWN);
    document.querySelector("#sbmEnviar").click();
  }, 2000);
}

function sendToDepartmentButton() {
  let divAppend = document.querySelector("#divGeral");
  divAppend.style.marginTop = "40px";
  let buttonAT = htmlToElements(
    '<button type="submit" id="sbmEnviarAT" class="infraButton" value="EnviarAT" style="position:absolute;top:-11%;">Enviar AT</button>'
  );
  let multasGGT = htmlToElements(
    '<button type="submit" id="sbmEnviarMultasGGT" class="infraButton" value="EnviarMultasGGT" style="position:absolute;top:-11%;left:8%">Enviar Multas-GGT</button>'
  );
  let buttonGGT = htmlToElements(
    '<button type="submit" id="sbmEnviarGGT" class="infraButton" value="EnviarGGT" style="position:absolute;top:-11%;left:18%">Enviar GGT</button>'
  );
  buttonAT.onclick = async function (e) {
    e.preventDefault();
    sendToDepartament("MULTAS-AT-STRANS");
  };

  multasGGT.onclick = async function (e) {
    e.preventDefault();
    sendToDepartament("MULTAS-GGT-STRANS");
  };

  buttonGGT.onclick = async function (e) {
    e.preventDefault();
    sendToDepartament("GGT-STRANS");
  };

  divAppend.prepend(buttonAT);
  divAppend.prepend(multasGGT);
  divAppend.prepend(buttonGGT);
}

(function () {
  "use strict";

  createFabMarkup();

  //sei.pmt.pi.gov.br/sei/controlador.php?acao=procedimento_enviar&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar&id_procedimento=7313676&arvore=1&infra_sistema=100000100&infra_unidade_atual=110002405&infra_hash=20a2335ccc3151ce93e379c7bd53f76db23575b42ade1f8aa1a7a810b51d5260

  if (window.location.href.indexOf("https://sei.pmt.pi.gov.br/sei/controlador.php?acao=procedimento_enviar") != -1) {
    sendToDepartmentButton();
  }

  document.head.append(createFabMarkup().fabCSS);
  document.body.append(createFabMarkup().toast);
  document.body.append(createFabMarkup().fab);
  console.log(createFabMarkup().fab);
})();
