sap.ui.define(
  [
    "../../BaseSoaController",
    "../../../../model/formatter",
    "sap/ui/model/json/JSONModel",
  ],
  function (BaseSoaController, formatter, JSONModel) {
    "use strict";

    return BaseSoaController.extend(
      "rgssoa.controller.soa.detail.scenery.Scenario1",
      {
        formatter: formatter,

        onInit: function () {
          var self = this;

          var oModelStepScenario = new JSONModel({
            wizard1Step3: true,
            wizard2: false,
            wizard3: false,
            wizard4: false,
          });
          self.setModel(oModelStepScenario, "StepScenario");

          var oModelSoa = new JSONModel({
            EnableEdit: false,
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

          this.getRouter()
            .getRoute("soa.detail.scenery.Scenario1")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        onNavBack: function () {
          var self = this;
          var oView = self.getView();
          var oWizard = oView.byId("wizScenario1");
          //Load Models
          var oModelStepScenario = self.getModel("StepScenario");

          var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");
          var bWizard4 = oModelStepScenario.getProperty("/wizard4");

          if (bWizard1Step3) {
            history.go(-1);
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
            oWizard.previousStep();
          }
        },

        onNavForward: function () {
          var self = this;
          var oWizard = self.getView().byId("wizScenario1");
          var oModelStepScenario = self.getModel("StepScenario");

          var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");

          if (bWizard1Step3) {
            oModelStepScenario.setProperty("/wizard1Step3", false);
            oModelStepScenario.setProperty("/wizard2", true);
            oWizard.nextStep();
          } else if (bWizard2) {
            oModelStepScenario.setProperty("/wizard2", false);
            oModelStepScenario.setProperty("/wizard3", true);
            oWizard.nextStep();
          } else if (bWizard3) {
            oModelStepScenario.setProperty("/wizard3", false);
            oModelStepScenario.setProperty("/wizard4", true);
            oWizard.nextStep();
          }
        },

        _onObjectMatched: function (oEvent) {
          var self = this;
          //Load Models
          var oDataModel = self.getModel();
          var oParameters = oEvent.getParameter("arguments");
          var sPath = self.getModel().createKey("SOASet", oParameters);

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + sPath, {
                success: function (data, oResponse) {
                  self._setSoaModel(data);
                  self.setInpsEditable();
                  self.getSedeBeneficiario();
                  self._getPosizioniSoa();
                },
                error: function () {},
              });
            });
        },

        _setSoaModel: function (oData) {
          var self = this;
          var oModelSoa = self.getModel("Soa");

          oModelSoa.setProperty("/Ztipopag", oData.Ztipopag);
          oModelSoa.setProperty("/Bukrs", oData.Bukrs);
          oModelSoa.setProperty("/Zchiavesop", oData.Zchiavesop);
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
              console.log(data);
              oModelSoa.setProperty("/data", data.results);
            },
            error: function () {},
          });
        },
      }
    );
  }
);
