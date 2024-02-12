sap.ui.define(
  [
    "../../BaseSoaController",
    "../../../../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/FilterOperator",
  ],
  function (
    BaseSoaController,
    formatter,
    JSONModel,
    MessageBox,
    FilterOperator,
    Filter
  ) {
    "use strict";

    return BaseSoaController.extend(
      "rgssoa.controller.soa.detail.scenery.Scenario1",
      {
        formatter: formatter,

        onInit: function () {
          var self = this;
          var oModelUtility = {
            ViewId: "rgssoa.view.soa.detail.scenery.Scenario1",
          };
          self.setModel(new JSONModel(oModelUtility), "Utility");

          self.acceptOnlyNumber("iptCodInps")
          self.acceptOnlyNumber("iptCodiceTributo")
          self.acceptOnlyImport("iptCFCommit")

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
          var sTable = oModelUtility.getProperty("/Table")

          var bRettifica =
            oModelUtility.getProperty("/Function") === "Rettifica";

          if (bWizard1Step1) {
            self.getRouter().navTo("soa.list.ListSoa", { Reload: false });
          } else if (bWizard1Step2) {
            switch (sTable) {
              case "Edit": {
                self.setModel(new JSONModel({}), "Soa")
                self.getRouter().navTo("soa.list.ListSoa", { Reload: false });
                break;
              }
              case "Add": {
                oModelStepScenario.setProperty("/wizard1Step2", false);
                oModelStepScenario.setProperty("/wizard1Step1", true);
                oModelStepScenario.setProperty("/visibleBtnForward", false);
                oModelStepScenario.setProperty("/visibleBtnStart", true);
                break;
              }
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
          var oWizard = self.getView().byId("wizScenario1");
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelUtility = self.getModel("Utility");
          var sTable = oModelUtility.getProperty("/Table")

          var bWizard1Step2 = oModelStepScenario.getProperty("/wizard1Step2");
          var bWizard1Step3 = oModelStepScenario.getProperty("/wizard1Step3");
          var bWizard2 = oModelStepScenario.getProperty("/wizard2");
          var bWizard3 = oModelStepScenario.getProperty("/wizard3");

          if (bWizard1Step2) {
            switch (sTable) {
              case "Edit": {
                self.checkWizard1();
                break;
              }
              case "Add": {
                self.checkWizard1Add()
                break;
              }
            }
          } else if (bWizard1Step3) {
            if (self.checkDispAutorizzazione()) {
              oModelStepScenario.setProperty("/wizard1Step3", false);
              oModelStepScenario.setProperty("/wizard2", true);
              self.createModelSedeBeneficiario()
              self.createModelModPagamento()
              self.setSedeBeneficiario();
              oWizard.nextStep();
            }
          } else if (bWizard2) {
            self.checkWizard2(oWizard);
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

        onIconTabChange: function (oEvent) {
          var self = this;
          var oModelUtility = self.getModel("Utility");
          var oModelStepScenario = self.getModel("StepScenario");
          var oModelSoa = self.getModel("Soa");
          var oModelUtility = self.getModel("Utility");
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
              self.createModelStepScenarioDet();
              oModelUtility.setProperty("/EnableEdit", false)
              self.setModelSoa(oParameters, function () { });
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

        onImpDaOrdinareChangeEdit: function (oEvent) {
          var self = this;
          var oTableDocumenti = self.getView().byId("tblEditPosizioniScen1");
          var oTableModelDocumenti = oTableDocumenti.getModel("Soa");
          var oModelSoa = self.getModel("Soa")

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

          var fZimptot = 0.00;
          oTableModelDocumenti.getData().data.map((oPosizione) => {
            fZimptot += parseFloat(oPosizione.Zimpdaord)
          })

          oModelSoa.setProperty("/Zimptot", fZimptot.toFixed(2))
        },

        _onObjectMatched: function (oEvent) {
          var self = this;
          var oParameters = oEvent.getParameter("arguments");
          var bDetailFromFunction =
            oParameters.DetailFromFunction === "true" ? true : false;
          var bRemoveFunctionButtons = bDetailFromFunction;

          //Load Models
          self.createModelStepScenarioDet();
          self.createModelUtilityDet(bDetailFromFunction, bRemoveFunctionButtons, "soa.detail.scenery.Scenario1");
          self.createModelFiltersWizard1();
          self.setModelSoa(oParameters, function () {
            self.enableFunctions();
            self.setMode(oParameters.Mode);
            self.setSedeBeneficiario();
          });
          self.resetWizard("wizScenario1");
        },

        onStart: function () {
          var self = this;
          var oModel = self.getModel();
          var oModelStepScenario = self.getModel("StepScenario");
          var aFilters = self.setFiltersWizard1();
          var oPanelCalculator = self.getView().byId("pnlCalculatorList");
          var oModelUtility = self.getModel("Utility")
          var aPositionsSoa = self.getModel("Soa").getProperty("/data")

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
                oModelUtility.setProperty("/Table", "Add")
              }

              var aPosizioni = data?.results;
              aPosizioni?.map((oPosition, iIndex) => {
                oPosition.Index = iIndex + 1;
              });

              //Rimuovo le posizioni già aggiunte al SOA
              if (aPosizioni.length !== 0) {
                aPositionsSoa.map((oPosizione) => {
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
              self.setModel(new JSONModel(aPosizioni), "PosizioniScen1");
              oPanelCalculator.setVisible(aPosizioni.length !== 0);
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
          var oModelPosizioni = self.getModel("PosizioniScen1");
          var oModelUtility = self.getModel("Utility");
          //Load Component
          var oButtonCalculate = self.getView().byId("btnCalculate");

          var aSelectedItems = oModelUtility.getProperty("/SelectedPositions");
          var aListItems = oEvent.getParameter("listItems");

          aListItems.map(async function (oListItem) {
            var oSelectedItem = oModelPosizioni.getObject(oListItem.getBindingContextPath());

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
            oModelUtility.setProperty("/SelectedPositions", aSelectedItems);
            oButtonCalculate.setVisible(aSelectedItems.length !== 0);
            oModelUtility.setProperty("/AddZimptot", "0.00");
          });
        },

        onSelectedItemEdit: function (oEvent) {
          var self = this;
          var oModelUtility = self.getModel("Utility")
          var bSelected = oEvent.getParameter("selected");

          var oTable = self.getView().byId("tblEditPosizioniScen1");
          var oModelTable = oTable.getModel("Soa");

          var aSelectedItems = oModelUtility.getProperty("/SelectedPositions");
          var aListItems = oEvent.getParameter("listItems");

          aListItems.map((oListItem) => {
            var oSelectedItem = oModelTable.getObject(oListItem.getBindingContextPath());

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
            oModelUtility.setProperty("/SelectedPositions", aSelectedItems);
          });
        },

        onDeletePosition: function () {
          var self = this;
          var oTable = self.getView().byId("tblEditPosizioniScen1");

          MessageBox.warning(
            "Procedere con la cancellazione delle righe selezionate?",
            {
              actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
              title: "Rettifica SOA - Cancellazione Righe",
              onClose: function (oAction) {
                if (oAction === "OK") {
                  var oModelUtility = self.getModel("Utility");
                  var oModelSoa = self.getModel("Soa");

                  var aDeletedPositions = oModelUtility.getProperty("/DeletedPositions")
                  var aSelectedItems = oModelUtility.getProperty(
                    "/SelectedPositions"
                  );
                  var aPositions = oModelSoa.getProperty("/data");

                  oTable.removeSelections();

                  aSelectedItems.map((oSelectedItem) => {
                    if (oSelectedItem.Zchiavesop) {
                      oSelectedItem.Tiporiga = 'D'
                      aDeletedPositions.push(oSelectedItem)
                    }
                    var iIndex = aPositions.findIndex((oPosition) => {
                      return (
                        oPosition.Bukrs === oSelectedItem.Bukrs &&
                        oPosition.Zposizione === oSelectedItem.Zposizione &&
                        oPosition.Znumliq === oSelectedItem.Znumliq &&
                        oPosition.Zversione === oSelectedItem.Zversione &&
                        oPosition.ZversioneOrig === oSelectedItem.ZversioneOrig
                      );
                    });


                    if (iIndex > -1) {
                      aPositions.splice(iIndex, 1);
                    }
                  });

                  oModelSoa.setProperty("/data", aPositions);
                  oModelUtility.setProperty("/DeletedPositions", aDeletedPositions)
                  oModelUtility.setProperty("/SelectedPositions", [])

                  var fTotal = 0;
                  aPositions.map((oPosition) => {
                    fTotal += parseFloat(oPosition?.Zimpdaord);
                  });

                  oModelSoa.setProperty("/Zimptot", fTotal.toFixed(2));

                }
              },
            }
          );
        },

        onAddPosition: function () {
          var self = this;
          var oModelUtility = self.getModel("Utility");
          var oModelStepScenario = self.getModel("StepScenario");
          var oSoa = self.getModel("Soa").getData()
          var oModelFilters = self.getModel("FiltersWizard1")

          oModelFilters.setProperty("/CodRitenuta", oSoa.Witht)
          oModelFilters.setProperty("/CodEnte", oSoa.ZzCebenra)

          oModelStepScenario.setProperty("/wizard1Step1", true);
          oModelStepScenario.setProperty("/wizard1Step2", false);
          oModelStepScenario.setProperty("/wizard1Step3", false);
          oModelStepScenario.setProperty("/visibleBtnStart", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);

          oModelUtility.setProperty("/SelectedPositions", [])
          oModelUtility.setProperty("/AddZimptot", "0.00")
          self.createModelBeneficiarioRettifica()
        },

        onImpDaOrdinareChangeAdd: function (oEvent) {
          var self = this;
          var oTable = self.getView().byId("tblPosizioniScen1");
          var oTableModel = oTable.getModel("PosizioniScen1");
          var oModelUtility = self.getModel("Utility");

          var sValue = oEvent.getParameter("value");
          oModelUtility.setProperty("/AddZimptot", "0.00");

          if (sValue) {
            oTableModel.getObject(oEvent.getSource().getParent().getBindingContextPath()).Zimpdaord = parseFloat(sValue).toFixed(2);
          } else {
            oTableModel.getObject(oEvent.getSource().getParent().getBindingContextPath()).Zimpdaord = "0.00";
          }
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

          self.createModelEditPositions()
        },

        onCancelRow: function (oEvent) {
          var self = this;
          //Load Models
          var oModelClassificazione = self.getModel("Classificazione");
          var oModelUtility = self.getModel("Utility")
          var aDeletedClassificazioni = oModelUtility.getProperty("/DeletedClassificazioni")

          var oSourceData = oEvent?.getSource()?.data();
          var oTableClassificazione = self.getView().byId(oSourceData?.table);

          var aPathSelectedItems = oTableClassificazione.getSelectedContextPaths();

          var aListClassificazione = oModelClassificazione.getProperty("/" + oSourceData?.etichetta);

          //Rimuovo i record selezionati
          aPathSelectedItems.map((sPath) => {
            var oItem = oModelClassificazione.getObject(sPath);
            if (oItem.Zchiavesop) {
              oItem.Zflagcanc = 'X'
              aDeletedClassificazioni.push(oItem)
            }
            aListClassificazione.splice(aListClassificazione.indexOf(oItem), 1);
          });

          //Resetto l'index
          aListClassificazione.map((oItem, iIndex) => {
            oItem.Index = iIndex;
          });

          //Rimuovo i record selezionati
          oTableClassificazione.removeSelections();

          oModelClassificazione.setProperty("/" + oSourceData?.etichetta, aListClassificazione);

          //Resetto l'importo totale da associare
          this._setImpTotAssociare(oSourceData?.etichetta);
        },
      }
    );
  }
);
