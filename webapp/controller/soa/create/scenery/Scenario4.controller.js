sap.ui.define(
  [
    "../../BaseSoaController",
    "../../../../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
  ],
  function (
    BaseSoaController,
    formatter,
    JSONModel,
    exportLibrary,
    Spreadsheet
  ) {
    "use strict";

    const EDM_TYPE = exportLibrary.EdmType;

    return BaseSoaController.extend(
      "rgssoa.controller.soa.create.scenery.Scenario4",
      {
        formatter: formatter,
        onInit: function () {
          var self = this;

          var oModelStepScenario = new JSONModel({
            wizard1Step1: true,
            wizard1Step2: false,
            wizard2: false,
            wizard3: false,
            wizard4: false,
            visibleBtnForward: true,
            visibleBtnInserisciProspLiquidazione: false,
            visibleBtnSave: false,
          });
          self.setModel(oModelStepScenario, "StepScenario");

          var oModelSoa = new JSONModel({
            EnableEdit: true,
            visibleBtnEdit: false,
            /**   Scenario    */
            Ztipopag: "4", //Tipo Pagamento

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
            Zperiodrifda: null, //INPS - Periodo riferimento da
            Zperiodrifa: null, //INPS - Periodo riferimento a
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
            Zdataprot: null, //Data protocollo
            Zdataesig: null, //TODO - Punto Aperto - Data esigibilità

            Bukrs: "",
            Zchiavesop: "",
            ZcodStatosop: "",
            Zdatasop: null,
            Znumsop: "",
            Zricann: "",
            ZstatTest: "",
            Zstep: "",
            Zutenza: "",
            Messaggio: [], //Messaggi di error
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

          var oModelNewAnagraficaBen = new JSONModel({
            Beneficiario: {
              FlagSife: true,
              Lifnr: "",
              SCountry: "IT",
              SType: "1",
              SRagsoc: "",
              SName: "Alessio",
              SSurname: "Carone",
              SStreet: "Parma",
              SHousenum: "53",
              SCity: "Altamura",
              SRegion: "BA",
              SPstlz: "70022",
              SSedelegale: false,
              SStcd1: "PTRLNZ03C10A662T",
              SStcd2: "86334519757",
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

          self.acceptOnlyImport("iptImportoLiquidazione");

          this.getRouter()
            .getRoute("soa.create.scenery.Scenario4")
            .attachPatternMatched(this._onObjectMatched, this);
        },
        onBeforeRendering: function () {
          var self = this;

          var oModelSoa = self.getModel("Soa");

          oModelSoa.setProperty("/ZspecieSop", "1");
          oModelSoa.setProperty("/DescZspecieSop", "Sosp Ben.");
        },

        onNavBack: function () {
          var self = this;
          var oView = self.getView();
          var oWizard = oView.byId("wizScenario4");
          //Load Models
          var oModelStepScenario = self.getModel("StepScenario");

          var bWizard1Step1 = oModelStepScenario.getProperty("/wizard1Step1");
          var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");
          var bWizard4 = oModelStepScenario.getProperty("/wizard4");

          if (bWizard1Step1) {
            self.resetSoa("4");
            history.go(-1);
          } else if (bWizard1Step2) {
            oModelStepScenario.setProperty("/wizard1Step2", false);
            oModelStepScenario.setProperty("/wizard1Step1", true);
            oModelStepScenario.setProperty("/visibleBtnForward", true);
            oModelStepScenario.setProperty(
              "/visibleBtnInserisciProspLiquidazione",
              false
            );
          } else if (bWizard2) {
            oModelStepScenario.setProperty("/wizard2", false);
            oModelStepScenario.setProperty("/wizard1Step2", true);
            oModelStepScenario.setProperty("/visibleBtnForward", false);
            oModelStepScenario.setProperty(
              "/visibleBtnInserisciProspLiquidazione",
              true
            );
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
          var oWizard = self.getView().byId("wizScenario4");
          var oModelStepScenario = self.getModel("StepScenario");
          var bWizard1Step1 = oModelStepScenario.getProperty("/wizard1Step1");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");

          if (bWizard1Step1) {
            if (this._checkNewProspettoLiquidazione()) {
              this._getNewProspettoLiquidazione();
              self.setDataBenficiario();
              self.getSedeBeneficiario();
              self.setInpsData();
            }
          } else if (bWizard2) {
            oModelStepScenario.setProperty("/wizard2", false);
            oModelStepScenario.setProperty("/wizard3", true);
            oWizard.nextStep();
          } else if (bWizard3) {
            oModelStepScenario.setProperty("/wizard3", false);
            oModelStepScenario.setProperty("/wizard4", true);
            oModelStepScenario.setProperty("/visibleBtnForward", false);
            oModelStepScenario.setProperty("/visibleBtnSave", true);
            oWizard.nextStep();
          }
        },

        onExport: function () {
          var oSheet;
          var self = this;

          var oTable = self.getView().byId("tblRiepNewProspettoLiquidazione");
          var oTableModel = oTable.getModel("NewProspettoLiquidazione");

          var aCols = this._createColumnConfig();
          var oSettings = {
            workbook: {
              columns: aCols,
            },
            dataSource: oTableModel.getData(),
            fileName: "Prospetto liquidazione.xlsx",
          };

          oSheet = new Spreadsheet(oSettings);
          oSheet.build().finally(function () {
            oSheet.destroy();
          });
        },

        //#region WIZARD 1
        onInserisciProspettoLiquidazione: function (oEvent) {
          var self = this;
          var oWizard = self.getView().byId("wizScenario4");
          var oModelStepScenario = self.getModel("StepScenario");

          oModelStepScenario.setProperty("/wizard1Step2", false);
          oModelStepScenario.setProperty("/wizard2", true);
          oModelStepScenario.setProperty("/visibleBtnForward", true);
          oModelStepScenario.setProperty(
            "/visibleBtnInserisciProspLiquidazione",
            false
          );
          oWizard.nextStep();
        },

        //#region VALUE HELP
        onValueHelpBeneficiario: function () {
          var self = this;
          var oModel = self.getModel();
          var oDialog = self.loadFragment(
            "rgssoa.view.fragment.valueHelp.BeneficiarioScen4"
          );

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oModel.read("/" + "RicercaBeneficiarioSet", {
                success: function (data, oResponse) {
                  self.setResponseMessage(oResponse);
                  var oModelJson = new JSONModel();
                  oModelJson.setData(data.results);
                  var oSelectDialog = sap.ui
                    .getCore()
                    .byId("sdBeneficiarioScen4");
                  oSelectDialog?.setModel(oModelJson, "Beneficiario");
                  oDialog.open();
                },
                error: function (error) {},
              });
            });
        },

        onValueHelpBeneficiarioClose: function (oEvent) {
          var self = this;
          //Load Models
          var oModelSoa = self.getModel("Soa");

          var oSelectedItem = oEvent.getParameter("selectedItem");

          oModelSoa.setProperty(
            "/Lifnr",
            self.setBlank(oSelectedItem?.getTitle())
          );
          oModelSoa.setProperty("/NameFirst", oSelectedItem?.data("NameFirst"));
          oModelSoa.setProperty("/NameLast", oSelectedItem?.data("NameLast"));
          oModelSoa.setProperty("/ZzragSoc", oSelectedItem?.data("ZzragSoc"));
          oModelSoa.setProperty("/TaxnumCf", oSelectedItem?.data("TaxnumCf"));
          oModelSoa.setProperty(
            "/TaxnumPiva",
            oSelectedItem?.data("TaxnumPiva")
          );
          oModelSoa.setProperty("/Taxnumxl", oSelectedItem?.data("Taxnumxl"));
          oModelSoa.setProperty("/BuType", oSelectedItem?.data("BuType"));

          oModelSoa.setProperty("/Zwels", "");
          oModelSoa.setProperty("/Iban", "");
          this._getModalitaPagamentoList();
          this._setDurc();
          this._setFermoAmministrativo();

          self.unloadFragment();
        },

        onValueHelpIban: function () {
          var self = this;
          //Load Models
          var oModel = self.getModel();
          var oModelSoa = self.getModel("Soa");
          var oDialog = self.loadFragment(
            "rgssoa.view.fragment.valueHelp.IbanScen4"
          );

          var aFilters = [];
          self.setFilterEQ(aFilters, "Lifnr", oModelSoa.getProperty("/Lifnr"));

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oModel.read("/" + "IbanScen4Set", {
                filters: aFilters,
                success: function (data, oResponse) {
                  self.setModelSelectDialog(
                    "Iban",
                    data,
                    "sdIbanScen4",
                    oDialog
                  );
                },
                error: function (error) {},
              });
            });
        },

        onValueHelpIbanClose: function (oEvent) {
          var self = this;
          //Load Models
          var oModelSoa = self.getModel("Soa");

          var oSelectedItem = oEvent.getParameter("selectedItem");

          oModelSoa.setProperty("/Iban", oSelectedItem?.getTitle());
          oModelSoa.setProperty(
            "/Banks",
            oSelectedItem?.getTitle().slice(0, 2)
          );

          self.unloadFragment();
        },

        onValueHelpCentroCosto: function () {
          var self = this;
          //Load Models
          var oModel = self.getModel();
          var oDialog = self.loadFragment(
            "rgssoa.view.fragment.valueHelp.CentroCosto"
          );

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oModel.read("/" + "CentroCostoSet", {
                success: function (data, oResponse) {
                  self.setModelSelectDialog(
                    "CentroCosto",
                    data,
                    "sdCentroCosto",
                    oDialog
                  );
                },
                error: function (error) {},
              });
            });
        },

        onValueHelpCentroCostoClose: function (oEvent) {
          var self = this;
          //Load Models
          var oModelSoa = self.getModel("Soa");

          var oSelectedItem = oEvent.getParameter("selectedItem");

          oModelSoa.setProperty(
            "/Kostl",
            self.setBlank(oSelectedItem?.getTitle())
          );
          oModelSoa.setProperty(
            "/DescKostl",
            self.setBlank(oSelectedItem?.data("Description"))
          );

          self.unloadFragment();
        },

        onValueHelpContoCoGe: function () {
          var self = this;
          //Load Models
          var oModel = self.getModel();
          var oModelSoa = self.getModel("Soa");
          var oDialog = self.loadFragment(
            "rgssoa.view.fragment.valueHelp.ContoCoGe"
          );

          var aFilters = [];

          self.setFilterEQ(aFilters, "Fipos", oModelSoa.getProperty("/Fipos"));
          self.setFilterEQ(aFilters, "Gjahr", oModelSoa.getProperty("/Gjahr"));

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oModel.read("/" + "ContoCoGeSet", {
                filters: aFilters,
                success: function (data, oResponse) {
                  self.setModelSelectDialog(
                    "ContoCoGe",
                    data,
                    "sdContoCoGe",
                    oDialog
                  );
                },
                error: function (error) {},
              });
            });
        },

        onValueHelpContoCoGeClose: function (oEvent) {
          var self = this;
          //Load Models
          var oModelSoa = self.getModel("Soa");

          var oSelectedItem = oEvent.getParameter("selectedItem");

          oModelSoa.setProperty(
            "/Hkont",
            self.setBlank(oSelectedItem?.getTitle())
          );
          oModelSoa.setProperty(
            "/DescHkont",
            self.setBlank(oSelectedItem?.data("Description"))
          );

          self.unloadFragment();
        },

        //#endregion

        //#region SELECTION CHANGE
        onImpLiquidazioneChange: function (oEvent) {
          var self = this;
          //Load Models
          var oModelSoa = self.getModel("Soa");

          var sValue = oEvent.getParameter("value");
          if (sValue) {
            oModelSoa.setProperty("/Zimptot", parseFloat(sValue).toFixed(2));
          } else {
            oModelSoa.setProperty("/Zimptot", "0.00");
          }
        },

        onModalitaPagamentoChange: function (oEvent) {
          var self = this;
          var oModelSoa = self.getModel("Soa");
          var oSelectedItem = oEvent.getParameter("selectedItem");

          oModelSoa.setProperty(
            "/Zdescwels",
            self.setBlank(oSelectedItem.getText())
          );

          self.setDatiVaglia();
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

        _getModalitaPagamentoList: function () {
          var self = this;
          //Load Models
          var oModel = self.getModel();
          var oModelSoa = self.getModel("Soa");

          var aFilters = [];

          self.setFilterEQ(aFilters, "Lifnr", oModelSoa.getProperty("/Lifnr"));

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oModel.read("/" + "ModalitaPagamentoScen4Set", {
                filters: aFilters,
                success: function (data, oResponse) {
                  self.setModelCustom("ModalitaPagamento", data.results);
                },
                error: function (error) {},
              });
            });
        },

        _setDurc: function () {
          var self = this;
          //Load Models
          var oModel = self.getModel();
          var oModelSoa = self.getModel("Soa");

          oModelSoa.setProperty("/Zdurc", "");

          if (oModelSoa.getProperty("/Lifnr")) {
            var sPath = self.getModel().createKey("PrevalDurcSet", {
              Lifnr: oModelSoa.getProperty("/Lifnr"),
            });

            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oModel.read("/" + sPath, {
                  success: function (data, oResponse) {
                    oModelSoa.setProperty("/Zdurc", data?.Zdurc);
                  },
                  error: function () {},
                });
              });
          }
        },

        _setFermoAmministrativo: function () {
          var self = this;
          //Load Models
          var oModel = self.getModel();
          var oModelSoa = self.getModel("Soa");

          oModelSoa.setProperty("/ZfermAmm", "");

          if (oModelSoa.getProperty("/Lifnr")) {
            var sPath = self
              .getModel()
              .createKey("PrevalFermoAmministrativoSet", {
                Lifnr: oModelSoa.getProperty("/Lifnr"),
              });

            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oModel.read("/" + sPath, {
                  success: function (data, oResponse) {
                    oModelSoa.setProperty("/ZfermAmm", data?.ZfermAmm);
                  },
                  error: function () {},
                });
              });
          }
        },

        _getNewProspettoLiquidazione: function () {
          var self = this;
          //Load Models
          var oModel = self.getModel();
          var oModelSoa = self.getModel("Soa");
          var oModelStepScenario = self.getModel("StepScenario");

          var aFilters = [];

          self.setFilterEQ(aFilters, "Lifnr", oModelSoa?.getProperty("/Lifnr"));
          self.setFilterEQ(aFilters, "Zwels", oModelSoa?.getProperty("/Zwels"));
          self.setFilterEQ(
            aFilters,
            "Zimpliq",
            oModelSoa?.getProperty("/Zimptot")
          );
          self.setFilterEQ(aFilters, "Iban", oModelSoa?.getProperty("/Iban"));

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oModel.read("/RegProspettoLiquidazioneSet", {
                filters: aFilters,
                success: function (data, oResponse) {
                  if (!self.setResponseMessage(oResponse)) {
                    self.setModelCustom(
                      "NewProspettoLiquidazione",
                      data?.results
                    );
                    oModelStepScenario.setProperty("/wizard1Step1", false);
                    oModelStepScenario.setProperty("/wizard1Step2", true);
                    oModelStepScenario.setProperty("/visibleBtnForward", false);
                    oModelStepScenario.setProperty(
                      "/visibleBtnInserisciProspLiquidazione",
                      true
                    );
                  }
                },
                error: function () {},
              });
            });
        },

        _checkNewProspettoLiquidazione: function () {
          var self = this;
          var oModelSoa = self.getModel("Soa");
          var oBundle = self.getResourceBundle();

          if (!oModelSoa.getProperty("/Kostl")) {
            sap.m.MessageBox.error(oBundle.getText("msgKostlRequired"));
            return false;
          }

          //TODO - Rimettere
          // if (!oModelSoa.getProperty("/Hkont")) {
          //   sap.m.MessageBox.error(oBundle.getText("msgHkontRequired"));
          //   return false;
          // }

          return true;
        },

        _createColumnConfig: function () {
          var self = this;
          var oBundle = self.getResourceBundle();
          var aCols = [
            {
              label: oBundle.getText("labelTipoDocumento"),
              property: "TpDoc",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText("labelDataDocumento"),
              property: "DataDoc",
              type: EDM_TYPE.Date,
              format: "dd.mm.yyyy",
            },
            {
              label: oBundle.getText("labelDataCompetenza"),
              property: "DataComp",
              type: EDM_TYPE.Date,
              format: "dd.mm.yyyy",
            },
            {
              label: oBundle.getText("labelDenomBenLiquidazione"),
              property: "ZzragSoc",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText("titleModalitaPagamento"),
              property: "Zdescwels",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText("labelIban"),
              property: "Iban",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText("labelDurc"),
              property: "Zdurc",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText("labelFermoAmministrativo"),
              property: "ZfermAmm",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText("labelImportoLiquidazione"),
              property: "Zimpliq",
              type: EDM_TYPE.Number,
              scale: 2,
              delimiter: true,
            },
          ];

          return aCols;
        },

        //#endregion

        //#endregion

        onSaveNewBeneficiario: function () {
          var self = this;
          var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");
          var bBeneficiarioCreated = oModelNewAnagraficaBen.getProperty(
            "/BeneficiarioCreated"
          );
          var oModelSoa = self.getModel("Soa");

          if (!bBeneficiarioCreated) {
            //Se il Beneficiario non è stato creato procedo con la creazione
            self.saveBeneficiario(function (callback) {
              if (callback.Success) {
                var oItem = self.setParametersNewModPagamento(callback.Lifnr);
                self._getModalitaPagamentoList();
                self._setDurc();
                self._setFermoAmministrativo();
                self.saveModalitaPagamento(oItem, "dlgNewBeneficiario");
              }
            });
          } else {
            //Se il Beneficiario è stato creato ma l'inserimento della modalità
            //di pagamento è andata in errore se premo nuovamente salva
            //salva solo la modalita di pagamento e non il beneficiario
            var oItem = self.setParametersNewModPagamento(
              oModelSoa.getProperty("/Lifnr")
            );
            self.saveModalitaPagamento(oItem, "dlgNewBeneficiario");
          }
        },
      }
    );
  }
);
