sap.ui.define(
  [
    "../BaseSoaController",
    "sap/ui/model/json/JSONModel",
    "../../../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseSoaController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    const NE = FilterOperator.NE;
    const SOA_ENTITY_SET = "SOASet";
    const SOA_ENTITY_MODEL = "SOASet";
    const SOA_MODEL = "SoaSettings";

    return BaseSoaController.extend("rgssoa.controller.soa.list.ListSoa", {
      formatter: formatter,
      /**
       * @override
       */
      onInit: function () {
        var self = this;

        var oModelFilter = new JSONModel({
          Gjahr: "",
          Zzamministr: "",
          Zcapitolo: "",
          ZnumsopFrom: "",
          ZnumsopTo: "",
          ZstatoSoa: "TU",
          //TODO - Mettere blank zchiaveaut
          Zchiaveaut: "2023-080-00001",
          Ztipodisp2: "000",
          Ztipodisp3: "000",
          Zztipologia: "0",
          DescTipopag: "TUTTI",
          ZspecieSop: "0",
          Zricann: "No",
          ZdatasopFrom: "",
          ZdatasopTo: "",
          Zdataprot: "",
          Lifnr: "",
          Witht: "",
          DescRitenuta: "",
          ZzCebenra: "",
          DescEnte: "",
          ZnumliqFrom: "",
          ZnumliqTo: "",
          ZdescProsp: "",
          FiposFrom: "",
          FiposTo: "",
          Fistl: "",
        });

        var oModelAuthoryCheckSoa = new JSONModel({
          AgrName: "",
          Fikrs: "",
          Prctr: "",
          Gestione: false,
          Registra: false,
          Dettaglio: false,
          Annullamento: false,
          InvioFirma: false,
          RevocaInvioFirma: false,
          Firma: false,
          RevocaFirma: false,
          RegistrazioneRichAnn: false,
          CancellazioneRichAnn: false,
        });
        self.setModel(oModelAuthoryCheckSoa, "AuthorityCheckSoa");
        self.setModel(oModelFilter, "Filter");

        self
          .getRouter()
          .getRoute("soa.list.ListSoa")
          .attachPatternMatched(this._onObjectMatched, this);
      },

      _onObjectMatched: function (oEvent) {
        var self = this;
        var oUrlParameters = oEvent.getParameter("arguments");
        var oModelFilter = self.getModel("Filter");

        var oModelSoa = new JSONModel({
          selectedItems: [],
          enabledBtnDetail: false,
          EnableBtnAnnullamento: false,
          EnableBtnRevocaInvioFirma: false,
          EnableBtnFirma: false,
          EnablebtnRevocaFirma: false,
          EnableBtnInvioFirma: false,
          EnablebtnRegistrazioneRichAnn: false,
        });
        self.setModel(oModelSoa, SOA_MODEL);

        if (
          oUrlParameters.Reload === "true" &&
          oModelFilter.getProperty("/Zchiaveaut")
        ) {
          this._getSoaList();
        }
        self.getLogModel();
      },

      onNavBack: function () {
        var self = this;

        self.getRouter().navTo("startpage");
      },

      onBeforeRendering: function () {
        var self = this;

        self.getPermissionsListSoa(true, function (callback) {
          self.setModelAuthorityCheck(callback?.permissions);
        });
      },

      onAfterRendering: function () {
        var self = this;
        var oDataModel = self.getModel();

        oDataModel.read("/TipoDisp3Set", {
          success: function (data, oResponse) {
            self.setResponseMessage(oResponse);
            self.setModelCustom("TipoDisp3Set", data.results);
          },
          error: function (error) {},
        });
      },

      onSearch: function () {
        this._getSoaList();
      },

      onRegisterSoa: function () {
        var self = this;
        self.getRouter().navTo("soa.create.ChoseTypeSoa");
      },

      onSelectedItem: function (oEvent) {
        var self = this;
        var bSelected = oEvent.getParameter("selected");
        var oModelSoaSettings = self.getModel("SoaSettings");
        var oTableSoa = self.getView().byId("tblListSoa");
        var oTableModelSoa = oTableSoa.getModel(SOA_ENTITY_MODEL);

        var aSelectedItems = oModelSoaSettings.getProperty("/selectedItems");
        var aListItems = oEvent.getParameter("listItems");

        aListItems.map((oListItem) => {
          var oSelectedItem = oTableModelSoa.getObject(
            oListItem.getBindingContextPath()
          );

          if (bSelected) {
            aSelectedItems.push(oSelectedItem);
          } else {
            this._removeUnselectedItem(aSelectedItems, oSelectedItem);
          }
        });

        oModelSoaSettings.setProperty(
          "/enabledBtnDetail",
          aSelectedItems.length === 1
        );

        var oModelSelectedItems = new JSONModel(aSelectedItems);
        sap.ui.getCore().setModel(oModelSelectedItems, "SelectedItems");

        oModelSoaSettings.setProperty("/selectedItems", aSelectedItems);

        this._isAnnullamentoEnabled();
        this._isRevocaInvioFirmaEnabled();
        this._isFirmaEnabled();
        this._isRevocaFirmaEnabled();
        this._isInvioFirmaEnabled();
        this._isRegistrazioneRichAnnEnabled();
        this._isCancellazioneRichAnnEnabled();
      },

      onDetail: function () {
        var self = this;
        var oModelSoaSettings = self.getModel("SoaSettings");
        var oSelectedItem = oModelSoaSettings.getProperty("/selectedItems")[0];

        var oParameters = {
          Gjahr: oSelectedItem.Gjahr,
          Zchiavesop: oSelectedItem.Zchiavesop,
          Bukrs: oSelectedItem.Bukrs,
          Zstep: oSelectedItem.Zstep,
          Ztipososp: oSelectedItem.Ztipososp,
          DetailFromFunction: false,
        };

        switch (oSelectedItem?.Ztipopag) {
          case "1":
            self.getRouter().navTo("soa.detail.scenery.Scenario1", oParameters);
            break;
          case "2":
            self.getRouter().navTo("soa.detail.scenery.Scenario2", oParameters);
            break;
          case "3":
            self.getRouter().navTo("soa.detail.scenery.Scenario3", oParameters);
            break;
          case "4":
            self.getRouter().navTo("soa.detail.scenery.Scenario4", oParameters);
            break;
        }
      },

      //#region VALUE HELP

      onValueHelpRitenuta: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.Ritenuta"
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RitenutaSet", {
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                self.setModelSelectDialog(
                  "Ritenuta",
                  data,
                  "sdRitenuta",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpRitenutaClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelFilter = self.getModel("Filter");

        var oSelectedItem = oEvent.getParameter("selectedItem");

        oModelFilter.setProperty(
          "/DescRitenuta",
          self.setBlank(oSelectedItem?.getTitle())
        );
        oModelFilter.setProperty(
          "/Witht",
          self.setBlank(oSelectedItem?.data("key"))
        );
        oModelFilter.setProperty("/DescEnte", "");
        oModelFilter.setProperty("/ZzCebenra", "");

        this.unloadFragment();
      },

      onValueHelpEnteBeneficiario: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oModelFilter = self.getModel("Filter");
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.EnteBeneficiario"
        );

        if (oModelFilter.getProperty("/Witht")) {
          var aFilters = [];

          self.setFilterEQ(
            aFilters,
            "CodRitenuta",
            oModelFilter.getProperty("/Witht")
          );
          self.setFilterEQ(
            aFilters,
            "DescRitenuta",
            oModelFilter.getProperty("/DescRitenuta")
          );
        }

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "EnteBeneficiarioSet", {
              filters: aFilters,
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                self.setModelSelectDialog(
                  "EnteBeneficiario",
                  data,
                  "sdEnteBeneficiario",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpEnteBeneficiarioClose: function () {
        var self = this;
        //Load Models
        var oModelFilter = self.getModel("Filter");

        var oSelectedItem = oEvent.getParameter("selectedItem");

        oModelFilter.setProperty(
          "/DescEnte",
          self.setBlank(oSelectedItem?.getTitle())
        );
        oModelFilter.setProperty(
          "/ZzCebenra",
          self.setBlank(oSelectedItem?.data("key"))
        );

        this.unloadFragment();
      },

      //#endregion

      //#region SELECTION CHANGE
      onFiposFromChange: function (oEvent) {
        var self = this;
        var oModelFilter = self.getModel("Filter");

        oModelFilter.setProperty("/FiposFrom", oEvent.getParameter("value"));
      },

      onFiposToChange: function (oEvent) {
        var self = this;
        var oModelFilter = self.getModel("Filter");

        oModelFilter.setProperty("/FiposTo", oEvent.getParameter("value"));
      },

      onFistlChange: function (oEvent) {
        var self = this;
        var oModelFilter = self.getModel("Filter");

        oModelFilter.setProperty("/Fistl", oEvent.getParameter("value"));
      },

      onTipologiaAutorizzazioneChange: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oModelFilter = self.getModel("Filter");

        var aFilters = [];

        self.setFilterEQ(
          aFilters,
          "Ztipodisp2",
          oModelFilter.getProperty("/Ztipodisp2")
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/TipoDisp3Set", {
              filters: aFilters,
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                self.setModelCustom("TipoDisp3Set", data.results);
              },
              error: function (error) {},
            });
          });
      },
      //#endregion

      //#region PRIVATE METHODS

      _getSoaList: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oView = self.getView();
        var aFilters = this._getHeaderFilters();
        var oListSoa = oView.byId("pnlListSoa");
        var oModelAuthorityCheck = self.getModel("AuthorityCheckSoa");
        var urlParameters = {
          AgrName: oModelAuthorityCheck.getProperty("/AgrName"),
          Fikrs: oModelAuthorityCheck.getProperty("/Fikrs"),
          Prctr: oModelAuthorityCheck.getProperty("/Prctr"),
          //TODO - Rimuovere test
          Test: "X",
        };

        //Controllo i filtri di tipo BEETWEN
        var sIntervalFilter = self.checkBTFilter(aFilters);
        if (sIntervalFilter) {
          sap.m.MessageBox.error(sIntervalFilter);

          var oModelJson = new JSONModel();
          oListSoa.setVisible(false);
          oView.setModel(oModelJson, SOA_ENTITY_MODEL);
          return;
        }

        oView.setBusy(true);

        oDataModel.read("/" + SOA_ENTITY_SET, {
          urlParameters: urlParameters,
          filters: aFilters,
          success: function (data, oResponse) {
            oListSoa.setVisible(!self.setResponseMessage(oResponse));
            self.setModelCustom(SOA_ENTITY_MODEL, data.results);
            oView.setBusy(false);
            self._setSelectedItems(data);
          },
          error: function (error) {
            oView.setBusy(false);
          },
        });
      },

      _getHeaderFilters: function () {
        var self = this;
        var aFilters = [];
        var oModelFilter = self.getModel("Filter");

        self.setFilterEQ(aFilters, "Gjahr", oModelFilter.getProperty("/Gjahr"));
        self.setFilterEQ(
          aFilters,
          "Zzamministr",
          oModelFilter.getProperty("/Zzamministr")
        );
        self.setFilterEQ(
          aFilters,
          "Zcapitolo",
          oModelFilter.getProperty("/Zcapitolo")
        );
        self.setFilterBT(
          aFilters,
          "Znumsop",
          oModelFilter.getProperty("/ZnumsopFrom"),
          oModelFilter.getProperty("/ZnumsopTo")
        );
        self.setFilterEQ(
          aFilters,
          "ZcodStatosop",
          oModelFilter.getProperty("/ZstatoSoa")
        );
        self.setFilterEQ(
          aFilters,
          "Zchiaveaut",
          oModelFilter.getProperty("/Zchiaveaut")
        );
        self.setFilterEQ(
          aFilters,
          "Ztipodisp2",
          oModelFilter.getProperty("/Ztipodisp2")
        );
        self.setFilterEQ(
          aFilters,
          "Ztipodisp3",
          oModelFilter.getProperty("/Ztipodisp3")
        );
        self.setFilterEQ(
          aFilters,
          "Zztipologia",
          oModelFilter.getProperty("/Zztipologia")
        );
        self.setFilterEQ(
          aFilters,
          "DescTipopag",
          oModelFilter.getProperty("/DescTipopag")
        );
        self.setFilterEQ(
          aFilters,
          "ZspecieSop",
          oModelFilter.getProperty("/ZspecieSop")
        );
        if (oModelFilter.getProperty("/Zricann") === "Si") {
          aFilters.push(new Filter("Zricann", NE, ""));
        } else {
          aFilters.push(new Filter("Zricann", FilterOperator.EQ, ""));
        }
        self.setFilterBT(
          aFilters,
          "Zdatasop",
          oModelFilter.getProperty("/ZdatasopFrom"),
          oModelFilter.getProperty("/ZdatasopTo")
        );
        self.setFilterEQ(
          aFilters,
          "Znumprot",
          oModelFilter.getProperty("/Znumprot")
        );
        self.setFilterEQ(aFilters, "Lifnr", oModelFilter.getProperty("/Lifnr"));
        self.setFilterEQ(aFilters, "Witht", oModelFilter.getProperty("/Witht"));
        self.setFilterEQ(
          aFilters,
          "ZzCebenra",
          oModelFilter.getProperty("/ZzCebenra")
        );
        self.setFilterBT(
          aFilters,
          "Fipos",
          oModelFilter.getProperty("/FiposFrom"),
          oModelFilter.getProperty("/FiposTo")
        );
        self.setFilterEQ(aFilters, "Fistl", oModelFilter.getProperty("/Fistl"));
        self.setFilterBT(
          aFilters,
          "Znumliq",
          oModelFilter.getProperty("/ZnumliqFrom"),
          oModelFilter.getProperty("/ZnumliqTo")
        );
        self.setFilterEQ(
          aFilters,
          "ZdescProsp",
          oModelFilter.getProperty("/ZdescProsp")
        );

        return aFilters;
      },

      _removeUnselectedItem: function (aSelectedItems, oSelectedItem) {
        var iIndex = aSelectedItems.findIndex((obj) => {
          return (
            obj.Gjahr === oSelectedItem.Gjahr &&
            obj.Zchiavesop === oSelectedItem.Zchiavesop &&
            obj.Bukrs === oSelectedItem.Bukrs &&
            obj.Zstep === oSelectedItem.Zstep &&
            obj.Ztipososp === oSelectedItem.Ztipososp
          );
        });

        if (iIndex > -1) {
          aSelectedItems.splice(iIndex, 1);
        }
      },

      _setSelectedItems: function (data) {
        var self = this;
        var oTableListSoa = self.getView().byId("tblListSoa");
        var oModelSoaSettings = self.getModel("SoaSettings");

        var aSelectedItems = oModelSoaSettings.getProperty("/selectedItems");

        if (data.results.length !== 0) {
          data.results.map((oItem, iIndex) => {
            aSelectedItems.map((oSelectedItem) => {
              if (
                oItem.Gjahr === oSelectedItem.Gjahr &&
                oItem.Zchiavesop === oSelectedItem.Zchiavesop &&
                oItem.Bukrs === oSelectedItem.Bukrs &&
                oItem.Zstep === oSelectedItem.Zstep &&
                oItem.Ztipososp === oSelectedItem.Ztipososp
              ) {
                oTableListSoa.setSelectedItem(oTableListSoa.getItems()[iIndex]);
              }
            });
          });
        }
      },

      //#endregion

      //#region GESTIONE FUNZIONALITA'
      onAnnullamento: function () {
        var self = this;

        self.getRouter().navTo("soa.function.Annullamento");
      },

      onRevocaInvioFirma: function () {
        var self = this;

        self.getRouter().navTo("soa.function.RevocaInvioFirma");
      },

      onFirma: function () {
        var self = this;

        self.getRouter().navTo("soa.function.Firma");
      },

      onRevocaFirma: function () {
        var self = this;

        self.getRouter().navTo("soa.function.RevocaFirma");
      },

      onInvioFirma: function () {
        var self = this;

        self.getRouter().navTo("soa.function.InvioFirma");
      },

      onRegistrazioneRichAnn: function () {
        var self = this;

        self.getRouter().navTo("soa.function.RegistrazioneRichAnn");
      },

      onCancellazioneRichAnn: function () {
        var self = this;

        self.getRouter().navTo("soa.function.CancellazioneRichAnn");
      },

      _isAnnullamentoEnabled: function () {
        var self = this;

        var oModelSoaSettings = self.getModel("SoaSettings");

        var aSelectedItems = oModelSoaSettings.getProperty("/selectedItems");

        var bEnabled = true;

        if (aSelectedItems.length === 0) {
          bEnabled = false;
          oModelSoaSettings.setProperty("/EnableBtnAnnullamento", bEnabled);
          return;
        }

        aSelectedItems.map((oSelectedItem) => {
          if (oSelectedItem.ZcodStatosop !== "00") {
            bEnabled = false;
            return;
          }
        });

        oModelSoaSettings.setProperty("/EnableBtnAnnullamento", bEnabled);
      },

      _isRevocaInvioFirmaEnabled: function () {
        var self = this;
        var oModelSoaSettings = self.getModel("SoaSettings");
        var aSelectedItems = oModelSoaSettings.getProperty("/selectedItems");
        var bEnabled = true;

        if (aSelectedItems.length === 0) {
          bEnabled = false;
          oModelSoaSettings.setProperty("/EnableBtnRevocaInvioFirma", bEnabled);
          return;
        }

        aSelectedItems.map((oSelectedItem) => {
          if (oSelectedItem.ZcodStatosop !== "01") {
            bEnabled = false;
            return;
          }
        });

        oModelSoaSettings.setProperty("/EnableBtnRevocaInvioFirma", bEnabled);
      },

      _isFirmaEnabled: function () {
        var self = this;
        var oModelSoaSettings = self.getModel("SoaSettings");
        var aSelectedItems = oModelSoaSettings.getProperty("/selectedItems");
        var bEnabled = true;

        if (aSelectedItems.length === 0) {
          bEnabled = false;
          oModelSoaSettings.setProperty("/EnableBtnFirma", bEnabled);
          return;
        }

        aSelectedItems.map((oSelectedItem) => {
          if (oSelectedItem.ZcodStatosop !== "01") {
            bEnabled = false;
            return;
          }
        });

        oModelSoaSettings.setProperty("/EnableBtnFirma", bEnabled);
      },

      _isRevocaFirmaEnabled: function () {
        var self = this;
        var oModelSoaSettings = self.getModel("SoaSettings");
        var aSelectedItems = oModelSoaSettings.getProperty("/selectedItems");
        var bEnabled = true;

        if (aSelectedItems.length === 0) {
          bEnabled = false;
          oModelSoaSettings.setProperty("/EnableBtnRevocaFirma", bEnabled);
          return;
        }

        //TODO - Rimettere "02"
        aSelectedItems.map((oSelectedItem) => {
          if (oSelectedItem.ZcodStatosop !== "00") {
            bEnabled = false;
            return;
          }
        });

        oModelSoaSettings.setProperty("/EnableBtnRevocaFirma", bEnabled);
      },

      _isInvioFirmaEnabled: function () {
        var self = this;
        var oModelSoaSettings = self.getModel("SoaSettings");
        var aSelectedItems = oModelSoaSettings.getProperty("/selectedItems");
        var bEnabled = true;

        if (aSelectedItems.length === 0) {
          bEnabled = false;
          oModelSoaSettings.setProperty("/EnableBtnInvioFirma", bEnabled);
          return;
        }

        aSelectedItems.map((oSelectedItem) => {
          if (oSelectedItem.ZcodStatosop !== "00") {
            bEnabled = false;
            return;
          }
        });

        oModelSoaSettings.setProperty("/EnableBtnInvioFirma", bEnabled);
      },

      _isRegistrazioneRichAnnEnabled: function () {
        var self = this;
        var oModelSoaSettings = self.getModel("SoaSettings");
        var aSelectedItems = oModelSoaSettings.getProperty("/selectedItems");
        var oModelFilter = self.getModel("Filter");
        var bEnabled = true;

        if (
          aSelectedItems.length === 0 ||
          oModelFilter.getProperty("/Zricann") !== "No"
        ) {
          bEnabled = false;
          oModelSoaSettings.setProperty(
            "/EnableBtnRegistrazioneRichAnn",
            bEnabled
          );
          return;
        }

        //TODO - Rimettere lo stato a 10
        aSelectedItems.map((oSelectedItem) => {
          if (oSelectedItem.ZcodStatosop !== "00") {
            bEnabled = false;
            return;
          }
        });

        oModelSoaSettings.setProperty(
          "/EnableBtnRegistrazioneRichAnn",
          bEnabled
        );
      },

      _isCancellazioneRichAnnEnabled: function () {
        var self = this;
        var oModelSoaSettings = self.getModel("SoaSettings");
        var aSelectedItems = oModelSoaSettings.getProperty("/selectedItems");
        var oModelFilter = self.getModel("Filter");
        var bEnabled = true;

        if (
          aSelectedItems.length !== 1 ||
          oModelFilter.getProperty("/Zricann") !== "Si"
        ) {
          bEnabled = false;
          oModelSoaSettings.setProperty(
            "/EnableBtnCancellazioneRichAnn",
            bEnabled
          );
          return;
        }

        //TODO - Rimettere lo stato a 10
        aSelectedItems.map((oSelectedItem) => {
          if (oSelectedItem.ZcodStatosop !== "00") {
            bEnabled = false;
            return;
          }
        });

        oModelSoaSettings.setProperty(
          "/EnableBtnCancellazioneRichAnn",
          bEnabled
        );
      },

      //#endregion GESTIONE FUNZIONALITA'
    });
  }
);
