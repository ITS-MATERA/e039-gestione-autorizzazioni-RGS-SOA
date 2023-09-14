sap.ui.define(
  [
    "sap/ui/model/json/JSONModel",
    "../../../../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../../BaseSoaController",
  ],

  function (JSONModel, formatter, Filter, FilterOperator, BaseSoaController) {
    "use strict";

    return BaseSoaController.extend(
      "rgssoa.controller.soa.create.scenery.Scenario1",
      {
        formatter: formatter,
        onInit: function () {
          this.getRouter()
            .getRoute("soa.create.scenery.Scenario1")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        onNavBack: function () {
          var self = this;
          var oView = self.getView();
          var oWizard = oView.byId("wizScenario1");
          //Load Models
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelSoa = self.getModel("Soa");

          var bWizard1Step1 = oModelStepScenario.getProperty("/wizard1Step1");
          var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
          var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");
          var bWizard4 = oModelStepScenario.getProperty("/wizard4");

          if (bWizard1Step1) {
            history.go(-1);
          } else if (bWizard1Step2) {
            oModelStepScenario.setProperty("/wizard1Step2", false);
            oModelStepScenario.setProperty("/wizard1Step1", true);
            oModelStepScenario.setProperty("/visibleBtnForward", false);
            oModelStepScenario.setProperty("/visibleBtnStart", true);
            oModelSoa.setProperty("/data", []);
            oModelSoa.setProperty("/Zimptot", "0.00");
          } else if (bWizard1Step3) {
            oModelStepScenario.setProperty("/wizard1Step3", false);
            oModelStepScenario.setProperty("/wizard1Step2", true);
          } else if (bWizard2) {
            oModelStepScenario.setProperty("/wizard2", false);
            oModelStepScenario.setProperty("/wizard1Step3", true);
            oWizard.previousStep();
          } else if (bWizard3) {
            oModelStepScenario.setProperty("/wizard3", false);
            oModelStepScenario.setProperty("/wizard2", true);
            oWizard.previousStep();
          } else if (bWizard4) {
            oModelStepScenario.setProperty("/wizard4", false);
            oModelStepScenario.setProperty("/wizard3", true);
            oModelStepScenario.setProperty("/visibleBtnForward", true);
            oModelStepScenario.setProperty("/visibleBtnSave", false);
            oWizard.previousStep();
          }
        },

        onNavForward: function () {
          var self = this;
          var oWizard = self.getView().byId("wizScenario1");
          var oModelStepScenario = self.getModel("StepScenario");

          var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
          var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");

          if (bWizard1Step2) {
            if (self.checkPosizioniScenario1()) {
              oModelStepScenario.setProperty("/wizard1Step2", false);
              oModelStepScenario.setProperty("/wizard1Step3", true);
            }
          } else if (bWizard1Step3) {
            oModelStepScenario.setProperty("/wizard1Step3", false);
            oModelStepScenario.setProperty("/wizard2", true);
            self.setDataBenficiario();
            self.setModalitaPagamento();
            self.setIbanBeneficiario();
            self.setDatiVaglia();
            self.getSedeBeneficiario();
            self.setInpsData();
            oWizard.nextStep();
          } else if (bWizard2) {
            oModelStepScenario.setProperty("/wizard2", false);
            oModelStepScenario.setProperty("/wizard3", true);
            oWizard.nextStep();
          } else if (bWizard3) {
            if (self.checkClassificazione()) {
              oModelStepScenario.setProperty("/wizard3", false);
              oModelStepScenario.setProperty("/wizard4", true);
              oModelStepScenario.setProperty("/visibleBtnForward", false);
              oModelStepScenario.setProperty("/visibleBtnSave", true);
              this._setCausalePagamento();
              oWizard.nextStep();
            }
          }
        },

        //#region WIZARD 1

        onStart: function () {
          this._getQuoteDocumentiList();
        },

        onSelectedItem: function (oEvent) {
          var self = this;
          var bSelected = oEvent.getParameter("selected");
          //Load Model
          var oModelDocumenti = self.getModel("QuoteDocumenti");
          var oModelSoa = self.getModel("Soa");
          //Load Component
          var oButtonCalculate = self.getView().byId("btnCalculate");

          var aSelectedItems = oModelSoa.getProperty("/data");
          var aListItems = oEvent.getParameter("listItems");

          aListItems.map((oListItem) => {
            var oSelectedItem = oModelDocumenti.getObject(
              oListItem.getBindingContextPath()
            );

            if (bSelected) {
              aSelectedItems.push(oSelectedItem);
            } else {
              var iIndex = aSelectedItems.findIndex((obj) => {
                return (
                  obj.Bukrs === oSelectedItem.Bukrs &&
                  obj.Zposizione === oSelectedItem.Zposizione &&
                  obj.Znumliq === oSelectedItem.Znumliq &&
                  obj.Zversione === oSelectedItem.Zversione &&
                  obj.ZversioneOrig === oSelectedItem.ZversioneOrig
                );
              });

              if (iIndex > -1) {
                aSelectedItems.splice(iIndex, 1);
              }
            }
          });

          oModelSoa.setProperty("/data", aSelectedItems);
          oButtonCalculate.setVisible(aSelectedItems.length !== 0);
          oModelSoa.setProperty("/Zimptot", "0.00");
        },

        onCalculate: function () {
          var self = this;
          var oModelSoa = self.getModel("Soa");
          var aListRiepilogo = oModelSoa.getProperty("/data");
          var fTotal = 0;

          aListRiepilogo.map((oSelectedItem) => {
            fTotal += parseFloat(oSelectedItem?.Zimpdaord);
          });

          oModelSoa.setProperty("/Zimptot", fTotal.toFixed(2));
        },

        //#region SELECTION CHANGE

        onImpDaOrdinareChange: function (oEvent) {
          var self = this;
          //Load Component
          var oTableDocumenti = self.getView().byId("tblQuoteDocumentiScen1");
          //Load Models
          var oTableModelDocumenti = oTableDocumenti.getModel("QuoteDocumenti");
          var oModelSoa = self.getModel("Soa");

          var sValue = oEvent.getParameter("value");
          oModelSoa.setProperty("/Zimptot", "0.00");

          if (sValue) {
            oTableModelDocumenti.getObject(
              oEvent.getSource().getParent().getBindingContextPath()
            ).Zimpdaord = parseFloat(sValue).toFixed(2);
          } else {
            oTableModelDocumenti.getObject(
              oEvent.getSource().getParent().getBindingContextPath()
            ).Zimpdaord = "0.00";
          }
        },

        //#endregion

        //#region PRIVATE METHODS

        _onObjectMatched: function (oEvent) {
          var self = this;
          self.resetWizard("wizScenario1");
          //Load Models
          var oModel = self.getModel();
          var oParameters = oEvent.getParameter("arguments");
          var sPath = self
            .getModel()
            .createKey("ChiaveAutorizzazioneSet", oParameters);

          oModel.read("/" + sPath, {
            success: function (data, oResponse) {
              oModelSoa.setProperty("/Gjahr", data?.Gjahr);
              oModelSoa.setProperty("/Zzamministr", data?.Zzamministr);
              oModelSoa.setProperty("/ZufficioCont", data?.ZufficioCont);
              oModelSoa.setProperty("/Fipos", data?.Fipos);
              oModelSoa.setProperty("/Fistl", data?.Fistl);
              oModelSoa.setProperty("/Zchiaveaut", data?.Zchiaveaut);
              oModelSoa.setProperty("/Ztipodisp2", data?.Ztipodisp2);
              oModelSoa.setProperty("/Zdesctipodisp2", data?.Zdesctipodisp2);
              oModelSoa.setProperty("/Ztipodisp3", data?.Ztipodisp3);
              oModelSoa.setProperty("/Zdesctipodisp3", data?.Zdesctipodisp3);
              oModelSoa.setProperty("/Zdesctipodisp3", data?.Zdesctipodisp3);
              oModelSoa.setProperty("/Zimpaut", data?.Zimpaut);
              oModelSoa.setProperty("/Zimpdispaut", data?.Zimpdispaut);
              oModelSoa.setProperty("/Zfunzdel", data?.Zfunzdel);
              oModelSoa.setProperty("/Zdescriz", data?.Zdescriz);
            },
            error: function () {},
          });

          var oModelFilterDocumenti = new JSONModel({
            CodRitenuta: "",
            DescRitenuta: "",
            CodEnte: "",
            DescEnte: "",
            QuoteEsigibili: true,
            DataEsigibilitaFrom: "",
            DataEsigibilitaTo: "",
            TipoBeneficiario: "",
            Lifnr: "",
            Gjahr: "",
            Lifnr: "",
            Zuffliq: [],
            ZnumliqFrom: "",
            ZnumliqTo: "",
            ZdescProsp: "",
            UfficioContabile: "",
            UfficioPagatore: "",
            AnnoRegDocumento: [],
            NumRegDocFrom: "",
            NumRegDocTo: "",
            AnnoDocBeneficiario: [],
            NDocBen: [],
            Cig: "",
            Cup: "",
            ScadenzaDocFrom: null,
            ScadenzaDocTo: null,
          });

          var oModelSoa = new JSONModel({
            EnableEdit: true,
            visibleBtnEdit: false,
            //Dati SOA (Parte celeste in alto)
            Gjahr: "", //Esercizio di gestione
            Zimptot: "0.00", //Importo
            Zzamministr: "", //Amministrazione
            ZufficioCont: "", //Ufficio Contabile
            NameFirst: "", //Nome Beneficiairo
            NameLast: "", //Cognome Beneficiario
            ZzragSoc: "", //Ragione Sociale
            TaxnumCf: "", //Codice Fiscale
            TaxnumPiva: "", //Partita Iva
            Fipos: "", //Posizione Finanziaria
            Fistl: "", //Struttura Amministrativa Responsabile
            Lifnr: "", //Beneficiario
            Witht: "", //Codice Ritenuta
            Text40: "", //Descrizione Ritenuta
            ZzCebenra: "", //Codice Ente Beneficiario
            ZzDescebe: "", //Descrizione Ente Beneficiario
            Zchiaveaut: "", //Identificativo Autorizzazione
            Ztipodisp2: "", //Codice Tipologia Autorizzazione
            Zdesctipodisp2: "", //Tipologia Autorizzazione
            Ztipodisp3: "", //Codice Tipologia Disponibilità
            Zdesctipodisp3: "", //Tipologia Disponibilità
            Zimpaut: "", //Importo autorizzato
            Zimpdispaut: "", //Disponibilità autorizzazione
            Zztipologia: "", //Tipololgia SOA
            DescZztipologia: "", //Descrizione Tipologia SOA
            Zfunzdel: "", //Codice FD
            Zdescriz: "", // Descrizione Codice FD
            ZspecieSop: "", //Specie SOA
            DescZspecieSop: "", //Descrizione Specie SOA
            Zsede: "", //Sede Estera
            Zdenominazione: "", //Descrizione Sede Estera
            Zidsede: "", //Sede Beneficiario
            Zwels: "", //Codice Modalità Pagamento
            ZCausaleval: "", //Causale Valutaria
            Swift: "", //BIC
            Zcoordest: "", //Cordinate Estere
            Iban: "", //IBAN
            Zmotivaz: "", //Motivazione cambio IBAN
            Ztipofirma: "", //Tipologia Firma
            ZpersCognomeQuiet1: "", //Cognome primo quietanzante
            ZpersCognomeQuiet2: "", //Cognome secondo quietanzante
            ZpersNomeQuiet1: "", //Nome primo quietanzante
            ZpersNomeQuiet2: "", //Nome secondo quietanzante
            ZpersNomeVaglia: "", //Nome persona vagliaesigibilità
            ZpersCognomeVaglia: "", //Cognome persona vaglia
            Zstcd1: "", //Codice Fiscale Utilizzatore
            Zstcd12: "", //Codice fiscale secondo quietanzante
            Zstcd13: "", //Codice fiscale destinatario vaglia
            Zcodprov: "", //INPS - Codice Provenienza
            Zcfcommit: "", //INPS - Codice Fiscale Committente
            Zcodtrib: "", //INPS - Codice tributo
            Zperiodrifda: null, //INPS - Periodo riferimento da
            Zperiodrifa: null, //INPS - Periodo riferimento a
            Zcodinps: "", //INPS - Matricola INPS/Codice INPS/Filiale azienda
            Zcfvers: "", //INPS - Codice Fiscale Versante
            Zcodvers: "", //INPS - Codice Versante
            Ztipopag: "1", //Tipo Pagamento
            Zcausale: "", //Causale di pagamento
            ZE2e: "", //E2E ID
            Zlocpag: "", //Località pagamento
            Zzonaint: "", //Zona di intervento
            Znumprot: "", //Numero protocollo
            Zdataprot: null, //Data protocollo
            Zdataesig: null, //Data esigibilità
            Bukrs: "",
            Hkont: "",
            Kostl: "",
            Zchiavesop: "",
            ZcodStatosop: "",
            Zdatasop: null,
            Znumsop: "",
            Zricann: "",
            ZstatTest: "",
            Zstep: "",
            Ztipososp: "2",
            Zutenza: "",
            data: [],
            Classificazione: [], //Classificazioni
            Messaggio: [], //Messaggi di errore

            BuType: "", //Tipologia Persona
            Taxnumxl: "", //Codice Fiscale Estero

            Zdurc: "", //Numero identificativo Durc
            ZfermAmm: "", //Fermo amministrativo
            Zdescwels: "", //Descrizione Modalità Pagamento
            Banks: "", //Paese di Residenza (Primi 2 digit IBAN)
            ZDesccauval: "", //Descrizione Causale Valutaria

            Zqindiriz: "", //Indirizzo primo quietanzante
            Zqcitta: "", //Citta primo quietanzantez
            Zqcap: "", //Cap primo quietanzante
            Zqprovincia: "", //Provincia primo quietanzante
            Zqindiriz12: "", //Indirizzo secondo quietanzante
            Zqcitta12: "", //Citta secondo quietanzante
            Zqcap12: "", //Cap secondo quietanzante
            Zqprovincia12: "", //Provincia secondo quietanzante
            Stras: "", //Via,numero civico
            Ort01: "", //Località
            Regio: "", //Regione
            Pstlz: "", //Codice di avviamento postale
            Land1: "", //Codice paese
            FlagInpsEditabile: false,
          });

          var oModelClassificazione = new JSONModel({
            Cos: [],
            Cpv: [],
            Cig: [],
            Cup: [],
            ImpTotAssociareCos: "0.00",
            ImpTotAssociareCpv: "0.00",
            ImpTotAssociareCig: "0.00",
            ImpTotAssociareCup: "0.00",
          });

          var oModelStepScenario = new JSONModel({
            wizard1Step1: true,
            wizard1Step2: false,
            wizard1Step3: false,
            wizard2: false,
            wizard3: false,
            wizard4: false,
            visibleBtnForward: false,
            visibleBtnStart: true,
            visibleBtnSave: false,
          });

          var oModelUtility = new JSONModel({
            EnableEdit: true,
            DetailFromFunction: true,
          });

          oModel.read("/" + "PrevalUfficioContabileSet", {
            success: function (data) {
              oModelFilterDocumenti.setProperty(
                "/UfficioContabile",
                data?.results[0]?.Fkber
              );
              oModelFilterDocumenti.setProperty(
                "/UfficioPagatore",
                data?.results[0]?.Fkber
              );
            },
            error: function (error) {},
          });

          self.setModel(oModelFilterDocumenti, "FilterDocumenti");
          self.setModel(oModelSoa, "Soa");
          self.setModel(oModelClassificazione, "Classificazione");
          self.setModel(oModelUtility, "Utility");
          self.setModel(oModelStepScenario, "StepScenario");
          self.getLogModel();
        },

        _getQuoteDocumentiList: function () {
          var self = this;
          var oView = self.getView();
          //Load Model
          var oDataModel = self.getModel();
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelSoa = self.getModel("Soa");
          //Load Component
          var oTableDocumenti = oView.byId("tblQuoteDocumentiScen1");
          var oPanelCalculator = oView.byId("pnlCalculatorList");

          var aListRiepilogo = oModelSoa.getProperty("/data");
          var aFilters = this.setFiltersScenario1();

          //Check BEETWEN filters
          var sIntervalFilter = self.checkBTFilter(aFilters);
          if (sIntervalFilter) {
            sap.m.MessageBox.error(sIntervalFilter);
            self.clearModel("QuoteDocumenti");
            return;
          }

          oView.setBusy(true);

          oDataModel.read("/" + "QuoteDocumentiSet", {
            filters: aFilters,
            success: function (data, oResponse) {
              if (!self.setResponseMessage(oResponse)) {
                oModelStepScenario.setProperty("/wizard1Step1", false);
                oModelStepScenario.setProperty("/wizard1Step2", true);
                oModelStepScenario.setProperty("/visibleBtnForward", true);
                oModelStepScenario.setProperty("/visibleBtnStart", false);
              }
              self.setModelCustom("QuoteDocumenti", data.results);

              oPanelCalculator.setVisible(data.results.length !== 0);

              if (data.results !== 0) {
                data.results.map((oItem, iIndex) => {
                  //Vengono selezionati i record quando viene caricata l'entità
                  aListRiepilogo.map((oSelectedItem) => {
                    if (
                      oItem.Bukrs === oSelectedItem.Bukrs &&
                      oItem.Znumliq === oSelectedItem.Znumliq &&
                      oItem.Zposizione === oSelectedItem.Zposizione &&
                      oItem.Zversione === oSelectedItem.Zversione &&
                      oItem.ZversioneOrig === oSelectedItem.ZversioneOrig
                    ) {
                      oTableDocumenti.setSelectedItem(
                        oTableDocumenti.getItems()[iIndex]
                      );
                    }
                  });
                });
              }
              oView.setBusy(false);
            },
            error: function (error) {
              oView.setBusy(false);
            },
          });
        },

        //#endregion PRIVATE METHODS

        //#region PRIVATE METHODS

        _setCausalePagamento: function () {
          var self = this;
          var oModelSoa = self.getModel("Soa");

          var aListDocumenti = oModelSoa.getProperty("/data");

          var sZcausale = "";
          aListDocumenti.map((oDocumento) => {
            sZcausale =
              sZcausale +
              " " +
              oDocumento.Belnr +
              " " +
              formatter.dateWithPoints(oDocumento.Bldat);
          });

          oModelSoa.setProperty("/Zcausale", sZcausale);
        },

        //#endregion

        //#endregion
      }
    );
  }
);
