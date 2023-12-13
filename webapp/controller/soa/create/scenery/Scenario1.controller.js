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
          var self = this;
          var oModelUtility = {
            ViewId: "rgssoa.view.soa.create.scenery.Scenario1",
          };
          self.setModel(new JSONModel(oModelUtility), "Utility");

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

        onNavForward: async function () {
          var self = this;
          var oWizard = self.getView().byId("wizScenario1");
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelUtility = self.getModel("Utility")

          var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
          var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");

          if (bWizard1Step2) {
            if (self.checkDispAutorizzazione()) {
              oModelStepScenario.setProperty("/wizard1Step2", false);
              oModelStepScenario.setProperty("/wizard1Step3", true);
            }
          } else if (bWizard1Step3) {
            oModelStepScenario.setProperty("/wizard1Step3", false);
            oModelStepScenario.setProperty("/wizard2", true);
            self.createModelSedeBeneficiario()
            self.setSedeBeneficiario();
            self.setModalitaPagamentoQuote();
            self.createModelModPagamento()
            self.setIbanQuote()
            oModelUtility.setProperty("/isVersanteEditable", await self.checkLifnrInTvarvc());
            oWizard.nextStep();
          } else if (bWizard2) {
            self.checkWizard2(oWizard);
            self.getCig();
          } else if (bWizard3) {
            if (self.checkClassificazione()) {
              oModelStepScenario.setProperty("/wizard3", false);
              oModelStepScenario.setProperty("/wizard4", true);
              oModelStepScenario.setProperty("/visibleBtnForward", false);
              oModelStepScenario.setProperty("/visibleBtnSave", true);
              self.setCausalePagamento();
              oWizard.nextStep();
            }
          }
        },

        onStart: function () {
          var self = this;
          var oModel = self.getModel();
          var oModelStepScenario = self.getModel("StepScenario");
          var aFilters = self.setFiltersWizard1();
          var oPanelCalculator = self.getView().byId("pnlCalculatorList");

          self.getView().setBusy(true);

          oModel.read("/QuoteDocumentiSet", {
            filters: aFilters,
            success: function (data, oResponse) {
              self.getView().setBusy(false);
              if (!self.hasResponseError(oResponse)) {
                oModelStepScenario.setProperty("/wizard1Step1", false);
                oModelStepScenario.setProperty("/wizard1Step2", true);
                oModelStepScenario.setProperty("/visibleBtnForward", true);
                oModelStepScenario.setProperty("/visibleBtnStart", false);
              }

              var aData = data?.results;
              aData?.map((oPosition, iIndex) => {
                oPosition.Index = iIndex + 1;
              });
              self.setModel(new JSONModel(aData), "PosizioniScen1");
              oPanelCalculator.setVisible(aData.length !== 0);
            },
            error: function () {
              self.getView().setBusy(false);
            },
          });
        },

        onSelectedItem: function (oEvent) {
          var self = this;
          var bSelected = oEvent.getParameter("selected");
          //Load Model
          var oModelDocumenti = self.getModel("PosizioniScen1");
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

        onImpDaOrdinareChange: function (oEvent) {
          var self = this;
          //Load Component
          var oTableDocumenti = self.getView().byId("tblPosizioniScen1");
          //Load Models
          var oTableModelDocumenti = oTableDocumenti.getModel("PosizioniScen1");
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

        _onObjectMatched: function (oEvent) {
          var self = this;

          self.resetWizard("wizScenario1");
          self.setSoaRegModel("1");
          self.setDataAutorizzazione(oEvent.getParameter("arguments"));
          self.setClassificazioneRegModel();
          self.setUtilityRegModel("rgssoa.view.soa.create.scenery.Scenario1");
          self.setStepScenarioRegModel();
          self.createModelFilters()
          self.getLogModel();
        },

      }
    );
  }
);
