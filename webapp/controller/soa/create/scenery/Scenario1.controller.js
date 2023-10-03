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
            self.setDataQuietanzante();
            self.setDataQuietanzante2();
            self.getSedeBeneficiario();
            self.setDataInps();
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
              self.setCausalePagamento();
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
          //Load Models
          var oModel = self.getModel();

          self.resetWizard("wizScenario1");
          self.setSoaRegModel("1");
          self.setDataAutorizzazione(oEvent.getParameter("arguments"));
          self.setClassificazioneRegModel();
          self.setUtilityRegModel();
          self.setStepScenarioRegModel();

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

        //#endregion
      }
    );
  }
);
