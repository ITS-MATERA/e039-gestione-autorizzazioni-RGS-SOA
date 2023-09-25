sap.ui.define(
  [
    "../../BaseSoaController",
    "../../../../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
  ],

  function (
    BaseSoaController,
    formatter,
    JSONModel,
    MessageBox,
    exportLibrary,
    Spreadsheet
  ) {
    "use strict";

    const EDM_TYPE = exportLibrary.EdmType;
    return BaseSoaController.extend(
      "rgssoa.controller.soa.detail.scenery.Scenario4",
      {
        onInit: function () {
          var self = this;
          var oModelUtility = {
            ViewId: "rgssoa.view.soa.detail.scenery.Scenario4",
          };
          self.setModel(new JSONModel(oModelUtility), "Utility");

          this.getRouter()
            .getRoute("soa.detail.scenery.Scenario4")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
          var self = this;
          var oParameters = oEvent.getParameter("arguments");
          var bDetailFromFunction =
            oParameters.DetailFromFunction === "true" ? true : false;
          var bRemoveFunctionButtons = bDetailFromFunction;

          //Load Models
          self.setStepScenarioModel();
          self.setUtilityModel(bDetailFromFunction, bRemoveFunctionButtons);
          self.setFiltersPosizioniModel();
          self.setSoaModel(oParameters, function () {
            self.enableFunctions();
            self.setMode(oParameters.Mode);
          });
          self.getLogModel();
          self.resetWizard("wizScenario4");
        },

        onIconTabChange: function (oEvent) {
          var self = this;
          var oModelUtility = self.getModel("Utility");
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelSoa = self.getModel("Soa");
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
              self.resetWizard("wizScenario4");
              self.setStepScenarioModel();
              self.setSoaModel(oParameters, function () {});
              break;
            }
            case "Workflow": {
              oModelStepScenario.setProperty("/visibleBtnForward", false);
              self.setWorkflowModel(oModelSoa.getData());
              break;
            }
            case "Rettifica": {
              this._setPropertiesForEdit();
              break;
            }
            default: {
              var aListSoa = [];
              aListSoa.push(oModelSoa.getData());
              self.setModel(new JSONModel(aListSoa), "ListSoa");
              oModelStepScenario.setProperty("/visibleBtnForward", false);
              break;
            }
          }
        },

        onNavBack: function () {
          var self = this;
          var oView = self.getView();
          var oWizard = oView.byId("wizScenario4");
          //Load Models
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelUtility = self.getModel("Utility");

          var bWizard1Step1 = oModelStepScenario.getProperty("/wizard1Step1");
          var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");
          var bWizard4 = oModelStepScenario.getProperty("/wizard4");

          var bRettifica =
            oModelUtility.getProperty("/Function") === "Rettifica";

          if (bWizard1Step1) {
            self.getRouter().navTo("soa.list.ListSoa", { Reload: false });
          } else if (bWizard1Step2) {
            if (bRettifica) {
              oModelStepScenario.setProperty("/wizard1Step1", true);
              oModelStepScenario.setProperty("/wizard1Step2", false);
              oModelStepScenario.setProperty("/visibleBtnForward", true);
              oModelStepScenario.setProperty(
                "/visibleBtnInserisciProspLiquidazione",
                false
              );
            } else {
              self.getRouter().navTo("soa.list.ListSoa", { Reload: false });
            }
          } else if (bWizard2) {
            oModelStepScenario.setProperty("/wizard2", false);
            oModelStepScenario.setProperty("/wizard1Step2", true);
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
          var oModelUtility = self.getModel("Utility");

          var bWizard1Step1 = oModelStepScenario.getProperty("/wizard1Step1");
          var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");

          var bRettifica = oModelUtility.getProperty(
            "/Function" === "Rettifica"
          );

          if (bWizard1Step1) {
            if (self.checkPosizioniScen4()) {
              self.setPosizioneScen4();
              self.setInpsData();
            }
          } else if (bWizard1Step2) {
            if (!bRettifica) {
              oModelStepScenario.setProperty("/wizard1Step2", false);
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
              oModelStepScenario.setProperty("/visibleBtnSave", true);
              oWizard.nextStep();
            }
          }
        },

        setStepScenarioModel: function () {
          var self = this;
          var oModelStepScenario = new JSONModel({
            wizard1Step1: false,
            wizard1Step2: true,
            wizard2: false,
            wizard3: false,
            wizard4: false,
            visibleBtnForward: true,
            visibleBtnInserisciProspLiquidazione: false,
            visibleBtnSave: false,
          });

          self.setModel(oModelStepScenario, "StepScenario");
        },

        onEdit: function () {
          this._setPropertiesForEdit();
        },

        _setPropertiesForEdit: function () {
          var self = this;
          var oModelSoa = self.getModel("Soa");
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelUtility = self.getModel("Utility");

          self.getModalitaPagamentoList();
          self.setDurc();
          self.setFermoAmministrativo();
          self.setInpsEditable();
          self.resetWizard("wizScenario4");

          oModelUtility.setProperty("/EnableEdit", true);
          oModelUtility.setProperty("/RemoveFunctionButtons", true);

          oModelSoa.setProperty("/EnableEdit", true);
          //Porto la IconTab sul tab giusto
          oModelUtility.setProperty("/Function", "Rettifica");
          oModelSoa.setProperty("/visibleBtnEdit", false);

          oModelStepScenario.setProperty("/wizard1Step1", true);
          oModelStepScenario.setProperty("/wizard1Step2", false);
          oModelStepScenario.setProperty("/wizard2", false);
          oModelStepScenario.setProperty("/wizard3", false);
          oModelStepScenario.setProperty("/wizard4", false);
        },

        onInserisciProspettoLiquidazione: function () {
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

        setPosizioneScen4: function () {
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

          oModel.read("/RegProspettoLiquidazioneSet", {
            filters: aFilters,
            success: function (data, oResponse) {
              if (!self.setResponseMessage(oResponse)) {
                self.setModelCustom("NewProspettoLiquidazione", data?.results);
                oModelStepScenario.setProperty("/wizard1Step1", false);
                oModelStepScenario.setProperty("/wizard1Step2", true);
                oModelStepScenario.setProperty("/visibleBtnForward", false);
                oModelStepScenario.setProperty(
                  "/visibleBtnInserisciProspLiquidazione",
                  true
                );

                var oNewPosizione = data?.results[0];
                var oOldPosizione = oModelSoa.getProperty("/data")[0];

                if (
                  oNewPosizione.Zbenalt !== oOldPosizione.Lifnr ||
                  oNewPosizione.Iban !== oOldPosizione.Iban ||
                  oNewPosizione.Zwels !== oOldPosizione.Zwels ||
                  oNewPosizione.Zdurc !== oOldPosizione.Zdurc ||
                  oNewPosizione.ZfermAmm !== oOldPosizione.ZfermAmm ||
                  oNewPosizione.Zimpliq !== oOldPosizione.Zimpliq
                ) {
                  var oNewPosizione = {
                    AnnoRegDocumento: "",
                    Belnr: "",
                    Blart: oNewPosizione.TpDoc,
                    Bldat: oNewPosizione.DataDoc,
                    Bukrs: "",
                    Gjahr: "",
                    Iban: oNewPosizione.Iban,
                    Xblnr: "",
                    Zbenalt: oNewPosizione.Lifnr,
                    ZbenaltName: oNewPosizione.ZzragSoc,
                    Zchiavesop: "",
                    ZdescProsp: "",
                    Zdescwels: oNewPosizione.Zdescwels,
                    Zdurc: oNewPosizione.Zdurc,
                    ZfermAmm: oNewPosizione.ZfermAmm,
                    Zimpdaord: oNewPosizione.Zimpliq,
                    Zimpliq: oNewPosizione.Zimpliq,
                    Zimppag: oNewPosizione.Zimpliq,
                    Znumliq: "0.00",
                    Zposizione: "",
                    Zpossop: "",
                    ZspecieSop: "",
                    ZstepSop: "",
                    Ztipopag: "",
                    Zwels: oNewPosizione.Zwels,
                  };

                  var aNewPosizione = [];

                  aNewPosizione.push(oNewPosizione);

                  oModelSoa.setProperty("/data", aNewPosizione);
                }

                // if(oNewPosizione.)
              }
            },
            error: function () {},
          });
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
      }
    );
  }
);
