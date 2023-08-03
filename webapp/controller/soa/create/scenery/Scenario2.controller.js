sap.ui.define(
  [
    "../../BaseSoaController",
    "sap/ui/model/json/JSONModel",
    "../../../../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseSoaController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    var bPrevalLoaded = false;
    const PAGINATOR_MODEL = "paginatorModel";
    return BaseSoaController.extend(
      "rgssoa.controller.soa.create.scenery.Scenario2",
      {
        formatter: formatter,

        onInit: function () {
          var self = this;
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

          var oModelSoa = new JSONModel({
            EnableEdit: true,
            /**   Scenario    */
            Ztipopag: "2", //Tipo Pagamento

            /**   Dati SOA (Parte celeste in alto)   */
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
            Zdescriz: "", //TODO - Open Point - Descrizione Codice FD
            ZspecieSop: "", //Specie SOA
            DescZspecieSop: "", //Descrizione Specie SOA

            data: [], //Quote Documenti

            /**   WIZARD 2 - Beneficiario SOA   */
            BuType: "", //Tipologia Persona
            Taxnumxl: "", //Codice Fiscale Estero
            Zsede: "", //Sede Estera
            Zdenominazione: "", //Descrizione Sede Estera
            Zdurc: "", //Numero identificativo Durc
            ZfermAmm: "", //Fermo amministrativo

            /**   WIZARD 2 - Modalità Pagamento   */
            Zwels: "", //Codice Modalità Pagamento
            ZCausaleval: "", //Causale Valutaria
            Swift: "", //BIC
            Zcoordest: "", //Cordinate Estere
            Iban: "", //IBAN
            Zmotivaz: "", //Motivazione cambio IBAN
            Zdescwels: "", //Descrizione Modalità Pagamento
            Banks: "", //Paese di Residenza (Primi 2 digit IBAN)
            ZDesccauval: "", //Descrizione Causale Valutaria

            /**   WIZARD 2 - Dati Quietanzante/Destinatario Vaglia    */
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
            Zqindiriz: "", //Indirizzo primo quietanzante
            Zqcitta: "", //Citta primo quietanzantez
            Zqcap: "", //Cap primo quietanzante
            Zqprovincia: "", //Provincia primo quietanzante
            Zqindiriz12: "", //Indirizzo secondo quietanzante
            Zqcitta12: "", //Citta secondo quietanzante
            Zqcap12: "", //Cap secondo quietanzante
            Zqprovincia12: "", //Provincia secondo quietanzante

            /**   WIZARD 2 - INPS    */
            Zcodprov: "", //INPS - Codice Provenienza
            Zcfcommit: "", //INPS - Codice Fiscale Committente
            Zcodtrib: "", //INPS - Codice tributo
            Zperiodrifda: "", //INPS - Periodo riferimento da
            Zperiodrifa: "", //INPS - Periodo riferimento a
            Zcodinps: "", //INPS - Matricola INPS/Codice INPS/Filiale azienda
            Zcfvers: "", //INPS - Codice Fiscale Versante
            Zcodvers: "", //INPS - Codice Versante
            FlagInpsEditabile: false,

            /**   WIZARD 2 - Sede Beneficiario */
            Zidsede: "", //Sede
            Stras: "", //Via,numero civico
            Ort01: "", //Località
            Regio: "", //Regione
            Pstlz: "", //Codice di avviamento postale
            Land1: "", //Codice paese

            /**   WIZARD 3    */
            Classificazione: [], //Classificazioni

            /**   WIZARD 4    */
            Zcausale: "", //Causale di pagamento
            ZE2e: "", //E2E ID
            Zlocpag: "", //Località pagamento
            Zzonaint: "", //Zona di intervento
            Znumprot: "", //Numero protocollo
            Zdataprot: "", //Data protocollo
            Zdataesig: "", //TODO - Punto Aperto - Data esigibilità
          });

          var oModelPaginator = new JSONModel({
            btnPrevEnabled: false,
            btnFirstEnabled: false,
            btnNextEnabled: false,
            btnLastEnabled: false,
            recordForPageEnabled: false,
            currentPageEnabled: true,
            numRecordsForPage: 10,
            currentPage: 1,
            maxPage: 1,
            paginatorSkip: 0,
            paginatorClick: 0,
            paginatorTotalPage: 1,
          });

          var oModelClassificazione = new JSONModel({
            CodiceGestionale: [],
            Cpv: [],
            Cig: [],
            Cup: [],
            ImpTotAssociareCodiceGestionale: "0.00",
            ImpTotAssociareCpv: "0.00",
            ImpTotAssociareCig: "0.00",
            ImpTotAssociareCup: "0.00",
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
          self.setModel(oModelFilterDocumenti, "FilterDocumenti");

          var oModelNewAnagraficaBen = new JSONModel({
            Beneficiario: {
              FlagSife: true,
              Lifnr: "",
              SCountry: "",
              SType: "",
              SRagsoc: "",
              SName: "",
              SSurname: "",
              SStreet: "",
              SHousenum: "",
              SCity: "",
              SRegion: "",
              SPstlz: "",
              SSedelegale: false,
              SStcd1: "",
              SStcd2: "",
              SStcd3: "",

              DescPaeseResidenza: "",
              DescProvincia: "",
            },
            ModalitaPagamento: {
              SZwels: "",
              Zdescwels: "",
              SType: "",
              SCountryRes: "",
              SIban: "",
              Ztipofirma: "",
              Swift: "",
              Zcoordest: "",
              ValidFromDats: "",
              ValidToDats: "",
              Gjahr: "",
              Zcapo: "",
              Zcapitolo: "",
              Zarticolo: "",
              Zconto: "",
              ZdescConto: "",
              Seqnr: "",

              DescPaeseResidenza: "",
            },
            Quietanzante: {
              Zqnome: "",
              Zqcognome: "",
              Zqqualifica: "",
              Stcd1: "",
              Zqdatanasc: "",
              Zqluogonasc: "",
              Zqprovnasc: "",
              Zqindiriz: "",
              Zqcitta: "",
              Zqcap: "",
              Zqprovincia: "",
              Zqtelefono: "",
            },
            Destinatario: {
              Zqnomedest: "",
              Zqcognomedest: "",
              Zqqualificadest: "",
              Stcd1Dest: "",
              Zqdatanascdest: "",
              Zqluogonascdest: "",
              Zqprovnascdest: "",
              Zqindirizdest: "",
              Zqcittadest: "",
              Zqcapdest: "",
              Zqprovinciadest: "",
              Zqtelefonodest: "",
            },
            VisibleNewBeneficiario: false,
            VisibleNewModalitaPagamento: false,
            VisibleNewQuietanzante: false,
            VisibleNewDestinatario: false,
            TitleDialogNewModPag: "Inserisci Modalità di Pagamento",
            TitleDialogNewBeneficiario: "Dati Anagrafica Beneficiario",
            BeneficiarioCreated: false,
          });
          self.setModel(oModelNewAnagraficaBen, "NewAnagraficaBen");

          self.setModel(oModelSoa, "Soa");
          self.setModel(oModelPaginator, PAGINATOR_MODEL);
          self.setModel(oModelStepScenario, "StepScenario");
          self.setModel(oModelClassificazione, "Classificazione");

          //TODO - Inserire l'acceptOnlyImport anche per CIG e CUP
          this.getRouter()
            .getRoute("soa.create.scenery.Scenario2")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        onBeforeRendering: function () {
          var self = this;
          var oDataModel = self.getModel();
          var oModelFilter = self.getModel("FilterDocumenti");

          if (!bPrevalLoaded) {
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + "PrevalUfficioContabileSet", {
                  success: function (data) {
                    oModelFilter.setProperty(
                      "/UfficioContabile",
                      data?.results[0]?.Fkber
                    );
                    oModelFilter.setProperty(
                      "/UfficioPagatore",
                      data?.results[0]?.Fkber
                    );
                    bPrevalLoaded = true;
                  },
                  error: function (error) {},
                });
              });
          }
        },

        onNavBack: function () {
          var self = this;
          var oView = self.getView();
          var oWizard = oView.byId("wizScenario2");
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
            self.resetModelSoa("2", true);
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
          var oWizard = self.getView().byId("wizScenario2");
          var oModelStepScenario = self.getModel("StepScenario");

          var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
          var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");

          if (bWizard1Step2) {
            //TODO - Riaggiungere

            // if (this._checkQuoteDocumenti()) {
            //   oModelStepScenario.setProperty("/wizard1Step2", false);
            //   oModelStepScenario.setProperty("/wizard1Step3", true);
            // }
            oModelStepScenario.setProperty("/wizard1Step2", false);
            oModelStepScenario.setProperty("/wizard1Step3", true);
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
            // TODO - Decommentare
            // if (this._checkClassificazione()) {
            oModelStepScenario.setProperty("/wizard3", false);
            oModelStepScenario.setProperty("/wizard4", true);
            oModelStepScenario.setProperty("/visibleBtnForward", false);
            oModelStepScenario.setProperty("/visibleBtnSave", true);
            this._setCausalePagamento();
            oWizard.nextStep();
            // }
          }
        },

        //#region WIZARD 1

        onStart: function () {
          this._setPaginatorProperties();
          this._getQuoteDocumentiList();
        },

        onSelectedItem: function (oEvent) {
          var self = this;
          var bSelected = oEvent.getParameter("selected");
          //Load Model
          var oModelDocumenti = self.getModel("QuoteDocumentiScen2");
          var oModelSoa = self.getModel("Soa");
          //Load Component
          var oTableDocumenti = self.getView().byId("tblQuoteDocumentiScen2");
          var oButtonCalculate = self.getView().byId("btnCalculate");

          var aListRiepilogo = oModelSoa.getProperty("/data");
          var aTableItems = oTableDocumenti.getItems();
          var aSelectedItems = oTableDocumenti.getSelectedItems();

          if (bSelected) {
            aSelectedItems.map((oSelectedItem) => {
              //Prendo i record selezionati
              var oItem = oModelDocumenti.getObject(
                oSelectedItem.getBindingContextPath()
              );

              var bExist = false;
              //Controllo se esiste già in lista, l'includes non funziona non so perchè
              aListRiepilogo.map((oRecord) => {
                if (oRecord.Docid === oItem.Docid) {
                  bExist = true;
                }
              });
              //Se non esiste lo aggiungo alla lista di riepilogo
              !bExist && aListRiepilogo.push(oItem);
            });
          } else {
            var aNotSelectedItems = [];

            //Inserisco in un array temporaneo i record della pagina corrente della tabella
            //che non sono selezionati
            aTableItems.map((oTableItem) => {
              !aSelectedItems.includes(oTableItem) &&
                aNotSelectedItems.push(oTableItem);
            });

            //Controllo l'esistenza dei record non selezionati nell'array dei record selezionati
            //Se ci sono record che corrispondono vengono eliminati
            aNotSelectedItems.map((oNotSelectedItem) => {
              //L'input dell'Importo da Ordinare dei record non selezionati viene rimesso
              //a editabile
              var oItem = oModelDocumenti.getObject(
                oNotSelectedItem.getBindingContextPath()
              );
              aListRiepilogo = aListRiepilogo.filter((oSelectedItem) => {
                return !(oSelectedItem.Docid === oItem.Docid);
              });
            });
          }

          oButtonCalculate.setVisible(aListRiepilogo.length !== 0);
          oModelSoa.setProperty("/Zimptot", "0.00");
          oModelSoa.setProperty("/data", aListRiepilogo);
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

        //#region PAGINATOR
        onFirstPaginator: function () {
          var self = this;

          self.getFirstPaginator(PAGINATOR_MODEL);
          this._getQuoteDocumentiList();
        },

        onLastPaginator: function () {
          var self = this;

          self.getLastPaginator(PAGINATOR_MODEL);
          this._getQuoteDocumentiList();
        },

        onChangePage: function (oEvent) {
          var self = this;

          self.getChangePage(oEvent, PAGINATOR_MODEL);
          this._getQuoteDocumentiList();
        },
        //#endregion PAGINATOR

        //#region SELECTION CHANGE

        onImpDaOrdinareChange: function (oEvent) {
          var self = this;
          //Load Component
          var oTableDocumenti = self.getView().byId("tblQuoteDocumentiScen2");
          //Load Models
          var oTableModelDocumenti = oTableDocumenti.getModel(
            "QuoteDocumentiScen2"
          );
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
          //Load Models
          var oDataModel = self.getModel();
          var oModelSoa = self.getModel("Soa");
          var oParameters = oEvent.getParameter("arguments");
          var sPath = self
            .getModel()
            .createKey("ChiaveAutorizzazioneSet", oParameters);

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + sPath, {
                success: function (data, oResponse) {
                  oModelSoa.setProperty("/Gjahr", data?.Gjahr);
                  oModelSoa.setProperty("/Zzamministr", data?.Zzamministr);
                  oModelSoa.setProperty("/ZufficioCont", data?.ZufficioCont);
                  oModelSoa.setProperty("/Fipos", data?.Fipos);
                  oModelSoa.setProperty("/Fistl", data?.Fistl);
                  oModelSoa.setProperty("/Zchiaveaut", data?.Zchiaveaut);
                  oModelSoa.setProperty("/Ztipodisp2", data?.Ztipodisp2);
                  oModelSoa.setProperty(
                    "/Zdesctipodisp2",
                    data?.Zdesctipodisp2
                  );
                  oModelSoa.setProperty("/Ztipodisp3", data?.Ztipodisp3);
                  oModelSoa.setProperty(
                    "/Zdesctipodisp3",
                    data?.Zdesctipodisp3
                  );
                  oModelSoa.setProperty(
                    "/Zdesctipodisp3",
                    data?.Zdesctipodisp3
                  );
                  oModelSoa.setProperty("/Zimpaut", data?.Zimpaut);
                  oModelSoa.setProperty("/Zimpdispaut", data?.Zimpdispaut);
                  oModelSoa.setProperty("/Zfunzdel", data?.Zfunzdel);
                  oModelSoa.setProperty("/Zdescriz", data?.Zdescriz);
                },
                error: function () {},
              });
            });
        },

        _getQuoteDocumentiFilters: function () {
          var self = this;
          var aFilters = [];
          var oModelSoa = self.getModel("Soa");
          var oModelFilter = self.getModel("FilterDocumenti");

          //Estremi di ricerca per Ritenute
          self.setFilterEQ(
            aFilters,
            "CodRitenuta",
            oModelFilter.getProperty("/CodRitenuta")
          );
          self.setFilterEQ(
            aFilters,
            "CodEnte",
            oModelFilter.getProperty("/CodEnte")
          );
          self.setFilterEQ(
            aFilters,
            "Zquoteesi",
            oModelFilter.getProperty("/QuoteEsigibili")
          );
          self.setFilterBT(
            aFilters,
            "DateEsigibilita",
            oModelFilter.getProperty("/DataEsigibilitaFrom"),
            oModelFilter.getProperty("/DataEsigibilitaTo")
          );

          //Estremi di ricerca per Beneficiario
          self.setFilterEQ(
            aFilters,
            "Lifnr",
            oModelFilter.getProperty("/Lifnr")
          );

          //Estremi di ricerca per Documento di Costo
          self.setFilterEQ(
            aFilters,
            "UfficioContabile",
            oModelFilter.getProperty("/UfficioContabile")
          );
          self.setFilterEQ(
            aFilters,
            "AreaFunz",
            oModelFilter.getProperty("/UfficioContabile")
          );
          self.setFilterEQ(
            aFilters,
            "UfficioPagatore",
            oModelFilter.getProperty("/UfficioPagatore")
          );
          var aAnnoRegDocumento = oModelFilter.getProperty("/AnnoRegDocumento");
          aAnnoRegDocumento.map((sAnno) => {
            self.setFilterEQ(aFilters, "AnnoRegDocumento", sAnno);
          });
          self.setFilterBT(
            aFilters,
            "Belnr",
            oModelFilter.getProperty("/NumRegDocFrom"),
            oModelFilter.getProperty("/NumRegDocTo")
          );
          var aAnnoDocBeneficiario = oModelFilter.getProperty(
            "/AnnoDocBeneficiario"
          );
          aAnnoDocBeneficiario.map((sAnno) => {
            self.setFilterEQ(aFilters, "AnnoDocBeneficiario", sAnno);
          });
          var aNDocBen = oModelFilter.getProperty("/NDocBen");
          aNDocBen.map((sNDocBen) => {
            self.setFilterEQ(aFilters, "NDocBen", sNDocBen);
          });
          self.setFilterEQ(aFilters, "Cig", oModelFilter.getProperty("/Cig"));
          self.setFilterEQ(aFilters, "Cup", oModelFilter.getProperty("/Cup"));
          self.setFilterBT(
            aFilters,
            "ScadenzaDoc",
            oModelFilter.getProperty("/ScadenzaDocFrom"),
            oModelFilter.getProperty("/ScadenzaDocTo")
          );

          self.setFilterEQ(aFilters, "Gjahr", oModelSoa.getProperty("/Gjahr"));
          self.setFilterEQ(aFilters, "Fipex", oModelSoa.getProperty("/Fipos"));
          self.setFilterEQ(aFilters, "Fistl", oModelSoa.getProperty("/Fistl"));
          return aFilters;
        },

        _setPaginatorProperties: function () {
          var self = this;
          var oDataModel = self.getModel();
          var aFilters = this._getQuoteDocumentiFilters();

          //Check BEETWEN filters
          if (self.checkBTFilter(aFilters)) {
            return;
          }

          var oPaginatorModel = self.getModel(PAGINATOR_MODEL);
          self.resetPaginator(oPaginatorModel);
          var iNumRecordsForPage =
            oPaginatorModel.getProperty("/numRecordsForPage");

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + "QuoteDocumentiScen2Set" + "/$count", {
                filters: aFilters,
                success: function (data) {
                  self.setPaginatorProperties(
                    oPaginatorModel,
                    data,
                    iNumRecordsForPage
                  );
                },
                error: function () {},
              });
            });
        },

        _getQuoteDocumentiList: function () {
          var self = this;
          var oView = self.getView();
          //Load Model
          var oDataModel = self.getModel();
          var oModelStepScenario = self.getModel("StepScenario");
          var oPaginatorModel = self.getModel(PAGINATOR_MODEL);
          var oModelSoa = self.getModel("Soa");
          //Load Component
          var oPanelPaginator = oView.byId("pnlPaginator");
          var oTableDocumenti = oView.byId("tblQuoteDocumentiScen2");
          var oPanelCalculator = oView.byId("pnlCalculatorList");

          var aListRiepilogo = oModelSoa.getProperty("/data");
          var aFilters = this._getQuoteDocumentiFilters();
          var urlParameters = {
            $top: oPaginatorModel.getProperty("/numRecordsForPage"),
            $skip: oPaginatorModel.getProperty("/paginatorSkip"),
          };

          //Check BEETWEN filters
          var sIntervalFilter = self.checkBTFilter(aFilters);
          if (sIntervalFilter) {
            sap.m.MessageBox.error(sIntervalFilter);
            self.clearModel("QuoteDocumentiScen2");
            return;
          }

          oView.setBusy(true);

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + "QuoteDocumentiScen2Set", {
                urlParameters: urlParameters,
                filters: aFilters,
                success: function (data, oResponse) {
                  if (!self.setResponseMessage(oResponse)) {
                    oModelStepScenario.setProperty("/wizard1Step1", false);
                    oModelStepScenario.setProperty("/wizard1Step2", true);
                    oModelStepScenario.setProperty("/visibleBtnForward", true);
                    oModelStepScenario.setProperty("/visibleBtnStart", false);
                  }
                  self.setModelCustom("QuoteDocumentiScen2", data.results);

                  oPanelPaginator.setVisible(data.results.length !== 0);
                  oPanelCalculator.setVisible(data.results.length !== 0);

                  if (data.results !== 0) {
                    data.results.map((oItem, iIndex) => {
                      //Vengono selezionati i record quando viene caricata l'entità
                      aListRiepilogo.map((oSelectedItem) => {
                        if (oItem.Docid === oSelectedItem.Docid) {
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
            });
        },

        _checkQuoteDocumenti: function () {
          var self = this;
          var oModelSoa = self.getModel("Soa");
          var oBundle = self.getResourceBundle();

          var fImpTot = parseFloat(oModelSoa.getProperty("/Zimptot"));
          var fImpDispAutorizzazione = parseFloat(
            oModelSoa.getProperty("/Zimpdispaut")
          );

          if (fImpTot > fImpDispAutorizzazione) {
            sap.m.MessageBox.error(
              oBundle.getText("msgImpTotGreaterImpDispAut")
            );
            return false;
          }

          if (
            oModelSoa.getProperty("/data").length === 0 ||
            oModelSoa.getProperty("/Zimptot") === "0.00"
          ) {
            sap.m.MessageBox.error(oBundle.getText("msgNoDocuments"));
            return false;
          }

          return true;
        },

        //#endregion

        //#endregion

        //#region WIZARD 4

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
