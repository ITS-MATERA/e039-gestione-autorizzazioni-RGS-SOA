sap.ui.define(
  [
    "../../BaseSoaController",
    "../../../../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
  ],
  function (BaseSoaController, formatter, JSONModel, MessageBox) {
    "use strict";

    return BaseSoaController.extend(
      "rgssoa.controller.soa.detail.scenery.Scenario3",
      {
        onInit: function () {
          var self = this;
          var oModelUtility = {
            ViewId: "rgssoa.view.soa.detail.scenery.Scenario3",
          };
          self.setModel(new JSONModel(oModelUtility), "Utility");

          this.getRouter()
            .getRoute("soa.detail.scenery.Scenario3")
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
            self.getSedeBeneficiario();
          });
          self.getLogModel();
          self.resetWizard("wizScenario3");
        },

        onNavBack: function () {
          var self = this;
          var oView = self.getView();
          var oWizard = oView.byId("wizScenario3");
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
            oModelStepScenario.setProperty("/visibleBtnSave", false);
            oWizard.previousStep();
          }
        },

        onNavForward: function () {
          var self = this;
          var oWizard = self.getView().byId("wizScenario3");
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelUtility = self.getModel("Utility");
          var oModelSoa = self.getModel("Soa");

          var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
          var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");
          var bGoToRiepilogo = oModelUtility.getProperty("/DeletePositions");

          if (bWizard1Step2) {
            if (bGoToRiepilogo && self.checkPosizioniScen2()) {
              var aSoaPositions = oModelSoa.getProperty("/data");
              var fTotal = 0.0;
              aSoaPositions.map((oPosition) => {
                fTotal += parseFloat(oPosition?.Zimpdaord);
              });
              oModelSoa.setProperty("/Zimptot", fTotal.toFixed(2));

              oModelStepScenario.setProperty("/wizard1Step2", false);
              oModelStepScenario.setProperty("/wizard1Step3", true);
            } else {
              this._addNewPositions();
            }
          } else if (bWizard1Step3) {
            oModelStepScenario.setProperty("/wizard1Step3", false);
            oModelStepScenario.setProperty("/wizard2", true);
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
              self.resetWizard("wizScenario3");
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

        onEdit: function () {
          this._setPropertiesForEdit();
        },

        onStart: function () {
          this._getPosizioniScen3();
        },

        //#region ----------------GESTIONE POSIZIONI RETTIFICA------------------
        onAddSelectedItem: function (oEvent) {
          var self = this;
          var bSelected = oEvent.getParameter("selected");
          //Load Model
          var oModelPosizioniScen2 = self.getModel("PosizioniScen3");
          var oModelUtility = self.getModel("Utility");

          var aSelectedItems = oModelUtility.getProperty(
            "/AddSelectedPositions"
          );
          var aListItems = oEvent.getParameter("listItems");

          aListItems.map((oListItem) => {
            var oSelectedItem = oModelPosizioniScen2.getObject(
              oListItem.getBindingContextPath()
            );

            if (bSelected) {
              aSelectedItems.push(oSelectedItem);
            } else {
              var iIndex = aSelectedItems.findIndex((obj) => {
                return (
                  obj.Bukrs === oSelectedItem.Bukrs &&
                  obj.Zversione === oSelectedItem.Zversione &&
                  obj.ZversioneOrig === oSelectedItem.ZversioneOrig &&
                  obj.Znumliq === oSelectedItem.Znumliq &&
                  obj.Zposizione === oSelectedItem.Zposizione
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
          var oTableDocumenti = self.getView().byId("tblEditPosizioniScen3");
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
          //Load Models
          var oTableModelDocumenti = self.getModel("PosizioniScen3");

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

        onDeletePositionSoa: function () {
          var self = this;
          var oTable = self.getView().byId("tblEditPosizioniScen3");

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

        onSelectedItem: function (oEvent) {
          var self = this;
          var bSelected = oEvent.getParameter("selected");
          //Load Model
          var oModelUtility = self.getModel("Utility");
          var oTablePosizioniSoa = self.getView().byId("tblEditPosizioniScen3");
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

        _getPosizioniScen3: function () {
          var self = this;
          var oView = self.getView();
          //Load Model
          var oDataModel = self.getModel();
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelSoa = self.getModel("Soa");
          var oModelUtility = self.getModel("Utility");
          //Load Component
          var oTableDocumenti = oView.byId("tblAddPosizioniScen3");

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

          var aFilters = self.setFiltersScenario3();

          oView.setBusy(true);

          oDataModel.read("/" + "ProspettoLiquidazioneSet", {
            filters: aFilters,
            success: function (data, oResponse) {
              if (!self.setResponseMessage(oResponse)) {
                oModelStepScenario.setProperty("/wizard1Step1", false);
                oModelStepScenario.setProperty("/wizard1Step2", true);
                oModelStepScenario.setProperty("/visibleBtnForward", true);
                oModelStepScenario.setProperty("/visibleBtnStart", false);
              }

              var aPosizioni = data.results;

              //Rimuovo le posizioni già aggiunte al SOA
              if (aPosizioni.length !== 0) {
                aAddSelectedPositions.map((oPosizione) => {
                  var iIndex = aPosizioni.findIndex((obj) => {
                    return (
                      obj.Bukrs === oPosizione.Bukrs &&
                      obj.Znumliq === oPosizione.Znumliq &&
                      obj.Zposizione === oPosizione.Zposizione &&
                      obj.Zversione === oPosizione.Zversione &&
                      obj.ZversioneOrig === oPosizione.ZversioneOrig
                    );
                  });

                  if (iIndex > -1) {
                    aPosizioni.splice(iIndex, 1);
                  }
                });
              }

              self.setModelCustom("PosizioniScen3", aPosizioni);

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

          var oTable = self.getView().byId("tblEditPosizioniScen3");

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

        //#endregion

        //#region ----------------------METHODS---------------------------------
        _setPropertiesForEdit: function () {
          var self = this;
          var oModelSoa = self.getModel("Soa");
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelUtility = self.getModel("Utility");

          self.setModelCustom(
            "ProspettoLiquidazione",
            oModelSoa.getProperty("/data")
          );

          self.resetWizard("wizScenario3");

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
          oModelStepScenario.setProperty("/visibleBtnSave", false);
          oModelStepScenario.setProperty("/visibleBtnForward", true);

          self.setInpsEditable();
        },
        //#endregion
      }
    );
  }
);
