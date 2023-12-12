sap.ui.define(
  [
    "../../BaseSoaController",
    "sap/ui/model/json/JSONModel",
    "../../../../model/formatter",
  ],
  function (BaseSoaController, JSONModel, formatter) {
    "use strict";

    return BaseSoaController.extend(
      "rgssoa.controller.soa.create.scenery.Scenario3",
      {
        formatter: formatter,
        onInit: function () {
          var self = this;
          var oModelUtility = {
            ViewId: "rgssoa.view.soa.create.scenery.Scenario3",
          };
          self.setModel(new JSONModel(oModelUtility), "Utility");

          this.getRouter()
            .getRoute("soa.create.scenery.Scenario3")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        onNavBack: function () {
          var self = this;
          var oView = self.getView();
          var oWizard = oView.byId("wizScenario3");
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
          var oWizard = self.getView().byId("wizScenario3");
          var oModelStepScenario = self.getModel("StepScenario");

          var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
          var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");

          if (bWizard1Step2) {
            if (this._checkProspettoLiquidazione()) {
              oModelStepScenario.setProperty("/wizard1Step2", false);
              oModelStepScenario.setProperty("/wizard1Step3", true);
            }
          } else if (bWizard1Step3) {
            oModelStepScenario.setProperty("/wizard1Step3", false);
            oModelStepScenario.setProperty("/wizard2", true);
            self.setDataBenficiario();
            self.setModalitaPagamento();
            self.setDataQuietanzante2();
            self.setDataQuietanzante();
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
              oWizard.nextStep();
            }
          }
        },

        //#region WIZARD 1
        onStart: function () {
          this._checkBeneficiario();
        },

        onSelectedItem: function (oEvent) {
          var self = this;
          var bSelected = oEvent.getParameter("selected");
          //Load Model
          var oModelDocumenti = self.getModel("ProspettoLiquidazione");
          var oModelSoa = self.getModel("Soa");
          //Load Component
          var oTableDocumenti = self.getView().byId("tblProspettoLiquidazione");
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
                if (
                  oRecord.Bukrs === oItem.Bukrs &&
                  oRecord.Znumliq === oItem.Znumliq &&
                  oRecord.Zposizione === oItem.Zposizione &&
                  oRecord.Zversione === oItem.Zversione &&
                  oRecord.ZversioneOrig === oItem.ZversioneOrig
                ) {
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
                return !(
                  oSelectedItem.Bukrs === oItem.Bukrs &&
                  oSelectedItem.Znumliq === oItem.Znumliq &&
                  oSelectedItem.Zposizione === oItem.Zposizione &&
                  oSelectedItem.Zversione === oItem.Zversione &&
                  oSelectedItem.ZversioneOrig === oItem.ZversioneOrig
                );
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

        //#region SELECTION CHANGE
        onImpDaOrdinareChange: function (oEvent) {
          var self = this;
          //Load Component
          var oTableDocumenti = self.getView().byId("tblProspettoLiquidazione");
          //Load Models
          var oTableModelDocumenti = oTableDocumenti.getModel(
            "ProspettoLiquidazione"
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

          self.resetWizard("wizScenario3");
          self.setSoaRegModel("3");
          self.setDataAutorizzazione(oEvent.getParameter("arguments"));
          self.setClassificazioneRegModel();
          self.setUtilityRegModel();
          self.setStepScenarioRegModel();
          self.createModelFilters()
          self.getLogModel();
        },

        _getProspettiLiquidazioneList: function () {
          var self = this;
          var oView = self.getView();
          //Load Model
          var oDataModel = self.getModel();
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelSoa = self.getModel("Soa");
          //Load Component
          var oTableDocumenti = oView.byId("tblProspettoLiquidazione");
          var oPanelCalculator = oView.byId("pnlCalculatorList");

          var aListRiepilogo = oModelSoa.getProperty("/data");
          var aFilters = self.setFiltersWizard1();

          oView.setBusy(true);

          oDataModel.read("/" + "ProspettoLiquidazioneSet", {
            filters: aFilters,
            success: function (data, oResponse) {
              if (!self.hasResponseError(oResponse)) {
                oModelStepScenario.setProperty("/wizard1Step1", false);
                oModelStepScenario.setProperty("/wizard1Step2", true);
                oModelStepScenario.setProperty("/visibleBtnForward", true);
                oModelStepScenario.setProperty("/visibleBtnStart", false);
              }
              self.setModelCustom("ProspettoLiquidazione", data.results);

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

        _checkProspettoLiquidazione: function () {
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
            sap.m.MessageBox.error(
              oBundle.getText("msgNoProspettoLiquidazione")
            );
            return false;
          }

          return true;
        },

        _checkBeneficiario: function () {
          var self = this;
          //Load Models
          var oModel = self.getModel();
          var oModelSoa = self.getModel("Soa");
          var oView = self.getView();

          if (oModelSoa.getProperty("/Lifnr")) {
            var sPath = self.getModel().createKey("CheckBeneficiarioScen3Set", {
              Lifnr: oModelSoa.getProperty("/Lifnr"),
            });
            var oBundle = self.getResourceBundle();

            oView.setBusy(true);

            oModel.read("/" + sPath, {
              success: function (data, oResponse) {
                if (oResponse?.headers["sap-message"]) {
                  sap.m.MessageBox.warning(
                    oBundle.getText("msgExistQuoteDocumenti"),
                    {
                      onClose: function (oAction) {
                        self._getProspettiLiquidazioneList();
                      },
                    }
                  );
                } else {
                  self._getProspettiLiquidazioneList();
                }
                oView.setBusy(false);
              },
              error: function () {
                oView.setBusy(false);
              },
            });
          } else {
            self._getProspettiLiquidazioneList();
          }
        },

        //#endregion

        //#endregion
      }
    );
  }
);
