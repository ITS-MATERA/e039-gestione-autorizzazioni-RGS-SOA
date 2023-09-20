sap.ui.define(
  [
    "./BaseAuthController",
    "sap/ui/model/json/JSONModel",
    "../../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    const AUTH_MODEL = "authModel";
    const AUTORIZZAZIONE_ENTITY_SET = "AutorizzazioneSet";
    const AUTORIZZAZIONE_MODEL = "AutorizzazioneSet";
    return BaseController.extend("rgssoa.controller.auth.AuthPage", {
      onInit: function () {
        var self = this,
          oAuthModel,
          oAuthModel = new JSONModel({
            authTableTitle: self
              .getResourceBundle()
              .getText("authPageTitleCountNoRows"),
            total: 0,
            // areFiltersValid: true,
            // isSelectedAll: false,
            btnDetailEnabled: false,
            Zzamministr: null,
            ufficioOrdinante: null,
            authFrom: null,
            authTo: null,
            Gjahr: null,
            statoAutorizzazione: null,
            tipologiaDisposizione: null,
            tipologiaAutorizzazione: null,
            fipexFrom: null,
            fipexTo: null,
            fistl: null,
          });

        self.setModel(oAuthModel, AUTH_MODEL);

        self
          .getRouter()
          .getRoute("auth.authPage")
          .attachPatternMatched(this._onObjectMatched, this);
      },

      _onObjectMatched: function (oEvent) {
        var self = this;
        if (!self.getModel(self.AUTHORITY_CHECK_AUTH)) {
          self.getAuthorityCheck(function (callback) {
            if (!callback.success || !callback.permission.Z26Enabled) {
              self.getRouter().navTo("startpage");
              return;
            }
          });
        }

        var oModel = self.getModel();
        var oModelAuth = self.getModel(AUTH_MODEL);

        var sPath = self.getModel().createKey("/UserParamSet", {
          ParameterName: "PRC",
        });

        self.getView().setBusy(true);

        oModel.read(sPath, {
          success: function (data) {
            self.getView().setBusy(false);
            oModelAuth.setProperty("/Zzamministr", data.ParameterValue);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      onNavBack: function () {
        var self = this;

        self.getRouter().navTo("startpage");
      },

      onToggle: function () {
        var self = this,
          oView = self.getView(),
          oBundle = self.getResourceBundle();

        var btnArrow = oView.byId("btnToggle");
        var panelFilter = oView.byId("_authFilterToolbarGrid");
        if (btnArrow.getIcon() === "sap-icon://slim-arrow-up") {
          btnArrow.setIcon("sap-icon://slim-arrow-down");
          btnArrow.setTooltip(oBundle.getText("tooltipArrowShow"));
          panelFilter.setVisible(false);
        } else {
          btnArrow.setIcon("sap-icon://slim-arrow-up");
          btnArrow.setTooltip(oBundle.getText("tooltipArrowHide"));
          panelFilter.setVisible(true);
        }
      },

      onAuthfEsercizio_Change: function (oEvent) {
        var self = this,
          value = oEvent.getParameters()
            ? oEvent.getParameters().selectedItem.getKey()
            : null;
        self.getView().getModel(AUTH_MODEL).setProperty("/Gjahr", value);
      },

      onBlockToggle: function () {
        var self = this,
          oView = self.getView();

        var btnArrow = oView.byId("btnToggle");
        btnArrow.getEnabled()
          ? btnArrow.setEnabled(false)
          : btnArrow.setEnabled(true);
      },

      onSearchAuthPress: function (oEvent) {
        var self = this;
        self._search(false);
      },

      onUpdateFinished: function (oEvent) {
        var self = this,
          sTitle,
          oTable = oEvent.getSource(),
          iTotalItems = self
            .getView()
            .getModel(AUTH_MODEL)
            .getProperty("/total");
        if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
          sTitle = this.getResourceBundle().getText("authPageTitleCount", [
            iTotalItems,
          ]);
        } else {
          sTitle = this.getResourceBundle().getText("authPageTitleCountNoRows");
          // if (isChange) {
          //     sTitle = this.getResourceBundle().getText("changeAuthPageTitle");
          // } else {
          //     sTitle = this.getResourceBundle().getText("listAuthPageTitle");
          // }
        }
        self
          .getView()
          .getModel(AUTH_MODEL)
          .setProperty("/authTableTitle", sTitle);
        self.getView().setBusy(false);
      },

      /* PAGINAZIONE - start */

      /* PAGINAZIONE - end */
      _search: function () {
        var self = this,
          oDataModel = self.getModel(),
          oView = self.getView();

        oView.setBusy(true);
        var headerObject = self.getAuthFilterBar();
        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + AUTORIZZAZIONE_ENTITY_SET, {
              urlParameters: {
                $inlinecount: "allpages",
                AutorityRole: self
                  .getModel(self.AUTHORITY_CHECK_AUTH)
                  .getProperty("/AGR_NAME")
                  ? self
                      .getModel(self.AUTHORITY_CHECK_AUTH)
                      .getProperty("/AGR_NAME")
                  : null,
                AutorityFikrs: self
                  .getModel(self.AUTHORITY_CHECK_AUTH)
                  .getProperty("/FIKRS")
                  ? self
                      .getModel(self.AUTHORITY_CHECK_AUTH)
                      .getProperty("/FIKRS")
                  : null,
                AutorityPrctr: self
                  .getModel(self.AUTHORITY_CHECK_AUTH)
                  .getProperty("/PRCTR")
                  ? self
                      .getModel(self.AUTHORITY_CHECK_AUTH)
                      .getProperty("/PRCTR")
                  : null,
              },
              filters: headerObject.filters,
              success: function (data, oResponse) {
                var oModelJson = new sap.ui.model.json.JSONModel();
                var linesCounter = data.__count;
                self
                  .getView()
                  .getModel(AUTH_MODEL)
                  .setProperty("/total", linesCounter);
                oModelJson.setData(data.results);
                oView.setModel(oModelJson, AUTORIZZAZIONE_MODEL);
                self.getView().setBusy(false);
              },
              error: function (error) {
                oView.setBusy(false);
              },
            });
          });
      },

      onDetail: function (oEvent) {
        var self = this,
          oTable = self.getView().byId("authTable"),
          selectedItems = oTable.getSelectedItems(),
          item = oTable
            .getModel(AUTORIZZAZIONE_MODEL)
            .getObject(selectedItems[0].getBindingContextPath());

        if (
          item &&
          item.Bukrs &&
          item.Gjahr &&
          item.Zchiaveaut &&
          item.ZstepAut
        ) {
          self.getRouter().navTo("auth.authDetail", {
            Bukrs: item.Bukrs,
            Gjahr: item.Gjahr,
            Zchiaveaut: item.Zchiaveaut,
            ZstepAut: item.ZstepAut,
          });
        } else return;
      },

      onRegisterAuth: function (oEvent) {
        var self = this;
        self.getOwnerComponent().getRouter().navTo("auth.registerAuth");
      },

      onAuthfStatoAutorizzazione_Change: function (oEvent) {
        var self = this,
          value = oEvent.getParameters()
            ? oEvent.getParameters().selectedItem.getKey()
            : null;
        self
          .getView()
          .getModel(AUTH_MODEL)
          .setProperty("/statoAutorizzazione", value);
      },

      onAuthfTipologiaDisposizione_change: function (oEvent) {
        var self = this,
          value = oEvent.getParameters()
            ? oEvent.getParameters().selectedItem.getKey()
            : null;
        self
          .getView()
          .getModel(AUTH_MODEL)
          .setProperty("/tipologiaDisposizione", value);
      },

      onAuthfTipologiaAutorizzazione_Change: function (oEvent) {
        var self = this,
          filters = [],
          oDataModel = self.getModel(),
          key = oEvent.getParameters().selectedItem.getKey();

        self
          .getView()
          .getModel(AUTH_MODEL)
          .setProperty("/tipologiaAutorizzazione", key);
        if (key) {
          filters.push(
            new sap.ui.model.Filter(
              "Ztipodisp2",
              sap.ui.model.FilterOperator.EQ,
              key
            )
          );

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/TipoDisp3Set", {
                filters: filters,
                success: function (data, oResponse) {
                  var oModelJson = new sap.ui.model.json.JSONModel();
                  oModelJson.setData(data.results);
                  self.getView().setModel(oModelJson, "TipoDisp3Set");
                },
                error: function (error) {},
              });
            });
        }
      },

      onSelectedItem: function (oEvent) {
        var self = this,
          oTable = self.getView().byId("authTable"),
          selectedItems = oTable.getSelectedItems();

        if (selectedItems.length > 0)
          self
            .getView()
            .getModel(AUTH_MODEL)
            .setProperty("/btnDetailEnabled", true);
        else
          self
            .getView()
            .getModel(AUTH_MODEL)
            .setProperty("/btnDetailEnabled", false);
      },

      getAuthFilterBar: function () {
        var self = this,
          object = {},
          aFilters = [],
          dataRegFromControl = self.getView().byId("authfdataAutorizzazioneDa"),
          dataRegToControl = self.getView().byId("authfdataAutorizzazioneA");

        var entityFilters = self.getView().getModel(AUTH_MODEL).getData();

        self.setFilterEQ(aFilters, "Gjahr", entityFilters.Gjahr);
        self.setFilterEQ(aFilters, "Zzamministr", entityFilters.Zzamministr);
        self.setFilterBT(
          aFilters,
          "Znumaut",
          entityFilters.authFrom,
          entityFilters.authTo
        );
        self.setFilterEQ(
          aFilters,
          "ZzstatoAut",
          entityFilters.statoAutorizzazione
        );
        self.setFilterEQ(
          aFilters,
          "ZufficioCont",
          entityFilters.ufficioOrdinante
        );
        self.setFilterEQ(
          aFilters,
          "Ztipodisp2",
          entityFilters.tipologiaAutorizzazione
        );
        self.setFilterEQ(
          aFilters,
          "Ztipodisp3",
          entityFilters.tipologiaDisposizione
        );
        self.setFilterBT(
          aFilters,
          "Zdata",
          dataRegFromControl?.getDateValue(),
          dataRegToControl?.getDateValue()
        );
        self.setFilterBT(
          aFilters,
          "Fipos",
          entityFilters.fipexFrom,
          entityFilters.fipexTo
        );
        self.setFilterEQ(aFilters, "Fistl", entityFilters.fistl);

        object.filters = aFilters;
        return object;
      },

      posizioneFinanziariaLiveChange: function (oEvent) {
        var self = this,
          prop = oEvent.getSource().data("search_model");
        self
          .getView()
          .getModel(AUTH_MODEL)
          .setProperty("/" + prop, oEvent.getParameters().value);
      },

      strutturaAmministrativaLiveChange: function (oEvent) {
        var self = this;
        self
          .getView()
          .getModel(AUTH_MODEL)
          .setProperty("/fistl" + prop, oEvent.getParameters().value);
      },
    });
  }
);
