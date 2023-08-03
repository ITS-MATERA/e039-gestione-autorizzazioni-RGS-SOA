sap.ui.define(
  [
    "../../BaseController",
    "sap/ui/model/json/JSONModel",
    "../../../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    const NE = FilterOperator.NE;
    const SOA_ENTITY_SET = "SOASet";
    const SOA_ENTITY_MODEL = "SOASet";
    const SOA_MODEL = "SoaSettings";
    const PAGINATOR_MODEL = "paginatorModel";

    return BaseController.extend("rgssoa.controller.soa.list.ListSoa", {
      formatter: formatter,
      /**
       * @override
       */
      onInit: function () {
        var self = this;
        var oModelPaginator = new JSONModel({
          btnPrevEnabled: false,
          btnFirstEnabled: false,
          btnNextEnabled: false,
          btnLastEnabled: false,
          recordForPageEnabled: false,
          currentPageEnabled: true,
          numRecordsForPage: 10,
          currentPage: 1,
          maxPage: 1,
          paginatorSkip: 0,
          paginatorClick: 0,
          paginatorTotalPage: 1,
        });

        var oModelSoa = new JSONModel({
          totalItems: 0,
          selectedItems: [],
          enabledBtnDetail: false,
        });

        var oModelFilter = new JSONModel({
          Gjahr: "",
          Zzamministr: "",
          Zcapitolo: "",
          ZnumsopFrom: "",
          ZnumsopTo: "",
          ZstatoSoa: "TU",
          Zchiaveaut: "",
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

        self.setModel(oModelPaginator, PAGINATOR_MODEL);
        self.setModel(oModelSoa, SOA_MODEL);
        self.setModel(oModelFilter, "Filter");
      },
      onNavBack: function () {
        history.go(-1);
      },
      onAfterRendering: function () {
        var self = this;
        var oDataModel = self.getModel();

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/TipoDisp3Set", {
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                self.setModelCustom("TipoDisp3Set", data.results);
              },
              error: function (error) {},
            });
          });
      },

      onSearch: function () {
        this._setPaginatorProperties();
        this._getSoaList();
      },

      onUpdateFinished: function () {
        var self = this;

        self.setTitleTotalItems(
          SOA_MODEL,
          "totalItems",
          "listSOATableTitle",
          "listSOATableTitleCount"
        );
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
        oModelSoaSettings.setProperty("/selectedItem", aSelectedItems);
      },
      onDetail: function () {
        var self = this;
        var oModelSoaSettings = self.getModel("SoaSettings");
        var oSelectedItem = oModelSoaSettings.getProperty("/selectedItems")[0];

        self.getRouter().navTo("soa.detail.scenery.Scenario1", {
          Gjahr: oSelectedItem.Gjahr,
          Zchiavesop: oSelectedItem.Zchiavesop,
          Bukrs: oSelectedItem.Bukrs,
          Zstep: oSelectedItem.Zstep,
          Ztipososp: oSelectedItem.Ztipososp,
        });
      },

      //#region PAGINATOR

      onFirstPaginator: function () {
        var self = this;

        self.getFirstPaginator(PAGINATOR_MODEL);
        this._getSoaList();
      },

      onLastPaginator: function () {
        var self = this;

        self.getLastPaginator(PAGINATOR_MODEL);
        this._getSoaList();
      },

      onChangePage: function (oEvent) {
        var self = this;

        self.getChangePage(oEvent, PAGINATOR_MODEL);
        this._getSoaList();
      },

      //#endregion

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
        var oPaginatorModel = self.getModel(PAGINATOR_MODEL);
        var oPaginator = oView.byId("pnlPaginator");
        var oListSoa = oView.byId("pnlListSoa");
        var urlParameters = {
          $top: oPaginatorModel.getProperty("/numRecordsForPage"),
          $skip: oPaginatorModel.getProperty("/paginatorSkip"),
        };

        //Controllo i filtri di tipo BEETWEN
        var sIntervalFilter = self.checkBTFilter(aFilters);
        if (sIntervalFilter) {
          sap.m.MessageBox.error(sIntervalFilter);

          var oModelJson = new JSONModel();
          oPaginator.setVisible(false);
          oListSoa.setVisible(false);
          oView.setModel(oModelJson, SOA_ENTITY_MODEL);
          return;
        }

        oView.setBusy(true);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + SOA_ENTITY_SET, {
              urlParameters: urlParameters,
              filters: aFilters,
              success: function (data, oResponse) {
                oListSoa.setVisible(!self.setResponseMessage(oResponse));
                self.setModelCustom(SOA_ENTITY_MODEL, data.results);
                self.setPaginatorVisible(oPaginator, data);
                oView.setBusy(false);
                self._setSelectedItems(data);
              },
              error: function (error) {
                oView.setBusy(false);
              },
            });
          });
      },

      _setPaginatorProperties: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oFilters = this._getHeaderFilters();
        var oPaginatorModel = self.getModel(PAGINATOR_MODEL);

        self.resetPaginator(oPaginatorModel);
        var iNumRecordsForPage =
          oPaginatorModel.getProperty("/numRecordsForPage");

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + SOA_ENTITY_SET + "/$count", {
              filters: oFilters,
              success: function (data) {
                self.getModel(SOA_MODEL).setProperty("/totalItems", data);
                self.setPaginatorProperties(
                  oPaginatorModel,
                  data,
                  iNumRecordsForPage
                );
              },
              error: function () {},
            });
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
          self.setFilterEQ(aFilters, "Zricann", "");
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
    });
  }
);
