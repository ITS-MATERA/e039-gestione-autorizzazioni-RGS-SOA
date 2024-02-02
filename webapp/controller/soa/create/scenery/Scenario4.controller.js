sap.ui.define(
  [
    "../../BaseSoaController",
    "../../../../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageBox"
  ],
  function (
    BaseSoaController,
    formatter,
    JSONModel,
    exportLibrary,
    Spreadsheet,
    MessageBox
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

          self.acceptOnlyNumber("iptCodInps")
          self.acceptOnlyNumber("iptCodiceTributo")
          self.acceptOnlyImport("iptCFCommit")
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

        onNavForward: async function () {
          var self = this;
          var oWizard = self.getView().byId("wizScenario4");
          var oModelStepScenario = self.getModel("StepScenario");
          var bWizard1Step1 = oModelStepScenario.getProperty("/wizard1Step1");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");

          if (bWizard1Step1) {
            if (await self.checkWizard1()) {
              self.checkExistDocumentForUser();
            }
          } else if (bWizard2) {
            self.checkWizard2(oWizard);
          } else if (bWizard3) {
            if (self.checkClassificazione()) {
              oModelStepScenario.setProperty("/wizard3", false);
              oModelStepScenario.setProperty("/wizard4", true);
              oModelStepScenario.setProperty("/visibleBtnForward", false);
              oModelStepScenario.setProperty("/visibleBtnSave", true);
              self.setLocPagamento();
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
          // var oModelSoa = self.getModel("Soa");
          // var oSoa = oModelSoa.getData();

          // var oPosizione = {
          //   Znumliq: "",
          //   Zposizione: "",
          //   ZdescProsp: "",
          //   Belnr: "",
          //   GjahrDc: "",
          //   Xblnr: "",
          //   Blart: "",
          //   Bldat: null,
          //   Zbenalt: "",
          //   ZbenaltName: "",
          //   Wrbtr: "",
          //   Zimpliq: oSoa.Zimptot,
          //   Zimppag: oSoa.Zimptot,
          //   Zimpdaord: oSoa.Zimptot,
          // };

          // var aPosizioni = [];
          // aPosizioni.push(oPosizione);

          // oModelSoa.setProperty("/data", aPosizioni);

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
          self.createModelSoa("4");
          self.setDataAutorizzazione(oEvent.getParameter("arguments"));
          self.createModelClassificazione();
          self.createModelUtilityReg("rgssoa.view.soa.create.scenery.Scenario4");

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
              property: "Blart",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText("labelDataDocumento"),
              property: "Bldat",
              type: EDM_TYPE.Date,
              format: "dd.mm.yyyy",
            },
            {
              label: oBundle.getText("labelDataCompetenza"),
              property: "Bldat",
              type: EDM_TYPE.Date,
              format: "dd.mm.yyyy",
            },
            {
              label: oBundle.getText("labelDenomBenLiquidazione"),
              property: "ZbenaltName",
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
              property: "Zimptot",
              type: EDM_TYPE.Number,
              scale: 2,
              delimiter: true,
            },
          ];

          return aCols;
        },

        checkWizard1: function () {
          var self = this;
          var oModel = self.getModel()
          var oSoa = self.getModel("Soa").getData()

          return new Promise(async function (resolve, reject) {
            self.getView().setBusy(true);
            await oModel.callFunction("/CheckWizard1Scen4", {
              method: "GET",
              urlParameters: {
                Iban: oSoa.Iban,
                Lifnr: oSoa.Lifnr,
                Zwels: oSoa.Zwels,
                Zimptot: oSoa.Zimptot,
                Hkont: oSoa.Hkont,
                Kostl: oSoa.Kostl
              },
              success: function (data) {
                self.getView().setBusy(false);
                resolve(self.hasMessageError(data) ? false : true);
              },
              error: function (error) {
                self.getView().setBusy(false);
                reject(error);
              },
            });
          });
        },

        checkExistDocumentForUser: function () {
          var self = this;
          var oModel = self.getModel()
          var oSoa = self.getModel("Soa").getData()
          var oModelStepScenario = self.getModel("StepScenario")

          self.getView().setBusy(true)
          oModel.callFunction("/CheckExisitingDocument", {
            urlParameters: {
              Lifnr: oSoa.Lifnr
            },
            success: function (data) {
              self.getView().setBusy(false)
              if (data.results.length > 0) {
                MessageBox.warning(
                  "Per il Beneficiario selezionato esistono Documenti di costo. Verificare se è necessario procedere con la registrazione di un SOA da documenti di costo",
                  {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
                    onClose: function (oAction) {
                      if (oAction === 'OK') {
                        oModelStepScenario.setProperty("/wizard1Step1", false);
                        oModelStepScenario.setProperty("/wizard1Step2", true);
                        oModelStepScenario.setProperty("/visibleBtnForward", false);
                        oModelStepScenario.setProperty(
                          "/visibleBtnInserisciProspLiquidazione",
                          true
                        );
                        self.createModelModPagamento();
                        self.createModelSedeBeneficiario();
                        self.setSedeBeneficiario();
                        self.setPosizioneScen4()
                        return
                      }
                    },
                  }
                )
              }
              else {
                oModelStepScenario.setProperty("/wizard1Step1", false);
                oModelStepScenario.setProperty("/wizard1Step2", true);
                oModelStepScenario.setProperty("/visibleBtnForward", false);
                oModelStepScenario.setProperty(
                  "/visibleBtnInserisciProspLiquidazione",
                  true
                );
                self.createModelModPagamento();
                self.createModelSedeBeneficiario();
                self.setSedeBeneficiario();
                self.setPosizioneScen4()
              }
            },
            error: function () {
              self.getView().setBusy(false)
            }
          })
        },
      }
    );
  }
);
