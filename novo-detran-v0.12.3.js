//version 12.2 - added cancelar autuadas
//Indice
//#CADOCOR = cadastro de ocorrência
//#CONBANAC - Consulta Base Nacional
//#BSELOCAL - Consulta Base Nacional
//#licenciamento

(function () {
  "use strict";
  //console.log(window.location);

  function highlightLines(tableBody) {
    const urlParams = new URLSearchParams(window.location.search);
    let auto = urlParams.get("auto");
    for (let row of tableBody.rows) {
      if (row.cells[1].innerText === "212190") {
        row.classList.add("highlighted-row");
        if (auto) {
          if (row.cells[2].innerText === auto) {
            row.cells[2].style.color = "red";
          }
        }
      }
    }
  }

  function dispatchCustomEvents(elem, event) {
    const EVENT_OPTIONS = { bubbles: true, cancelable: false, composed: true };
    const EVENTS = {
      BLUR: new Event("blur", EVENT_OPTIONS),
      CHANGE: new Event("change", EVENT_OPTIONS),
      INPUT: new Event("input"),
      KEYDOWN: new Event("keydown", EVENT_OPTIONS),
    };
    elem.dispatchEvent(EVENTS[event]);
  }

  function htmlToElements(html) {
    var template = document.createElement("template");
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
  }

  function convertFromStringToDate(responseDate) {
    let dateComponents = responseDate.split(" ");
    let datePieces = dateComponents[0].split("/");
    return new Date(datePieces[2], datePieces[1] - 1, datePieces[0]);
  }

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  window.onload = function () {
    document.querySelector("body").style.overflowX = "hidden";
    let divSistemas = document.querySelector("#sistemas");
    if (divSistemas) {
      divSistemas.style = "";
    }
  };

  //Primeiro carregamento da página, ativa ao carregar a pagina de fora
  // Check if the current page is the dashboard page
  if (window.location.href === "https://sistemas.detran.pi.gov.br/detran-web/restrito/dashboard.xhtml") {
    // Define the CSS styles to be injected
    const customCss = `
      a.button-red, button.button-red {
        background-color: #a83240;
      }

      a.button-green, button.button-green {
        background-color: #1e9600;
      }

      a.button-purple, button.button-purple {
        background-color: #8d0096;
      }

      #sistemas {
        padding-top: 30px;
      }

      #upper > div {
        display: none;
      }

      #menuform > div {
        top: 0px;
      }

      #j_idt75 .ui-inputfield {
        border-width: 2px;
        padding: 4px;
      }

      div.uix-dialog-fluid {
        height: auto !important;
      }

      /* Fix RENAVAM */
      body > div.layout-wrapper.menu-layout-static.menu-layout-horizontal {
        min-height: fit-content;
        height: 95vh;
      }

      body .ui-button.ui-button-icon-only.actionButtonTable {
        border-radius: 0%;
        padding: 0px;
      }

      /* Style the tab */
      .tab {
        overflow: hidden;
        border: 1px solid #ccc;
        background-color: #f1f1f1;
      }

      /* Style the buttons that are used to open the tab content */
      .tab button {
        background-color: inherit;
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 14px 16px;
        transition: 0.3s;
      }

      /* Change background color of buttons on hover */
      .tab button:hover {
        background-color: #ddd;
      }

      /* Create an active/current tablink class */
      .tab button.active {
        background-color: #ccc;
      }

      /* Style the tab content */
      .tabcontent {
        display: none;
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-top: none;
      }
    `;

    // Create a <style> element and inject the CSS styles
    const styleElement = document.createElement("style");
    styleElement.innerHTML = customCss;
    document.head.append(styleElement);
    console.log("Applied custom CSS");

    // Wait for <iframe> elements to load and adjust their styles
    waitForKeyElements("iframe", function (iframe) {
      iframe.onload = function () {
        console.log("Frame detected");
        iframe.style.height = "95vh";
        iframe.style.overflowX = "hidden";
        iframe.style.overflowY = "hidden";
      };
    });
  }

  //#CONBANAC - Consulta Base Nacional
  if (
    window.location.host === "sistemas.detran.pi.gov.br" &&
    window.location.pathname === "/renainf-web/restrito/consulta/baseNacional/infracao/porPlaca/consulta.jsf"
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    let data = urlParams.get("data");
    if (data) {
      document.querySelector("#formConsulta402\\:dataInicio_input").value = data;
      document.querySelector("#formConsulta402\\:dataFinal_input").value = data;
    }
    let placa = urlParams.get("placa");
    if (placa) {
      placa = placa.replace("-", "");
      document.querySelector("#formConsulta402\\:placa").value = placa;
      document.querySelector("#formConsulta402\\:j_idt54").click();
    }

    function buildSummary() {
      let infoSummary = htmlToElements(
        `<div id="infoSummary" class="ui-panelgrid ui-widget ui-panelgrid-blank form-group" style="background-color: #ededed">
        <ul>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkLicenciamento" target="_blank" title='Licenciamento'><span class="ui-button-icon-left ui-icon ui-c fa fa-list"></span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkAtendimento" target="_blank" title='Baixa'><span class="ui-button-icon-left ui-icon ui-c fa fa-inbox"></span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkBatrif" target="_blank" title='Batrif'><span class="ui-button-icon-left ui-icon ui-c fa fa-cloud-download"></span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkPagrif" target="_blank" title='Pagrif'><span class="ui-button-icon-left ui-icon ui-c fa fa-cloud-upload"></span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkAutuar" target="_blank" title='Autuar'><span class="ui-button-icon-left ui-icon ui-c fa fa-pencil-square-o"></span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkPenalizar" target="_blank" title='Penalizar'><span class="ui-button-icon-left ui-icon ui-c fa fa-usd"></span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkInfrator" target="_blank" title='Cadastrar Real Infrator'><span class="ui-button-icon-left ui-icon ui-c fa fa-address-card"></span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkOcorrencia" target="_blank" title='Cadastrar Ocorrência'><span class="ui-button-icon-left ui-icon ui-c fa fa-indent"></span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkOcorrenciaListar" target="_blank" title='Verificar Ocorrência'><span class="ui-button-icon-left ui-icon ui-c fa fa-outdent"></span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkLocal" target="_blank" title='Verificar na base Local'><span class="ui-button-icon-left ui-icon ui-c fa fa-flag"></span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkDesvincular" target="_blank" title='Desvincular'><span class="ui-button-icon-left ui-icon ui-c fa fa-toggle-off"></span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkPagNac" target="_blank" title='Pagamento Nacional'><span class="ui-button-icon-left ui-icon ui-c fa fa-money"></span></a></li>
          </ul>
        <div class="ui-panelgrid ui-widget ui-panelgrid-blank form-group">
          <div class="ui-panelgrid-content ui-widget-content ui-grid ui-grid-responsive"></div>
        </div>
      </div>`
      );

      //create resumo tab nav
      let resumo = $("#formConsulta401\\:j_idt76\\:tabview > ul > li.ui-state-default.ui-corner-top.ui-tabs-selected.ui-state-active").clone(true);
      resumo.find("a")[0].innerText = "Resumo";
      resumo.find("a")[0].href = "#formConsulta401:j_idt76:tabview:j_idt077";

      //add tab content
      let tabSummary = $("#formConsulta401\\:j_idt76\\:tabview\\:j_idt238").clone();
      tabSummary.prepend(infoSummary);
      tabSummary.attr("id", "formConsulta401:j_idt76:tabview:j_idt77");
      //build structure
      tabSummary.find("h4")[0].remove();
      tabSummary.find("div")[1].id = "";
      tabSummary.find("div")[2].id = "";
      tabSummary.find("div")[3].remove();
      //add information

      let infoInputArr = [
        ["infoPlacaVeiculo", "Placa Veículo"],
        ["infoRenavamVeiculo", "Renavam Veículo"],
        ["infoNumeroAuto", "Número do Auto"],
        ["infoDataAutuacao", "Data da Autuação"],
        ["infoDataDefesaPrevia", "Data Limite Defesa Prévia"],
        ["infoNumeroNIT", "Numero do NIT"],
        ["infoDataPenalizacao", "Data da Penalização"],
        ["infoDataVencBoleto", "Data Vencimento Boleto"],
        ["infoUfPagamento", "UF de Pagamento"],
        ["infoDataPagamento", "Data do Pagamento"],
        ["infoValorPagamento", "Valor do Pagmento"],
        ["infoDataBaixaPAgamento", "Data Baixa Pagamento"],
        ["infoTipoOcorrencia", "Tipo Ocorrência"],
        ["infoOrigemOcorrencia", "Origem Ocorrência"],
        ["infoDataOcorrencia", "Data Ocorrência "],
      ];

      let infoRowTitle = ["Veiculo", "Autuação", "Penalidade", "Pagamento", "Cancelamento"];
      let infoGridRow = htmlToElements('<div class="ui-grid-row"></div>');
      let infoInputTemplate = htmlToElements(
        `<div class="ui-panelgrid-cell ui-grid-col-4">
        <span class="md-inputfield">
        <label></label>
        <input name="" type="text" value="" readonly="readonly" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all ui-state-filled" role="textbox">
        </span>
      </div>`
      );

      let infoInputElements = infoInputArr.map(function (e) {
        let el = infoInputTemplate.cloneNode(true);
        el.querySelector("input").name = e[0];
        el.querySelector("input").id = e[0];
        el.querySelector("label").innerText = e[1];
        return el;
      });

      let infoTitlesElements = infoRowTitle.map(function (e) {
        let el = document.createElement("h4");
        el.innerText = e;
        return el;
      });

      //Creates the row and add the elements
      let veiculoRow = infoGridRow.cloneNode(true);
      veiculoRow.append(infoInputElements[0]);
      veiculoRow.append(infoInputElements[1]);
      veiculoRow.append(infoInputElements[2]);
      let autuacaoRow = infoGridRow.cloneNode(true);
      autuacaoRow.append(infoInputElements[3]);
      autuacaoRow.append(infoInputElements[4]);
      let penalidadeRow = infoGridRow.cloneNode(true);
      penalidadeRow.append(infoInputElements[5]);
      penalidadeRow.append(infoInputElements[6]);
      penalidadeRow.append(infoInputElements[7]);
      let pagamentoRow = infoGridRow.cloneNode(true);
      pagamentoRow.append(infoInputElements[8]);
      pagamentoRow.append(infoInputElements[9]);
      pagamentoRow.append(infoInputElements[10]);
      pagamentoRow.append(infoInputElements[11]);
      let ocorrenciaRow = infoGridRow.cloneNode(true);
      ocorrenciaRow.append(infoInputElements[12]);
      ocorrenciaRow.append(infoInputElements[13]);
      ocorrenciaRow.append(infoInputElements[14]);
      //adds the row to infoSummary
      console.log(infoSummary);
      infoSummary.querySelector(".ui-panelgrid-content").append(infoTitlesElements[0]);
      infoSummary.querySelector(".ui-panelgrid-content").append(veiculoRow);
      infoSummary.querySelector(".ui-panelgrid-content").append(infoTitlesElements[1]);
      infoSummary.querySelector(".ui-panelgrid-content").append(autuacaoRow);
      infoSummary.querySelector(".ui-panelgrid-content").append(infoTitlesElements[2]);
      infoSummary.querySelector(".ui-panelgrid-content").append(penalidadeRow);
      infoSummary.querySelector(".ui-panelgrid-content").append(infoTitlesElements[3]);
      infoSummary.querySelector(".ui-panelgrid-content").append(pagamentoRow);
      infoSummary.querySelector(".ui-panelgrid-content").append(infoTitlesElements[4]);
      infoSummary.querySelector(".ui-panelgrid-content").append(ocorrenciaRow);

      return [resumo, tabSummary];
    }
    let innerCSS = document.createElement("style");
    innerCSS.innerHTML = `

    body .ui-datatable tbody tr.highlighted-row{
      background-color: rgb(0 103 150 / 25%);
      font-weight: bold;
    }

    body .ui-datatable tbody tr.highlighted-row:hover{
      font-weight: bold;
    }
    
    .highlighted-cell{
      background-color: rgb(0 103 150 / 25%);
    }

    #infoSummary{
      //display: flex;
      margin: 10px 0;
    }
    #infoSummary h4{
      margin: 2px 0;
    }


    #infoSummary > ul{
      list-style: none;
      margin: 0;
      padding: 0;
      display: inline-flex;
    }

    #infoSummary > ul > li{
      margin: 0 5px;
    }
    
   #infoSummary a.button-blue, button.button-blue{
      background-color: #006296;
      color: #fff;
      min-height: 35px;
    }

    #infoSummary span{
      line-height: 1.5;
    }

    @media (min-width: 1281px) {
      #infoSummary a.button-blue, button.button-blue{
        min-height: 50px;
      }
      
      #infoSummary span{
        font-size: 2.5em !important;
        line-height: 1.5;
        margin-top: 5px;
      }

    }
    
    
    div#j_idt75{
      height: auto !important;
    }

    #btnPreencheData{
      background-color: #8d0096;
    }

    #btnLimpaData{
      background-color: #8d0096;
    }
    `;
    document.head.append(innerCSS);
    // console.log("applied innerCSS");

    async function updateInfoInputsValues(dataSource) {
      // console.log(dataSource);
      // console.log(dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview > .ui-tabs-panels").childNodes);
      let placa = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt83").value;
      let renavam = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt288").value;
      let auto = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt94").value;
      let nit = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt201").value;
      let enquadramento = document.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt86").value.split(" - ")[0];

      dataSource.querySelector("#linkLicenciamento").href = `http://taxas.detran.pi.gov.br/multa/index.jsf?placa=${placa}&renavam=${renavam}`;
      dataSource.querySelector("#linkAtendimento").href = `http://atendimento.detran.pi.gov.br/view/pesquisa/pesquisa.jsf?nit=${nit}`;
      dataSource.querySelector(
        "#linkBatrif"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/alteracao/atualizarMultasPorPlaca/atualizar.jsf?placa=${placa}`;

      dataSource.querySelector("#linkBatrif").onclick = function (e) {
        e.preventDefault();
        localStorage.setItem("Autom-Batrif-num", dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt94").value);
        localStorage.setItem("Autom-Batrif-attempt", 0);
        window.open(this.href, "_blank").focus();
      };

      dataSource.querySelector(
        "#linkPagrif"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/alteracao/atualizarPagamentosPorPlaca/atualizar.jsf?placa=${placa}`;
      dataSource.querySelector(
        "#linkAutuar"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/cadastro/notificacaoAutuacao/createNotificacaoAutuacao.jsf?placa=${placa}&auto=${auto}`;
      dataSource.querySelector(
        "#linkPenalizar"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/cadastro/notificacaoPenalidade/createNotificacaoPenalidade.jsf?placa=${placa}&auto=${auto}`;
      dataSource.querySelector(
        "#linkInfrator"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/cadastro/realInfrator/createRealInfrator.jsf?auto=${auto}&enquadramento=${enquadramento}`;
      dataSource.querySelector(
        "#linkOcorrencia"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/servico/ocorrencia/createOcorrencia.jsf?placa=${placa}&auto=${auto}`;
      dataSource.querySelector(
        "#linkOcorrenciaListar"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/servico/ocorrencia/cancelaOcorrencia.jsf?operacao=CANCELAR&placa=${placa}&enquadramento=${enquadramento}`;
      dataSource.querySelector(
        "#linkLocal"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/cadastro/multa/listMulta.jsf?operacao=CONSULTA&placa=${placa}`;
      dataSource.querySelector(
        "#linkDesvincular"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/cancelamento/desvinculacao/desvinculacao.jsf?placa=${placa}&renavam=${renavam}`;
      dataSource.querySelector(
        "#linkPagNac"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/consulta/baseNacional/pagamentoInfracao/consulta.jsf?auto=${auto}&enquadramento=${enquadramento}`;

      dataSource.querySelector("#infoPlacaVeiculo").value = placa;
      dataSource.querySelector("#infoRenavamVeiculo").value = renavam;
      dataSource.querySelector("#infoNumeroAuto").value = auto;

      try {
        let clipboardText = await navigator.clipboard.readText();
        let parsedClipboard = JSON.parse(clipboardText);
        if (parsedClipboard && dataSource.querySelector("#infoNumeroAuto").value == parsedClipboard.fine) {
          dataSource.querySelector("#infoNumeroAuto").style.color = "red";
        }
      } catch {
        dataSource.querySelector("#infoNumeroAuto").style.fontWeight = "bold";
      }

      document.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt183");
      dataSource.querySelector("#infoDataAutuacao").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt183").value;
      dataSource.querySelector("#infoDataDefesaPrevia").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt186").value;
      dataSource.querySelector("#infoNumeroNIT").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt201").value;
      dataSource.querySelector("#infoDataPenalizacao").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt204").value;
      dataSource.querySelector("#infoDataVencBoleto").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt207").value;
      dataSource.querySelector("#infoUfPagamento").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt225").value;
      dataSource.querySelector("#infoDataPagamento").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt228").value;
      dataSource.querySelector("#infoValorPagamento").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt231").value;
      dataSource.querySelector("#infoDataBaixaPAgamento").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt234").value;
      dataSource.querySelector("#infoTipoOcorrencia").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt258").value;
      dataSource.querySelector("#infoOrigemOcorrencia").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt261").value;
      dataSource.querySelector("#infoDataOcorrencia").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt267").value;
    }

    // console.log("Adding WaitForKeyElements on Fines Data Table and Fine Modal");

    waitForKeyElements("#formConsulta402\\:j_idt59_data", function (elem) {
      highlightLines(elem);
      //shrink input fields to add button at the end
      let inputFields = document.querySelector("#formConsulta402\\:j_idt32_content");
      let inputFieldsDivs = inputFields.childNodes[0].childNodes;

      for (let ipd of inputFieldsDivs) {
        ipd.classList.remove("ui-grid-col-4");
        ipd.classList.add("ui-grid-col-2");
      }

      let divPreencheData = htmlToElements(`
          <div class="ui-panelgrid-cell ui-grid-col-4">
            <a id="btnPreencheData" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only button-purple" role="button" aria-disabled="false" style="margin-left: 15px;">
              <span class="ui-button-icon-left ui-icon ui-c fa fa-save"></span>
              <span class="ui-button-text ui-c">ui-button</span>
              <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
            </a>
            <a id="btnLimpaData" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only button-purple" role="button" aria-disabled="false" style="margin-left: 15px;">
              <span class="ui-button-icon-left ui-icon ui-c fa fa-paint-brush"></span>
              <span class="ui-button-text ui-c">ui-button</span>
              <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
            </a>
          </div>
          `);

      divPreencheData.querySelector("#btnPreencheData").onclick = function (e) {
        e.preventDefault();
        let DataUltimaInfracao = convertFromStringToDate(
          document.querySelector("#formConsulta402\\:j_idt59_data > tr:nth-child(17) > td:nth-child(5)").innerText
        );

        document.querySelector("#formConsulta402\\:dataFinal_input").value = DataUltimaInfracao.toLocaleDateString();
        document.querySelector("#formConsulta402\\:dataInicio_input").value = "01/01/2015";
      };

      divPreencheData.querySelector("#btnLimpaData").onclick = function (e) {
        e.preventDefault();
        document.querySelector("#formConsulta402\\:dataFinal_input").value = "";
        document.querySelector("#formConsulta402\\:dataInicio_input").value = "";
      };

      document.querySelector("#formConsulta402\\:j_idt32_content > div").append(divPreencheData);
    });

    waitForKeyElements("#j_idt75", function (elem) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.log("visible");
          let [resumo, tabSummary] = buildSummary();
          $("#formConsulta401\\:j_idt76\\:tabview > ul").prepend(resumo);
          $("#formConsulta401\\:j_idt76\\:tabview > div").prepend(tabSummary);
          $("#formConsulta401\\:j_idt76\\:tabview > ul > li:nth-child(3)").click();
          $("#formConsulta401\\:j_idt76\\:tabview > ul > li:nth-child(1)").click();
          console.log("Summary appended");
          updateInfoInputsValues(elem);
        } else {
          console.log("invisible");
        }
      });
      observer.observe(elem);
      //make sure resumo tab is showing
    });
  }
  //BATRIF
  if (
    window.location.host === "sistemas.detran.pi.gov.br" &&
    window.location.pathname === "/renainf-web/restrito/alteracao/atualizarMultasPorPlaca/atualizar.jsf"
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    let placa = urlParams.get("placa");
    document.querySelector("#formAtualizaMultasPorPlaca\\:placa").value = placa;
    document.querySelector("#formAtualizaMultasPorPlaca\\:j_idt50").click();
    let auto = localStorage.getItem("Autom-Batrif-num");
    let attempt = localStorage.getItem("Autom-Batrif-attempt");
    waitForKeyElements("#formAtualizaMultasPorPlaca\\:j_idt54_data > tr:nth-child(1) > td:nth-child(3)", function (elem) {
      if (auto !== null) {
        let listaMultas = document.querySelector("#formAtualizaMultasPorPlaca\\:j_idt54_data").childNodes;
        for (let multa of listaMultas) {
          if (multa.childNodes[2].innerText === auto) {
            multa.querySelector("span").click();
            document.querySelector("#formAtualizaMultasPorPlaca\\:j_idt81").click();
            auto = null;
            break;
          }
        }
      }
    });
    localStorage.removeItem("Autom-Batrif-num");
    localStorage.removeItem("Autom-Batrif-attempt");
  }
  //PAGRIF
  if (
    window.location.host === "sistemas.detran.pi.gov.br" &&
    window.location.pathname === "/renainf-web/restrito/alteracao/atualizarPagamentosPorPlaca/atualizar.jsf"
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    let placa = urlParams.get("placa");
    document.querySelector("#formAtualizaPagamentosMultaPorPlaca\\:placa").value = placa;
    document.querySelector("#formAtualizaPagamentosMultaPorPlaca\\:j_idt38").click();
  }

  //AUTUAÇÃO
  if (
    window.location.host === "sistemas.detran.pi.gov.br" &&
    window.location.pathname === "/renainf-web/restrito/cadastro/notificacaoAutuacao/createNotificacaoAutuacao.jsf"
  ) {
    let fillButton = htmlToElements(`
        <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" type="submit" role="button" aria-disabled="false">
        <span class="ui-button-icon-left ui-icon ui-c fa fa-pencil"></span>
        <span class="ui-button-text ui-c">ui-button</span>
        <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
        </button>`);

    fillButton.onclick = function (e) {
      e.preventDefault();
      let dataInfracao = convertFromStringToDate(document.querySelector("#formCreateNotificacaoAutuacao\\:j_idt53").value);
      document.querySelector("#formCreateNotificacaoAutuacao\\:datahHoraEmissaoNotificacao_input").value = addDays(
        dataInfracao,
        32
      ).toLocaleDateString();
      document.querySelector("#formCreateNotificacaoAutuacao\\:dataLimiteDefesa_input").value = addDays(dataInfracao, 62).toLocaleDateString();
    };

    // select the target node
    var target = document.querySelector("#j_idt24 > div");

    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        document.querySelector("#formCreateNotificacaoAutuacao > div.uix-center").append(fillButton);
      });
    });

    // configuration of the observer:
    var config = { childList: true };

    // pass in the target node, as well as the observer options
    observer.observe(target, config);

    const urlParams = new URLSearchParams(window.location.search);
    let placa = urlParams.get("placa");
    let auto = urlParams.get("auto");

    document.querySelector("#formCreateNotificacaoAutuacao\\:numeroAutoInfracao").value = auto;
    document.querySelector("#formCreateNotificacaoAutuacao\\:placa").value = placa;

    document.querySelector("#formCreateNotificacaoAutuacao\\:j_idt45").click();
  }
  //PENALIZAÇÃO
  if (
    window.location.host === "sistemas.detran.pi.gov.br" &&
    window.location.pathname === "/renainf-web/restrito/cadastro/notificacaoPenalidade/createNotificacaoPenalidade.jsf"
  ) {
    let fillButton = htmlToElements(`
        <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" type="submit" role="button" aria-disabled="false">
        <span class="ui-button-icon-left ui-icon ui-c fa fa-pencil"></span>
        <span class="ui-button-text ui-c">ui-button</span>
        <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
        </button>`);

    fillButton.onclick = function (e) {
      e.preventDefault();
      let today = new Date(Date.now());
      console.log(today);
      document.querySelector("#formCreateNotificacaoPenalidade\\:dataHoraEmissaoNotificacao_input").value = today.toLocaleDateString();
      document.querySelector("#formCreateNotificacaoPenalidade\\:dataHoraVencimentoNotificacao_input").value = addDays(
        today,
        45
      ).toLocaleDateString();
      //checkbox
      document
        .querySelector("#formCreateNotificacaoPenalidade\\:indicadorExigibilidade > div.ui-chkbox-box.ui-widget.ui-corner-all.ui-state-default")
        .classList.add("ui-state-active");
      document
        .querySelector(
          "#formCreateNotificacaoPenalidade\\:indicadorExigibilidade > div.ui-chkbox-box.ui-widget.ui-corner-all.ui-state-default > span"
        )
        .classList.remove("ui-icon-blank");
      document
        .querySelector(
          "#formCreateNotificacaoPenalidade\\:indicadorExigibilidade > div.ui-chkbox-box.ui-widget.ui-corner-all.ui-state-default > span"
        )
        .classList.add("ui-icon-check");
      document
        .querySelector(
          "#formCreateNotificacaoPenalidade\\:indicadorExigibilidade > div.ui-chkbox-box.ui-widget.ui-corner-all.ui-state-default > span"
        )
        .click();
      //select
      document.querySelector("#formCreateNotificacaoPenalidade\\:tipoPenalidade_1").classList.add("ui-state-highlight");
      document.querySelector("#formCreateNotificacaoPenalidade\\:tipoPenalidade_label").textContent = "1 - Penalidade de multa";
      document.querySelector("#formCreateNotificacaoPenalidade\\:tipoPenalidade_input").value = "MULTA";
    };
    // select the target node
    var target = document.querySelector("#j_idt24 > div");

    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        document.querySelector("#formCreateNotificacaoPenalidade > div.uix-center").append(fillButton);
      });
    });

    // configuration of the observer:
    var config = { childList: true };

    // pass in the target node, as well as the observer options
    observer.observe(target, config);

    //
    // ADD FILL BUTTON
    //

    const urlParams = new URLSearchParams(window.location.search);
    let placa = urlParams.get("placa");
    let auto = urlParams.get("auto");

    document.querySelector("#formCreateNotificacaoPenalidade\\:numeroAutoInfracao").value = auto;
    document.querySelector("#formCreateNotificacaoPenalidade\\:placa").value = placa;

    document.querySelector("#formCreateNotificacaoPenalidade\\:j_idt43").click();
  }

  //Consulta Licenciamento
  if (window.location.host === "atendimento.detran.pi.gov.br" && window.location.pathname === "/view/pesquisa/pesquisa.jsf") {
    const urlParams = new URLSearchParams(window.location.search);
    let nit = urlParams.get("nit");
    document.querySelector("#j_idt30\\:j_idt53").value = nit;
    document.querySelector("#j_idt30\\:j_idt74").click();
  }
  //#CADOCOR = cadastro de ocorrência
  if (
    window.location.host === "sistemas.detran.pi.gov.br" &&
    window.location.pathname === "/renainf-web/restrito/servico/ocorrencia/createOcorrencia.jsf"
  ) {
    let css = document.createElement("style");
    css.innerHTML = `
          body .ui-button .ui-icon{
            color: #000;
          }

          button.ui-button{
            margin: 0 5px;
          }

          .ui-icon a.button-blue, button.button-blue{
            background-color: #006296;
          }

          .ui-icon a.button-red, button.button-red{
            background-color: #a83240;
          }

          .ui-icon a.button-green, button.button-green{
            background-color: #1e9600;
          }

          .ui-icon a.button-purple, button.button-purple{
            background-color: #8d0096;
          }
          
          `;

    document.head.append(css);

    const urlParams = new URLSearchParams(window.location.search);
    let placa = urlParams.get("placa");
    let auto = urlParams.get("auto");
    if (auto && placa) {
      document.querySelector("#formCreateOcorrencia\\:numeroAuto").value = auto;
      document.querySelector("#formCreateOcorrencia\\:placa").value = placa;
      document.querySelector("#formCreateOcorrencia\\:j_idt45").click();
    }

    let botaoPreencheAuto = htmlToElements(
      `<button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" role="button" aria-disabled="false">
      <span class="ui-button-icon-left ui-icon ui-c fa fa-file-text"></span>
      <span class="ui-button-text ui-c">ui-button</span>
      <span class="ink animate" style="height: 32px; width: 32px; top: -1.64062px; left: -6.5px; pointer-events: none;"></span>
      </button>`
    );

    let botaoPesquisaComData = htmlToElements(
      `<button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" role="button" aria-disabled="false">
      <span class="ui-button-icon-left ui-icon ui-c fa fa-arrow-circle-right"></span>
      <span class="ui-button-text ui-c">ui-button</span>
      <span class="ink animate" style="height: 32px; width: 32px; top: -1.64062px; left: -6.5px; pointer-events: none;"></span>
      </button>`
    );

    document.querySelector("#formCreateOcorrencia\\:formConsultaMulta > div.uix-center").append(botaoPreencheAuto);

    let botaoNumeroProcesso = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only button-purple" role="button" aria-disabled="false" style="margin-left: 15px;">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-save"></span>
    <span class="ui-button-text ui-c">ui-button</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheJulgamentoAutuador = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-blue" role="button" aria-disabled="false" >
    <span class="ui-button-icon-left ui-icon ui-c fa fa-pencil" alt="Cadastrar Defesa da Autuação"></span>
    <span class="ui-button-text ui-c">Cad Defesa</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheDeferimentoAutuador = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-green" role="button" aria-disabled="false">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-check"></span>
    <span class="ui-button-text ui-c">Def. Defesa</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheIndeferimentoAutuador = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-red" role="button" aria-disabled="false">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-window-close"></span>
    <span class="ui-button-text ui-c">Indef. Defesa</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheCancelamentoAutuador = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-blue" role="button" aria-disabled="false">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-file-text-o"></span>
    <span class="ui-button-text ui-c">Cancelar</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheCancelamentoAutuadas = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-blue" role="button" aria-disabled="false">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-scissors"></span>
    <span class="ui-button-text ui-c">Cancelar Autuadas</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheJulgamentoJari = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-blue" role="button" aria-disabled="false">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-pencil"></span>
    <span class="ui-button-text ui-c">Cad. Jari</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheIndeferimentoJari = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-red" role="button" aria-disabled="false">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-window-close"></span>
    <span class="ui-button-text ui-c">Indef. Jari</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheDeferimentoJari = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-green" role="button" aria-disabled="false">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-check"></span>
    <span class="ui-button-text ui-c">Def. Jari</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    botaoPesquisaComData.onclick = function (e) {
      e.preventDefault();
      let placa = document.querySelector("#formCreateOcorrencia\\:placa").value;
      let auto = document.querySelector("#formCreateOcorrencia\\:numeroAuto").value;
      let diaInfracao = document.querySelector("#formCreateOcorrencia\\:j_idt53").value.split(" ")[0];
      window.open(
        `https://sistemas.detran.pi.gov.br/renainf-web/restrito/consulta/baseNacional/infracao/porPlaca/consulta.jsf?placa=${placa}&auto=${auto}&data=${diaInfracao}`,
        "_blank"
      );
    };

    botaoPreencheAuto.onclick = async function (e) {
      e.preventDefault();
      let clipboardText = await navigator.clipboard.readText();
      let parsedClipboard = JSON.parse(clipboardText);
      if (parsedClipboard) {
        document.querySelector("#formCreateOcorrencia\\:numeroAuto").value = parsedClipboard.fine;
        document.querySelector("#formCreateOcorrencia\\:placa").value = parsedClipboard.plate;
      } else {
        document.querySelector("#formCreateOcorrencia\\:numeroAuto").focus();
      }
    };

    botaoNumeroProcesso.onclick = async function (e) {
      e.preventDefault();
      let clipboardText = await navigator.clipboard.readText();
      let parsedClipboard = JSON.parse(clipboardText);
      if (parsedClipboard) {
        document.querySelector("#formCreateOcorrencia\\:numeroProcesso").value = parsedClipboard.procNumber;
      } else {
        document.querySelector("#formCreateOcorrencia\\:numeroProcesso").focus();
      }
    };

    botaoPreencheJulgamentoAutuador.onclick = function (e) {
      e.preventDefault();

      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_3").click();

      setTimeout(async function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_1").click();
        let clipboardText = await navigator.clipboard.readText();
        let parsedClipboard = JSON.parse(clipboardText);
        if (parsedClipboard) {
          document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").value = parsedClipboard.procDateOpen;
          document.querySelector("#formCreateOcorrencia\\:numeroProcesso").value = parsedClipboard.procNumber;
        } else {
          document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").focus();
        }
      }, 1000);
      //preenche o textarea
      document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "Defesa Prévia em Julgamento";
    };

    botaoPreencheDeferimentoAutuador.onclick = function (e) {
      e.preventDefault();

      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_3").click();

      setTimeout(async function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_2").click();
        let clipboardText = await navigator.clipboard.readText();
        let parsedClipboard = JSON.parse(clipboardText);
        if (parsedClipboard) {
          document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").value = parsedClipboard.dateFinal;
          document.querySelector("#formCreateOcorrencia\\:numeroProcesso").value = parsedClipboard.procNumber;
        } else {
          document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").focus();
        }
      }, 1000);
      //preenche o textarea
      document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "Defesa Prévia Deferida";
    };

    botaoPreencheIndeferimentoAutuador.onclick = function (e) {
      e.preventDefault();

      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_3").click();

      setTimeout(async function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_3").click();
        let clipboardText = await navigator.clipboard.readText();
        let parsedClipboard = JSON.parse(clipboardText);
        if (parsedClipboard) {
          document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").value = parsedClipboard.dateFinal;
          document.querySelector("#formCreateOcorrencia\\:numeroProcesso").value = parsedClipboard.procNumber;
        } else {
          document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").focus();
        }
      }, 1000);
      //preenche o textarea
      document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "Defesa Prévia Indeferida";
    };

    botaoPreencheCancelamentoAutuador.onclick = async function (e) {
      e.preventDefault();
      let today = new Date(Date.now());

      document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").value = today.toLocaleDateString();
      //preenche o textarea
      let lateFineSelect = document.querySelector("#formCreateOcorrencia\\:prescrita > span.ui-button-text.ui-c").innerText;

      if (lateFineSelect === "Não") {
        document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "Cancelamento por deferimento de recurso";
      } else {
        document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "Cancelamento de multa por Prescrição";
      }

      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_3").click();

      setTimeout(function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_5").click();
      }, 1000);

      try {
        let clipboardText = await navigator.clipboard.readText();
        let parsedClipboard = JSON.parse(clipboardText);
        if (parsedClipboard) document.querySelector("#formCreateOcorrencia\\:numeroProcesso").value = parsedClipboard.procNumber;
      } catch (e) {
        console.log("não foi Possivel capturar a area de transferencia\n", e);
      }
    };

    botaoPreencheCancelamentoAutuadas.onclick = async function (e) {
      e.preventDefault();
      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_3").click();
      setTimeout(function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_5").click();
      }, 1000);

      let today = new Date(Date.now());
      document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").value = today.toLocaleDateString();
      //preenche o textarea
      document.querySelector("#formCreateOcorrencia\\:numeroProcesso").value = "00077.020835/2023-31";
      document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "DOM PORTARIA Nº 30-2024 (SEI nº 9593886)";
    };

    botaoPreencheJulgamentoJari.onclick = function (e) {
      e.preventDefault();
      //clica no JARI no select
      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_1").click();

      setTimeout(async function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_1").click();
        let clipboardText = await navigator.clipboard.readText();
        let parsedClipboard = JSON.parse(clipboardText);
        if (parsedClipboard) {
          document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").value = parsedClipboard.procDateOpen;
          document.querySelector("#formCreateOcorrencia\\:numeroProcesso").value = parsedClipboard.procNumber;
        } else {
          document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").focus();
        }
      }, 1000);
      //preenche o textarea
      document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "recurso de multa em julgamento";
    };

    botaoPreencheDeferimentoJari.onclick = function (e) {
      e.preventDefault();
      //clica no JARI no select
      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_1").click();

      setTimeout(async function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_2").click();
        let clipboardText = await navigator.clipboard.readText();
        let parsedClipboard = JSON.parse(clipboardText);
        if (parsedClipboard) {
          document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").value = parsedClipboard.dateFinal;
          document.querySelector("#formCreateOcorrencia\\:numeroProcesso").value = parsedClipboard.procNumber;
        } else {
          document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").focus();
        }
      }, 1000);
      //preenche o textarea
      document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "recurso de multa deferido";
    };

    botaoPreencheIndeferimentoJari.onclick = function (e) {
      e.preventDefault();
      //clica no JARI no select
      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_1").click();

      setTimeout(async function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_3").click();
        let clipboardText = await navigator.clipboard.readText();
        let parsedClipboard = JSON.parse(clipboardText);
        if (parsedClipboard) {
          document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").value = parsedClipboard.dateFinal;
          document.querySelector("#formCreateOcorrencia\\:numeroProcesso").value = parsedClipboard.procNumber;
        } else {
          document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").focus();
        }
      }, 1000);
      //preenche o textarea
      document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "recurso de multa indeferido";
    };

    waitForKeyElements("#formCreateOcorrencia\\:j_idt134", function (elem) {
      elem.style = "margin: 0 25px 0 30px;";
      document.querySelector("#formCreateOcorrencia > div.uix-center").prepend(botaoPreencheIndeferimentoAutuador);
      document.querySelector("#formCreateOcorrencia > div.uix-center").prepend(botaoPreencheDeferimentoAutuador);
      document.querySelector("#formCreateOcorrencia > div.uix-center").prepend(botaoPreencheJulgamentoAutuador);

      document.querySelector("#formCreateOcorrencia > div.uix-center").append(botaoPreencheJulgamentoJari);
      document.querySelector("#formCreateOcorrencia > div.uix-center").append(botaoPreencheIndeferimentoJari);
      document.querySelector("#formCreateOcorrencia > div.uix-center").append(botaoPreencheDeferimentoJari);
      document.querySelector("#formCreateOcorrencia > div.uix-center").append(botaoPreencheCancelamentoAutuador);
      document.querySelector("#formCreateOcorrencia > div.uix-center").append(botaoPreencheCancelamentoAutuadas);

      document.querySelector("#formCreateOcorrencia\\:j_idt117_content > div > div:nth-child(2) > span").append(botaoNumeroProcesso);
      document.querySelector("#formCreateOcorrencia\\:formConsultaMulta > div.uix-center").append(botaoPreencheAuto);
      document.querySelector("#formCreateOcorrencia\\:j_idt51_content > div:nth-child(1) > div:nth-child(1)").append(botaoPesquisaComData);
      document.querySelector("#formCreateOcorrencia\\:j_idt117_content > div > div:nth-child(2) > span").style = "display:flex";
    });
  }
  //#LSTOCOR = Listagem de ocorrência
  if (
    window.location.host === "sistemas.detran.pi.gov.br" &&
    window.location.pathname === "/renainf-web/restrito/servico/ocorrencia/cancelaOcorrencia.jsf"
  ) {
    const urlParams = new URLSearchParams(window.location.search);

    let placa = urlParams.get("placa");
    let enquadramento = urlParams.get("enquadramento");
    document.querySelector("#formListarOcorrencia\\:placa").value = placa;
    document.querySelector("#formListarOcorrencia\\:j_idt44\\:infracao_input").value = enquadramento;
    setTimeout(function () {
      dispatchCustomEvents(document.querySelector("#formListarOcorrencia\\:j_idt44\\:infracao_input"), "KEYDOWN");
      dispatchCustomEvents(document.querySelector("#formListarOcorrencia\\:j_idt44\\:infracao_input"), "INPUT");
    }, 500);
  }

  //#BSELOCAL = Consulta Base Local
  if (window.location.host === "sistemas.detran.pi.gov.br" && window.location.pathname === "/renainf-web/restrito/cadastro/multa/listMulta.jsf") {
    const urlParams = new URLSearchParams(window.location.search);
    let placa = urlParams.get("placa");
    if (placa) {
      document.querySelector("#formListMulta\\:placa").value = placa;
      document.querySelector("#formListMulta\\:j_idt61").click();
    }

    waitForKeyElements("#formListMulta\\:dataTableMulta_data > tr:nth-child(1) > td:nth-child(2)", function (elem) {
      const tableData = elem.parentElement.parentElement;

      for (let row of tableData.rows) {
        let buttonCadOcor = htmlToElements(`
          <button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" title="Cadastrar Ocorrência" style='background-color: #8d0096'>         
            <span class="ui-button-icon-left ui-icon ui-c fa fa-indent"></span>
            <span class="ui-button-text ui-c">Cadastrar Ocorrência</span>
            <span class="ink animate" style="height: 32px; width: 32px; top: 4.35938px; left: 6.34375px; pointer-events: none;"></span>
          </button>
          `);
        buttonCadOcor.onclick = function (e) {
          e.preventDefault();
          window.open(
            `https://sistemas.detran.pi.gov.br/renainf-web/restrito/servico/ocorrencia/createOcorrencia.jsf?placa=${placa}&auto=${row.cells[2].innerText.trim()}`
          );
        };
        row.cells[14].append(buttonCadOcor);
      }
    });
  }

  //#DESVINCULAR
  if (
    window.location.host === "sistemas.detran.pi.gov.br" &&
    window.location.pathname === "/renainf-web/restrito/cancelamento/desvinculacao/desvinculacao.jsf"
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    let placa = urlParams.get("placa");
    if (placa) {
      document.querySelector("#formCreateAgenteAutuador\\:valorChavePlaca").value = placa;
      document.querySelector("#formCreateAgenteAutuador\\:j_idt44").click();
    }

    let buttonPreencheDesvincular = htmlToElements(
      `<button id="preencheDesvincular" name="preencheDesvincular" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left" style="background-color: #8d0096;" "type="submit" role="button" aria-disabled="false">
      <span class="ui-button-icon-left ui-icon ui-c ui-icon-pencil"></span>
      <span class="ui-button-text ui-c">Preencher</span>
    </button>`
    );

    waitForKeyElements("#formCreateAgenteAutuador\\:numeroProcesso", function (elem) {
      buttonPreencheDesvincular.onclick = function (e) {
        e.preventDefault();
        //clica no DETERMINAÇÃO JUDICIAL no select
        document.querySelector("#formCreateAgenteAutuador\\:motivoDesvinculacao_2").click();

        document.querySelector("#formCreateAgenteAutuador\\:numeroProcesso").value = "00077.020835/2023-31";
        document.querySelector("#formCreateAgenteAutuador\\:dataProcesso_input").value = "26/04/2024";
        document.querySelector("#formCreateAgenteAutuador\\:observacoes").innerText = "DOM PORTARIA Nº 30-2024 (SEI nº 9593886)";
      };

      document.querySelector("#formCreateAgenteAutuador\\:j_idt147").parentElement.append(buttonPreencheDesvincular);
    });

    waitForKeyElements("#formDesvinculacaoMulta\\:j_idt266", function (elem) {
      buttonPreencheDesvincular.onclick = function (e) {
        e.preventDefault();
        //clica no DETERMINAÇÃO JUDICIAL no select
        document.querySelector("#formDesvinculacaoMulta\\:motivoDesvinculacaoDialog_2").click();

        document.querySelector("#formDesvinculacaoMulta\\:numeroProcessoDialog").value = "00077.020835/2023-31";
        document.querySelector("#formDesvinculacaoMulta\\:dataProcessoDialog_input").value = "26/04/2024";
        document.querySelector("#formDesvinculacaoMulta\\:observacoesDialog").innerText = "DOM PORTARIA Nº 30-2024 (SEI nº 9593886)";
      };
      document.querySelector("#formDesvinculacaoMulta\\:j_idt266").parentElement.append(buttonPreencheDesvincular);
    });
  }

  if (
    window.location.host === "sistemas.detran.pi.gov.br" &&
    window.location.pathname === "/renainf-web/restrito/cadastro/realInfrator/createRealInfrator.jsf"
  ) {
    const urlParams = new URLSearchParams(window.location.search);

    let auto = urlParams.get("auto");
    let enquadramento = urlParams.get("enquadramento");
    document.querySelector("#formCreateRealInfrator\\:numeroAutoInfracao").value = auto;
    document.querySelector("#formCreateRealInfrator\\:j_idt38\\:infracao_input").value = enquadramento;
    setTimeout(function () {
      dispatchCustomEvents(document.querySelector("#formCreateRealInfrator\\:j_idt38\\:infracao_input"), "KEYDOWN");
      dispatchCustomEvents(document.querySelector("#formCreateRealInfrator\\:j_idt38\\:infracao_input"), "INPUT");
    }, 500);
  }

  if (
    window.location.host === "sistemas.detran.pi.gov.br" &&
    window.location.pathname === "/renainf-web/restrito/consulta/baseNacional/pagamentoInfracao/consulta.jsf"
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    let auto = urlParams.get("auto");
    let enquadramento = urlParams.get("enquadramento");

    if (auto) {
      document.querySelector("#formConsultarPagamentoInfracao\\:inputNumeroAutoInfracao").value = auto;
      document.querySelector("#formConsultarPagamentoInfracao\\:j_idt39\\:infracao_input").value = enquadramento;

      document.querySelector("#formConsultarPagamentoInfracao\\:selectOrgaoAutuador_label").click();

      setTimeout(function () {
        document.querySelector("#formConsultarPagamentoInfracao\\:selectOrgaoAutuador_1598").click();
      }, 1000);

      setTimeout(function () {
        dispatchCustomEvents(document.querySelector("#formConsultarPagamentoInfracao\\:j_idt39\\:infracao_input"), "KEYDOWN");
        dispatchCustomEvents(document.querySelector("#formConsultarPagamentoInfracao\\:j_idt39\\:infracao_input"), "INPUT");
      }, 500);
    }
  }
})();
