(function () {
  "use strict";
  console.log(window.location);
  function highlightLines(tableBody) {
    for (let row of tableBody.rows) {
      if (row.cells[1].innerText === "212190") {
        row.classList.add("highlighted-row");
        //row.cells[0].classList.add("highlighted-cell");
      }
      row.onclick = function () {
        localStorage.setItem("numeroAuto", row.cells[2].innerText);
        row.classList.add("ui-state-highlight");
      };
    }
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
  if (window.location.href === "https://sistemas.detran.pi.gov.br/detran-web/restrito/dashboard.xhtml") {
    let outsideCss = document.createElement("style");
    outsideCss.innerHTML = `
          

          a.button-red, button.button-red{
            background-color: #a83240;
          }

          a.button-green, button.button-green{
            background-color: #1e9600;
          }

          a.button-purple, button.button-purple{
            background-color: #8d0096;
          }



          #sistemas {
            padding-top: 30px
          }
          #upper > div{
            display: none;

          }
          #menuform > div{
            top: 0px;
          }

          #btnPreencheData.button-purple{
            background-color: #8d0096;
          }

          #btnLimpaData.button-purple{
            background-color: #8d0096;
          }

          

          #j_idt75 .ui-inputfield{
            border-width: 2px;
            padding: 4px;

          }

          div.uix-dialog-fluid{
            height: auto !important;
          }

          /*Fix RENAVAM*/
          body > div.layout-wrapper.menu-layout-static.menu-layout-horizontal{
            min-height: fit-content;
            height: 95vh;
          }

          body .ui-button.ui-button-icon-only.actionButtonTable{
            webkit-border-radius: 0%;
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
          }`;
    document.head.append(outsideCss);
    console.log("applied outsideCss");

    waitForKeyElements("iframe", function (elem) {
      //console.log(elem);
      elem.onload = function () {
        console.log("frame detected");
        elem.style.height = "95vh";
        elem.style.overflowX = "hidden";
        elem.style.overflowY = "hidden";
      };
    });
  }
  //Ativa ao carregar o iframe da consulta de placa 402
  if (window.location.href === "https://sistemas.detran.pi.gov.br/renainf-web/restrito/consulta/baseNacional/infracao/porPlaca/consulta.jsf") {
    function buildSummary() {
      let infoSummary = htmlToElements(
        `<div id="infoSummary" class="ui-panelgrid ui-widget ui-panelgrid-blank form-group" style="background-color: #ededed">
        <ul>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-blue" id="linkLicenciamento" target="_blank">
            <span class="ui-button-icon-left ui-icon ui-c ui-icon-search"></span>
            <span class="ui-button-text ui-c">Consultar Licenciamento</span>
          </a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkAtendimento" target="_blank"><span class="ui-button-text ui-c">Consultar Baixa</span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkBatrif" target="_blank"><span class="ui-button-text ui-c">Batrif</span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkPagrif" target="_blank"><span class="ui-button-text ui-c">Pagrif</span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkAutuar" target="_blank"><span class="ui-button-text ui-c">Autuar Infração</span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkPenalizar" target="_blank"><span class="ui-button-text ui-c">Penalizar Infração</span></a></li>
          <li><a class="ui-button ui-widget ui-state-default ui-corner-all button-blue" id="linkOcorrencia" target="_blank"><span class="ui-button-text ui-c">Cadastrar Ocorrência</span></a></li>
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
      color: #fff
    }
    
    div#j_idt75{
      height: auto !important;
    }
    `;
    document.head.append(innerCSS);
    console.log("applied innerCSS");

    function updateInfoInputsValues(dataSource) {
      console.log(dataSource);
      console.log(dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview > .ui-tabs-panels").childNodes);

      dataSource.querySelector("#linkLicenciamento").href = `http://taxas.detran.pi.gov.br/multa/index.jsf?placa=${
        dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt83").value
      }&renavam=${dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt288").value}`;

      dataSource.querySelector("#linkAtendimento").href = `http://atendimento.detran.pi.gov.br/view/pesquisa/pesquisa.jsf?nit=${
        dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt201").value
      }`;
      dataSource.querySelector(
        "#linkBatrif"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/alteracao/atualizarMultasPorPlaca/atualizar.jsf?placa=${
        dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt83").value
      }`;

      dataSource.querySelector(
        "#linkPagrif"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/alteracao/atualizarPagamentosPorPlaca/atualizar.jsf?placa=${
        dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt83").value
      }`;

      dataSource.querySelector(
        "#linkAutuar"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/cadastro/notificacaoAutuacao/createNotificacaoAutuacao.jsf?placa=${
        dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt83").value
      }&auto=${dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt94").value}`;

      dataSource.querySelector(
        "#linkPenalizar"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/cadastro/notificacaoPenalidade/createNotificacaoPenalidade.jsf?placa=${
        dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt83").value
      }&auto=${dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt94").value}`;

      dataSource.querySelector(
        "#linkOcorrencia"
      ).href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/servico/ocorrencia/createOcorrencia.jsf?placa=${
        dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt83").value
      }&auto=${dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt94").value}`;

      dataSource.querySelector("#infoPlacaVeiculo").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt83").value;
      dataSource.querySelector("#infoRenavamVeiculo").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt288").value;
      dataSource.querySelector("#infoNumeroAuto").value = dataSource.querySelector("#formConsulta401\\:j_idt76\\:tabview\\:j_idt94").value;
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

    console.log("Adding WaitForKeyElements on Fines Data Table and Fine Modal");

    waitForKeyElements("#formConsulta402\\:j_idt59_data", function (elem) {
      highlightLines(elem);
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
  //DETALHE MULTA
  if (window.location.host === "taxas.detran.pi.gov.br" && window.location.pathname === "/multa/index.jsf") {
    const urlParams = new URLSearchParams(window.location.search);
    let placa = urlParams.get("placa");
    let renavam = urlParams.get("renavam");

    document.querySelector("#inputPlaca").value = placa;
    document.querySelector("#inputRenavam").value = renavam;

    document.querySelector("#inputCaptcha").focus();
    document.querySelector("#inputCaptcha").onkeypress = function (e) {
      e.preventDefault();
      if (e.key === "Enter") {
        document.querySelector("#botaoConsultarRenavamNovo").click();
      } else {
        e.target.value += e.key;
      }
    };

    waitForKeyElements("#dtMultasWS_data", function (elem) {
      for (let row of elem.rows) {
        if (row.cells[6].innerText.trim() === "TERESINA" && row.cells[8].innerText.trim() === "Registrada") {
          row.cells[10].innerHTML = `<a target='_blank' href='https://sistemas.detran.pi.gov.br/renainf-web/restrito/cadastro/notificacaoAutuacao/createNotificacaoAutuacao.jsf?placa=${
            row.cells[4].querySelector("span").innerText
          }'><i class="fa fa-2x fa-pencil-square-o" aria-hidden="true"></i></a>
                                        <a target='_blank' href='https://sistemas.detran.pi.gov.br/renainf-web/restrito/cadastro/notificacaoPenalidade/createNotificacaoPenalidade.jsf?placa=${
                                          row.cells[4].querySelector("span").innerText
                                        }'><i class="fa fa-2x fa-usd" aria-hidden="true"></i></a>`;
        }
        if (row.cells[6].innerText.trim() === "TERESINA" && row.cells[8].innerText.trim() === "Autuada") {
          row.cells[10].innerHTML = `<a target='_blank' href='https://sistemas.detran.pi.gov.br/renainf-web/restrito/cadastro/notificacaoPenalidade/createNotificacaoPenalidade.jsf?placa=${
            row.cells[4].querySelector("span").innerText
          }'><i class="fa fa-2x fa-usd" aria-hidden="true"></i></a>`;
        }
        if (
          row.cells[6].innerText.trim() === "TERESINA" &&
          (row.cells[8].innerText.trim() === "Penalizada" || row.cells[8].innerText.trim() === "Autuada")
        ) {
          let linkOcorrencia = document.createElement("a");
          linkOcorrencia.target = "_blank";
          linkOcorrencia.href = `https://sistemas.detran.pi.gov.br/renainf-web/restrito/servico/ocorrencia/createOcorrencia.jsf?placa=${
            row.cells[4].querySelector("span").innerText
          }`;
          linkOcorrencia.innerHTML = `<i style="margin-left: 5px;" class="fa fa-2x fa-file-text" aria-hidden="true"></i>`;
          row.cells[10].append(linkOcorrencia);
        }
      }
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
      let dataInfracao = convertFromStringToDate(document.querySelector("#formCreateNotificacaoAutuacao\\:j_idt49").value);
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

  if (window.location.host === "atendimento.detran.pi.gov.br" && window.location.pathname === "/view/pesquisa/pesquisa.jsf") {
    const urlParams = new URLSearchParams(window.location.search);
    let nit = urlParams.get("nit");
    document.querySelector("#j_idt30\\:j_idt53").value = nit;
    document.querySelector("#j_idt30\\:j_idt74").click();
  }

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
    document.querySelector("#formCreateOcorrencia\\:numeroAuto").value = auto;
    document.querySelector("#formCreateOcorrencia\\:placa").value = placa;
    document.querySelector("#formCreateOcorrencia\\:j_idt45").click();

    let botaoNumeroProcesso = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only button-purple" role="button" aria-disabled="false" style="margin-left: 15px;">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-save"></span>
    <span class="ui-button-text ui-c">ui-button</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheJulgamentoAutuador = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-blue" role="button" aria-disabled="false" >
    <span class="ui-button-icon-left ui-icon ui-c fa fa-pencil" alt="Cadastrar Defesa da Autuação"></span>
    <span class="ui-button-text ui-c">Cadastrar Defesa</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheDeferimentoAutuador = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-green" role="button" aria-disabled="false">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-check"></span>
    <span class="ui-button-text ui-c">Deferir Defesa</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheIndeferimentoAutuador = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-red" role="button" aria-disabled="false">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-window-close"></span>
    <span class="ui-button-text ui-c">Indeferir Defesa</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheCancelamentoAutuador = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-blue" role="button" aria-disabled="false">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-file-text-o"></span>
    <span class="ui-button-text ui-c">Cancelar</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheJulgamentoJari = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-blue" role="button" aria-disabled="false">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-pencil"></span>
    <span class="ui-button-text ui-c">Cadastrar Jari</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheIndeferimentoJari = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-red" role="button" aria-disabled="false">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-window-close"></span>
    <span class="ui-button-text ui-c">Indeferir Jari</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    let botaoPreencheDeferimentoJari = htmlToElements(`
    <button id="" name="" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left button-green" role="button" aria-disabled="false">
    <span class="ui-button-icon-left ui-icon ui-c fa fa-check"></span>
    <span class="ui-button-text ui-c">Deferir Jari</span>
    <span class="ink animate" style="height: 32px; width: 32px; top: -1.69098px; left: -1px; pointer-events: none;"></span>
    </button>`);

    botaoNumeroProcesso.onclick = async function (e) {
      e.preventDefault();
      let clipboardText = await navigator.clipboard.readText();
      let regex = new RegExp("([0-9]{5}[.][0-9]{6}[/][0-9]{4}[-][0-9]{2})");
      if (regex.test(clipboardText)) {
        console.log("macth");
        document.querySelector("#formCreateOcorrencia\\:numeroProcesso").value = clipboardText;
        localStorage.setItem("processo", clipboardText);
      } else if (localStorage.getItem("processo")) {
        console.log("no macth");
        document.querySelector("#formCreateOcorrencia\\:numeroProcesso").value = localStorage.getItem("processo");
      }
    };

    botaoPreencheJulgamentoAutuador.onclick = function (e) {
      e.preventDefault();

      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_3").click();

      setTimeout(function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_1").click();
        document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").focus();
      }, 1000);
      //preenche o textarea
      document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "Defesa Prévia em Julgamento";
    };

    botaoPreencheDeferimentoAutuador.onclick = function (e) {
      e.preventDefault();

      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_3").click();

      setTimeout(function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_2").click();
        document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").focus();
      }, 1000);
      //preenche o textarea
      document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "Defesa Prévia Deferida";
    };

    botaoPreencheIndeferimentoAutuador.onclick = function (e) {
      e.preventDefault();

      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_3").click();

      setTimeout(function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_3").click();
        document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").focus();
      }, 1000);
      //preenche o textarea
      document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "Defesa Prévia Indeferida";
    };

    botaoPreencheCancelamentoAutuador.onclick = function (e) {
      e.preventDefault();
      let today = new Date(Date.now());

      document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").value = today.toLocaleDateString();

      document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "Cancelamento por deferimento de recurso";

      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_3").click();

      setTimeout(function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_5").click();
      }, 1000);
      //preenche o textarea
    };

    botaoPreencheJulgamentoJari.onclick = function (e) {
      e.preventDefault();
      //clica no JARI no select
      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_1").click();

      setTimeout(function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_1").click();
        document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").focus();
      }, 1000);
      //preenche o textarea
      document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "recurso de multa em julgamento";
    };

    botaoPreencheDeferimentoJari.onclick = function (e) {
      e.preventDefault();
      //clica no JARI no select
      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_1").click();

      setTimeout(function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_2").click();
        document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").focus();
      }, 1000);
      //preenche o textarea
      document.querySelector("#formCreateOcorrencia\\:observacoes").innerText = "recurso de multa deferido";
    };

    botaoPreencheIndeferimentoJari.onclick = function (e) {
      e.preventDefault();
      //clica no JARI no select
      document.querySelector("#formCreateOcorrencia\\:origemOcorrencia_1").click();

      setTimeout(function () {
        document.querySelector("#formCreateOcorrencia\\:tipoOcorrencia_3").click();
        document.querySelector("#formCreateOcorrencia\\:dataOcorrencia_input").focus();
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

      document.querySelector("#formCreateOcorrencia\\:j_idt117_content > div > div:nth-child(2) > span").append(botaoNumeroProcesso);
      document.querySelector("#formCreateOcorrencia\\:j_idt117_content > div > div:nth-child(2) > span").style = "display:flex";
    });
  }
})();