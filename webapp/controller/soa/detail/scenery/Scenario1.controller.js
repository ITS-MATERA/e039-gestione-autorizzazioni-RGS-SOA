sap.ui.define(
  [
    "../../BaseSoaController",
    "../../../../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
  ],
  function (BaseSoaController, formatter, JSONModel, MessageBox) {
    "use strict";

    var bPrevalLoaded = false;
    const PAGINATOR_MODEL = "paginatorModel";
    return BaseSoaController.extend(
      "rgssoa.controller.soa.detail.scenery.Scenario1",
      {
        formatter: formatter,

        onInit: function () {
          var self = this;

          var oModelUtility = new JSONModel({
            Function: "Dettaglio",
            DeleteSelectedPositions: [],
            AddSelectedPositions: [],
            AddPositions: false,
            DeletePositions: false,
            EnableEdit: false,
          });
          self.setModel(oModelUtility, "Utility");

          var oModelStepScenario = new JSONModel({
            wizard1Step1: false,
            wizard1Step2: false,
            wizard1Step3: true,
            wizard2: false,
            wizard3: false,
            wizard4: false,
            visibleBtnForward: true,
            visibleBtnStart: false,
          });
          self.setModel(oModelStepScenario, "StepScenario");

          var oModelSoa = new JSONModel({
            EnableEdit: false,
            visibleBtnEdit: true,
            /**     CHIAVI */
            Gjahr: "",
            Bukrs: "",
            Zchiavesop: "",
            Ztipososp: "",
            Zstep: "",

            Ztipopag: "", //Tipo Pagamento

            /**   Dati SOA (Parte celeste in alto)   */
            Zimptot: "", //Importo
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

            /**   WIZARD 1 - SCENARIO 4 */
            Kostl: "", //Centro Costo
            Hkont: "", // Conto Co.Ge.
            DescKostl: "", //Descrizione Centro Costo
            DescHkont: "", //Descrizione Conto Co.Ge.

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
            Zidsede: "", //Sede Beneficiario
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
          self.setModel(oModelSoa, "Soa");

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
          self.setModel(oModelClassificazione, "Classificazione");

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
          self.setModel(oModelPaginator, PAGINATOR_MODEL);

          this.getRouter()
            .getRoute("soa.detail.scenery.Scenario1")
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
          var oWizard = oView.byId("wizScenario1");
          //Load Models
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelUtility = self.getModel("Utility");

          var bWizard1Step1 = oModelStepScenario.getProperty("/wizard1Step1");
          var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
          var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");
          var bWizard4 = oModelStepScenario.getProperty("/wizard4");

          var bDettaglio =
            oModelUtility.getProperty("/Function") === "Dettaglio";
          var bRettifica =
            oModelUtility.getProperty("/Function") === "Rettifica";

          if (bWizard1Step1) {
            history.go(-1);
          } else if (bWizard1Step2) {
            this._resetStepScenario();
            this._resetSoaDetail();
            this._resetUtility(false);
            history.go(-1);
          } else if (bWizard1Step3) {
            if (bDettaglio) {
              this._resetStepScenario();
              this._resetSoaDetail();
              this._resetUtility(false);
              history.go(-1);
            } else if (bRettifica) {
              oModelStepScenario.setProperty("/wizard1Step2", true);
              oModelStepScenario.setProperty("/wizard1Step3", false);
            }
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
            this._addNewPositions();
            oModelStepScenario.setProperty("/wizard1Step2", false);
            oModelStepScenario.setProperty("/wizard1Step3", true);
          } else if (bWizard1Step3) {
            if (this._checkQuoteDocumenti()) {
              oModelStepScenario.setProperty("/wizard1Step3", false);
              oModelStepScenario.setProperty("/wizard2", true);
              oWizard.nextStep();
            }
          } else if (bWizard2) {
            oModelStepScenario.setProperty("/wizard2", false);
            oModelStepScenario.setProperty("/wizard3", true);
            oWizard.nextStep();
          } else if (bWizard3) {
            if (self.checkClassificazione()) {
              oModelStepScenario.setProperty("/wizard3", false);
              oModelStepScenario.setProperty("/wizard4", true);
              oModelStepScenario.setProperty("/visibleBtnForward", false);
              oWizard.nextStep();
            }
          }
        },

        onEdit: function () {
          this._setPropertiesForEdit();
        },

        onIconTabChange: function (oEvent) {
          var self = this;
          var oModel = self.getModel();
          var oModelUtility = self.getModel("Utility");
          var oModelSoa = self.getModel("Soa");
          var oWizard = self.getView().byId("wizScenario1");
          var sKey = oEvent.getParameter("selectedKey");

          oModelUtility.setProperty("/Function", sKey);

          var oParameters = {
            Gjahr: oModelSoa.getProperty("/Gjahr"),
            Bukrs: oModelSoa.getProperty("/Bukrs"),
            Zchiavesop: oModelSoa.getProperty("/Zchiavesop"),
            Ztipososp: oModelSoa.getProperty("/Ztipososp"),
            Zstep: oModelSoa.getProperty("/Zstep"),
          };

          switch (sKey) {
            case "Dettaglio": {
              var sPath = self.getModel().createKey("SOASet", oParameters);
              var oWizard = self.getView().byId("wizScenario1");
              for (var i = 0; i < oWizard.getProgress(); i++) {
                oWizard.previousStep();
              }

              this._resetSoaDetail();
              this._resetStepScenario();
              this._resetUtility(oModelUtility.getProperty("/EnableEdit"));

              oModel.read("/" + sPath, {
                success: function (data) {
                  self._setSoaModel(data);
                  self.setInpsEditable();
                  self.getSedeBeneficiario();
                  self._getPosizioniSoa();
                  self._getClassificazioniSoa();
                },
                error: function () {},
              });

              break;
            }
            case "Workflow": {
              this._getWorkflow();
              break;
            }
            case "Rettifica": {
              this._setPropertiesForEdit();
              break;
            }
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
          var oModelUtility = self.getModel("Utility");
          var oTablePosizioniSoa = self
            .getView()
            .byId("tblEditQuoteDocumentiScen1");
          var oModelTablePosizioniSoa = oTablePosizioniSoa.getModel("Soa");

          var aSelectedItems = oModelUtility.getProperty(
            "/DeleteSelectedPositions"
          );
          var aListItems = oEvent.getParameter("listItems");

          aListItems.map((oListItem) => {
            var oSelectedItem = oModelTablePosizioniSoa.getObject(
              oListItem.getBindingContextPath()
            );

            if (bSelected) {
              aSelectedItems.push(oSelectedItem);
            } else {
              var iIndex = aSelectedItems.findIndex((obj) => {
                return (
                  obj.Bukrs === oSelectedItem.Bukrs &&
                  obj.Gjahr === oSelectedItem.Gjahr &&
                  obj.Zchiavesop === oSelectedItem.Zchiavesop &&
                  obj.Zpossop === oSelectedItem.Zpossop &&
                  obj.ZstepSop === oSelectedItem.ZstepSop
                );
              });

              if (iIndex > -1) {
                aSelectedItems.splice(iIndex, 1);
              }
            }
          });

          oModelUtility.setProperty("/DeleteSelectedPositions", aSelectedItems);
        },

        onDeletePositionSoa: function () {
          var self = this;
          var oTable = self.getView().byId("tblEditQuoteDocumentiScen1");

          MessageBox.warning(
            "Procedere con la cancellazione delle righe selezionate?",
            {
              actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
              title: "Rettifica SOA - Cancellazione Righe",
              onClose: function (oAction) {
                if (oAction === "OK") {
                  var oModelUtility = self.getModel("Utility");
                  var oModelSoa = self.getModel("Soa");
                  var oModelStepScenario = self.getModel("StepScenario");

                  var aSelectedItems = oModelUtility.getProperty(
                    "/DeleteSelectedPositions"
                  );
                  var aPositionSoa = oModelSoa.getProperty("/data");

                  aSelectedItems.map((oSelectedItem) => {
                    var iIndex;
                    if (oSelectedItem?.Zchiavesop) {
                      iIndex = aPositionSoa.findIndex((oPositionSoa) => {
                        return (
                          oPositionSoa.Bukrs === oSelectedItem.Bukrs &&
                          oPositionSoa.Gjahr === oSelectedItem.Gjahr &&
                          oPositionSoa.Zchiavesop ===
                            oSelectedItem.Zchiavesop &&
                          oPositionSoa.Zpossop === oSelectedItem.Zpossop &&
                          oPositionSoa.ZstepSop === oSelectedItem.ZstepSop
                        );
                      });
                    } else {
                      iIndex = aPositionSoa.findIndex((oPositionSoa) => {
                        return (
                          oPositionSoa.Bukrs === oSelectedItem.Bukrs &&
                          oPositionSoa.Zposizione ===
                            oSelectedItem.Zposizione &&
                          oPositionSoa.Znumliq === oSelectedItem.Znumliq &&
                          oPositionSoa.Zversione === oSelectedItem.Zversione &&
                          oPositionSoa.ZversioneOrig ===
                            oSelectedItem.ZversioneOrig
                        );
                      });
                    }

                    if (iIndex > -1) {
                      aPositionSoa.splice(iIndex, 1);
                    }
                  });

                  oModelStepScenario.setProperty("/wizard1Step2", false);
                  oModelStepScenario.setProperty("/wizard1Step3", true);
                  oModelSoa.setProperty("/data", aPositionSoa);

                  var fTotal = 0;
                  aPositionSoa.map((oPosition) => {
                    fTotal += parseFloat(oPosition?.Zimpdaord);
                  });

                  oModelSoa.setProperty("/Zimptot", fTotal.toFixed(2));

                  oModelUtility.setProperty("/DeleteSelectedPositions", []);
                  oModelUtility.setProperty("/AddSelectedPositions", []);

                  oTable.removeSelections();
                }
              },
            }
          );
        },

        onAddPositionSoa: function () {
          var self = this;
          var oModelSoa = self.getModel("Soa");
          var oModelUtility = self.getModel("Utility");
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelFilterDocumenti = self.getModel("FilterDocumenti");

          oModelUtility.setProperty("/AddPositions", true);
          oModelUtility.setProperty("/DeletePositions", false);

          oModelStepScenario.setProperty("/wizard1Step1", true);
          oModelStepScenario.setProperty("/wizard1Step2", false);
          oModelStepScenario.setProperty("/wizard1Step3", false);
          oModelStepScenario.setProperty("/visibleBtnStart", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);

          oModelFilterDocumenti.setProperty(
            "/Lifnr",
            oModelSoa.getProperty("/Lifnr")
          );
          oModelFilterDocumenti.setProperty(
            "/TipoBeneficiario",
            oModelSoa.getProperty("/BuType")
          );
          oModelFilterDocumenti.setProperty(
            "/CodRitenuta",
            oModelSoa.getProperty("/Witht")
          );
          oModelFilterDocumenti.setProperty(
            "/CodEnte",
            oModelSoa.getProperty("/ZzCebenra")
          );
        },

        onAddSelectedItem: function (oEvent) {
          var self = this;
          var bSelected = oEvent.getParameter("selected");
          //Load Model
          var oModelDocumenti = self.getModel("QuoteDocumenti");
          var oModelUtility = self.getModel("Utility");

          var aSelectedItems = oModelUtility.getProperty(
            "/AddSelectedPositions"
          );
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
        },

        onImpDaOrdinareChange: function (oEvent) {
          var self = this;
          //Load Component
          var oTableDocumenti = self
            .getView()
            .byId("tblEditQuoteDocumentiScen1");
          //Load Models
          var oTableModelDocumenti = oTableDocumenti.getModel("Soa");

          var sValue = oEvent.getParameter("value");

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

        onAddImpDaOrdinareChange: function (oEvent) {
          var self = this;
          //Load Component
          var oTableDocumenti = self.getView().byId("pnlAddQuoteDocumenti");
          //Load Models
          var oTableModelDocumenti = oTableDocumenti.getModel("QuoteDocumenti");

          var sValue = oEvent.getParameter("value");

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

        //#region WIZARD 1 - PRIVATE METHODS

        _getPositionsFilters: function () {
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
            "QuoteEsigibili",
            oModelFilter.getProperty("/QuoteEsigibili")
          );
          self.setFilterBT(
            aFilters,
            "DataEsigibilita",
            oModelFilter.getProperty("/DataEsigibilitaFrom"),
            oModelFilter.getProperty("/DataEsigibilitaTo")
          );

          //Estremi di ricerca per Beneficiario
          //TODO - Rimettere come prima
          self.setFilterEQ(aFilters, "Lifnr", "0010000077");
          // self.setFilterEQ(
          //   aFilters,
          //   "Lifnr",
          //   oModelFilter.getProperty("/Lifnr")
          // );
          self.setFilterEQ(
            aFilters,
            "TipoBeneficiario",
            oModelFilter.getProperty("/TipoBeneficiario")
          );

          //Estremi di ricerca per Documento di Costo
          self.setFilterEQ(
            aFilters,
            "UfficioContabile",
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
            self.setFilterEQ(aFilters, "Xblnr", sNDocBen);
          });
          self.setFilterEQ(aFilters, "Cig", oModelFilter.getProperty("/Cig"));
          self.setFilterEQ(aFilters, "Cup", oModelFilter.getProperty("/Cup"));
          self.setFilterBT(
            aFilters,
            "ScadenzaDoc",
            oModelFilter.getProperty("/ScadenzaDocFrom"),
            oModelFilter.getProperty("/ScadenzaDocTo")
          );

          self.setFilterEQ(
            aFilters,
            "EsercizioContabile",
            oModelSoa.getProperty("/Gjahr")
          );
          self.setFilterEQ(aFilters, "Fipex", oModelSoa.getProperty("/Fipos"));
          self.setFilterEQ(aFilters, "Fistl", oModelSoa.getProperty("/Fistl"));

          return aFilters;
        },

        _setPaginatorProperties: function () {
          var self = this;
          var oDataModel = self.getModel();
          var aFilters = this._getPositionsFilters();

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
              oDataModel.read("/" + "QuoteDocumentiSet" + "/$count", {
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
          var oModelUtility = self.getModel("Utility");
          //Load Component
          var oPanelPaginator = oView.byId("pnlPaginator");
          var oTableDocumenti = oView.byId("tblQuoteDocumentiScen1");

          var aPositionSoa = oModelSoa.getProperty("/data");
          var aAddSelectedPositions = [];
          aPositionSoa.map((oPosition) => {
            if (!oPosition?.Zchiavesop) {
              aAddSelectedPositions.push(oPosition);
            }
          });

          var aSelectedItems = oModelUtility.getProperty(
            "/AddSelectedPositions"
          );

          var aFilters = this._getPositionsFilters();
          var urlParameters = {
            $top: oPaginatorModel.getProperty("/numRecordsForPage"),
            $skip: oPaginatorModel.getProperty("/paginatorSkip"),
          };

          //Check BEETWEN filters
          var sIntervalFilter = self.checkBTFilter(aFilters);
          if (sIntervalFilter) {
            sap.m.MessageBox.error(sIntervalFilter);
            self.clearModel("QuoteDocumenti");
            return;
          }

          oView.setBusy(true);

          oDataModel.read("/" + "QuoteDocumentiSet", {
            urlParameters: urlParameters,
            filters: aFilters,
            success: function (data, oResponse) {
              if (!self.setResponseMessage(oResponse)) {
                oModelStepScenario.setProperty("/wizard1Step1", false);
                oModelStepScenario.setProperty("/wizard1Step2", true);
                oModelStepScenario.setProperty("/visibleBtnForward", true);
                oModelStepScenario.setProperty("/visibleBtnStart", false);
              }

              var aQuoteDocumenti = data.results;

              oPanelPaginator.setVisible(aQuoteDocumenti.length !== 0);

              if (aQuoteDocumenti.length !== 0) {
                aAddSelectedPositions.map((oQuotaDocumento) => {
                  var iIndex = aQuoteDocumenti.findIndex((obj) => {
                    return (
                      obj.Bukrs === oQuotaDocumento.Bukrs &&
                      obj.Zposizione === oQuotaDocumento.Zposizione &&
                      obj.Znumliq === oQuotaDocumento.Znumliq &&
                      obj.Zversione === oQuotaDocumento.Zversione &&
                      obj.ZversioneOrig === oQuotaDocumento.ZversioneOrig
                    );
                  });

                  if (iIndex > -1) {
                    aQuoteDocumenti.splice(iIndex, 1);
                  }
                });
              }

              self.setModelCustom("QuoteDocumenti", aQuoteDocumenti);

              if (aQuoteDocumenti.length !== 0) {
                aQuoteDocumenti.map((oItem, iIndex) => {
                  //Vengono selezionati i record quando viene caricata l'entità
                  aSelectedItems.map((oSelectedItem) => {
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

        _addNewPositions: function () {
          var self = this;
          var oModelUtility = self.getModel("Utility");
          var oModelSoa = self.getModel("Soa");

          var oTable = self.getView().byId("tblEditQuoteDocumentiScen1");

          var aAddSelectedPositions = oModelUtility.getProperty(
            "/AddSelectedPositions"
          );
          var aSoaPositions = oModelSoa.getProperty("/data");

          aAddSelectedPositions.map((oPosition) => {
            aSoaPositions.push(oPosition);
          });

          oModelSoa.setProperty("/data", aSoaPositions);

          var fTotal = 0;
          aSoaPositions.map((oPosition) => {
            fTotal += parseFloat(oPosition?.Zimpdaord);
          });

          oModelSoa.setProperty("/Zimptot", fTotal.toFixed(2));
          oModelUtility.setProperty("/AddPositions", false);
          oModelUtility.setProperty("/DeletePositions", true);
          oModelUtility.setProperty("/DeleteSelectedPositions", []);
          oModelUtility.setProperty("/AddSelectedPositions", []);

          oTable.removeSelections();
        },

        _checkQuoteDocumenti: function () {
          var self = this;
          var oModelSoa = self.getModel("Soa");
          var oBundle = self.getResourceBundle();

          var fImpTot = parseFloat(oModelSoa.getProperty("/Zimptot"));
          var fImpDispAutorizzazione = parseFloat(
            oModelSoa.getProperty("/Zimpdispaut")
          );

          //TODO - Rimettere
          // if (fImpTot > fImpDispAutorizzazione) {
          //   sap.m.MessageBox.error(
          //     oBundle.getText("msgImpTotGreaterImpDispAut")
          //   );
          //   return false;
          // }

          if (
            oModelSoa.getProperty("/data").length === 0 ||
            oModelSoa.getProperty("/Zimptot") === "0.00"
          ) {
            sap.m.MessageBox.error(oBundle.getText("msgNoDocuments"));
            return false;
          }

          return true;
        },

        _getPosizioniSoa: function () {
          var self = this;
          var oModel = self.getModel();
          var oModelSoa = self.getModel("Soa");

          var aFilters = [];

          self.setFilterEQ(aFilters, "Bukrs", oModelSoa.getProperty("/Bukrs"));
          self.setFilterEQ(aFilters, "Gjahr", oModelSoa.getProperty("/Gjahr"));
          self.setFilterEQ(
            aFilters,
            "Zchiavesop",
            oModelSoa.getProperty("/Zchiavesop")
          );

          oModel.read("/SoaPosizioneSet", {
            filters: aFilters,
            success: function (data) {
              oModelSoa.setProperty("/data", data.results);
            },
            error: function () {},
          });
        },

        //#endregion WIZARD 1 - PRIVATE METHODS

        //#endregion WIZARD 1

        //#region WIZARD 3

        //#region WIZARD 3 - PRIVATE METHODS
        _getClassificazioniSoa: function () {
          var self = this;
          var oModel = self.getModel();
          var oModelSoa = self.getModel("Soa");

          var aFilters = [];

          self.setFilterEQ(aFilters, "Bukrs", oModelSoa.getProperty("/Bukrs"));
          self.setFilterEQ(
            aFilters,
            "Zchiavesop",
            oModelSoa.getProperty("/Zchiavesop")
          );

          oModel.read("/SoaClassificazioneSet", {
            filters: aFilters,
            success: function (data) {
              oModelSoa.setProperty("/Classificazione", data.results);
              self._setModelClassificazione(data.results);
            },
            error: function () {},
          });
        },

        _setModelClassificazione: function (aData) {
          var self = this;
          var oModelClassificazione = self.getModel("Classificazione");
          var aCos = [];
          var aCpv = [];
          var aCig = [];
          var aCup = [];
          var fImpTotAssociareCos = 0.0;
          var fImpTotAssociareCpv = 0.0;
          var fImpTotAssociareCig = 0.0;
          var fImpTotAssociareCup = 0.0;

          //Separo le classificazione in base all'etichetta
          aData.map((oClassificazione) => {
            switch (oClassificazione.Zetichetta) {
              case "COS":
                fImpTotAssociareCos += parseFloat(
                  oClassificazione.ZimptotClass
                );

                oClassificazione.Index = aCos.length;
                aCos.push(oClassificazione);
                break;
              case "CPV":
                fImpTotAssociareCpv += parseFloat(
                  oClassificazione.ZimptotClass
                );
                oClassificazione.Index = aCpv.length;
                aCpv.push(oClassificazione);
                break;
              case "CIG":
                fImpTotAssociareCig += parseFloat(
                  oClassificazione.ZimptotClass
                );
                oClassificazione.Index = aCig.length;
                aCig.push(oClassificazione);
                break;
              case "CUP":
                fImpTotAssociareCup += parseFloat(
                  oClassificazione.ZimptotClass
                );
                oClassificazione.Index = aCup.length;
                aCup.push(oClassificazione);
                break;
            }
          });

          oModelClassificazione.setProperty("/Cos", aCos);
          oModelClassificazione.setProperty("/Cpv", aCpv);
          oModelClassificazione.setProperty("/Cig", aCig);
          oModelClassificazione.setProperty("/Cup", aCup);
          oModelClassificazione.setProperty(
            "/ImpTotAssociareCos",
            fImpTotAssociareCos.toFixed(2)
          );
          oModelClassificazione.setProperty(
            "/ImpTotAssociareCpv",
            fImpTotAssociareCpv.toFixed(2)
          );
          oModelClassificazione.setProperty(
            "/ImpTotAssociareCig",
            fImpTotAssociareCig.toFixed(2)
          );
          oModelClassificazione.setProperty(
            "/ImpTotAssociareCup",
            fImpTotAssociareCup.toFixed(2)
          );
        },

        //#endregion WIZARD 3 - PRIVATE METHODS

        //#endregion WIZARD 3

        //#region PRIVATE METHODS

        _onObjectMatched: function (oEvent) {
          var self = this;
          //Load Models
          var oModel = self.getModel();
          var oParameters = oEvent.getParameter("arguments");
          var sPath = self.getModel().createKey("SOASet", oParameters);

          oModel.read("/" + sPath, {
            success: function (data, oResponse) {
              self._setSoaModel(data);
              self.setInpsEditable();
              self.getSedeBeneficiario();
              self._getPosizioniSoa();
              self._getClassificazioniSoa();
            },
            error: function () {},
          });
        },

        _setSoaModel: function (oData) {
          var self = this;
          var oModelSoa = self.getModel("Soa");

          oModelSoa.setProperty("/Ztipopag", oData.Ztipopag);
          oModelSoa.setProperty("/Bukrs", oData.Bukrs);
          oModelSoa.setProperty("/Zchiavesop", oData.Zchiavesop);
          oModelSoa.setProperty("/Ztipososp", oData.Ztipososp);
          oModelSoa.setProperty("/Zstep", oData.Zstep);
          oModelSoa.setProperty("/Gjahr", oData.Gjahr);
          oModelSoa.setProperty("/Zimptot", oData.Zimptot);
          oModelSoa.setProperty("/Zzamministr", oData.Zzamministr);
          oModelSoa.setProperty("/ZufficioCont", oData.ZufficioCont);
          oModelSoa.setProperty("/NameFirst", oData.NameFirst);
          oModelSoa.setProperty("/NameLast", oData.NameLast);
          oModelSoa.setProperty("/ZzragSoc", oData.ZzragSoc);
          oModelSoa.setProperty("/TaxnumCf", oData.TaxnumCf);
          oModelSoa.setProperty("/TaxnumPiva", oData.TaxnumPiva);
          oModelSoa.setProperty("/Fipos", oData.Fipos);
          oModelSoa.setProperty("/Fistl", oData.Fistl);
          oModelSoa.setProperty("/Lifnr", oData.Lifnr);
          oModelSoa.setProperty("/Witht", oData.Witht);
          oModelSoa.setProperty("/Text40", oData.Text40);
          oModelSoa.setProperty("/ZzCebenra", oData.ZzCebenra);
          oModelSoa.setProperty("/ZzDescebe", oData.ZzDescebe);
          oModelSoa.setProperty("/Zchiaveaut", oData.Zchiaveaut);
          oModelSoa.setProperty("/Ztipodisp2", oData.Ztipodisp2);
          oModelSoa.setProperty("/Zdesctipodisp2", oData.Zdesctipodisp2);
          oModelSoa.setProperty("/Ztipodisp3", oData.Ztipodisp3);
          oModelSoa.setProperty("/Zdesctipodisp3", oData.Zdesctipodisp3);
          oModelSoa.setProperty("/Zimpaut", oData.Zimpaut);
          oModelSoa.setProperty("/Zimpdispaut", oData.Zimpdispaut);
          oModelSoa.setProperty("/Zztipologia", oData.Zztipologia);
          oModelSoa.setProperty("/DescZztipologia", oData.DescZztipologia);
          oModelSoa.setProperty("/Zfunzdel", oData.Zfunzdel);
          oModelSoa.setProperty("/Zdescriz", oData.Zdescriz);
          oModelSoa.setProperty("/ZspecieSop", oData.ZspecieSop);
          oModelSoa.setProperty("/DescZspecieSop", oData.DescZspecieSop);
          oModelSoa.setProperty("/Kostl", oData.Kostl);
          oModelSoa.setProperty("/Hkont", oData.Hkont);
          oModelSoa.setProperty("/DescKostl", oData.DescKostl);
          oModelSoa.setProperty("/DescHkont", oData.DescHkont);
          oModelSoa.setProperty("/BuType", oData.BuType);
          oModelSoa.setProperty("/Taxnumxl", oData.Taxnumxl);
          oModelSoa.setProperty("/Zsede", oData.Zsede);
          oModelSoa.setProperty("/Zdenominazione", oData.Zdenominazione);
          oModelSoa.setProperty("/Zdurc", oData.Zdurc);
          oModelSoa.setProperty("/ZfermAmm", oData.ZfermAmm);
          oModelSoa.setProperty("/Zwels", oData.Zwels);
          oModelSoa.setProperty("/ZCausaleval", oData.ZCausaleval);
          oModelSoa.setProperty("/Swift", oData.Swift);
          oModelSoa.setProperty("/Zcoordest", oData.Zcoordest);
          oModelSoa.setProperty("/Iban", oData.Iban);
          oModelSoa.setProperty("/Zmotivaz", oData.Zmotivaz);
          oModelSoa.setProperty("/Zdescwels", oData.Zdescwels);
          oModelSoa.setProperty("/Banks", oData.Banks);
          oModelSoa.setProperty("/ZDesccauval", oData.ZDesccauval);
          oModelSoa.setProperty("/Ztipofirma", oData.Ztipofirma);
          oModelSoa.setProperty(
            "/ZpersCognomeQuiet1",
            oData.ZpersCognomeQuiet1
          );
          oModelSoa.setProperty(
            "/ZpersCognomeQuiet2",
            oData.ZpersCognomeQuiet2
          );
          oModelSoa.setProperty("/ZpersNomeQuiet1", oData.ZpersNomeQuiet1);
          oModelSoa.setProperty("/ZpersNomeQuiet2", oData.ZpersNomeQuiet2);
          oModelSoa.setProperty("/ZpersNomeVaglia", oData.ZpersNomeVaglia);
          oModelSoa.setProperty(
            "/ZpersCognomeVaglia",
            oData.ZpersCognomeVaglia
          );
          oModelSoa.setProperty("/Zstcd1", oData.Zstcd1);
          oModelSoa.setProperty("/Zstcd12", oData.Zstcd12);
          oModelSoa.setProperty("/Zstcd13", oData.Zstcd13);
          oModelSoa.setProperty("/Zqindiriz", oData.Zqindiriz);
          oModelSoa.setProperty("/Zqcitta", oData.Zqcitta);
          oModelSoa.setProperty("/Zqcap", oData.Zqcap);
          oModelSoa.setProperty("/Zqprovincia", oData.Zqprovincia);
          oModelSoa.setProperty("/Zqindiriz12", oData.Zqindiriz12);
          oModelSoa.setProperty("/Zqcitta12", oData.Zqcitta12);
          oModelSoa.setProperty("/Zqcap12", oData.Zqcap12);
          oModelSoa.setProperty("/Zqprovincia12", oData.Zqprovincia12);
          oModelSoa.setProperty("/Zcodprov", oData.Zcodprov);
          oModelSoa.setProperty("/Zcfcommit", oData.Zcfcommit);
          oModelSoa.setProperty("/Zcodtrib", oData.Zcodtrib);
          oModelSoa.setProperty("/Zperiodrifda", oData.Zperiodrifda);
          oModelSoa.setProperty("/Zperiodrifa", oData.Zperiodrifa);
          oModelSoa.setProperty("/Zcodinps", oData.Zcodinps);
          oModelSoa.setProperty("/Zcfvers", oData.Zcfvers);
          oModelSoa.setProperty("/Zcodvers", oData.Zcodvers);
          oModelSoa.setProperty("/Zidsede", oData.Zidsede);
          oModelSoa.setProperty("/Stras", oData.Stras);
          oModelSoa.setProperty("/Ort01", oData.Ort01);
          oModelSoa.setProperty("/Regio", oData.Regio);
          oModelSoa.setProperty("/Pstlz", oData.Pstlz);
          oModelSoa.setProperty("/Land1", oData.Land1);
          oModelSoa.setProperty("/Zcausale", oData.Zcausale);
          oModelSoa.setProperty("/ZE2e", oData.ZE2e);
          oModelSoa.setProperty("/Zlocpag", oData.Zlocpag);
          oModelSoa.setProperty("/Zzonaint", oData.Zzonaint);
          oModelSoa.setProperty("/Znumprot", oData.Znumprot);
          oModelSoa.setProperty("/Zdataprot", oData.Zdataprot);
          oModelSoa.setProperty("/Zdataesig", oData.Zdataesig);
        },
        _resetSoaDetail: function () {
          var self = this;

          var oModelSoa = new JSONModel({
            EnableEdit: false,
            visibleBtnEdit: true,
            Bukrs: "",
            Zchiavesop: "",

            Ztipopag: "", //Tipo Pagamento

            /**   Dati SOA (Parte celeste in alto)   */
            Gjahr: "", //Esercizio di gestione
            Zimptot: "", //Importo
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

            /**   WIZARD 1 - SCENARIO 4 */
            Kostl: "", //Centro Costo
            Hkont: "", // Conto Co.Ge.
            DescKostl: "", //Descrizione Centro Costo
            DescHkont: "", //Descrizione Conto Co.Ge.

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
            Zidsede: "", //Sede Beneficiario
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
          self.setModel(oModelSoa, "Soa");
        },

        _resetUtility: function (bEnableEdit) {
          var self = this;

          var oModelUtility = new JSONModel({
            Function: "Dettaglio",
            DeleteSelectedPositions: [],
            AddSelectedPositions: [],
            AddPositions: false,
            DeletePositions: false,
            EnableEdit: bEnableEdit,
          });
          self.setModel(oModelUtility, "Utility");
        },

        _resetStepScenario: function () {
          var self = this;
          var oModelStepScenario = new JSONModel({
            wizard1Step1: false,
            wizard1Step2: false,
            wizard1Step3: true,
            wizard2: false,
            wizard3: false,
            wizard4: false,
            visibleBtnForward: true,
            visibleBtnStart: false,
          });
          self.setModel(oModelStepScenario, "StepScenario");
        },

        _getWorkflow: function () {
          var self = this;

          var oModel = self.getModel();
          var oModelSoa = self.getModel("Soa");

          var aFilters = [];

          self.setFilterEQ(
            aFilters,
            "Esercizio",
            oModelSoa.getProperty("/Gjahr")
          );
          //TODO - Rimettere
          //self.setFilterEQ(aFilters, "Bukrs", oModelSoa.getProperty("/Bukrs"));
          self.setFilterEQ(
            aFilters,
            "Zchiavesop",
            oModelSoa.getProperty("/Zchiavesop")
          );

          oModel.read("/WFStateSoaSet", {
            filters: aFilters,
            success: function (data) {
              data.results.map((oItem) => {
                oItem.DataOraString = new Date(oItem.DataOraString);
              });

              self.setModelCustom("WFStateSoa", data.results);
            },

            error: function () {},
          });
        },

        _setPropertiesForEdit: function () {
          var self = this;
          var oModelSoa = self.getModel("Soa");
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelUtility = self.getModel("Utility");
          var oWizard = self.getView().byId("wizScenario1");

          self.setModelCustom("QuoteDocumenti", oModelSoa.getProperty("/data"));

          for (var i = 0; i < oWizard.getProgress(); i++) {
            oWizard.previousStep();
          }

          oModelUtility.setProperty("/DeletePositions", true);
          oModelUtility.setProperty("/EnableEdit", true);

          oModelSoa.setProperty("/EnableEdit", true);
          //Porto la IconTab sul tab giusto
          oModelUtility.setProperty("/Function", "Rettifica");
          oModelSoa.setProperty("/visibleBtnEdit", false);

          oModelStepScenario.setProperty("/wizard1Step2", true);
          oModelStepScenario.setProperty("/wizard1Step3", false);
          oModelStepScenario.setProperty("/wizard2", false);
          oModelStepScenario.setProperty("/wizard3", false);
          oModelStepScenario.setProperty("/wizard4", false);
        },

        //#endregion PRIVATE METHODS

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
      }
    );
  }
);
