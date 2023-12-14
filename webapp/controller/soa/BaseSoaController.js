sap.ui.define(
  [
    "../BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "../../model/formatter",
    "sap/m/MessageBox",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
  ],
  function (
    BaseController,
    Filter,
    FilterOperator,
    JSONModel,
    formatter,
    MessageBox,
    Spreadsheet,
    exportLibrary
  ) {
    "use strict";

    return BaseController.extend("rgssoa.controller.soa.BaseSoaController", {
      formatter: formatter,
      /**
       * @override
       */
      onInit: function () {
        var self = this;

        self.acceptOnlyImport("iptImpDaOrd");
        self.acceptOnlyImport("iptAddImpDaOrd");
        self.acceptOnlyImport("iptImpDaAssociare");
        self.acceptOnlyImport("iptImpDaAssociareCpv");
        self.acceptOnlyImport("iptImpDaAssociareCig");
        self.acceptOnlyImport("iptImpDaAssociareCup");
      },

      //#region ----------------------WIZARD---------------------------------- /

      //#region WIZARD 1

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

      //#region VALUE HELP

      onValueHelpNRegDocumento: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oModelFilter = self.getModel("FilterDocumenti");
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.soa.value-help.filters.NRegDocumento"
        );

        var oSelectDialog = sap.ui.getCore().byId("sdNRegDocumento");
        oSelectDialog.data(
          "PropertyModel",
          oEvent.getSource().data().PropertyModel
        );

        var aFilters = [];
        var aGjahr = oModelFilter.getProperty("/AnnoRegDocumento");

        aGjahr.map((sGjahr) => {
          self.setFilterEQ(aFilters, "Gjahr", sGjahr);
        });

        oDataModel.read("/" + "RicercaNumRegDocSet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setModelDialog(
              "NRegDocumento",
              data,
              "sdNRegDocumento",
              oDialog
            );
          },
          error: function (error) { },
        });
      },
      onValueHelpNRegDocumentoClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelFilter = self.getModel("FilterDocumenti");
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sBelnr = self.setBlank(oSelectedItem?.getTitle());

        oModelFilter.setProperty(
          "/" + oEvent.getSource().data("PropertyModel"),
          sBelnr
        );

        this.unloadFragment();
      },

      onValueHelpNumDocBene: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oModelFilter = self.getModel("FilterDocumenti");
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.soa.value-help.filters.NDocBeneficiario"
        );
        var aFilters = [];
        var aGjahr = oModelFilter.getProperty("/AnnoDocBeneficiario");

        aGjahr.map((sGjahr) => {
          self.setFilterEQ(aFilters, "Gjahr", sGjahr);
        });

        oDataModel.read("/" + "RicercaNumDocBeneSet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setModelDialog(
              "NDocBeneficiario",
              data,
              "sdNDocBeneficiario",
              oDialog
            );
          },
          error: function (error) { },
        });
      },
      onValueHelpNumDocBeneClose: function (oEvent) {
        var self = this;
        var oContexts = oEvent.getParameter("selectedContexts");
        var oModelFilter = self.getModel("FilterDocumenti");

        oModelFilter.setProperty("/NDocBen", []);

        if (oContexts?.length) {
          var aData = oContexts.map((oContext) => {
            return oContext.getObject()["NDocBen"];
          });

          oModelFilter.setProperty("/NDocBen", aData);
        }
        this.unloadFragment();
      },

      onValueHelpCupFilter: function (oEvent) {
        var self = this;
        //Load Models
        var oModelCup = self.getModel("ZSS4_COSP_CONTRATTO_SRV");
        var oSourceData = oEvent.getSource().data();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.soa.value-help.filters.Cup"
        );
        var aFilters = [];

        self.setFilterEQ(aFilters, "Matchcode", "CODICE_CUP");

        oModelCup.read("/MatchCodeContrattoSet", {
          filters: aFilters,
          success: function (data) {
            var aCup = [];
            var aData = data.results;
            aData.map((oData) =>
              aCup.push({
                Zzcup: oData.CodiceCup,
              })
            );
            var oModelJson = new JSONModel();
            oModelJson.setData(aCup);
            var oSelectDialog = sap.ui.getCore().byId("sdCupFilter");
            oSelectDialog?.setModel(oModelJson, "Cup");
            oDialog.open();
          },
          error: function () { },
        });
      },

      onValueHelpCupFilterClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelFilter = self.getModel("FilterDocumenti");
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sZzcup = self.setBlank(oSelectedItem?.getTitle());

        oModelFilter.setProperty("/Cup", sZzcup);

        this.unloadFragment();
      },

      onValueHelpCigFilter: function () {
        var self = this;
        var oModel = self.getModel();
        var oDialog = self.loadFragment("rgssoa.view.fragment.soa.value-help.filters.Cig");

        self.getView().setBusy(true);

        oModel.read("/CigMcSet", {
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            self.setModelDialog("Cig", data, "sdCigFilter", oDialog);
            self.hasResponseError(oResponse);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      onValueHelpCigFilterClose: function (oEvent) {
        var self = this;
        var oModelFilters = self.getModel("FilterDocumenti");
        var oSelectedItem = oEvent.getParameter("selectedItem");

        oModelFilters.setProperty("/Cig", self.setBlank(oSelectedItem?.getTitle()));

        this.unloadFragment();
      },

      onValueHelpDescProspLiquidazione: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.soa.value-help.filters.DescProspLiquidazione"
        );

        oDataModel.read("/" + "RicercaDescProspLiqSet", {
          success: function (data, oResponse) {
            self.setModelDialog(
              "DescProspLiquidazione",
              data,
              "sdDescProspLiquidazione",
              oDialog
            );
          },
          error: function (error) { },
        });
      },
      onValueHelpDescProspLiquidazioneClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelFilter = self.getModel("FilterDocumenti");
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sZdescProsp = self.setBlank(oSelectedItem?.getTitle());

        oModelFilter.setProperty("/ZdescProsp", sZdescProsp);

        this.unloadFragment();
      },

      onValueHelpUffLiquidatore: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.soa.value-help.filters.UfficioLiquidatore"
        );

        oDataModel.read("/" + "RicercaUffLiquidatoreSet", {
          success: function (data, oResponse) {
            self.setModelDialog(
              "UfficioLiquidatore",
              data,
              "sdUfficioLiquidatore",
              oDialog
            );
          },
          error: function (error) { },
        });
      },
      onValueHelpUffLiquidatoreClose: function (oEvent) {
        var self = this;
        var oContexts = oEvent.getParameter("selectedContexts");
        var oModelFilter = self.getModel("FilterDocumenti");

        oModelFilter.setProperty("/Zuffliq", []);

        if (oContexts?.length) {
          var aData = oContexts.map((oContext) => {
            return oContext.getObject()["Zuffliq"];
          });

          oModelFilter.setProperty("/Zuffliq", aData);
        }
        this.unloadFragment();
      },

      onValueHelpCentroCosto: async function () {
        var self = this;
        var oSoa = self.getModel("Soa").getData();
        var oModelCentroCosto = self.getModel("ZSS4_SEARCH_HELP_SRV")
        var oDialog = self.loadFragment("rgssoa.view.fragment.soa.value-help.CentroCosto");
        var aFilters = []

        self.setFilterEQ(aFilters, "Shlpname", 'ZHX_KOST');
        self.setFilterEQ(aFilters, "FilterValue", "Kokrs|" + oSoa.Bukrs);

        self.getView().setBusy(true)
        oModelCentroCosto.read("/ZES_RetFieldValueSet", {
          filters: aFilters,
          success: function (data) {
            self.getView().setBusy(false)
            self.setModelDialog("CentroCosto", data, "sdCentroCosto", oDialog);
          },
          error: function () {
            self.getView().setBusy(false)
          }
        })
      },

      onValueHelpCentroCostoClose: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oSelectedItem = oEvent.getParameter("selectedItem");

        oModelSoa.setProperty("/Kostl", self.setBlank(oSelectedItem?.getTitle()));
        oModelSoa.setProperty("/DescKostl", self.setBlank(oSelectedItem?.getDescription()));

        this.unloadFragment();
      },

      /**--------------------------SCENARIO 4-------------------------------- */


      //#endregion

      //#region SELECTION CHANGE
      onBeneficiarioChange: function (oEvent) {
        var self = this;
        var oModelFilter = self.getModel("FilterDocumenti");

        oModelFilter.setProperty("/QuoteEsigibili", false)
        this._setDataBeneficiario(oEvent.getParameter("value"))
        this._createModelAnnoDocBen(oEvent.getParameter("value"))
      },

      onRitenutaChange: function (oEvent) {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oModelFilter = self.getModel("FilterDocumenti");
        var oSelectedItem = oEvent.getParameter("selectedItem");

        var sCodRitenuta = self.setBlank(oSelectedItem?.getKey());
        var sDescRitenuta = self.setBlank(oSelectedItem?.getText());

        oModelSoa.setProperty("/Witht", sCodRitenuta);
        oModelSoa.setProperty("/Text40", sDescRitenuta);
        oModelFilter.setProperty("/DescRitenuta", sDescRitenuta);

        oModelSoa.setProperty("/ZzCebenra", "");
        oModelSoa.setProperty("/ZzDescebe", "");
        oModelFilter.setProperty("/CodEnte", "");
        oModelFilter.setProperty("/DescEnte", "");

        if (oSelectedItem) {
          this._setSpecieSoaDesc("2");
        } else {
          oModelSoa.setProperty("/DescZspecieSop", "");
          oModelSoa.setProperty("/ZspecieSop", "");
        }

        var aFilters = [];

        self.setFilterEQ(aFilters, "CodRitenuta", sCodRitenuta);

        oModel.read("/RicercaEnteBeneficiarioSet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setModelCustom("RicercaEnteBeneficiario", data?.results);
          },
        });
      },

      onEnteBeneficiarioChange: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oModelFilter = self.getModel("FilterDocumenti");
        var oSelectedItem = oEvent?.getSource()?.getSelectedItem();

        var sCodEnte = self.setBlank(oSelectedItem?.getKey());
        var sDescEnte = self.setBlank(oSelectedItem?.getText());

        oModelSoa.setProperty("/ZzCebenra", self.setBlank(sCodEnte));
        oModelSoa.setProperty("/ZzDescebe", self.setBlank(sDescEnte));
        oModelFilter.setProperty("/DescEnte", self.setBlank(sDescEnte));
      },

      onQuoteEsigibiliChange: function () {
        var self = this;
        var oModelFilter = self.getModel("FilterDocumenti");

        oModelFilter.setProperty("/DataEsigibilitaFrom", null);
        oModelFilter.setProperty("DataEsigibilitaTo", null);
      },

      onBeneficiarioScen4Change: function (oEvent) {
        var self = this;

        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        if (!oEvent.getParameter("value")) {
          oModelSoa.setProperty("/NameFirst", "");
          oModelSoa.setProperty("/NameLast", "");
          oModelSoa.setProperty("/ZzragSoc", "");
          oModelSoa.setProperty("/TaxnumCf", "");
          oModelSoa.setProperty("/Taxnumxl", "");
          oModelSoa.setProperty("/TaxnumPiva", "");
          oModelSoa.setProperty("/Zsede", "");
          oModelSoa.setProperty("/Zdenominazione", "");
          oModelSoa.setProperty("/ZzDescebe", "");
          oModelSoa.setProperty("/Zdurc", "");
          oModelSoa.setProperty("/ZfermAmm", "");
          oModelSoa.setProperty("/Zdstatodes", "");
          oModelSoa.setProperty("/Zdscadenza", "");
          oModelSoa.setProperty("/BuType", "");
          oModelSoa.setProperty("/Zwels", "");
          oModelSoa.setProperty("/Iban", "");
          return;
        }

      },

      onCentroCostoChange: async function (oEvent) {
        var self = this;
        var oModel = self.getModel()
        var oModelSoa = self.getModel("Soa")
        var oSoa = oModelSoa.getData()

        var sKey = oModel.createKey("/CentroCostoSet", {
          Bukrs: oSoa.Bukrs,
          Kostl: oSoa.Kostl
        })

        self.getView().setBusy(true)

        oModel.read(sKey, {
          success: function (data, oResponse) {
            self.getView().setBusy(false)
            oModelSoa.setProperty("/DescKostl", data.Descrizione)
            if (self.hasResponseError(oResponse)) {
              oModelSoa.setProperty("/Kostl", "")
              oModelSoa.setProperty("/DescKostl", "")
            }
          },
          error: function () {
            self.getView().setBusy(false)
          }
        })
      },

      onContoCoGeChange: async function (oEvent) {
        var self = this;
        var oModel = self.getModel()
        var oModelSoa = self.getModel("Soa")
        var oSoa = oModelSoa.getData()

        var sKey = oModel.createKey("/ContoCogeSet", {
          Bukrs: oSoa.Bukrs,
          Gjahr: oSoa.Gjahr,
          Fipos: oSoa.Fipos,
          Saknr: oSoa.Hkont
        })

        self.getView().setBusy(true)

        oModel.read(sKey, {
          success: function (data, oResponse) {
            self.getView().setBusy(false)
            oModelSoa.setProperty("/DescHkont", data.Descrizione)
            if (self.hasResponseError(oResponse)) {
              oModelSoa.setProperty("/Hkont", "")
              oModelSoa.setProperty("/DescHkont", "")
            }
          },
          error: function () {
            self.getView().setBusy(false)
          }
        })
      },

      //#endregion

      //#region PRIVATE METHODS

      _setSpecieSoaDesc: function (sValue) {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oParameters = {
          ZspecieSoa: sValue,
        };
        var sPath = self.getModel().createKey("SpecieSOASet", oParameters);

        oModel.read("/" + sPath, {
          success: function (data, oResponse) {
            oModelSoa.setProperty("/DescZspecieSop", data?.ZdescSpecieSoa);
            oModelSoa.setProperty("/ZspecieSop", data?.ZspecieSoa);
          },
          error: function () { },
        });
      },

      setSoaRegModel: function (sTipopag) {
        var self = this;
        var oModelSoa = {
          EnableEdit: true,
          visibleBtnEdit: false,
          /**  CHIAVI */
          Gjahr: "",
          Bukrs: "",
          Zchiavesop: "",
          Ztipososp: "2",
          Zstep: "",

          /**   Scenario    */
          Ztipopag: sTipopag, //Tipo Pagamento

          /**   Dati SOA (Parte celeste in alto)   */
          Zimptot: "0.00", //Importo
          Zzamministr: "", //Amministrazione
          ZufficioCont: "", //Ufficio Contabile
          NameFirst: "", //Nome Beneficiairo
          NameLast: "", //Cognome Beneficiario
          ZzragSoc: "", //Ragione Sociale
          TaxnumCf: "", //Codice Fiscale
          TaxnumPiva: "", //Partita Iva
          Zgeber: "", //Id Autorizzazione
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
          Zdescriz: "", //Descrizione Codice FD
          ZspecieSop: "", //Specie SOA
          DescZspecieSop: "", //Descrizione Specie SOA
          ZflagFipos: false,

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
          Zdstatodes: "", //Stato DURC
          Zdscadenza: null, //Scandenza DURC

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
          Zalias: "", //Alias RGS
          AccTypeId: "", //Tipo conto
          RegioConto: "", //Provincia
          ZaccText: "", //Descrizione conto
          Zzposfinent: "", //Posizione finanziaria entrate
          Zpurpose: "", //Purpose
          Zflagfrutt: "", //Flag Fruttifero/Infruttifero
          Zcausben: "", //Causale Per Beneficiario
          Seqnr: "",

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
          Zqindiriz2: "", //Indirizzo secondo quietanzante
          Zqcitta2: "", //Citta secondo quietanzante
          Zqcap2: "", //Cap secondo quietanzante
          Zqprovincia2: "", //Provincia secondo quietanzante
          Zstcd14: "", //Identificativo Fiscale Estero (Primo quietanzante)
          Zstcd15: "", //Identificativo Fiscale Estero (Secondo quietanzante)
          ZqragSoc: "", //Ragione sociale
          Land1: "", //Nazione
          Land2: "", //Nazione
          Znumquiet: "", //Numero Queitanzante 1
          Znumquiet2: "", //Numero Queitanzante 1

          /**   WIZARD 2 - Versante    */
          Zcodprov: "", //INPS - Codice Provenienza
          Zcfcommit: "", //INPS - Codice Fiscale Committente
          Zcodtrib: "", //INPS - Codice tributo
          Zperiodrifda: null, //INPS - Periodo riferimento da
          Zperiodrifa: null, //INPS - Periodo riferimento a
          Zcodinps: "", //INPS - Matricola INPS/Codice INPS/Filiale azienda
          Zcfvers: "", //INPS - Codice Fiscale Versante
          Zcodvers: "", //INPS - Codice Versante
          FlagInpsEditabile: false,
          Zdescvers: "", //Descrizione versante
          Zdatavers: null, //Data versamento
          Zprovvers: "", //Provincia versante
          Zsedevers: "", //Sede versante

          /**   WIZARD 2 - Sede Beneficiario */
          Zidsede: "", //Sede Beneficiario
          Stras: "", //Via,numero civico
          Ort01: "", //Località
          RegioSede: "", //Regione
          Pstlz: "", //Codice di avviamento postale
          Land1Sede: "", //Codice paese

          /**   WIZARD 2 - Banca Accredito */
          Zibanb: "", //IBAN
          Zbicb: "", //BIC
          Zcoordestb: "", //Coordinate estere
          Zdenbanca: "", //Denominazione banca
          Zclearsyst: "", //ClearingSystemid
          StrasBanca: "", //Via
          Zcivico: "", //Civico
          Ort01Banca: "", //Città
          RegioBanca: "", //Provincia
          PstlzBanca: "", //CAP
          Land1: "", //Nazione

          /**   WIZARD 2 - Intestatario 1 */
          Zibani: "", //IBAN
          Zbici: "", //BIC
          Zcoordesti: "", //Coordinate estere
          Zdenbancai: "", //Denominazione banca
          Zclearsysti: "", //ClearingSystemid
          Zstrasi: "", //Via
          Zcivicoi: "", //Civico
          Zort01i: "", //Città
          Zregioi: "", //Provincia
          Zpstlzi: "", //CAP
          Zland1i: "", //Nazione

          /**   WIZARD 3    */
          Classificazione: [], //Classificazioni

          /**   WIZARD 4    */
          Zcausale: "", //Causale di pagamento
          ZE2e: "", //E2E ID
          Zlocpag: "", //Località pagamento
          Zzonaint: "", //Zona di intervento
          Znumprot: "", //Numero protocollo
          Zdataprot: null, //Data protocollo
          Zdataesig: null, //Data esigibilità

          ZcodStatoSoa: "",
          Zdatasop: null,
          Znumsop: "",
          Zricann: "",
          ZstatTest: "",
          Zutenza: "",
          Messaggio: [], //Messaggi di error
          NumquietInitial1: false,
          NumquietInitial2: false
        };

        self.setModel(new JSONModel(oModelSoa), "Soa");
      },

      setDataAutorizzazione: function (oParameters) {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty(
          "/Zgeber",
          oParameters.Zgeber === "null" ? "" : oParameters.Zgeber
        );

        var sPath = oModel.createKey("ChiaveAutorizzazioneSet", {
          Gjahr: oParameters.Gjahr,
          Zchiaveaut: oParameters.Zchiaveaut,
          Bukrs: oParameters.Bukrs,
          ZstepAut: "",
        });

        self.getView().setBusy(true);
        oModel.read("/" + sPath, {
          success: function (data, oResponse) {
            self.getView().setBusy(false);

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
            oModelSoa.setProperty("/ZflagFipos", data?.ZflagFipos);
            if (oModelSoa.getProperty("/Ztipopag") === "4") {
              oModelSoa.setProperty("/ZspecieSop", "1");
              oModelSoa.setProperty("/DescZspecieSop", "Sosp Ben.");
            }
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      setClassificazioneRegModel: function () {
        var self = this;

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
      },

      setUtilityRegModel: function (sView) {
        var self = this;
        var oModelUtility = new JSONModel({
          EnableEdit: true,
          DetailFromFunction: true,
          RemoveFunctionButtons: true,
          IbanPrevalorizzato: false,
          isVersanteEditable: false,
          isZcoordEsterPrevalorizzato: false,
          isQuiet1Prevalorizzato: false,
          ViewId: sView,
          isLogVisible: false
        });

        self.setModel(oModelUtility, "Utility");
      },

      setStepScenarioRegModel: function () {
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

        self.setModel(oModelStepScenario, "StepScenario");
      },

      _createModelAnnoDocBen: function (sLifnr) {
        var self = this;
        var oModel = self.getModel();
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", sLifnr);
        self.getView().setBusy(true);

        oModel.read("/RicercaAnnoDocBeneSet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            self.setModel(new JSONModel(data.results), "AnnoDocBeneficiario");
            self.hasResponseError(oResponse);
          },
          error: function () {
            self.getView().setBusy(true);
          },
        });
      },


      checkWizard1: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelStepScenario = self.getModel("StepScenario");
        var oSoa = self.getModel("Soa").getData();
        var aPosizioni = oSoa.data;
        var aPosizioniFormatted = [];
        if (oSoa.Zimptot <= 0) {
          MessageBox.error("L'importo non può essere minore o uguale a 0");
          return;
        }

        if (!self.checkDispAutorizzazione()) {
          return
        }

        aPosizioni.map((oPosition, index) => {
          oPosition.Index = index + 1
          aPosizioniFormatted.push({
            HeaderIndex: "1",
            Index: oPosition.Index.toString(),
            Zimpdaord: oPosition.Zimpdaord,
            Zimppag: oPosition.Zimppag,
            Zimpres: oPosition.Zimpres,
            Zimpliq: oPosition.Zimpliq
          });
        });

        var oParamenters = {
          HeaderIndex: "1",
          Ztipopag: oSoa.Ztipopag,
          ZspecieSop: oSoa.ZspecieSop,
          CheckImportPositionSet: aPosizioniFormatted,
          CheckImportMessageSet: [],
        };

        self.getView().setBusy(true);
        oModel.create("/DeepCheckImportHeaderSet", oParamenters, {
          success: function (data) {
            var aMessage = data?.CheckImportMessageSet?.results;
            if (aMessage.length > 0) {
              self.managementLogDeep(aMessage);
              self.getView().setBusy(false);
              return;
            }

            oModelStepScenario.setProperty("/wizard1Step2", false);
            oModelStepScenario.setProperty("/wizard1Step3", true);
            self.getView().setBusy(false);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      checkDispAutorizzazione: function () {
        //TODO - Rimuovi return
        return true
        var self = this;
        var oSoa = self.getModel("Soa").getData();
        var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

        var fImpTot = parseFloat(oSoa.Zimptot);
        var fImpDispAutorizzazione = parseFloat(oSoa.Zimpdispaut);

        if (fImpTot > fImpDispAutorizzazione) {
          sap.m.MessageBox.error(oBundle.getText("msgImpTotGreaterImpDispAut"));
          return false;
        }

        if (oSoa.data.length === 0 || oModelSoa.Zimptot === "0.00") {
          sap.m.MessageBox.error(oBundle.getText("msgNoDocuments"));
          return false;
        }

        return true;
      },

      //#endregion PRIVATE METHODS

      //#endregion

      //#region WIZARD 2

      createModelSedeBeneficiario: function () {
        var self = this;
        var oModel = self.getModel();
        var oSoa = self.getModel("Soa").getData();
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oSoa.Lifnr);
        self.setFilterEQ(aFilters, "ZspecieSop", oSoa.ZspecieSop);
        self.setFilterEQ(aFilters, "ZzCebenra", oSoa.ZzCebenra);
        self.setFilterEQ(aFilters, "Witht", oSoa.Witht);

        self.getView().setBusy(true);
        oModel.read("/SedeBeneficiarioSOASet", {
          filters: aFilters,
          success: function (data) {
            self.getView().setBusy(false);
            self.setModel(new JSONModel(data.results), "SedeBeneficiario");
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      createModelModPagamento: function () {
        var self = this;
        var oSoa = self.getModel("Soa").getData();
        var oModel = self.getModel();
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oSoa.Lifnr);
        self.setFilterEQ(aFilters, "ZspecieSop", oSoa.ZspecieSop);
        self.setFilterEQ(aFilters, "Qsskz", oSoa.Witht);
        self.setFilterEQ(aFilters, "ZzCebenra", oSoa.ZzCebenra);
        self.getView().setBusy(true);

        oModel.read("/ModalitaPagamentoSet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            var aData = data.results
            self.setModel(new JSONModel(aData), "ModalitaPagamento");
            self.hasResponseError(oResponse);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      //#region VALUE HELP

      onValueHelpQuietanzante1: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oDialog = self.loadFragment("rgssoa.view.fragment.soa.value-help.Quietanzante1");
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oModelSoa?.getProperty("/Lifnr"));
        self.setFilterEQ(aFilters, "Ztipofirma", oModelSoa?.getProperty("/Ztipofirma"));
        self.setFilterEQ(aFilters, "Qsskz", oModelSoa?.getProperty("/Witht"));
        self.setFilterEQ(aFilters, "ZzCebenra", oModelSoa?.getProperty("/ZzCebenra"));

        oDataModel.read("/Quietanzante1Set", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setModelDialog("Quietanzante1", data, "sdQuietanzante1", oDialog);
          },
          error: function (error) { },
        });
      },

      onValueHelpQuietanzante1Close: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();
        var oSelectedItem = oEvent?.getParameter("selectedItem");
        var sCodiceFiscale = self.setBlank(oSelectedItem?.getTitle());
        if (!sCodiceFiscale) {
          self.resetQuietanzante1()
        }
        var sZnumquiet = oEvent?.getParameter("selectedItem")?.data("Znumquiet");
        var bNumquietInitial1 = oEvent?.getParameter("selectedItem")?.data("NumquietInitial");

        oModelSoa.setProperty("/Znumquiet", sZnumquiet);
        oModelSoa.setProperty("/NumquietInitial1", bNumquietInitial1);
        if (oSoa.Zwels === "ID1") {
          oModelSoa.setProperty("/Zstcd1", sCodiceFiscale);
        } else {
          oModelSoa.setProperty("/Zstcd3", sCodiceFiscale);
        }

        self._setDataQuietanzante1(sCodiceFiscale);

        self.unloadFragment();
      },

      onValueHelpQuietanzante2: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oDialog = self.loadFragment("rgssoa.view.fragment.soa.value-help.Quietanzante2");
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oModelSoa?.getProperty("/Lifnr"));
        self.setFilterEQ(aFilters, "Ztipofirma", oModelSoa?.getProperty("/Ztipofirma"));
        self.setFilterEQ(aFilters, "Qsskz", oModelSoa?.getProperty("/Witht"));
        self.setFilterEQ(aFilters, "ZzCebenra", oModelSoa?.getProperty("/ZzCebenra"));

        oDataModel.read("/Quietanzante2Set", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setModelDialog("Quietanzante2", data, "sdQuietanzante2", oDialog);
          },
          error: function (error) { },
        });
      },

      onValueHelpQuietanzante2Close: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oSelectedItem = oEvent?.getParameter("selectedItem");
        var sCodiceFiscale = self.setBlank(oSelectedItem?.getTitle());
        if (!sCodiceFiscale) {
          self.resetQuietanzante2()
        }
        var sZnumquiet2 = oEvent?.getParameter("selectedItem")?.data("Znumquiet2");
        var bNumquietInitial1 = oEvent?.getParameter("selectedItem")?.data("NumquietInitial");

        oModelSoa.setProperty("/Znumquiet2", sZnumquiet2);
        oModelSoa.setProperty("/NumquietInitial2", bNumquietInitial1);
        oModelSoa.setProperty("/Zstcd12", sCodiceFiscale);

        self._setDataQuietanzante2();

        self.unloadFragment();
      },

      onValueHelpQuietEstero1: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oDialog = self.loadFragment("rgssoa.view.fragment.soa.value-help.QuietanzanteEstero1");
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oModelSoa?.getProperty("/Lifnr"));
        self.setFilterEQ(aFilters, "Ztipofirma", oModelSoa?.getProperty("/Ztipofirma"));
        self.setFilterEQ(aFilters, "Qsskz", oModelSoa?.getProperty("/Witht"));
        self.setFilterEQ(aFilters, "ZzCebenra", oModelSoa?.getProperty("/ZzCebenra"));

        oDataModel.read("/Quietanzante1EsteroSet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setModelDialog("QuietEstero1", data, "sdQuietEstero1", oDialog);
          },
          error: function (error) { },
        });
      },

      onValueHelpQuietEstero1Close: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oSelectedItem = oEvent?.getParameter("selectedItem");
        var sCodiceFiscale = self.setBlank(oSelectedItem?.getTitle());
        if (!sCodiceFiscale) {
          self.resetQuietanzante1()
        }
        var bNumquietInitial1 = oEvent?.getParameter("selectedItem")?.data("NumquietInitial");

        oModelSoa.setProperty("/NumquietInitial2", bNumquietInitial1);
        oModelSoa.setProperty("/Zstcd14", sCodiceFiscale);

        self._setDataQuietEstero1();

        self.unloadFragment();
      },

      onValueHelpQuietEstero2: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oDialog = self.loadFragment("rgssoa.view.fragment.soa.value-help.QuietanzanteEstero2");
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oModelSoa?.getProperty("/Lifnr"));
        self.setFilterEQ(aFilters, "Ztipofirma", oModelSoa?.getProperty("/Ztipofirma"));
        self.setFilterEQ(aFilters, "Qsskz", oModelSoa?.getProperty("/Witht"));
        self.setFilterEQ(aFilters, "ZzCebenra", oModelSoa?.getProperty("/ZzCebenra"));

        oDataModel.read("/Quietanzante2EsteroSet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setModelDialog("QuietEstero2", data, "sdQuietEstero2", oDialog);
          },
          error: function (error) { },
        });
      },

      onValueHelpQuietEstero2Close: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oSelectedItem = oEvent?.getParameter("selectedItem");
        var sCodiceFiscale = self.setBlank(oSelectedItem?.getTitle());
        if (!sCodiceFiscale) {
          self.resetQuietanzante2()
        }
        var bNumquietInitial1 = oEvent?.getParameter("selectedItem")?.data("NumquietInitial");

        oModelSoa.setProperty("/NumquietInitial2", bNumquietInitial1);
        oModelSoa.setProperty("/Zstcd15", sCodiceFiscale);

        self._setDataQuietEstero2();

        self.unloadFragment();
      },

      onValueHelpCoordEstere: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oDialog = self.loadFragment("rgssoa.view.fragment.soa.value-help.CoordinateEstere");
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oModelSoa?.getProperty("/Lifnr"));
        self.getView().setBusy(true);

        oModel.read("/CoordinateEstereSet", {
          filters: aFilters,
          success: function (data) {
            self.getView().setBusy(false);
            self.setModelDialog("CoordinateEstere", data, "sdCoordEstere", oDialog);
          },
          error: function (error) {
            self.getView().setBusy(false);
          },
        });
      },

      onValueHelpCoordEstereClose: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oSelectedItem = oEvent?.getParameter("selectedItem");

        oModelSoa.setProperty("/Zcoordest", self.setBlank(oSelectedItem?.getTitle()));
        self.setPaeseResidenza();
        self.setBic();

        self.unloadFragment();
      },

      //#endregion

      //#region SELECTION CHANGE

      onAliasChange: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var sZalias = oModelSoa.getProperty("/Zalias");

        if (!sZalias) {
          oModelSoa.setProperty("/AccTypeId", "");
          oModelSoa.setProperty("/RegioConto", "");
          oModelSoa.setProperty("/ZaccText", "");
          oModelSoa.setProperty("/Iban", "");
          return;
        }

        self.setIban();

        var sPath = oModel.createKey("/AliasSet", {
          Zalias: sZalias,
        });

        oModel.read(sPath, {
          success: function (data) {
            oModelSoa.setProperty("/AccTypeId", data.AccTypeId);
            oModelSoa.setProperty("/RegioConto", data.Regio);
            oModelSoa.setProperty("/ZaccText", data.ZaccText);
          },
          error: function () { },
        });
      },

      onTipoFirmaChange: function (oEvent) {
        var self = this;
        var sTipoFirma = oEvent.getSource().getSelectedKey();

        this.resetQuietanzante1();
        this.resetQuietanzante2();


        if (sTipoFirma) {
          self.setQuietanzante1();
        }

        if (sTipoFirma === "03" && sTipoFirma === "04") {
          this.setQuietanzante2();
        }


      },

      onQuietanzante1Change: function (oEvent) {
        if (oEvent.getParameter("value")) {
          this._setDataQuietanzante1(oEvent.getParameter("value"));
        } else {
          this.resetQuietanzante1();
        }
      },

      onQuietanzante2Change: function (oEvent) {
        if (oEvent.getParameter("value")) {
          this._setDataQuietanzante2();
        } else {
          this.resetQuietanzante2();
        }
      },

      onQuietEstero1Change: function (oEvent) {
        if (oEvent.getParameter("value")) {
          this._setDataQuietEstero1();
        } else {
          this.resetQuietanzante1();
        }
      },

      onQuietEstero2Change: function (oEvent) {
        if (oEvent.getParameter("value")) {
          this._setDataQuietEstero2();
        } else {
          this.resetQuietanzante2();
        }
      },

      onIbanChange: function () {
        this.checkIban();
      },

      onSedeBeneficiarioChange: function (oEvent) {
        this.setSedeBeneficiario();
      },

      onModalitaPagamentoChange: async function (oEvent) {
        var self = this;
        var oModel = self.getModel()
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData()
        var oModelUtility = self.getModel("Utility");
        var sZwels = oEvent.getSource().getSelectedKey();
        oModelSoa.setProperty("/Zdescwels", self.setBlank(oEvent.getSource()?.getSelectedItem()?.getText()))

        if (!oModelUtility.getProperty("/isIbanPrevalorizzato") || !sZwels) {
          oModelSoa.setProperty("/Iban", "");
          oModelSoa.setProperty("/Banks", "");
        }

        if (oModelUtility.getProperty("/isVersanteEditable") && (oModelSoa.getProperty("/Zwels") === "ID4" || oModelSoa.getProperty("/Zwels") === "ID3")) {
          this._getCodProvenienza();
        }
        await this._resetDataModalitaPagamento();

        if (!sZwels) {
          return;
        }

        this.setIban(true);
        this.setCoordinateEstere();

        if (sZwels === 'ID2') {
          var sKey = oModel.createKey("/Quietanzante1Set", {
            Zstcd1: "",
            Zwels: oSoa.Zwels,
            Lifnr: oSoa.Lifnr,
            NumquietInitial: true,
            Qsskz: oSoa.Witht,
            ZzCebenra: oSoa.ZzCebenra,
            Ztipofirma: oSoa.Ztipofirma
          });

          self.getView().setBusy(true);
          oModel.read(sKey, {
            success: function (data, oResponse) {
              self.getView().setBusy(false);
              oModelSoa.setProperty("/Zstcd1", data.Zstcd1);
              oModelSoa.setProperty("/ZpersCognomeQuiet1", data.ZpersCognomeQuiet1);
              oModelSoa.setProperty("/ZpersNomeQuiet1", data.ZpersNomeQuiet1);
              oModelSoa.setProperty("/ZpersCognomeVaglia", data.ZpersCognomeVaglia);
              oModelSoa.setProperty("/ZpersNomeVaglia", data.ZpersNomeVaglia);
              oModelSoa.setProperty("/Land1", data.Land1);
              oModelSoa.setProperty("/Zqcap", data.Zqcap);
              oModelSoa.setProperty("/Zqcitta", data.Zqcitta);
              oModelSoa.setProperty("/Zqindiriz", data.Zqindiriz);
              oModelSoa.setProperty("/Zqprovincia", data.Zqprovincia);
              oModelSoa.setProperty("/ZqragSoc", data.ZzragSoc);
              oModelSoa.setProperty("/Znumquiet", data.Znumquiet);
              self.hasResponseError(oResponse);
            },
            error: function () {
              self.getView().setBusy(false);
            },
          });
        }
      },

      onCausaleValutariaChange: function (oEvent) {
        this.checkCasualeValutaria();
      },

      onCoordinateEstereChange: function (oEvent) {
        this._checkCoordinateEstere();
        this.setPaeseResidenza();
        this.setBic();
      },

      //Cambio IBAN
      onOkMotivazione: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var sMotivazione = sap.ui.getCore().byId("txtMotivazione")?.getValue();
        var oDialogMotivazione = sap.ui.getCore().byId("dlgMotivazione");

        oDialogMotivazione.close();
        self.unloadFragment();

        if (!sMotivazione) {
          MessageBox.error("Motivazione cambio IBAN obbligatoria", {
            title: "Errore",
          });
          oModelSoa.setProperty("/Iban", "");
          return;
        }

        oModelSoa.setProperty("/Zmotivaz", sMotivazione);
      },

      onCloseMotivazione: function () {
        var self = this;
        var oDialogMotivazione = sap.ui.getCore().byId("dlgMotivazione");
        oDialogMotivazione.close();
        self.unloadFragment();
      },

      //#endregion

      //#region PRIVATE METHODS

      _getCodProvenienza: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var sKey = oModel.createKey("/CodiceProvenienzaSet", {
          Zcodprov: "",
        });

        self.getView().setBusy(true);
        oModel.read(sKey, {
          success: function (data) {
            oModelSoa.setProperty("/Zcodprov", data.Zcodprov);
            self.getView().setBusy(false);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      checkLifnrInTvarvc: function () {
        var self = this;
        var oModel = self.getModel();
        var oSoa = self.getModel("Soa").getData();

        self.getView().setBusy(true);
        return new Promise(async function (resolve, reject) {
          await oModel.callFunction("/CheckLifnrInTvarvc", {
            urlParameters: {
              Lifnr: oSoa.Lifnr,
            },
            success: function (data, oResponse) {
              self.getView().setBusy(false);
              resolve(data?.CheckLifnrInTvarvc?.Editable);
            },
            error: function (e) {
              self.getView().setBusy(false);
              reject(e);
            },
          });
        });
      },

      _resetDataModalitaPagamento: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var sZwels = oModelSoa.getProperty("/Zwels");

        if (sZwels !== "ID3") {
          oModelSoa.setProperty("/Zalias", "");
          oModelSoa.setProperty("/AccTypeId", "");
          oModelSoa.setProperty("/RegioConto", "");
          oModelSoa.setProperty("/ZaccText", "");
          oModelSoa.setProperty("/Zflagfrutt", "");
          oModelSoa.setProperty("/Zcausben", "");
        }
        if (sZwels !== "ID4") {
          oModelSoa.setProperty("/Zzposfinent", "");
        }
        if (sZwels !== "ID6" && sZwels !== "ID10") {
          oModelSoa.setProperty("/Swift", "");
          oModelSoa.setProperty("/Zcoordest", "");
          oModelSoa.setProperty("/Zpurpose", "");

          oModelSoa.setProperty("/Zibanb", "");
          oModelSoa.setProperty("/Zbicb", "");
          oModelSoa.setProperty("/Zcoordestb", "");
          oModelSoa.setProperty("/Zdenbanca", "");
          oModelSoa.setProperty("/Zclearsyst", "");
          oModelSoa.setProperty("/StrasBanca", "");
          oModelSoa.setProperty("/Zcivico", "");
          oModelSoa.setProperty("/Ort01Banca", "");
          oModelSoa.setProperty("/RegioBanca", "");
          oModelSoa.setProperty("/PstlzBanca", "");
          oModelSoa.setProperty("/Land1", "");

          oModelSoa.setProperty("/Zibani", "");
          oModelSoa.setProperty("/Zbici", "");
          oModelSoa.setProperty("/Zcoordesti", "");
          oModelSoa.setProperty("/Zdenbancai", "");
          oModelSoa.setProperty("/Zclearsysti", "");
          oModelSoa.setProperty("/Zstrasi", "");
          oModelSoa.setProperty("/Zcivicoi", "");
          oModelSoa.setProperty("/Zort01i", "");
          oModelSoa.setProperty("/Zregioi", "");
          oModelSoa.setProperty("/Zpstlzi", "");
          oModelSoa.setProperty("/Zland1i", "");
        }

        oModelSoa.setProperty("/Ztipofirma", "");
        this.resetQuietanzante1();
        this.resetQuietanzante2();

        if (sZwels !== "ID3" && sZwels !== "ID4") {
          oModelSoa.setProperty("/Zcodprov", "");
          oModelSoa.setProperty("/Zcfcommit", "");
          oModelSoa.setProperty("/Zcodtrib", "");
          oModelSoa.setProperty("/Zperiodrifda", null);
          oModelSoa.setProperty("/Zperiodrifa", null);
          oModelSoa.setProperty("/Zcodinps", "");
          oModelSoa.setProperty("/Zdescvers", "");
          oModelSoa.setProperty("/Zdatavers", null);
          oModelSoa.setProperty("/Zprovvers", "");
          oModelSoa.setProperty("/Zsedevers", "");
        }
      },

      setSedeBeneficiario: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        var sKey = oModel.createKey("/SedeBeneficiarioSOASet", {
          Lifnr: oSoa.Lifnr,
          ZspecieSop: oSoa.ZspecieSop,
          Zidsede: oModelSoa.getProperty("/Zidsede"),
          Witht: oSoa.Witht,
          ZzCebenra: oSoa.ZzCebenra,
        });

        self.getView().setBusy(true);

        oModel.read(sKey, {
          success: function (data) {
            oModelSoa.setProperty("/Zidsede", data.Zidsede);
            oModelSoa.setProperty("/Stras", data.Stras);
            oModelSoa.setProperty("/RegioSede", data.Regio);
            oModelSoa.setProperty("/Pstlz", data.Pstlz);
            oModelSoa.setProperty("/Ort01", data.Ort01);
            oModelSoa.setProperty("/Land1Sede", data.Land1);
            self.getView().setBusy(false);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      setPaeseResidenza: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        var sKey = oModel.createKey("/PaeseBancaSet", {
          Zwels: oSoa.Zwels,
          ZspecieSop: oSoa.ZspecieSop,
          Iban: oSoa.Iban,
          Zcoordest: oSoa.Zcoordest,
          Lifnr: oSoa.Lifnr,
        });
        self.getView().setBusy(true);

        oModel.read(sKey, {
          success: function (data) {
            self.getView().setBusy(false);
            if (data.Banks === "" || data.Banks === "IT") {
              oModelSoa.setProperty("/ZCausaleval", "");
              oModelSoa.setProperty("/ZDesccauval", "");
            }
            oModelSoa.setProperty("/Banks", data.Banks);
            oModelSoa.setProperty("/Seqnr", data.Seqnr);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      setBancaAccredito: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        if (!((oSoa.Iban || oSoa.Zcoordest) && (oSoa.Zwels === "ID6" || oSoa.Zwels === "ID10"))) {
          oModelSoa.setProperty("/Zibanb", "");
          oModelSoa.setProperty("/Zbicb", "");
          oModelSoa.setProperty("/Zcoordestb", "");
          oModelSoa.setProperty("/Zdenbanca", "");
          oModelSoa.setProperty("/Zclearsyst", "");
          oModelSoa.setProperty("/StrasBanca", "");
          oModelSoa.setProperty("/Zcivico", "");
          oModelSoa.setProperty("/Ort01Banca", "");
          oModelSoa.setProperty("/RegioBanca", "");
          oModelSoa.setProperty("/PstlzBanca", "");
          return;
        }

        var sKey = oModel.createKey("/BancaAccreditoSet", {
          Lifnr: oSoa.Lifnr,
          Iban: oSoa.Iban,
          Zcoordest: oSoa.Zcoordest,
          Qsskz: oSoa.Witht,
          ZzCebenra: oSoa.ZzCebenra
        });
        self.getView().setBusy(true);

        oModel.read(sKey, {
          success: function (data) {
            self.getView().setBusy(false);
            oModelSoa.setProperty("/Zibanb", data?.Zibanb);
            oModelSoa.setProperty("/Zbicb", data?.Zbicb);
            oModelSoa.setProperty("/Zcoordestb", data?.Zcoordestb);
            oModelSoa.setProperty("/Zdenbanca", data?.Zdenbanca);
            oModelSoa.setProperty("/Zclearsyst", data?.Zclearsyst);
            oModelSoa.setProperty("/StrasBanca", data?.Stras);
            oModelSoa.setProperty("/Zcivico", data?.Zcivico);
            oModelSoa.setProperty("/Ort01Banca", data?.Ort01);
            oModelSoa.setProperty("/RegioBanca", data?.Regio);
            oModelSoa.setProperty("/PstlzBanca", data?.Pstlz);
            oModelSoa.setProperty("/Land1", data?.Land1);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      setIntermediario1: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        if (!((oSoa.Iban || oSoa.Zcoordest) && (oSoa.Zwels === "ID6" || oSoa.Zwels === "ID10"))) {
          oModelSoa.setProperty("/Zibani", "");
          oModelSoa.setProperty("/Zbici", "");
          oModelSoa.setProperty("/Zcoordesti", "");
          oModelSoa.setProperty("/Zdenbancai", "");
          oModelSoa.setProperty("/Zclearsysti", "");
          oModelSoa.setProperty("/Zstrasi", "");
          oModelSoa.setProperty("/Zcivicoi", "");
          oModelSoa.setProperty("/Zort01i", "");
          oModelSoa.setProperty("/Zregioi", "");
          oModelSoa.setProperty("/Zpstlzi", "");
          oModelSoa.setProperty("/Zland1i", "");
          return;
        }

        var sKey = oModel.createKey("/Intermediario1Set", {
          Lifnr: oSoa.Lifnr,
          Iban: oSoa.Iban,
          Zcoordest: oSoa.Zcoordest,
          Qsskz: oSoa.Witht,
          ZzCebenra: oSoa.ZzCebenra
        });
        self.getView().setBusy(true);

        oModel.read(sKey, {
          success: function (data) {
            self.getView().setBusy(false);
            oModelSoa.setProperty("/Zibani", data?.Zibani);
            oModelSoa.setProperty("/Zbici", data?.Zbici);
            oModelSoa.setProperty("/Zcoordesti", data?.Zcoordesti);
            oModelSoa.setProperty("/Zdenbancai", data?.Zdenbancai);
            oModelSoa.setProperty("/Zclearsysti", data?.Zclearsysti);
            oModelSoa.setProperty("/Zstrasi", data?.Zstrasi);
            oModelSoa.setProperty("/Zcivicoi", data?.Zcivicoi);
            oModelSoa.setProperty("/Zort01i", data?.Zort01i);
            oModelSoa.setProperty("/Zregioi", data?.Zregioi);
            oModelSoa.setProperty("/Zpstlzi", data?.Zpstlzi);
            oModelSoa.setProperty("/Zland1i", data?.Zland1i);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      setCoordinateEstere: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oModelUtility = self.getModel("Utility");
        var oSoa = oModelSoa.getData();
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oSoa.Lifnr);

        if (oSoa.Zwels !== "ID6" && oSoa.Zwels !== "ID10") {
          return;
        }

        self.getView().setBusy(true);
        oModel.read("/CoordinateEstereSet", {
          filters: aFilters,
          success: function (data) {
            self.getView().setBusy(false);
            var aData = data.results;
            if (aData.length === 1) {
              oModelSoa.setProperty("/Zcoordest", aData[0]?.Zcoordest);
              oModelUtility.setProperty("/isZcoordEsterPrevalorizzato", true);
              self.setPaeseResidenza();
              self.setBic();
            }
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      setBic: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        var sKey = oModel.createKey("/SwiftSet", {
          Lifnr: oSoa.Lifnr,
          Zwels: oSoa.Zwels,
          Zcoordest: oSoa.Zcoordest,
        });

        self.getView().setBusy(true);

        oModel.read(sKey, {
          success: function (data) {
            oModelSoa.setProperty("/Swift", data.Bic);
            self.getView().setBusy(false);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      setPaeseResidenza: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        var sKey = oModel.createKey("/PaeseBancaSet", {
          Zwels: oSoa.Zwels,
          ZspecieSop: oSoa.ZspecieSop,
          Iban: oSoa.Iban,
          Zcoordest: oSoa.Zcoordest,
          Lifnr: oSoa.Lifnr,
        });
        self.getView().setBusy(true);

        oModel.read(sKey, {
          success: function (data) {
            self.getView().setBusy(false);
            if (data.Banks === "" || data.Banks === "IT") {
              oModelSoa.setProperty("/ZCausaleval", "");
              oModelSoa.setProperty("/ZDesccauval", "");
            }
            oModelSoa.setProperty("/Banks", data.Banks);
            oModelSoa.setProperty("/Seqnr", data.Seqnr);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      checkCasualeValutaria: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        var sKey = oModel.createKey("/CausaleValutariaSet", {
          ZCausaleval: oSoa.ZCausaleval,
        });

        oModel.read(sKey, {
          success: function (data, oResponse) {
            if (self.hasResponseError(oResponse)) {
              oModelSoa.setProperty("/ZCausaleval", "");
              oModelSoa.setProperty("/ZDesccauval", "");
            }
          },
          error: function () { },
        });
      },

      _checkCoordinateEstere: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        var sKey = oModel.createKey("/CoordinateEstereSet", {
          Lifnr: oSoa.Lifnr,
          Zcoordest: oSoa.Zcoordest,
        });

        self.getView().setBusy(true);
        oModel.read(sKey, {
          success: function (data, oResponse) {
            if (self.hasResponseError(oResponse)) {
              oModelSoa.setProperty("/Zcoordest", "");
            }
            self.getView().setBusy(false);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      setModalitaPagamentoQuote: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        if (oSoa.ZspecieSop === '1') {
          return;
        }

        if (oSoa?.data) {
          var aPosizioniFormatted = oSoa?.data?.map((oPosition) => {
            var oPosizioneFormatted = {
              Bukrs: oPosition?.Bukrs,
              Znumliq: oPosition?.Znumliq,
              Zposizione: oPosition?.Zposizione,
              Zversione: oPosition?.Zversione,
              ZversioneOrig: oPosition?.ZversioneOrig,
              Docid: oPosition?.Docid,
            };

            return oPosizioneFormatted;
          });
        }

        var sKey = oModel.createKey("/ModalitaPagamentoSet", {
          ZspecieSop: oSoa.ZspecieSop,
          Zwels: "",
          Json: JSON.stringify(aPosizioniFormatted),

        });

        self.getView().setBusy(true);
        oModel.read(sKey, {
          success: function (data) {
            oModelSoa.setProperty("/Zwels", data?.Zwels)
            oModelSoa.setProperty("/Zdesczwels", data?.Zdesczwels)
            self.getView().setBusy(false);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      checkWizard2: function (oWizard) {
        var self = this;
        var oModel = self.getModel();
        var oSoa = self.getModel("Soa").getData();
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelUtility = self.getModel("Utility");

        var oParamenters = {
          ZspecieSop: oSoa?.ZspecieSop,
          Zwels: oSoa?.Zwels,
          Ztipofirma: oSoa?.Ztipofirma,
          Iban: oSoa?.Iban,
          Zcoordest: oSoa?.Zcoordest,
          Zstcd1: oSoa?.Zstcd1,
          Zstcd14: oSoa?.Zstcd14,
          Zstcd12: oSoa?.Zstcd12,
          Zstcd15: oSoa?.Zstcd15,
          Zalias: oSoa?.Zalias,
          Zzposfinent: oSoa?.Zzposfinent,
          Zflagfrutt: oSoa?.Zflagfrutt,
          Zimptot: oSoa?.Zimptot,
        };

        self.getView().setBusy(true);
        oModel.callFunction("/CheckWizard2", {
          urlParameters: oParamenters,
          success: function (data, oResponse) {
            var aMessage = data?.results;
            if (aMessage.length > 0) {
              self.managementLogFI(aMessage);
              self.getView().setBusy(false);
              return;
            }
            self.getView().setBusy(false);
            oModelUtility.setProperty("/isLogVisible", false);
            oModelStepScenario.setProperty("/wizard2", false);
            oModelStepScenario.setProperty("/wizard3", true);
            oWizard.nextStep();
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      //Iban

      setIbanQuote: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oModelUtility = self.getModel("Utility");
        var oSoa = oModelSoa.getData();

        if (oSoa.Iban) {
          return;
        }

        if (oSoa?.data) {
          var aPosizioniFormatted = oSoa?.data?.map((oPosition) => {
            var oPosizioneFormatted = {
              Bukrs: oPosition?.Bukrs,
              Znumliq: oPosition?.Znumliq,
              Zposizione: oPosition?.Zposizione,
              Zversione: oPosition?.Zversione,
              ZversioneOrig: oPosition?.ZversioneOrig,
              Docid: oPosition?.Docid,
            };

            return oPosizioneFormatted;
          });
        }

        var sKey = oModel.createKey("/IbanBeneficiarioSet", {
          ZspecieSop: oSoa.ZspecieSop,
          Zwels: "",
          Iban: "",
          Json: JSON.stringify(aPosizioniFormatted),
          Lifnr: oSoa.Lifnr,
          Qsskz: "",
          ZzCebenra: ""
        });

        self.getView().setBusy(true);
        oModel.read(sKey, {
          urlParameters: {
            AliasRgs: oSoa.Zalias,
          },
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            oModelSoa.setProperty("/Iban", data?.Iban);
            if (data?.Iban) {
              oModelUtility.setProperty("/isIbanPrevalorizzato", true);
              self._sIbanPrevalorizzato = data?.Iban
            } else {
              oModelUtility.setProperty("/isIbanPrevalorizzato", false);
            }
            if (self.hasResponseError(oResponse)) {
              oModelSoa.setProperty("/Iban", "");
              oModelSoa.setProperty("/Banks", "");
              return;
            }
            self.setDataIban();
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      setIban: function (bModalitaPagamento = false) {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();
        var sZspecieSop = oSoa.ZspecieSop

        var sKey = oModel.createKey("/IbanBeneficiarioSet", {
          ZspecieSop: oSoa.ZspecieSop,
          Zwels: oSoa.Zwels,
          Iban: "",
          Json: "",
          Lifnr: oSoa.Lifnr,
          Qsskz: oSoa.Witht,
          ZzCebenra: oSoa.ZzCebenra
        });

        self.getView().setBusy(true);
        oModel.read(sKey, {
          urlParameters: {
            AliasRgs: oSoa.Zalias,
          },
          success: function (data, oResponse) {
            self.getView().setBusy(false);

            switch (sZspecieSop) {
              case "1": {
                if (oSoa.Zwels === "ID1" || oSoa.Zwels === "ID2" || oSoa.Zwels === "ID3" || oSoa.Zwels === "ID4") {
                  oModelSoa.setProperty("/Iban", data?.Iban);
                }
                break;
              }
              case "2": {
                if (oSoa.Zwels === "ID3" || oSoa.Zwels === "ID4" || oSoa.Zwels === "ID5") {
                  oModelSoa.setProperty("/Iban", data?.Iban);
                }
                break;
              }
            }

            self.checkIban(bModalitaPagamento);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      checkIban: function (bModalitaPagamento) {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();
        var oModelUtility = self.getModel("Utility")

        var sKey = oModel.createKey("/IbanBeneficiarioSet", {
          ZspecieSop: oSoa.ZspecieSop,
          Zwels: oSoa.Zwels,
          Iban: oModelSoa.getProperty("/Iban"),
          Json: "",
          Lifnr: oSoa.Lifnr,
          Qsskz: oSoa.Witht,
          ZzCebenra: oSoa.ZzCebenra
        });

        self.getView().setBusy(true);
        oModel.read(sKey, {
          urlParameters: {
            AliasRgs: oSoa.Zalias,
          },
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            if (self.hasResponseError(oResponse)) {
              oModelSoa.setProperty("/Iban", "");
              oModelSoa.setProperty("/Banks", "");
              return;
            }
            if (
              oModelUtility.getProperty("/isIbanPrevalorizzato") &&
              self._sIbanPrevalorizzato !== oModelSoa.getProperty("/Iban") &&
              !bModalitaPagamento
            ) {
              var oDialogMotivazione = self.loadFragment("rgssoa.view.fragment.soa.wizard2.Motivazione");
              oModelUtility.setProperty("/isIbanPrevalorizzato", false);
              oDialogMotivazione.open();
            }
            self.setDataIban();
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      setDataIban: function () {
        this.setPaeseResidenza();
        this.setBancaAccredito();
        this.setIntermediario1();
      },

      //Quietanzante

      _setDataQuietanzante1: function (sCodiceFiscale) {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        if (!sCodiceFiscale) {
          return;
        }

        var sKey = oModel.createKey("/Quietanzante1Set", {
          Zstcd1: sCodiceFiscale,
          Zwels: oSoa.Zwels,
          Lifnr: oSoa.Lifnr,
          NumquietInitial: oSoa.NumquietInitial1 ? oSoa.NumquietInitial1 : false,
          Qsskz: oSoa.Witht,
          ZzCebenra: oSoa.ZzCebenra,
          Ztipofirma: oSoa.Ztipofirma
        });

        self.getView().setBusy(true);
        oModel.read(sKey, {
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            oModelSoa.setProperty("/Zstcd1", data.Zstcd1);
            oModelSoa.setProperty("/ZpersCognomeQuiet1", data.ZpersCognomeQuiet1);
            oModelSoa.setProperty("/ZpersNomeQuiet1", data.ZpersNomeQuiet1);
            oModelSoa.setProperty("/ZpersCognomeVaglia", data.ZpersCognomeVaglia);
            oModelSoa.setProperty("/ZpersNomeVaglia", data.ZpersNomeVaglia);
            oModelSoa.setProperty("/Land1", data.Land1);
            oModelSoa.setProperty("/Zqcap", data.Zqcap);
            oModelSoa.setProperty("/Zqcitta", data.Zqcitta);
            oModelSoa.setProperty("/Zqindiriz", data.Zqindiriz);
            oModelSoa.setProperty("/Zqprovincia", data.Zqprovincia);
            oModelSoa.setProperty("/ZqragSoc", data.ZzragSoc);
            oModelSoa.setProperty("/Znumquiet", data.Znumquiet);
            if (self.hasResponseError(oResponse)) {
              oModelSoa.setProperty("/Zstcd1", "")
            };
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      _setDataQuietanzante2: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        if (!oSoa.Zstcd12) {
          return;
        }

        var sKey = oModel.createKey("/Quietanzante2Set", {
          Zstcd12: oSoa.Zstcd12,
          Lifnr: oSoa.Lifnr,
          NumquietInitial: oSoa.NumquietInitial2 ? oSoa.NumquietInitial2 : false,
          Qsskz: oSoa.Witht,
          ZzCebenra: oSoa.ZzCebenra,
          Ztipofirma: oSoa.Ztipofirma
        });

        self.getView().setBusy(true);
        oModel.read(sKey, {
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            oModelSoa.setProperty("/Zstcd12", data.Zstcd12);
            oModelSoa.setProperty("/ZpersCognomeQuiet2", data.ZpersCognomeQuiet2);
            oModelSoa.setProperty("/ZpersNomeQuiet2", data.ZpersNomeQuiet2);
            oModelSoa.setProperty("/Land2", data.Land1);
            oModelSoa.setProperty("/Zqcap2", data.Zqcap);
            oModelSoa.setProperty("/Zqcitta2", data.Zqcitta);
            oModelSoa.setProperty("/Zqindiriz2", data.Zqindiriz);
            oModelSoa.setProperty("/Zqprovincia2", data.Zqprovincia);
            oModelSoa.setProperty("/Znumquiet2", data.Znumquiet);
            if (self.hasResponseError(oResponse)) {
              oModelSoa.setProperty("/Zstcd12", "")
            };
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      _setDataQuietEstero1: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        var sKey = oModel.createKey("/Quietanzante1EsteroSet", {
          Zstcd14: oSoa.Zstcd14,
          Lifnr: oSoa.Lifnr,
          NumquietInitial: oSoa.NumquietInitial1 ? oSoa.NumquietInitial1 : false,
          Qsskz: oSoa.Witht,
          ZzCebenra: oSoa.ZzCebenra,
          Ztipofirma: oSoa.Ztipofirma
        });

        self.getView().setBusy(true);
        oModel.read(sKey, {
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            oModelSoa.setProperty("/Zstcd14", data.Zstcd14);
            oModelSoa.setProperty("/ZpersCognomeQuiet1", data.ZpersCognomeQuiet1);
            oModelSoa.setProperty("/ZpersNomeQuiet1", data.ZpersNomeQuiet1);
            oModelSoa.setProperty("/Land1", data.Land1);
            oModelSoa.setProperty("/Zqcap", data.Zqcap);
            oModelSoa.setProperty("/Zqcitta", data.Zqcitta);
            oModelSoa.setProperty("/Zqindiriz", data.Zqindiriz);
            oModelSoa.setProperty("/Zqprovincia", data.Zqprovincia);
            oModelSoa.setProperty("/ZqragSoc", data.ZzragSoc);
            oModelSoa.setProperty("/Znumquiet", data.Znumquiet);
            if (self.hasResponseError(oResponse)) {
              oModelSoa.setProperty("/Zstcd14", "");
            };
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      _setDataQuietEstero2: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        var sKey = oModel.createKey("/Quietanzante2EsteroSet", {
          Zstcd15: oSoa.Zstcd15,
          Lifnr: oSoa.Lifnr,
          NumquietInitial: oSoa.NumquietInitial2 ? oSoa.NumquietInitial2 : false,
          Qsskz: oSoa.Witht,
          ZzCebenra: oSoa.ZzCebenra,
          Ztipofirma: oSoa.Ztipofirma
        });

        self.getView().setBusy(true);
        oModel.read(sKey, {
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            oModelSoa.setProperty("/Zstcd15", data.Zstcd15);
            oModelSoa.setProperty("/ZpersCognomeQuiet2", data.ZpersCognomeQuiet2);
            oModelSoa.setProperty("/ZpersNomeQuiet2", data.ZpersNomeQuiet2);
            oModelSoa.setProperty("/Land2", data.Land1);
            oModelSoa.setProperty("/Zqcap2", data.Zqcap);
            oModelSoa.setProperty("/Zqcitta2", data.Zqcitta);
            oModelSoa.setProperty("/Zqindiriz2", data.Zqindiriz);
            oModelSoa.setProperty("/Zqprovincia2", data.Zqprovincia);
            oModelSoa.setProperty("/Znumquiet2", data.Znumquiet);
            if (self.hasResponseError(oResponse)) {
              oModelSoa.setProperty("/Zstcd15", "");
            };
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      setQuietanzante1: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oModelUtility = self.getModel("Utility");
        var oSoa = oModelSoa.getData();
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oModelSoa?.getProperty("/Lifnr"));
        self.setFilterEQ(aFilters, "Ztipofirma", oModelSoa?.getProperty("/Ztipofirma"));
        self.setFilterEQ(aFilters, "Qsskz", oModelSoa?.getProperty("/Witht"));
        self.setFilterEQ(aFilters, "ZzCebenra", oModelSoa?.getProperty("/ZzCebenra"));

        self.getView().setBusy(true);
        oDataModel.read("/Quietanzante1Set", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            var aData = data.results;
            var oFirstRecord = aData[0];
            if (aData.length === 1 && oFirstRecord.NumquietInitial === true) {
              self.getView().setBusy(false);
              oModelUtility.setProperty("/isQuiet1Prevalorizzato", true);
              oModelSoa.setProperty("/Znumquiet", oFirstRecord.Znumquiet);
              oModelSoa.setProperty("/NumquietInitial1", oFirstRecord.NumquietInitial1);
              if (oSoa.Zwels === "ID1") {
                oModelSoa.setProperty("/Zstcd1", oFirstRecord.Zstcd1);
              } else {
                oModelSoa.setProperty("/Zstcd3", oFirstRecord.Zstcd1);
              }

              self._setDataQuietanzante1(oFirstRecord.Zstcd1);
            }
          },
          error: function (error) {
            self.getView().setBusy(false);
          },
        });
      },

      setQuietanzante2: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oModelUtility = self.getModel("Utility");
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oModelSoa?.getProperty("/Lifnr"));
        self.setFilterEQ(aFilters, "Ztipofirma", oModelSoa?.getProperty("/Ztipofirma"));
        self.setFilterEQ(aFilters, "Qsskz", oModelSoa?.getProperty("/Witht"));
        self.setFilterEQ(aFilters, "ZzCebenra", oModelSoa?.getProperty("/ZzCebenra"));

        self.getView().setBusy(true);
        oDataModel.read("/Quietanzante2Set", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            var aData = data.results;
            var oFirstRecord = aData[0];
            if (aData.length === 1 && oFirstRecord.NumquietInitial === true) {
              oModelUtility.setProperty("/isQuiet1Prevalorizzato", true);
              oModelSoa.setProperty("/Znumquiet", oFirstRecord.Znumquiet);
              oModelSoa.setProperty("/NumquietInitial1", oFirstRecord.NumquietInitial1);
              oModelSoa.setProperty("/Zstcd12", oFirstRecord.Zstcd12);

              self._setDataQuietanzante2();
            }
          },
          error: function (error) {
            self.getView().setBusy(false);
          },
        });
      },

      resetQuietanzante1: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty("/ZpersNomeQuiet1", "");
        oModelSoa.setProperty("/ZpersCognomeQuiet1", "");
        oModelSoa.setProperty("/Zstcd1", "");
        oModelSoa.setProperty("/ZpersNomeVaglia", "");
        oModelSoa.setProperty("/ZpersCognomeVaglia", "");
        oModelSoa.setProperty("/Zqindiriz", "");
        oModelSoa.setProperty("/Zqcitta", "");
        oModelSoa.setProperty("/Zqcap", "");
        oModelSoa.setProperty("/Zqprovincia", "");
        oModelSoa.setProperty("/Zstcd14", "");
        oModelSoa.setProperty("/Land1", "");
        oModelSoa.setProperty("/ZqragSoc", "");
        oModelSoa.setProperty("/Znumquiet", "");
        oModelSoa.setProperty("/NumquietInitial1", false);
      },

      resetQuietanzante2: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty("/ZpersCognomeQuiet2", "");
        oModelSoa.setProperty("/ZpersNomeQuiet2", "");
        oModelSoa.setProperty("/Zstcd12", "");
        oModelSoa.setProperty("/Zqindiriz2", "");
        oModelSoa.setProperty("/Zqcitta2", "");
        oModelSoa.setProperty("/Zqcap2", "");
        oModelSoa.setProperty("/Zqprovincia2", "");
        oModelSoa.setProperty("/Zstcd15", "");
        oModelSoa.setProperty("/Land2", "");
        oModelSoa.setProperty("/Znumquiet2", "");
      },

      //#endregion

      //#endregion

      //#region WIZARD 3

      onAddRow: function (oEvent) {
        var self = this;
        var oModelClassificazione = self.getModel("Classificazione");

        var oData = oEvent?.getSource()?.data();
        var aListClassificazione = oModelClassificazione.getProperty(
          "/" + oData?.etichetta
        );

        aListClassificazione.push({
          Zchiavesop: "",
          Bukrs: "",
          Zetichetta: oData?.etichetta,
          Zposizione: "",
          ZstepSop: "",
          Zzcig: "",
          Zzcup: "",
          Zcpv: "",
          ZcpvDesc: "",
          Zcos: "",
          ZcosDesc: "",
          Belnr: "",
          ZimptotClass: "0.00",
          Zflagcanc: "",
          ZstatoClass: "",
          Index: aListClassificazione.length,
        });

        oModelClassificazione.setProperty(
          "/" + oData?.etichetta,
          aListClassificazione
        );
      },

      onCancelRow: function (oEvent) {
        var self = this;
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");

        var oSourceData = oEvent?.getSource()?.data();
        var oTableClassificazione = self.getView().byId(oSourceData?.table);

        var aPathSelectedItems =
          oTableClassificazione.getSelectedContextPaths();

        var aListClassificazione = oModelClassificazione.getProperty(
          "/" + oSourceData?.etichetta
        );

        //Rimuovo i record selezionati
        aPathSelectedItems.map((sPath) => {
          var oItem = oModelClassificazione.getObject(sPath);
          aListClassificazione.splice(aListClassificazione.indexOf(oItem), 1);
        });

        //Resetto l'index
        aListClassificazione.map((oItem, iIndex) => {
          oItem.Index = iIndex;
        });

        //Rimuovo i record selezionati
        oTableClassificazione.removeSelections();

        oModelClassificazione.setProperty(
          "/" + oSourceData?.etichetta,
          aListClassificazione
        );

        //Resetto l'importo totale da associare
        this._setImpTotAssociare(oSourceData?.etichetta);
      },

      //#region VALUE HELP

      onValueHelpCos: function (oEvent) {
        var self = this;
        var oModel = self.getModel();
        var oModelGestAnag = self.getModel("ZSS4_CO_GEST_ANAGRAFICHE_SRV");
        var oModelSoa = self.getModel("Soa").getData();
        var aFilters = [];
        var oSourceData = oEvent.getSource().data();
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.soa.value-help.CodiceGestionale"
        );

        var dCurrentDate = new Date();
        var sCurrentDate =
          dCurrentDate.getFullYear().toString() +
          (dCurrentDate.getMonth() + 1).toString() +
          dCurrentDate.getDate().toString();

        self.setFilterEQ(aFilters, "ANNO", oModelSoa?.Gjahr);
        self.setFilterEQ(aFilters, "FASE", "GEST");
        aFilters.push(new Filter("DATBIS", FilterOperator.GE, sCurrentDate));
        aFilters.push(new Filter("DATAB", FilterOperator.LE, sCurrentDate));
        self.setFilterEQ(aFilters, "MC", "X");
        self.setFilterEQ(aFilters, "REALE", "R");

        oModel.read("/UserParamSet('FIK')", {
          success: function (data) {
            self.setFilterEQ(aFilters, "FIKRS", data.ParameterValue);
          },
          error: function () { },
        });

        self.getView().setBusy(true);
        oModelGestAnag.read("/ZES_COD_GEST_SET", {
          filters: aFilters,
          success: function (data) {
            self.getView().setBusy(false);
            var aCos = [];
            var aData = data.results;
            aData.map((oData) =>
              aCos.push({
                Zcos: oData.CODICE_GESTIONALE,
                ZcosDesc: oData.DESCRIZIONE,
              })
            );

            var oModelJson = new JSONModel();
            oModelJson.setData(aCos);
            var oSelectDialog = sap.ui.getCore().byId(dialogName);
            oSelectDialog?.setModel(oModelJson, "Cos");
            oSelectDialog?.data("index", oSourceData.index);
            oDialog.open();
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      onValueHelpCosClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");
        var aListClassificazione = oModelClassificazione.getProperty("/Cos");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sIndex = oSource.data().index;

        if (!oSelectedItem) {
          this.unloadFragment();
          return;
        }

        aListClassificazione[sIndex].Zcos = oSelectedItem.getTitle();
        aListClassificazione[sIndex].ZcosDesc = oSelectedItem.getDescription();
        oModelClassificazione.setProperty("/Cos", aListClassificazione);

        this.unloadFragment();
      },

      onValueHelpCup: function (oEvent) {
        var self = this;
        //Load Models
        var oModelCup = self.getModel("ZSS4_COSP_CONTRATTO_SRV");
        var oSourceData = oEvent.getSource().data();
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.soa.value-help.Cup"
        );
        var aFilters = [];

        self.setFilterEQ(aFilters, "Matchcode", "CODICE_CUP");

        oModelCup.read("/MatchCodeContrattoSet", {
          filters: aFilters,
          success: function (data) {
            var aCup = [];
            var aData = data.results;
            aData.map((oData) =>
              aCup.push({
                Zzcup: oData.CodiceCup,
                Belnr: oData.Descrizione,
              })
            );
            var oModelJson = new JSONModel();
            oModelJson.setData(aCup);
            var oSelectDialog = sap.ui.getCore().byId(dialogName);
            oSelectDialog?.setModel(oModelJson, "Cup");
            oSelectDialog?.data("index", oSourceData.index);
            oDialog.open();
          },
          error: function () { },
        });

        // oDataModel.read("/" + "CPVClassificazioneSet", {
        //   success: function (data, oResponse) {
        //     var oModelJson = new JSONModel();
        //     oModelJson.setData(data.results);
        //     var oSelectDialog = sap.ui.getCore().byId(dialogName);
        //     oSelectDialog?.setModel(oModelJson, "Cpv");
        //     oSelectDialog?.data("index", oSourceData.index);
        //     oDialog.open();
        //   },
        //   error: function (error) {},
        // });
      },

      onValueHelpCupClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");
        var aListClassificazione = oModelClassificazione.getProperty("/Cup");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sIndex = oSource.data().index;

        if (!oSelectedItem) {
          this.unloadFragment();
          return;
        }

        aListClassificazione[sIndex].Zzcup = oSelectedItem.getTitle();
        aListClassificazione[sIndex].Belnr = oSelectedItem.getDescription();
        oModelClassificazione.setProperty("/Cup", aListClassificazione);

        this.unloadFragment();
      },

      onValueHelpCigClassificazione: function (oEvent) {
        var self = this;
        var oModel = self.getModel();
        var oDialog = self.loadFragment("rgssoa.view.fragment.soa.value-help.Cig");
        var oSourceData = oEvent.getSource().data();

        self.getView().setBusy(true);

        oModel.read("/CigMcSet", {
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            self.hasResponseError(oResponse);

            var oModelJson = new JSONModel();
            oModelJson.setData(data?.results);
            var oSelectDialog = sap.ui.getCore().byId("sdCig");
            oSelectDialog?.setModel(oModelJson, "Cig");
            oSelectDialog?.data("index", oSourceData.index);
            oDialog.open();
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      onValueHelpCigClassificazioneClose: async function (oEvent) {
        var self = this;
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");
        var aListClassificazione = oModelClassificazione.getProperty("/Cig");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sIndex = oSource.data().index;

        if (!oSelectedItem) {
          this.unloadFragment();
          return;
        }

        aListClassificazione[sIndex].Zzcig = oSelectedItem.getTitle();
        aListClassificazione[sIndex].Belnr = await this._getCigDescription(oSelectedItem.getTitle());
        oModelClassificazione.setProperty("/Cig", aListClassificazione);
      },
      //#endregion

      //#region SELECTION CHANGE

      onImpDaAssociareChange: function (oEvent) {
        var self = this;
        var oSourceData = oEvent.getSource().data();
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");

        var sValue = oEvent.getParameter("value");
        var aListClassificazione = oModelClassificazione.getProperty(
          "/" + oSourceData?.etichetta
        );

        if (sValue) {
          aListClassificazione[oSourceData?.index].ZimptotClass =
            parseFloat(sValue).toFixed(2);
        } else {
          aListClassificazione[oSourceData?.index].ZimptotClass = "0.00";
        }

        oModelClassificazione.setProperty(
          "/" + oSourceData?.etichetta,
          aListClassificazione
        );

        this._setImpTotAssociare(oSourceData?.etichetta);
      },

      onCosChange: function (oEvent) {
        var self = this;
        var oModel = self.getModel();
        var oModelClassificazione = self.getModel("Classificazione");
        var oSoa = self.getModel("Soa").getData();
        var aListClassificazione = oModelClassificazione.getProperty("/Cos");

        var oSource = oEvent.getSource();
        var sIndex = oSource.data().index;

        var sKey = oModel.createKey("/CosSet", {
          Gjahr: oSoa.Gjahr,
          Zcos: aListClassificazione[sIndex].Zcos,
        });

        self.getView().setBusy(true);
        oModel.read(sKey, {
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            aListClassificazione[sIndex].ZcosDesc = data.ZcosDesc;
            oModelClassificazione.setProperty("/Cos", aListClassificazione);
            self.hasResponseError(oResponse);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      onCpvChange: function (oEvent) {
        var self = this;
        var oModel = self.getModel();
        var oModelClassificazione = self.getModel("Classificazione");
        var aListClassificazione = oModelClassificazione.getProperty("/Cpv");

        var oSource = oEvent.getSource();
        var sIndex = oSource.data().index;

        if (!aListClassificazione[sIndex].Zcpv) {
          aListClassificazione[sIndex].ZcpvDesc = "";
          oModelClassificazione.setProperty("/Cpv", aListClassificazione);
          return;
        }

        var sKey = oModel.createKey("/CpvSet", {
          Zcpv: aListClassificazione[sIndex].Zcpv,
        });

        self.getView().setBusy(true);
        oModel.read(sKey, {
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            aListClassificazione[sIndex].ZcpvDesc = data.ZcpvDesc;
            oModelClassificazione.setProperty("/Cpv", aListClassificazione);
            self.hasResponseError(oResponse);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      //#region PRIVATE METHODS
      _setImpTotAssociare: function (sEtichetta) {
        var self = this;
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");

        var aListClassificazione = oModelClassificazione.getProperty(
          "/" + sEtichetta
        );

        var iTotalImpDaAssociare = 0;
        aListClassificazione.map((oItem) => {
          iTotalImpDaAssociare += parseFloat(oItem.ZimptotClass);
        });

        oModelClassificazione.setProperty(
          "/ImpTotAssociare" + sEtichetta,
          parseFloat(iTotalImpDaAssociare).toFixed(2)
        );
      },

      getCig: function () {
        var self = this;
        var oModel = self.getModel();
        var oSoa = self.getModel("Soa").getData();
        var oModelClassificazione = self.getModel("Classificazione");
        var aCos = [];
        var aPosition = oSoa.data;
        var aFilters = [];

        aPosition.map((oPosition) => {
          self.setFilterEQ(aFilters, "Belnr", oPosition.Belnr);
        });

        self.getView().setBusy(true);
        oModel.read("/CigMcSet", {
          filters: aFilters,
          success: function (data) {
            self.getView().setBusy(false);

            var aData = data.results;
            aData.map((oData, index) => {
              aCos.push({
                Zchiavesop: "",
                Bukrs: "",
                Zetichetta: "CIG",
                Zposizione: "",
                ZstepSop: "",
                Zzcig: oData.ZcodiCig,
                Zzcup: "",
                Zcpv: "",
                ZcpvDesc: "",
                Zcos: "",
                ZcosDesc: "",
                Belnr: oData.Belnr,
                ZimptotClass: "0.00",
                Zflagcanc: "",
                ZstatoClass: "",
                Index: index,
              });
            });

            oModelClassificazione.setProperty("/Cig", aCos);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      _getCigDescription: async function (sCig) {
        var self = this;
        var oModel = self.getModel();
        var sKey = oModel.createKey("/CigMcSet", {
          ZcodiCig: sCig,
        });
        self.getView().setBusy(true);
        return new Promise(async function (resolve, reject) {
          await oModel.read(sKey, {
            success: function (data, oResponse) {
              self.getView().setBusy(false);
              if (self.hasResponseError(oResponse)) return;
              resolve(data.Belnr);
            },
            error: function (e) {
              self.getView().setBusy(false);
              reject(e);
            },
          });
        });
      },

      checkClassificazione: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oModelClassificazione = self.getModel("Classificazione");
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        var aListCos = oModelClassificazione.getProperty("/Cos");
        var aListCpv = oModelClassificazione.getProperty("/Cpv");
        var aListCig = oModelClassificazione.getProperty("/Cig");
        var aListCup = oModelClassificazione.getProperty("/Cup");

        //Controllo se sono stati inseriti i Codici Gestionali
        if (aListCos?.length === 0) {
          sap.m.MessageBox.error(oBundle.getText("msgCosRequired"));
          return false;
        }

        //Controllo se i codici sono stati inseriti
        if (this._checkCodiceClassificazione(aListCos, "Zcos")) {
          sap.m.MessageBox.error(oBundle.getText("msgNoZcos"));
          return false;
        }

        //Controllo se i codici sono stati inseriti
        if (this._checkCodiceClassificazione(aListCpv, "Zcpv")) {
          sap.m.MessageBox.error(oBundle.getText("msgNoZcpv"));
          return false;
        }

        //Controllo se i codici sono stati inseriti
        if (this._checkCodiceClassificazione(aListCig, "Zzcig")) {
          sap.m.MessageBox.error(oBundle.getText("msgNoZcig"));
          return false;
        }

        //Controllo se i codici sono stati inseriti
        if (this._checkCodiceClassificazione(aListCup, "Zzcup")) {
          sap.m.MessageBox.error(oBundle.getText("msgNoZcup"));
          return false;
        }

        //Controllo gli importi
        var aListClassificazione = this._getClassificazioneList();

        var bImpZero = false;
        aListClassificazione.map((oClassificazione) => {
          if (oClassificazione.ZimptotClass === "0.00") {
            bImpZero = true;
          }
        });

        if (bImpZero) {
          sap.m.MessageBox.error(oBundle.getText("msgImportiZero"));
          return false;
        }

        //Controllo il totale degli importi con l'importo associato
        var iImpAssociato = parseFloat(oModelSoa.getProperty("/Zimptot"));
        var iImpAssociatoCodiceGestione = parseFloat(
          oModelClassificazione.getProperty("/ImpTotAssociareCos")
        );
        var iImpCpv = parseFloat(
          oModelClassificazione.getProperty("/ImpTotAssociareCpv")
        );
        var iImpCig = parseFloat(
          oModelClassificazione.getProperty("/ImpTotAssociareCig")
        );
        var iImpCup = parseFloat(
          oModelClassificazione.getProperty("/ImpTotAssociareCup")
        );

        var iTotaImpAssociato =
          iImpAssociatoCodiceGestione + iImpCpv + iImpCig + iImpCup;

        if (iImpAssociato !== iTotaImpAssociato) {
          sap.m.MessageBox.error(
            oBundle.getText(
              "msgDifferentImpAssociato",
              formatter.convertImport(
                parseFloat(iImpAssociato).toFixed(2)
              )
            )
          );
          return false;
        }

        oModelSoa.setProperty("/Classificazione", aListClassificazione);
        return true;
      },

      _getClassificazioneList: function () {
        var self = this;
        var oModelClassificazione = self.getModel("Classificazione");

        var aListCos = oModelClassificazione.getProperty("/Cos");
        var aListCpv = oModelClassificazione.getProperty("/Cpv");
        var aListCig = oModelClassificazione.getProperty("/Cig");
        var aListCup = oModelClassificazione.getProperty("/Cup");

        var aListClassificazione = [];

        aListCos.map((oCos) => {
          aListClassificazione.push(oCos);
        });

        aListCpv.map((oCpv) => {
          aListClassificazione.push(oCpv);
        });

        aListCig.map((oCig) => {
          aListClassificazione.push(oCig);
        });

        aListCup.map((oCup) => {
          aListClassificazione.push(oCup);
        });

        return aListClassificazione;
      },

      _checkCodiceClassificazione: function (aList, sCodice) {
        var bCodiceEmpty = false;
        if (aList.length !== 0) {
          aList.map((oItem) => {
            if (!oItem[sCodice]) {
              bCodiceEmpty = true;
            }
          });
        }

        return bCodiceEmpty;
      },

      //#endregion

      //#endregion

      //#endregion

      //#region WIZARD 4
      onSave: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oView = self.getView()
        var oModelUtility = self.getModel("Utility")
        var oSoa = oModelSoa.getData()
        var aPosition = oSoa.data
        var aClassificazione = oSoa.Classificazione

        var aPosizioniDeep = [];
        var aClassificazioneDeep = [];

        switch (oSoa.Ztipopag) {
          case "1": {
            aPosition.map((oPosition) => {
              aPosizioniDeep.push({
                Znumliq: oPosition.Znumliq,
                Zposizione: oPosition.Zposizione,
                Belnr: oPosition.Belnr,
                GjahrDc: oPosition.AnnoRegDoc,
                Xblnr: oPosition.Xblnr,
                Blart: oPosition.Blart,
                Bldat: oPosition.Bldat,
                Zbenalt: oPosition.Zbenalt,
                ZbenaltName: oPosition.ZbenaltName,
                Wrbtr: oPosition.Zimptot,
                Zimppag: oPosition.Zimppag,
                Zimpdaord: oPosition.Zimpdaord,
                Zimptot: oPosition.Zimptot
              })
            })
            break;
          }
          case "2": {
            aPosition.map((oPosition) => {
              aPosizioniDeep.push({
                Zimpres: oPosition.Zimpres,
                Belnr: oPosition.Belnr,
                GjahrDc: oPosition.AnnoRegDoc,
                Xblnr: oPosition.Xblnr,
                Blart: oPosition.Blart,
                Bldat: oPosition.Bldat,
                Zbenalt: oPosition.Zbenalt,
                ZbenaltName: oPosition.ZbenaltName,
                Wrbtr: oPosition.Wrbtr,
                Zimpdaord: oPosition.Zimpdaord,
                Zdurc: oPosition.Zdurc,
                ZfermAmm: oPosition.ZfermAmm
              })
            })
            break;
          }
          case "3": {
            aPosition.map((oPosition) => {
              aPosizioniDeep.push({
                Znumliq: oPosition.Znumliq,
                Zposizione: oPosition.Zposizione,
                Belnr: oPosition.Belnr,
                GjahrDc: oPosition.AnnoRegDoc,
                Blart: oPosition.Blart,
                Bldat: oPosition.Bldat,
                ZbenaltName: oPosition.ZbenaltName,
                Wrbtr: oPosition.Zimptot,
                Zimpdaord: oPosition.Zimpdaord,
              })
            })
            break;
          }
          case "4": {
            aPosition.map((oPosition) => {
              aPosizioniDeep.push({
                Wrbtr: oPosition.Zimptot,
                ZbenaltName: oPosition.ZbenaltName,
                Zimpliq: oPosition.Zimptot,
                Zimpdaord: oPosition.Zimptot,
                Zdurc: oPosition.Zdurc,
                ZfermAmm: oPosition.ZfermAmm,
                Zimppag: oPosition.Zimptot
              })
            })
          }
        }


        aClassificazione.map((oClassificazione) => {
          aClassificazioneDeep.push({
            Zetichetta: oClassificazione.Zetichetta,
            Zzcig: oClassificazione.Zzcig,
            Zzcup: oClassificazione.Zzcup,
            Zcpv: oClassificazione.Zcpv,
            ZcpvDesc: oClassificazione.ZcpvDesc.slice(0, 40),
            Zcos: oClassificazione.Zcos,
            ZcosDesc: oClassificazione.ZcosDesc.slice(0, 30),
            Belnr: oClassificazione.Belnr.slice(0, 10),
            ZimptotClass: oClassificazione.ZimptotClass,
          })
        })

        var oSoaDeep = {
          Bukrs: oModelSoa.getProperty("/Bukrs"),
          Fipos: oModelSoa.getProperty("/Fipos"),
          Fistl: oModelSoa.getProperty("/Fistl"),
          Gjahr: oModelSoa.getProperty("/Gjahr"),
          Hkont: oModelSoa.getProperty("/Hkont"),
          Iban: oModelSoa.getProperty("/Iban"),
          Kostl: oModelSoa.getProperty("/Kostl"),
          Lifnr: oModelSoa.getProperty("/Lifnr"),
          Swift: oModelSoa.getProperty("/Swift"),
          Witht: oModelSoa.getProperty("/Witht"),
          Zcausale: oModelSoa.getProperty("/Zcausale"),
          ZCausaleval: oModelSoa.getProperty("/ZCausaleval"),
          Zcfcommit: oModelSoa.getProperty("/Zcfcommit"),
          Zcfvers: oModelSoa.getProperty("/Zcfvers"),
          Zchiaveaut: oModelSoa.getProperty("/Zchiaveaut"),
          Zchiavesop: oModelSoa.getProperty("/Zchiavesop"),
          Zcodinps: oModelSoa.getProperty("/Zcodinps"),
          Zcodprov: oModelSoa.getProperty("/Zcodprov"),
          ZcodStatosop: oModelSoa.getProperty("/ZcodStatoSoa"),
          Zcodtrib: oModelSoa.getProperty("/Zcodtrib"),
          Zcodvers: oModelSoa.getProperty("/Zcodvers"),
          Zcoordest: oModelSoa.getProperty("/Zcoordest"),
          Zdataprot: oModelSoa.getProperty("/Zdataprot"),
          Zdatasop: oModelSoa.getProperty("/Zdatasop"),
          ZE2e: oModelSoa.getProperty("/ZE2e"),
          Zfunzdel: oModelSoa.getProperty("/Zfunzdel"),
          Zidsede: oModelSoa.getProperty("/Zidsede"),
          Zimptot: oModelSoa.getProperty("/Zimptot"),
          Zlocpag: oModelSoa.getProperty("/Zlocpag"),
          Zmotivaz: oModelSoa.getProperty("/Zmotivaz"),
          Znumprot: oModelSoa.getProperty("/Znumprot"),
          Znumsop: oModelSoa.getProperty("/Znumsop"),
          Zperiodrifa: oModelSoa.getProperty("/Zperiodrifa"),
          Zperiodrifda: oModelSoa.getProperty("/Zperiodrifda"),
          ZpersCognomeQuiet1: oModelSoa.getProperty("/ZpersCognomeQuiet1"),
          ZpersCognomeQuiet2: oModelSoa.getProperty("/ZpersCognomeQuiet2"),
          ZpersCognomeVaglia: oModelSoa.getProperty("/ZpersCognomeVaglia"),
          ZpersNomeQuiet1: oModelSoa.getProperty("/ZpersNomeQuiet1"),
          ZpersNomeQuiet2: oModelSoa.getProperty("/ZpersNomeQuiet2"),
          ZpersNomeVaglia: oModelSoa.getProperty("/ZpersNomeVaglia"),
          Zricann: oModelSoa.getProperty("/Zricann"),
          ZspecieSop: oModelSoa.getProperty("/ZspecieSop"),
          ZstatTest: oModelSoa.getProperty("/ZstatTest"),
          Zstcd1: oModelSoa.getProperty("/Zstcd1"),
          Zstcd12: oModelSoa.getProperty("/Zstcd12"),
          Zstep: oModelSoa.getProperty("/Zstep"),
          Ztipofirma: oModelSoa.getProperty("/Ztipofirma"),
          Ztipopag: oModelSoa.getProperty("/Ztipopag"),
          Ztipososp: oModelSoa.getProperty("/Ztipososp"),
          ZufficioCont: oModelSoa.getProperty("/ZufficioCont"),
          Zutenza: oModelSoa.getProperty("/Zutenza"),
          Zwels: oModelSoa.getProperty("/Zwels"),
          Zzamministr: oModelSoa.getProperty("/Zzamministr"),
          ZzCebenra: oModelSoa.getProperty("/ZzCebenra"),
          Zzonaint: oModelSoa.getProperty("/Zzonaint"),
          Zztipologia: oModelSoa.getProperty("/Zztipologia"),
          Ztipodisp2: oModelSoa.getProperty("/Ztipodisp2"),
          Ztipodisp3: oModelSoa.getProperty("/Ztipodisp3"),
          Zdescvers: oModelSoa.getProperty("/Zdescvers"),
          Zdatavers: oModelSoa.getProperty("/Zdatavers"),
          Zprovvers: oModelSoa.getProperty("/Zprovvers"),
          Zsedevers: oModelSoa.getProperty("/Zsedevers"),
          Zstcd14: oModelSoa.getProperty("/Zstcd14"),
          Zstcd15: oModelSoa.getProperty("/Zstcd15"),
          Zalias: oModelSoa.getProperty("/Zalias"),
          AccTypeId: oModelSoa.getProperty("/AccTypeId"),
          Regio: oModelSoa.getProperty("/RegioConto"),
          ZaccText: oModelSoa.getProperty("/ZaccText"),
          Zflagfrutt: oModelSoa.getProperty("/Zflagfrutt"),
          Zcausben: oModelSoa.getProperty("/Zcausben"),
          Zpurpose: oModelSoa.getProperty("/Zpurpose"),
          Zzposfinent: oModelSoa.getProperty("/Zzposfinent"),
          Seqnr: oModelSoa.getProperty("/Seqnr"),
          Znumquiet: oModelSoa.getProperty("/Znumquiet"),
          Znumquiet2: oModelSoa.getProperty("/Znumquiet2"),
          ZflagFipos: oModelSoa.getProperty("/ZflagFipos"),
          Zgeber: oModelSoa.getProperty("/Zgeber"),
          Banks: oModelSoa.getProperty("/Banks"),

          Classificazione: aClassificazioneDeep,
          Posizione: aPosizioniDeep,
          Messaggio: [],
        };


        oView.setBusy(true);

        oModel.create("/SoaDeepSet", oSoaDeep, {
          success: function (data) {
            self.getView().setBusy(false)
            var aMessage = data?.Messaggio?.results;
            var aMessageFormatted = []
            if (aMessage.length > 0) {
              if (aMessage.length === 1) {
                if (aMessage[0]?.Body?.Msgty === 'E') {
                  MessageBox.error(aMessage[0]?.Body?.Message);
                }
                else if (aMessage[0]?.Body?.Msgty === 'S') {
                  MessageBox.success(aMessage[0]?.Body?.Message, {
                    actions: [MessageBox.Action.CLOSE],
                    onClose: function () {
                      self.getRouter().navTo("soa.list.ListSoa", {
                        Reload: true,
                      });
                    },
                  });

                }
                return;
              }

              aMessage.map((oMessage) => {
                aMessageFormatted.push({
                  Msgid: oMessage?.Body?.Msgid,
                  Msgty: oMessage?.Body?.Msgty,
                  Msgno: oMessage?.Body?.Msgno,
                  Message: oMessage?.Body?.Message,
                });
              });

              oModelUtility.setProperty("/isLogVisible");
              self.setModel(new JSONModel(aMessageFormatted), "Log");
              MessageBox.error("Operazione non eseguita correttamente");
              return;
            }

          },
          error: function () {
            oView.setBusy(false);
          },
        });
      },

      setCausalePagamento: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        var aListDocumenti = oModelSoa.getProperty("/data");

        var sZcausale = "";
        aListDocumenti.map((oDocumento) => {
          if (sZcausale) {
            sZcausale + " ";
          }

          sZcausale =
            sZcausale +
            oDocumento.Belnr +
            " " +
            formatter.dateWithPoints(oDocumento.Bldat);
        });

        oModelSoa.setProperty("/Zcausale", sZcausale);
      },

      setLocPagamento: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();

        var sKey = oModel.createKey("/LocPagamentoSet", {
          Regio: oSoa.RegioSede,
          Zlocpag: "",
        });

        self.getView().setBusy(true);
        oModel.read(sKey, {
          success: function (data) {
            oModelSoa.setProperty("/Zlocpag", data.Zlocpag);
            self.getView().setBusy(false);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },
      //#endregion

      //#region -------------------GESTIONE LOG------------------------------- /

      onLog: function () {
        var self = this;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.soa.table.TableLog"
        );

        oDialog.open();
      },

      onCloseLog: function () {
        var self = this;
        var oDialog = sap.ui.getCore().byId("dlgLog");
        oDialog.close();
        self.unloadFragment();
      },

      onExportLog: function () {
        var self = this;
        const EDM_TYPE = exportLibrary.EdmType;

        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        var oTable = sap.ui.getCore().byId("tblLog");
        var oTableModel = oTable.getModel("Log");

        var aCols = [
          {
            label: oBundle.getText("labelMessageType"),
            property: "Msgty",
            type: EDM_TYPE.String,
          },
          {
            label: oBundle.getText("labelMessageId"),
            property: "Msgid",
            type: EDM_TYPE.String,
          },
          {
            label: oBundle.getText("labelMessageNumber"),
            property: "Msgno",
            type: EDM_TYPE.String,
          },
          {
            label: oBundle.getText("labelMessageText"),
            property: "Message",
            type: EDM_TYPE.String,
          },
        ];

        var oSettings = {
          workbook: {
            columns: aCols,
          },
          dataSource: oTableModel.getData()?.Messaggio,
          fileName: "Lista Log.xlsx",
        };

        var oSheet = new Spreadsheet(oSettings);
        oSheet.build().finally(function () {
          oSheet.destroy();
        });
      },

      getLogModel: function () {
        var self = this;
        var oEmptyModel = new JSONModel({
          Messaggio: [],
        });

        var oGlobalModelLog = sap.ui.getCore().getModel("GlobalLog");

        if (!oGlobalModelLog) {
          oGlobalModelLog = oEmptyModel;
        }

        self.setModel(oGlobalModelLog, "Log");
        sap.ui.getCore().setModel(oEmptyModel, "GlobalLog");
      },

      _setLogModel: function (aLog) {
        var self = this;
        var oModel = new JSONModel({
          Messaggio: aLog,
        });

        sap.ui.getCore().setModel(oModel, "GlobalLog");
        self.setModel(oModel, "Log");
      },
      //#endregion

      //#region ----------------------DETTAGLIO------------------------------- /

      //#region SET MODELLI
      setInpsEditable: function () {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        if (
          oModelSoa.getProperty("/Zwels") === "ID4" ||
          oModelSoa.getProperty("/Zwels") === "ID3"
        ) {
          var oParameters = {
            Lifnr: oModelSoa.getProperty("/Lifnr"),
            Zwels: oModelSoa.getProperty("/Zwels"),
            Zcodtrib: "",
          };

          var sPath = self.getModel().createKey("/InpsSOASet", oParameters);

          oModel.read(sPath, {
            success: function (data) {
              oModelSoa.setProperty(
                "/FlagInpsEditabile",
                data?.FlagInpsEditabile ? true : false
              );
            },
            error: function () { },
          });
        }
      },

      _setSoa: function (oData) {
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
        oModelSoa.setProperty("/Zdstatodes", oData.Zdstatodes);
        oModelSoa.setProperty("/Zdscadenza", oData.Zdscadenza);
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
        oModelSoa.setProperty("/ZpersCognomeQuiet1", oData.ZpersCognomeQuiet1);
        oModelSoa.setProperty("/ZpersCognomeQuiet2", oData.ZpersCognomeQuiet2);
        oModelSoa.setProperty("/ZpersNomeQuiet1", oData.ZpersNomeQuiet1);
        oModelSoa.setProperty("/ZpersNomeQuiet2", oData.ZpersNomeQuiet2);
        oModelSoa.setProperty("/ZpersNomeVaglia", oData.ZpersNomeVaglia);
        oModelSoa.setProperty("/ZpersCognomeVaglia", oData.ZpersCognomeVaglia);
        oModelSoa.setProperty("/Zstcd1", oData.Zstcd1);
        oModelSoa.setProperty("/Zstcd12", oData.Zstcd12);
        oModelSoa.setProperty("/Zstcd13", oData.Zstcd13);
        oModelSoa.setProperty("/Zqindiriz", oData.Zqindiriz);
        oModelSoa.setProperty("/Zqcitta", oData.Zqcitta);
        oModelSoa.setProperty("/Zqcap", oData.Zqcap);
        oModelSoa.setProperty("/Zqprovincia", oData.Zqprovincia);
        oModelSoa.setProperty("/Zqindiriz2", oData.Zqindiriz2);
        oModelSoa.setProperty("/Zqcitta2", oData.Zqcitta2);
        oModelSoa.setProperty("/Zqcap2", oData.Zqcap2);
        oModelSoa.setProperty("/Zqprovincia2", oData.Zqprovincia2);
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
        oModelSoa.setProperty("/RegioSede", oData.Regio);
        oModelSoa.setProperty("/Pstlz", oData.Pstlz);
        oModelSoa.setProperty("/Land1Sede", oData.Land1);
        oModelSoa.setProperty("/Zcausale", oData.Zcausale);
        oModelSoa.setProperty("/ZE2e", oData.ZE2e);
        oModelSoa.setProperty("/Zlocpag", oData.Zlocpag);
        oModelSoa.setProperty("/Zzonaint", oData.Zzonaint);
        oModelSoa.setProperty(
          "/Znumprot",
          oData.Znumprot === "000000" ? "" : oData.Znumprot
        );
        oModelSoa.setProperty("/Zdataprot", oData.Zdataprot);
        oModelSoa.setProperty("/Zdataesig", oData.Zdataesig);
        oModelSoa.setProperty("/ZcodStatoSoa", oData.ZcodStatoSoa);
        oModelSoa.setProperty("/Zricann", oData.Zricann);
        oModelSoa.setProperty("/DescStateSoa", oData.DescStateSoa);
        oModelSoa.setProperty("/Zdatarichann", oData.Zdatarichann);
        oModelSoa.setProperty("/AccTypeId", oData.AccTypeId);
        oModelSoa.setProperty("/RegioConto", oData.RegioConto);
        oModelSoa.setProperty("/ZaccText", oData.ZaccText);
        oModelSoa.setProperty("/Zzposfinent", oData.Zzposfinent);
        oModelSoa.setProperty("/Zpurpose", oData.Zpurpose);
        oModelSoa.setProperty("/Zflagfrutt", oData.Zflagfrutt);
        oModelSoa.setProperty("/Zcausben", oData.Zcausben);
        oModelSoa.setProperty("/Zstcd14", oData.Zstcd14);
        oModelSoa.setProperty("/Zstcd15", oData.Zstcd15);
        oModelSoa.setProperty(
          "/ZqragSoc",
          oData.ZqragSoc
        );
        oModelSoa.setProperty("/Land1", oData.Land1);
        oModelSoa.setProperty("/Land2", oData.Land2);
        oModelSoa.setProperty("/Zdescvers", oData.Zdescvers);
        oModelSoa.setProperty("/Zdatavers", oData.Zdatavers);
        oModelSoa.setProperty("/Zprovvers", oData.Zprovvers);
        oModelSoa.setProperty("/Zsedevers", oData.Zsedevers);
        oModelSoa.setProperty("/Seqnr", oData.Seqnr);
        oModelSoa.setProperty("/Znumquiet", oData.Znumquiet);
        oModelSoa.setProperty("/Znumquiet2", oData.Znumquiet2);
        oModelSoa.setProperty("/ZflagFipos", oData.ZflagFipos);
      },

      enableFunctions: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();
        var oModelUtility = self.getModel("Utility");

        self.getPermissionsListSoa(false, function (callback) {
          var oPermissions = callback.permissions;

          if (oSoa.ZcodStatoSoa === "00" && oPermissions.Annullamento) {
            oModelUtility.setProperty("/EnableBtnAnnullamento", true);
          }

          oModelUtility.setProperty(
            "/EnableBtnInvioFirma",
            oSoa.ZcodStatoSoa === "00" && oPermissions.InvioFirma
          );
          oModelUtility.setProperty(
            "/EnableBtnRevocaInvioFirma",
            oSoa.ZcodStatoSoa === "01" && oPermissions.RevocaInvioFirma
          );
          oModelUtility.setProperty(
            "/EnableBtnFirma",
            oSoa.ZcodStatoSoa === "01" && oPermissions.Firma
          );
          oModelUtility.setProperty(
            "/EnableBtnRevocaFirma",
            oSoa.ZcodStatoSoa === "02" && oPermissions.RevocaFirma
          );
          oModelUtility.setProperty(
            "/EnableBtnRegistrazioneRichAnn",
            oSoa.ZcodStatoSoa === "10" &&
            oPermissions.RegistrazioneRichAnn &&
            oSoa.Zricann === "0000000"
          );
          oModelUtility.setProperty(
            "/EnableBtnCancellazioneRichAnn",
            oSoa.ZcodStatoSoa === "10" &&
            oPermissions.CancellazioneRichAnn &&
            oSoa.Zricann !== "0000000"
          );
        });
      },

      setSoaModel: function (oParameters, callback) {
        var self = this;
        var oModel = self.getModel();
        var oView = self.getView();
        var sPath = self.getModel().createKey("/SOASet", {
          Gjahr: oParameters.Gjahr,
          Zchiavesop: oParameters.Zchiavesop,
          Bukrs: oParameters.Bukrs,
          Zstep: oParameters.Zstep,
          Ztipososp: oParameters.Ztipososp,
        });

        var oModelSoa = new JSONModel({
          EnableEdit: false,
          visibleBtnEdit: true,
          /**  CHIAVI */
          Gjahr: "",
          Bukrs: "",
          Zchiavesop: "",
          Ztipososp: "",
          Zstep: "",

          /**   Scenario    */
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
          Zgeber: "", //Id Autorizzazione
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
          Zdescriz: "", //Descrizione Codice FD
          ZspecieSop: "", //Specie SOA
          DescZspecieSop: "", //Descrizione Specie SOA
          ZflagFipos: false,

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
          Zdstatodes: "", //Stato DURC
          Zdscadenza: null, //Scandenza DURC

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
          Zalias: "", //Alias RGS
          AccTypeId: "", //Tipo conto
          RegioConto: "", //Provincia
          ZaccText: "", //Descrizione conto
          Zzposfinent: "", //Posizione finanziaria entrate
          Zpurpose: "", //Purpose
          Zflagfrutt: "", //Flag Fruttifero/Infruttifero
          Zcausben: "", //Causale Per Beneficiario
          Seqnr: "",

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
          Zqindiriz2: "", //Indirizzo secondo quietanzante
          Zqcitta2: "", //Citta secondo quietanzante
          Zqcap2: "", //Cap secondo quietanzante
          Zqprovincia2: "", //Provincia secondo quietanzante
          Zstcd14: "", //Identificativo Fiscale Estero (Primo quietanzante)
          Zstcd15: "", //Identificativo Fiscale Estero (Secondo quietanzante)
          ZqragSoc: "", //Ragione sociale
          Land1: "", //Nazione
          Land2: "", //Nazione
          Znumquiet: "", //Numero Queitanzante 1
          Znumquiet2: "", //Numero Queitanzante 1

          /**   WIZARD 2 - Versante    */
          Zcodprov: "", //INPS - Codice Provenienza
          Zcfcommit: "", //INPS - Codice Fiscale Committente
          Zcodtrib: "", //INPS - Codice tributo
          Zperiodrifda: null, //INPS - Periodo riferimento da
          Zperiodrifa: null, //INPS - Periodo riferimento a
          Zcodinps: "", //INPS - Matricola INPS/Codice INPS/Filiale azienda
          Zcfvers: "", //INPS - Codice Fiscale Versante
          Zcodvers: "", //INPS - Codice Versante
          FlagInpsEditabile: false,
          Zdescvers: "", //Descrizione versante
          Zdatavers: null, //Data versamento
          Zprovvers: "", //Provincia versante
          Zsedevers: "", //Sede versante

          /**   WIZARD 2 - Sede Beneficiario */
          Zidsede: "", //Sede Beneficiario
          Stras: "", //Via,numero civico
          Ort01: "", //Località
          RegioSede: "", //Regione
          Pstlz: "", //Codice di avviamento postale
          Land1Sede: "", //Codice paese

          /**   WIZARD 2 - Banca Accredito */
          Zibanb: "", //IBAN
          Zbicb: "", //BIC
          Zcoordestb: "", //Coordinate estere
          Zdenbanca: "", //Denominazione banca
          Zclearsyst: "", //ClearingSystemid
          StrasBanca: "", //Via
          Zcivico: "", //Civico
          Ort01Banca: "", //Città
          RegioBanca: "", //Provincia
          PstlzBanca: "", //CAP
          Land1: "", //Nazione

          /**   WIZARD 2 - Intestatario 1 */
          Zibani: "", //IBAN
          Zbici: "", //BIC
          Zcoordesti: "", //Coordinate estere
          Zdenbancai: "", //Denominazione banca
          Zclearsysti: "", //ClearingSystemid
          Zstrasi: "", //Via
          Zcivicoi: "", //Civico
          Zort01i: "", //Città
          Zregioi: "", //Provincia
          Zpstlzi: "", //CAP
          Zland1i: "", //Nazione

          /**   WIZARD 3    */
          Classificazione: [], //Classificazioni

          /**   WIZARD 4    */
          Zcausale: "", //Causale di pagamento
          ZE2e: "", //E2E ID
          Zlocpag: "", //Località pagamento
          Zzonaint: "", //Zona di intervento
          Znumprot: "", //Numero protocollo
          Zdataprot: null, //Data protocollo
          Zdataesig: null, //Data esigibilità

          ZcodStatoSoa: "",
          Zdatasop: null,
          Znumsop: "",
          Zricann: "",
          ZstatTest: "",
          Zutenza: "",
          Messaggio: [], //Messaggi di error
        });
        self.setModel(oModelSoa, "Soa");

        oView.setBusy(true);

        oModel.read(sPath, {
          success: function (data, oResponse) {
            self._setSoa(data);
            self._getPosizioniSoa();
            self._getClassificazioniSoa();
            oView.setBusy(false);
            callback(data);
          },
          error: function () {
            oView.setBusy(true);
          },
        });
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
          error: function () { },
        });
      },

      setStepScenarioModel: function () {
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
          visibleBtnSave: false,
        });

        self.setModel(oModelStepScenario, "StepScenario");
      },

      setUtilityModel: function (bDetailFromFunction, bRemoveFunctionButtons) {
        var self = this;
        var oModelUtility = new JSONModel({
          Function: "Dettaglio",
          DeleteSelectedPositions: [],
          AddSelectedPositions: [],
          AddPositions: false,
          DetailAfter: false,
          EnableBtnDeleteSoa: false,
          EnableEdit: false,
          EnableAnnullamento: false,
          EnableRevocaInvioFirma: false,
          EnableFirma: false,
          EnableRevocaFirma: false,
          EnableInvioFirma: false,
          EnableRegistrazioneRichAnn: false,
          EnableCancellazioneRichAnn: false,
          DetailFromFunction: bDetailFromFunction,
          RemoveFunctionButtons: bRemoveFunctionButtons,
          IbanPrevalorizzato: false,
          isLogVisible: false
        });
        self.setModel(oModelUtility, "Utility");
      },

      _setClassificazioneModel: function (aData) {
        var self = this;

        var oDataClassificazione = {
          Cos: [],
          Cpv: [],
          Cig: [],
          Cup: [],
          ImpTotAssociareCos: 0.0,
          ImpTotAssociareCpv: 0.0,
          ImpTotAssociareCig: 0.0,
          ImpTotAssociareCup: 0.0,
        };

        aData.map((oClassificazione) => {
          switch (oClassificazione.Zetichetta) {
            case "COS":
              oDataClassificazione.ImpTotAssociareCos += parseFloat(
                oClassificazione.ZimptotClass
              );

              oClassificazione.Index = oDataClassificazione.Cos.length;
              oDataClassificazione.Cos.push(oClassificazione);
              break;
            case "CPV":
              oDataClassificazione.ImpTotAssociareCpv += parseFloat(
                oClassificazione.ZimptotClass
              );
              oClassificazione.Index = oDataClassificazione.Cpv.length;
              oDataClassificazione.Cpv.push(oClassificazione);
              break;
            case "CIG":
              oDataClassificazione.ImpTotAssociareCig += parseFloat(
                oClassificazione.ZimptotClass
              );
              oClassificazione.Index = oDataClassificazione.Cig.length;
              oDataClassificazione.Cig.push(oClassificazione);
              break;
            case "CUP":
              oDataClassificazione.ImpTotAssociareCup += parseFloat(
                oClassificazione.ZimptotClass
              );
              oClassificazione.Index = oDataClassificazione.Cup.length;
              oDataClassificazione.Cup.push(oClassificazione);
              break;
          }
        });

        oDataClassificazione.ImpTotAssociareCos =
          oDataClassificazione.ImpTotAssociareCos.toFixed(2);
        oDataClassificazione.ImpTotAssociareCpv =
          oDataClassificazione.ImpTotAssociareCpv.toFixed(2);
        oDataClassificazione.ImpTotAssociareCig =
          oDataClassificazione.ImpTotAssociareCig.toFixed(2);
        oDataClassificazione.ImpTotAssociareCup =
          oDataClassificazione.ImpTotAssociareCup.toFixed(2);

        self.setModel(new JSONModel(oDataClassificazione), "Classificazione");
      },

      setFiltersPosizioniModel: async function () {
        var self = this;
        var sUfficio = await self.getUfficio()

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
          UfficioContabile: sUfficio,
          UfficioPagatore: sUfficio,
          AnnoRegDocumento: [],
          NumRegDocFrom: "",
          NumRegDocTo: "",
          AnnoDocBeneficiario: [],
          NDocBen: [],
          Cig: "",
          Cup: "",
          ScadenzaDocFrom: null,
          ScadenzaDocTo: null,
          Gjahr: "",
          Zuffliq: [],
          ZnumliqFrom: "",
          ZnumliqTo: "",
          ZdescProsp: "",
        });
        self.setModel(oModelFilterDocumenti, "FilterDocumenti");
      },

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
            self._setClassificazioneModel(data.results);
          },
          error: function () {
            self._setClassificazioneModel([]);
          },
        });
      },

      setMode: function (sMode) {
        if (sMode === "Dettaglio") {
          return;
        }

        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        oModelUtility.setProperty("/RemoveFunctionButtons", true);
        oModelUtility.setProperty("/Function", sMode);
        oModelUtility.setProperty("/Enable" + sMode, true);
        oModelStepScenario.setProperty("/visibleBtnForward", false);

        if (
          sMode === "InvioFirma" ||
          sMode === "RegistrazioneRichAnn" ||
          sMode === "CancellazioneRichAnn"
        ) {
          self.setDatiFirmatario();
        }
      },

      //#endregion SET MODELLI

      //#endregion

      //#region ---------------------FUNZIONALITA----------------------------- /

      //#region FUNZIONALITA - EVENTI
      onAnnulla: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableAnnullamento")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "Annullamento");
          oModelUtility.setProperty("/EnableAnnullamento", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
        } else {
          self.doAnnulla();
        }
      },

      onInviaFirma: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableInvioFirma")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "InvioFirma");
          oModelUtility.setProperty("/EnableInvioFirma", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
          self.setDatiFirmatario();
        } else {
          self.doInviaFirma();
        }
      },

      onRevocaInvioFirma: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableRevocaInvioFirma")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "RevocaInvioFirma");
          oModelUtility.setProperty("/EnableRevocaInvioFirma", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
        } else {
          self.doRevocaInvioFirma();
        }
      },

      onFirma: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableFirma")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "Firma");
          oModelUtility.setProperty("/EnableFirma", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
        } else {
          self.doFirma();
        }
      },

      onRevocaFirma: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableRevocaFirma")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "RevocaFirma");
          oModelUtility.setProperty("/EnableRevocaFirma", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
        } else {
          self.doRevocaFirma();
        }
      },

      onRegistraRichAnn: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableRegistrazioneRichAnn")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "RegistrazioneRichAnn");
          oModelUtility.setProperty("/EnableRegistrazioneRichAnn", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
          self.setDatiFirmatario();
        } else {
          self.doRegistraRichAnn();
        }
      },

      onCancellaRichAnn: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableCancellazioneRichAnn")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "CancellazioneRichAnn");
          oModelUtility.setProperty("/EnableCancellazioneRichAnn", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
          self.setDatiFirmatario();
        } else {
          self.doCancellaRichAnn();
        }
      },

      onValorizzaDataProt: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var aListSoa = self.getModel("ListSoa").getData();

        aListSoa.map((oSoa) => {
          oSoa.Zdataprot = oModelUtility.getProperty("/Zdataprot");
        });

        self.setModel(new JSONModel(aListSoa), "ListSoa");
      },

      onNumProtocolloChange: function (oEvent) {
        var self = this;
        var oInput = self.getView().byId(oEvent.getParameter("id"));

        if (oEvent.getParameter("newValue")) {
          oInput.setValue(
            parseInt(oEvent.getParameter("newValue"))
              .toString()
              .padStart(6, "0")
          );
        }
      },

      //#endregion FUNZIONALITA - EVENTI

      //#region FUNZIONALITA - METHODS
      doAnnulla: function () {
        var self = this;
        var oModel = self.getModel();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
        var aListSoa = self.getModel("ListSoa").getData();

        var sMessage =
          aListSoa.length === 1
            ? oBundle.getText("msgWarningAnnulla")
            : oBundle.getText("msgWarningAnnullaMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Annullamento SOA",
          onClose: function (oAction) {
            if (oAction === "OK") {
              var aSospesi = [];

              aListSoa.map((oSoa) => {
                var oSospeso = {
                  Bukrs: oSoa.Bukrs,
                  Gjahr: oSoa.Gjahr,
                  Zchiavesop: oSoa.Zchiavesop,
                  Zstep: oSoa.Zstep,
                  Ztipososp: oSoa.Ztipososp,
                  Ztipopag: oSoa.Ztipopag,
                  Lifnr: oSoa.Lifnr,
                  Witht: oSoa.Witht,
                  ZzCebenra: oSoa.ZzCebenra,
                };

                aSospesi.push(oSospeso);
              });

              var oFunzionalitaDeep = {
                Funzionalita: "ANNULLAMENTO",
                ZuffcontFirm: "",
                Zcodord: "",
                ZdirigenteAmm: "",
                Sospeso: aSospesi,
                Messaggio: [],
              };

              oModel.create("/FunzionalitaDeepSet", oFunzionalitaDeep, {
                success: function (result) {
                  self._printMessage(result, "Annullamento SOA");
                },
                error: function () { },
              });
            }
          },
        });
      },

      doInviaFirma: function () {
        var self = this;
        var oModel = self.getModel();
        var oDatiFirma = self.getModel("DatiFirmatario")?.getData();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
        var aModelListSoa = self.getModel("ListSoa").getData();

        var sMessage =
          aModelListSoa.length === 1
            ? oBundle.getText("msgWarningInviaFirma")
            : oBundle.getText("msgWarningInviaFirmaMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Invio alla firma SOA",
          onClose: function (oAction) {
            if (oAction === "OK") {
              var aSospesi = [];

              aModelListSoa.map((oSoa) => {
                var oSospeso = {
                  Bukrs: oSoa.Bukrs,
                  Gjahr: oSoa.Gjahr,
                  Zchiavesop: oSoa.Zchiavesop,
                  Zstep: oSoa.Zstep,
                  Ztipososp: oSoa.Ztipososp,
                  Znumprot: oSoa.Znumprot,
                  Zdataprot: oSoa.Zdataprot ? oSoa.Zdataprot : null,
                };

                aSospesi.push(oSospeso);
              });

              var oFunzionalitaDeep = {
                Funzionalita: "INVIO_FIRMA",
                ZuffcontFirm: self.setBlank(oDatiFirma.ZuffcontFirm),
                Zcodord: self.setBlank(oDatiFirma.Zcodord),
                ZdirigenteAmm: self.setBlank(oDatiFirma.ZdirigenteAmm),
                Zcdr: self.setBlank(oDatiFirma.Fistl),
                Sospeso: aSospesi,
                Messaggio: [],
              };

              oModel.create("/FunzionalitaDeepSet", oFunzionalitaDeep, {
                success: function (result) {
                  self._printMessage(result, "Invio alla firma SOA");
                },
                error: function () { },
              });
            }
          },
        });
      },

      doRevocaInvioFirma: function () {
        var self = this;
        var oModel = self.getModel();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
        var aModelListSoa = self.getModel("ListSoa").getData();

        var sMessage =
          aModelListSoa.length === 1
            ? oBundle.getText("msgWarningRevocaInviaFirma")
            : oBundle.getText("msgWarningRevocaInviaFirmaMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Revoca Invio alla Firma SOA",
          onClose: function (oAction) {
            if (oAction === "OK") {
              var aSospesi = [];

              aModelListSoa.map((oSoa) => {
                var oSospeso = {
                  Bukrs: oSoa.Bukrs,
                  Gjahr: oSoa.Gjahr,
                  Zchiavesop: oSoa.Zchiavesop,
                  Zstep: oSoa.Zstep,
                  Ztipososp: oSoa.Ztipososp,
                };

                aSospesi.push(oSospeso);
              });

              var oFunzionalitaDeep = {
                Funzionalita: "REVOCA_INVIO_FIRMA",
                ZuffcontFirm: "",
                Zcodord: "",
                ZdirigenteAmm: "",
                Sospeso: aSospesi,
                Messaggio: [],
              };

              oModel.create("/FunzionalitaDeepSet", oFunzionalitaDeep, {
                success: function (result) {
                  self._printMessage(result, "Revoca Invio alla Firma SOA");
                },
                error: function () { },
              });
            }
          },
        });
      },

      doFirma: function () {
        var self = this;
        var oModel = self.getModel();
        var aModelListSoa = self.getModel("ListSoa").getData();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        var sMessage =
          aModelListSoa.length === 1
            ? oBundle.getText("msgWarningFirma", aModelListSoa[0].Zchiavesop)
            : oBundle.getText("msgWarningFirmaMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Firma SOA",
          onClose: function (oAction) { },
        });
      },

      doRevocaFirma: function () {
        var self = this;
        var oModel = self.getModel();
        var aModelListSoa = self.getModel("ListSoa").getData();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        var sMessage =
          aModelListSoa.length === 1
            ? oBundle.getText(
              "msgWarningRevocaFirma",
              aModelListSoa[0].Zchiavesop
            )
            : oBundle.getText("msgWarningRevocaFirmaMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Revoca firma SOA",
          onClose: function (oAction) {
            if (oAction === "OK") {
              var aSospesi = [];

              aModelListSoa.map((oSoa) => {
                var oSospeso = {
                  Bukrs: oSoa.Bukrs,
                  Gjahr: oSoa.Gjahr,
                  Zchiavesop: oSoa.Zchiavesop,
                  Zstep: oSoa.Zstep,
                  Ztipososp: oSoa.Ztipososp,
                };

                aSospesi.push(oSospeso);
              });

              var oFunzionalitaDeep = {
                Funzionalita: "REVOCA_FIRMA",
                ZuffcontFirm: "",
                Zcodord: "",
                ZdirigenteAmm: "",
                Sospeso: aSospesi,
                Messaggio: [],
              };

              oModel.create("/FunzionalitaDeepSet", oFunzionalitaDeep, {
                success: function (result) {
                  self._printMessage(result, "Revoca firma SOA");
                },
                error: function () { },
              });
            }
          },
        });
      },

      doRegistraRichAnn: function () {
        var self = this;
        var oModel = self.getModel();
        var aModelListSoa = self.getModel("ListSoa").getData();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        var sMessage =
          aModelListSoa.length === 1
            ? oBundle.getText("msgWarningRegistraRichAnn", [
              aModelListSoa[0].Zchiavesop,
            ])
            : oBundle.getText("msgWarningRegistraRichAnnMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Registrazione Richiesta di annullamento",
          onClose: function (oAction) { },
        });
      },

      doCancellaRichAnn: function () {
        var self = this;
        var oModel = self.getModel();
        var aModelListSoa = self.getModel("ListSoa").getData();
        var oDatiFirma = self.getModel("DatiFirmatario")?.getData();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        var sMessage =
          aModelListSoa.length === 1
            ? oBundle.getText("msgWarningCancellaRichAnn", [
              aModelListSoa[0].Zricann,
              aModelListSoa[0].Zchiavesop,
            ])
            : oBundle.getText("msgWarningCancellaRichAnnMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Cancellazione Richiesta di annullamento",
          onClose: function (oAction) {
            if (oAction === "OK") {
              var aSospesi = [];

              aModelListSoa.map((oSoa) => {
                var oSospeso = {
                  Bukrs: oSoa.Bukrs,
                  Gjahr: oSoa.Gjahr,
                  Zchiavesop: oSoa.Zchiavesop,
                  Zstep: oSoa.Zstep,
                  Ztipososp: oSoa.Ztipososp,
                };

                aSospesi.push(oSospeso);
              });

              var oFunzionalitaDeep = {
                Funzionalita: "CANCELLAZIONE_RICH_ANN",
                ZuffcontFirm: self.setBlank(oDatiFirma.ZuffcontFirm),
                Zcodord: self.setBlank(oDatiFirma.Zcodord),
                ZdirigenteAmm: self.setBlank(oDatiFirma.ZdirigenteAmm),
                Zcdr: self.setBlank(oDatiFirma.Fistl),
                Sospeso: aSospesi,
                Messaggio: [],
              };

              oModel.create("/FunzionalitaDeepSet", oFunzionalitaDeep, {
                success: function (result) {
                  self._printMessage(
                    result,
                    "Cancellazione Richiesta di annullamento"
                  );
                },
                error: function () { },
              });
            }
          },
        });
      },

      setDatiFirmatario: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelListSoa = self.getModel("ListSoa");
        var aListSoa = oModelListSoa.getData();

        var oModelDatiFirmatatario = new JSONModel({
          ZuffcontFirm: "",
          ZvimDescrufficio: "",
          Zcodord: "",
          ZcodordDesc: "",
          Fistl: "",
          ZdirigenteAmm: "",
        });

        if (aListSoa.length === 1) {
          oModelDatiFirmatatario.setProperty("/Fistl", aListSoa[0].Fistl);
        }

        oModel.read("/DatiFirmatarioSet", {
          success: function (data) {
            var oData = data.results[0];
            oModelDatiFirmatatario.setProperty(
              "/ZuffcontFirm",
              oData.ZuffcontFirm
            );
            oModelDatiFirmatatario.setProperty(
              "/ZvimDescrufficio",
              oData.ZvimDescrufficio
            );
          },
        });

        self.setModel(oModelDatiFirmatatario, "DatiFirmatario");
      },

      setWorkflowModel: function (oSoa) {
        var self = this;
        var oModel = self.getModel();

        //Carico il workflow
        var aFilters = [];
        self.setFilterEQ(aFilters, "Esercizio", oSoa.Gjahr);
        self.setFilterEQ(aFilters, "Bukrs", oSoa.Bukrs);
        self.setFilterEQ(aFilters, "Zchiavesop", oSoa.Zchiavesop);

        oModel.read("/WFStateSoaSet", {
          filters: aFilters,
          success: function (data) {
            data.results.map((oItem) => {
              oItem.DataOraString = new Date(oItem.DataOraString);
            });

            self.setModelCustom("WFStateSoa", data.results);
          },
        });
      },

      _printMessage: function (oResult, sTitle) {
        var self = this;
        var aMessage = oResult?.Messaggio.results;

        if (aMessage.length === 1) {
          var oMessage = aMessage[0];

          if (oResult.IsSuccess) {
            MessageBox.success(oMessage.Message, {
              actions: [MessageBox.Action.OK],
              title: sTitle,
              onClose: function () {
                self.getRouter().navTo("soa.list.ListSoa", {
                  Reload: true,
                });
              },
            });
          } else {
            MessageBox.error(oMessage.Message, {
              actions: [MessageBox.Action.OK],
              title: sTitle,
            });
          }
        } else {
          self._setLogModel(aMessage);

          if (oResult.IsSuccess) {
            MessageBox.success("Operazione eseguita correttamente", {
              actions: [MessageBox.Action.OK],
              title: sTitle,
              onClose: function () {
                self.getRouter().navTo("soa.list.ListSoa", {
                  Reload: true,
                });
              },
            });
          } else {
            MessageBox.error("Operazione non eseguita correttamente", {
              actions: [MessageBox.Action.OK],
              title: sTitle,
            });
          }
        }
      },

      //#endregion FUNZIONALITA - METHODS

      //#endregion

      //#region ------------------------GLOBAL-------------------------------- /

      resetWizard: function (sId) {
        var self = this;
        var oWizard = self.getView().byId(sId);
        var iCurrentWizard = oWizard.getProgress();
        for (var i = 0; i < iCurrentWizard - 1; i++) {
          oWizard.previousStep();
        }
      },

      //#endregion

      //#region -------------------GESTIONE FILTRI-----------------------------/
      createModelFilters: async function () {
        var self = this;
        var sUfficio = await self.getUfficio()
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
          UfficioContabile: sUfficio,
          UfficioPagatore: sUfficio,
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
      },

      setFiltersWizard1: function () {
        var self = this;
        var aFilters = [];
        var oSoa = self.getModel("Soa").getData();
        var oFilter = self.getModel("FilterDocumenti").getData();

        self.setFilterEQ(aFilters, "Ztipopag", oSoa.Ztipopag);
        self.setFilterEQ(aFilters, "Fipos", oSoa.Fipos);
        self.setFilterEQ(aFilters, "Fistl", oSoa.Fistl);
        self.setFilterEQ(aFilters, "Zgeber", oSoa.Zgeber);
        self.setFilterEQ(aFilters, "Witht", oFilter.CodRitenuta);
        self.setFilterEQ(aFilters, "ZzCebenra", oFilter.CodEnte);
        self.setFilterEQ(aFilters, "Zquoteesi", oFilter.QuoteEsigibili);
        self.setFilterBT(aFilters, "Zdateesi", oFilter.DataEsigibilitaFrom, oFilter.DataEsigibilitaTo);
        self.setFilterEQ(aFilters, "Lifnr", oFilter.Lifnr);
        self.setFilterEQ(aFilters, "FkberLong", oFilter.UfficioContabile);
        self.setFilterEQ(aFilters, "ZzuffPag", oFilter.UfficioPagatore);
        self.setFilterBT(aFilters, "Belnr", oFilter.NumRegDocFrom, oFilter.NumRegDocTo);
        self.setFilterEQ(aFilters, "Cig", oFilter.Cig);
        self.setFilterEQ(aFilters, "Cup", oFilter.Cup);
        self.setFilterBT(aFilters, "Netdt", oFilter.ScadenzaDocFrom, oFilter.ScadenzaDocTo);
        self.setFilterEQ(aFilters, "EsercizioContabile", oFilter.Gjahr);
        self.setFilterEQ(aFilters, "Zbenalt", oFilter?.Zbenalt);
        self.setFilterBT(aFilters, "Znumliq", oFilter.ZnumliqFrom, oFilter.ZnumliqTo);
        self.setFilterEQ(aFilters, "ZdescProsp", oFilter.ZdescProsp);

        oFilter?.AnnoRegDocumento.map((sAnno) => {
          self.setFilterEQ(aFilters, "AnnoRegDoc", sAnno);
        });

        oFilter?.AnnoDocBeneficiario.map((sAnno) => {
          self.setFilterEQ(aFilters, "AnnoDocBen", sAnno);
        });

        oFilter?.NDocBen.map((sNDocBen) => {
          self.setFilterEQ(aFilters, "Xblnr", sNDocBen);
        });

        oFilter?.Zuffliq.map((sUfficioLiquidatore) => {
          self.setFilterEQ(aFilters, "Zuffliq", sUfficioLiquidatore);
        });
        return aFilters;
      },

      checkPosizioniScen4: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oBundle = self.getResourceBundle();

        // TODO - Non commentare
        // if (!oModelSoa.getProperty("/Kostl")) {
        //   sap.m.MessageBox.error(oBundle.getText("msgKostlRequired"));
        //   return false;
        // }

        // if (!oModelSoa.getProperty("/Hkont")) {
        //   sap.m.MessageBox.error(oBundle.getText("msgHkontRequired"));
        //   return false;
        // }

        return true;
      },

      setPosizioneScen4: function () {
        var self = this;
        var oModel = self.getModel()
        var oModelSoa = self.getModel("Soa")
        var oSoa = oModelSoa.getData()

        var oPosition = oSoa.data[0]

        var sKey = oModel.createKey("/RegProspettoLiquidazioneSet", {
          Lifnr: oSoa.Lifnr,
          Zwels: oSoa.Zwels,
          Zdescwels: oSoa.Zdescwels,
          Iban: oSoa.Iban,
          Zimptot: oSoa.Zimptot
        })

        self.getView().setBusy(true)
        oModel.read(sKey, {
          success: function (data) {
            var aData = []
            data.Znumliq = oPosition?.Znumliq
            data.Zposizione = oPosition?.Zposizione
            aData.push(data)
            oModelSoa.setProperty("/data", aData)
            self.getView().setBusy(false)
          },
          error: function () {
            self.getView().setBusy(false)
          }
        })
      },

      //#endregion-----------------GESTIONE FILTRI-----------------------------/

      //#endregion

      //#region ---------------CREAZIONE ANAGRAFICA/PAGAMENTO------------------/
      functionReturnValueAnag: function (obj) {
        var oData = obj?.data;
        var aDataQuietaVaglia = obj?.data?.QuietVaglia?.results;
        var self = this;
        var oModelSoa = self.getModel("Soa");

        if (oData.MessageType !== "S") {
          return;
        }

        //Dati beneficiario
        oModelSoa.setProperty("/Lifnr", oData.Lifnr);
        oModelSoa.setProperty("/BuType", oData.Type);
        oModelSoa.setProperty("/TaxnumCf", oData.Stcd1);
        oModelSoa.setProperty("/TaxnumPiva", oData.Stcd2);
        oModelSoa.setProperty("/Taxnumxl", oData.Stcd3);
        oModelSoa.setProperty("/NameFirst", oData.Name);
        oModelSoa.setProperty("/NameLast", oData.Surname);
        oModelSoa.setProperty("/ZzragSoc", oData.Ragsoc);
        oModelSoa.setProperty("/Zdurc", oData.Durc);
        oModelSoa.setProperty("/Zdstatodes", oData.Statodurc);
        oModelSoa.setProperty("/Zdscadenza", oData.Scadenzadurc);
        oModelSoa.setProperty("/ZfermAmm", oData.ZfermAmm);

        //Modalita di pagamento
        oModelSoa.setProperty("/Banks", oData.CountryRes);
        oModelSoa.setProperty("/Zwels", oData.Zwels);
        oModelSoa.setProperty("/Zdescwels", oData.Zdescwels);
        oModelSoa.setProperty("/Swift", oData.Swift);
        oModelSoa.setProperty("/Zcoordest", oData.Zcoordest);
        oModelSoa.setProperty("/Iban", oData.Iban);
        oModelSoa.setProperty("/Ztipofirma", oData.Ztipofirma);

        //Banca Accredito
        oModelSoa.setProperty("/Zibanb", oData.Zibanb);
        oModelSoa.setProperty("/Zbicb", oData.Zbicb);
        oModelSoa.setProperty("/Zcoordestb", oData.Zcoordestb);
        oModelSoa.setProperty("/Zdenbanca", oData.Zdenbanca);
        oModelSoa.setProperty("/Zclearsyst", oData.Zclearsyst);
        oModelSoa.setProperty("/StrasBanca", oData.Stras);
        oModelSoa.setProperty("/Zcivico", oData.Zcivico);
        oModelSoa.setProperty("/Ort01Banca", oData.Ort01);
        oModelSoa.setProperty("/RegioBanca", oData.Regio);
        oModelSoa.setProperty("/PstlzBanca", oData.Stlz);
        oModelSoa.setProperty("/Land1", oData.Land1);

        //Intermediario 1
        oModelSoa.setProperty("/Zibani", oData.Zibani);
        oModelSoa.setProperty("/Zbici", oData.Zbici);
        oModelSoa.setProperty("/Zcoordesti", oData.Zcoordesti);
        oModelSoa.setProperty("/Zdenbancai", oData.Zdenbancai);
        oModelSoa.setProperty("/Zclearsysti", oData.Zclearsysti);
        oModelSoa.setProperty("/Zstrasi", oData.Zstrasi);
        oModelSoa.setProperty("/Zcivicoi", oData.Zcivicoi);
        oModelSoa.setProperty("/Zort01i", oData.Zort01i);
        oModelSoa.setProperty("/Zregioi", oData.Zregioi);
        oModelSoa.setProperty("/Zpstlzi", oData.Zpstlzi);
        oModelSoa.setProperty("/Zland1i", oData.Zland1i);

        //Sede beneficiario
        oModelSoa.setProperty("/Ort01", oData.City);
        oModelSoa.setProperty("/Regio", oData.Region);
        oModelSoa.setProperty("/Pstlz", oData.Pstlz);
        oModelSoa.setProperty("/Land1", oData.Country);
        oModelSoa.setProperty("/Stras", oData.Street + ", " + oData.Housenum);

        this._setDatiQuagliaVaglia(aDataQuietaVaglia, false);
      },

      functionReturnValueModPag: function (obj) {
        var aDataQuietaVaglia = obj?.data?.QuietVaglia?.results;
        var oData = obj?.data;

        if (oData.MessageType !== "S" || aDataQuietaVaglia.length === 0) {
          return;
        }

        this._setDatiQuagliaVaglia(aDataQuietaVaglia, true);
      },

      _setDatiQuagliaVaglia: function (aData, bModPag) {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        aData.map((oData) => {
          if (oData.TipVis === "P" && bModPag) {
            oModelSoa.setProperty("/Banks", oData.Country_res);
            oModelSoa.setProperty("/Zwels", oData.Zwels);
            oModelSoa.setProperty("/Zdescwels", oData.Zdescwels);
            oModelSoa.setProperty("/Swift", oData.Swift);
            oModelSoa.setProperty("/Zcoordest", oData.Zcoordest);
            oModelSoa.setProperty("/Iban", oData.Iban);
            oModelSoa.setProperty("/Ztipofirma", oData.Ztipofirma);

            //Banca Accredito
            oModelSoa.setProperty("/Zibanb", oData.Zibanb);
            oModelSoa.setProperty("/Zbicb", oData.Zbicb);
            oModelSoa.setProperty("/Zcoordestb", oData.Zcoordestb);
            oModelSoa.setProperty("/Zdenbanca", oData.Zdenbanca);
            oModelSoa.setProperty("/Zclearsyst", oData.Zclearsyst);
            oModelSoa.setProperty("/StrasBanca", oData.Stras);
            oModelSoa.setProperty("/Zcivico", oData.Zcivico);
            oModelSoa.setProperty("/Ort01Banca", oData.Ort01);
            oModelSoa.setProperty("/RegioBanca", oData.Regio);
            oModelSoa.setProperty("/PstlzBanca", oData.Stlz);
            oModelSoa.setProperty("/Land1", oData.Land1);

            //Intermediario 1
            oModelSoa.setProperty("/Zibani", oData.Zibani);
            oModelSoa.setProperty("/Zbici", oData.Zbici);
            oModelSoa.setProperty("/Zcoordesti", oData.Zcoordesti);
            oModelSoa.setProperty("/Zdenbancai", oData.Zdenbancai);
            oModelSoa.setProperty("/Zclearsysti", oData.Zclearsysti);
            oModelSoa.setProperty("/Zstrasi", oData.Zstrasi);
            oModelSoa.setProperty("/Zcivicoi", oData.Zcivicoi);
            oModelSoa.setProperty("/Zort01i", oData.Zort01i);
            oModelSoa.setProperty("/Zregioi", oData.Zregioi);
            oModelSoa.setProperty("/Zpstlzi", oData.Zpstlzi);
            oModelSoa.setProperty("/Zland1i", oData.Zland1i);
          } else if (oData.TipVis === "D") {
            //Se D = Destinatario
            oModelSoa.setProperty("/ZpersNomeVaglia", oData.ZQNome);
            oModelSoa.setProperty("/ZpersCognomeVaglia", oData.ZQCognome);
            oModelSoa.setProperty("/Zstcd13", oData.Stcd3);
            oModelSoa.setProperty("/Zqindiriz", oData.ZQIndiriz);
            oModelSoa.setProperty("/Zqcitta", oData.ZQCitta);
            oModelSoa.setProperty("/Zqcap", oData.ZQCAP);
            oModelSoa.setProperty("/Zqprovincia", oData.ZQProvincia);
            oModelSoa.setProperty("/Land1", oData.Land1);
            oModelSoa.setProperty("/ZqragSoc", oData.Zzrag_soc);
          } else if (oData.TipVis === "Q") {
            //Se Q = Quietanzante
            //Se non sono valorizzati sia il CF del primo quietanzante e sia
            //il CF del destinatario vuol dire che quello inserito è il primo
            //quietanzante
            if (
              !oModelSoa.getProperty("/Zstcd1") &&
              !oModelSoa.getProperty("/Zstcd13")
            ) {
              oModelSoa.setProperty("/ZpersNomeQuiet1", oData.ZQNome);
              oModelSoa.setProperty("/ZpersCognomeQuiet1", oData.ZQCognome);
              oModelSoa.setProperty("/Zstcd1", oData.Stcd1);
              oModelSoa.setProperty("/Zqindiriz", oData.ZQIndiriz);
              oModelSoa.setProperty("/Zqcitta", oData.ZQCitta);
              oModelSoa.setProperty("/Zqcap", oData.ZQCAP);
              oModelSoa.setProperty("/Zqprovincia", oData.ZQProvincia);
              oModelSoa.setProperty("/Land1", oData.Zzrag_soc);
              oModelSoa.setProperty("/ZqragSoc", oData.Land1);
            } else {
              oModelSoa.setProperty("/ZpersCognomeQuiet2", oData.ZQCognome);
              oModelSoa.setProperty("/ZpersNomeQuiet2", oData.ZQNome);
              oModelSoa.setProperty("/Zstcd12", oData.Stcd2);
              oModelSoa.setProperty("/Zqindiriz2", oData.ZQIndiriz);
              oModelSoa.setProperty("/Zqcitta2", oData.ZQCitta);
              oModelSoa.setProperty("/Zqcap2", oData.ZQCAP);
              oModelSoa.setProperty("/Zqprovincia2", oData.ZQProvincia);
              oModelSoa.setProperty("/Land2", oData.Land1);
            }
          }
        });
      },

      //#endregion ------------CREAZIONE ANAGRAFICA/PAGAMENTO------------------/

      functionReturnValueMC: async function (obj) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oModelUtility = self.getModel("Utility");
        var oStepScenario = self.getModel("StepScenario").getData()
        var oSoa = oModelSoa.getData()

        if (obj?.Iban && obj?.Banks) {
          if (oModelUtility.getProperty("/isIbanPrevalorizzato")) {
            var oDialogMotivazione = self.loadFragment("rgssoa.view.fragment.soa.wizard2.Motivazione");
            oDialogMotivazione.open();
          }

          self.checkIban();
          self.setDataIban();
          return;
        }

        if (obj?.Lifnr) {
          self._setSpecieSoaDesc("1")
          if (!oStepScenario.wizard2) {
            self._createModelAnnoDocBen();
            oModelSoa.setProperty("/Zquoteesi", false);
            oModelSoa.setProperty("/ZspecieSop", oSpecieSop.ZspecieSop);
            oModelSoa.setProperty("/DescZspecieSop", oSpecieSop.Descrizione);
          }

          if (oSoa.Ztipopag === "4") {
            self.createModelModPagamento()
          }
          this.setDataBeneficiario(obj?.Lifnr);
          return;
        }

        if (obj?.Zalias) {
          oModelSoa.setProperty("/Zalias", obj.Zalias);
          oModelSoa.setProperty("/ZaccText", obj.ZaccText);
          oModelSoa.setProperty("/AccTypeId", obj.AccTypeId);
          oModelSoa.setProperty("/RegioConto", obj.Zregio);
          this.setIban();
          return;
        }

        if (obj?.ZCausaleval) {
          oModelSoa.setProperty("/ZCausaleval", obj?.ZCausaleval);
          oModelSoa.setProperty("/ZDesccauval", obj?.ZDesccauval);
          return;
        }

        if (obj?.Zcodtrib) {
          oModelSoa.setProperty("/Zcodinps", obj.Zcodinps);
          oModelSoa.setProperty("/Zperiodrifa", obj.Zperiodrifa ? obj.Zperiodrifa : null);
          oModelSoa.setProperty("/Zperiodrifda", obj.Zperiodrifda ? obj.Zperiodrifda : null);
          return;
        }
      },

      _setDataBeneficiario: function (sLifnr) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oModelFilter = self.getModel("FilterDocumenti")
        var oModel = self.getModel();

        var sPath = self.getModel().createKey("/BeneficiarioSOASet", {
          Beneficiario: sLifnr,
        });

        if (!sLifnr) {
          oModelSoa.setProperty("/Lifnr", "");
          oModelSoa.setProperty("/NameFirst", "");
          oModelSoa.setProperty("/NameLast", "");
          oModelSoa.setProperty("/ZzragSoc", "");
          oModelSoa.setProperty("/TaxnumCf", "");
          oModelSoa.setProperty("/Taxnumxl", "");
          oModelSoa.setProperty("/TaxnumPiva", "");
          oModelSoa.setProperty("/Zsede", "");
          oModelSoa.setProperty("/Zdenominazione", "");
          oModelSoa.setProperty("/ZzDescebe", "");
          oModelSoa.setProperty("/Zdurc", "");
          oModelSoa.setProperty("/ZfermAmm", "");
          oModelSoa.setProperty("/Zdstatodes", "");
          oModelSoa.setProperty("/Zdscadenza", "");
          oModelSoa.setProperty("/Type", "");
          oModelFilter.setProperty("/TipoBeneficiario", "")
          oModelFilter.setProperty("/Lifnr", "")
        }


        self.getView().setBusy(true);
        oModel.read(sPath, {
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            if (self.hasResponseError(oResponse)) {
              oModelSoa.setProperty("/Lifnr", "");
              oModelFilter.setProperty("/Lifnr", "")
              oModelSoa.setProperty("/ZspecieSop", "");
              oModelSoa.setProperty("/DescZspecieSop", "");
            }
            oModelFilter.setProperty("/TipoBeneficiario", data?.Type)
            oModelFilter.setProperty("/Lifnr", data.Beneficiario)
            oModelSoa.setProperty("/Lifnr", data.Beneficiario);
            oModelSoa.setProperty("/NameFirst", data.Nome);
            oModelSoa.setProperty("/NameLast", data.Cognome);
            oModelSoa.setProperty("/ZzragSoc", data.RagSoc);
            oModelSoa.setProperty("/TaxnumCf", data.CodFisc);
            oModelSoa.setProperty("/Taxnumxl", data.CodFiscEst);
            oModelSoa.setProperty("/TaxnumPiva", data.PIva);
            oModelSoa.setProperty("/Zsede", data?.Sede);
            oModelSoa.setProperty("/Zdenominazione", data?.DescrSede);
            oModelSoa.setProperty("/ZzDescebe", data?.EnteBen);
            oModelSoa.setProperty("/Zdurc", data?.Zdurc);
            oModelSoa.setProperty("/ZfermAmm", data?.ZfermAmm);
            oModelSoa.setProperty("/Zdstatodes", data?.Zdstatodes);
            oModelSoa.setProperty("/Zdscadenza", data?.Zdscadenza);
            oModelSoa.setProperty("/BuType", data?.Type);
            self._setSpecieSoaDesc("1");
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });

      }
    });
  }
);
