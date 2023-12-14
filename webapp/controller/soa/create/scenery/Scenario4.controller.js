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
          var oModelUtility = {
            ViewId: "rgssoa.view.soa.create.scenery.Scenario4",
          };
          self.setModel(new JSONModel(oModelUtility), "Utility");

          self.acceptOnlyImport("iptImportoLiquidazione");

          this.getRouter()
            .getRoute("soa.create.scenery.Scenario4")
            .attachPatternMatched(this._onObjectMatched, this);
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
            if (self.checkPosizioniScen4()) {
              oModelStepScenario.setProperty("/wizard1Step1", false);
              oModelStepScenario.setProperty("/wizard1Step2", true);
              oModelStepScenario.setProperty("/visibleBtnForward", false);
              oModelStepScenario.setProperty(
                "/visibleBtnInserisciProspLiquidazione",
                true
              );
              self.setPosizioneScen4();
              self.createModelSedeBeneficiario()
              self.setSedeBeneficiario();
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
              oModelStepScenario.setProperty("/visibleBtnSave", true);
              oWizard.nextStep();
            }
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

        onInserisciProspettoLiquidazione: function () {
          var self = this;
          var oWizard = self.getView().byId("wizScenario4");
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelSoa = self.getModel("Soa");
          var oSoa = oModelSoa.getData();

          var oPosizione = {
            Znumliq: "",
            Zposizione: "",
            ZdescProsp: "",
            Belnr: "",
            GjahrDc: "",
            Xblnr: "",
            Blart: "",
            Bldat: null,
            Zbenalt: "",
            ZbenaltName: "",
            Wrbtr: "",
            Zimpliq: oSoa.Zimptot,
            Zimppag: oSoa.Zimptot,
            Zimpdaord: oSoa.Zimptot,
          };

          var aPosizioni = [];
          aPosizioni.push(oPosizione);

          oModelSoa.setProperty("/data", aPosizioni);

          oModelStepScenario.setProperty("/wizard1Step2", false);
          oModelStepScenario.setProperty("/wizard2", true);
          oModelStepScenario.setProperty("/visibleBtnForward", true);
          oModelStepScenario.setProperty(
            "/visibleBtnInserisciProspLiquidazione",
            false
          );
          oWizard.nextStep();
        },

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

        _onObjectMatched: function (oEvent) {
          var self = this;

          self.resetWizard("wizScenario4");
          self.setSoaRegModel("4");
          self.setDataAutorizzazione(oEvent.getParameter("arguments"));
          self.setClassificazioneRegModel();
          self.setUtilityRegModel("rgssoa.view.soa.create.scenery.Scenario4");

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
          self.getLogModel();
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

        _setDataBeneficiario: function (sLifnr) {
          var self = this;
          var oModelSoa = self.getModel("Soa");
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
          }


          self.getView().setBusy(true);
          oModel.read(sPath, {
            success: function (data, oResponse) {
              self.getView().setBusy(false);
              if (self.hasResponseError(oResponse)) {
                oModelSoa.setProperty("/Lifnr", "");
                oModelSoa.setProperty("/ZspecieSop", "");
                oModelSoa.setProperty("/DescZspecieSop", "");
              }
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

              self.createModelModPagamento()
            },
            error: function () {
              self.getView().setBusy(false);
            },
          });
        },

        onBeneficiarioChange: function (oEvent) {
          var self = this;
          this._setDataBeneficiario(oEvent.getParameter("value"))
          self.createModelModPagamento()
        },
      }
    );
  }
);
