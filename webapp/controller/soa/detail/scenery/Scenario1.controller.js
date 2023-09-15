sap.ui.define(
  [
    "../../BaseSoaController",
    "../../../../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
  ],
  function (BaseSoaController, formatter, JSONModel, MessageBox, Annullamento) {
    "use strict";

    return BaseSoaController.extend(
      "rgssoa.controller.soa.detail.scenery.Scenario1",
      {
        formatter: formatter,

        onInit: function () {
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
          var oModelUtility = self.getModel("Utility");

          var bWizard1Step1 = oModelStepScenario.getProperty("/wizard1Step1");
          var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
          var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");
          var bWizard4 = oModelStepScenario.getProperty("/wizard4");

          var bRettifica =
            oModelUtility.getProperty("/Function") === "Rettifica";
          var bBackToFilters = oModelUtility.getProperty("/AddPositions");

          if (bWizard1Step1) {
            self.getRouter().navTo("soa.list.ListSoa", { Reload: false });
          } else if (bWizard1Step2) {
            if (bBackToFilters) {
              oModelStepScenario.setProperty("/wizard1Step1", true);
              oModelStepScenario.setProperty("/wizard1Step2", false);
              oModelStepScenario.setProperty("/visibleBtnForward", false);
              oModelStepScenario.setProperty("/visibleBtnStart", true);
            } else {
              self.getRouter().navTo("soa.list.ListSoa", { Reload: false });
            }
          } else if (bWizard1Step3) {
            if (bRettifica) {
              oModelStepScenario.setProperty("/wizard1Step2", true);
              oModelStepScenario.setProperty("/wizard1Step3", false);
            } else if (oModelUtility.getProperty("/DetailFromFunction")) {
              history.back();
            } else {
              self.getRouter().navTo("soa.list.ListSoa", { Reload: false });
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
          var oModelUtility = self.getModel("Utility");

          var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
          var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");
          var bGoToRiepilogo = oModelUtility.getProperty("/DeletePositions");

          if (bWizard1Step2) {
            if (bGoToRiepilogo) {
              oModelStepScenario.setProperty("/wizard1Step2", false);
              oModelStepScenario.setProperty("/wizard1Step3", true);
            } else {
              this._addNewPositions();
            }
          } else if (bWizard1Step3) {
            if (self.checkPosizioniScenario1()) {
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
              self.resetWizard("wizScenario1");
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
              self.setInpsEditable();
              this._setPropertiesForEdit();
              break;
            }
            default: {
              oModelStepScenario.setProperty("/visibleBtnForward", false);
              break;
            }
          }
        },

        onEdit: function () {
          this._setPropertiesForEdit();
        },

        //#region WIZARD 1

        onStart: function () {
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

          oModelUtility.setProperty(
            "/EnableBtnDeleteSoa",
            aSelectedItems.length > 0
          );
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

                  oModelSoa.setProperty("/data", aPositionSoa);

                  var fTotal = 0;
                  aPositionSoa.map((oPosition) => {
                    fTotal += parseFloat(oPosition?.Zimpdaord);
                  });

                  oModelSoa.setProperty("/Zimptot", fTotal.toFixed(2));
                  oModelUtility.setProperty("/EnableBtnDeleteSoa", false);
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

        _getQuoteDocumentiList: function () {
          var self = this;
          var oView = self.getView();
          //Load Model
          var oDataModel = self.getModel();
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelSoa = self.getModel("Soa");
          var oModelUtility = self.getModel("Utility");
          //Load Component
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

          var aFilters = this.setFiltersScenario1();

          //Check BEETWEN filters
          var sIntervalFilter = self.checkBTFilter(aFilters);
          if (sIntervalFilter) {
            sap.m.MessageBox.error(sIntervalFilter);
            self.clearModel("QuoteDocumenti");
            return;
          }

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

              var aQuoteDocumenti = data.results;

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

        //#endregion WIZARD 1 - PRIVATE METHODS

        //#endregion WIZARD 1

        //#region PRIVATE METHODS

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
        },

        _setPropertiesForEdit: function () {
          var self = this;
          var oModelSoa = self.getModel("Soa");
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelUtility = self.getModel("Utility");

          self.setModelCustom("QuoteDocumenti", oModelSoa.getProperty("/data"));

          self.resetWizard("wizScenario1");

          oModelUtility.setProperty("/DeletePositions", true);
          oModelUtility.setProperty("/EnableEdit", true);
          oModelUtility.setProperty("/RemoveFunctionButtons", true);

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
      }
    );
  }
);
