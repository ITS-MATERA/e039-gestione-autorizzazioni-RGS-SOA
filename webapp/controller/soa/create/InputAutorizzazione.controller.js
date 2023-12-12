sap.ui.define(
  [
    "../BaseSoaController",
    "sap/ui/model/json/JSONModel",
    "../../../model/formatter",
    "sap/m/MessageBox",
  ],
  function (BaseSoaController, JSONModel, formatter, MessageBox) {
    "use strict";

    return BaseSoaController.extend(
      "rgssoa.controller.soa.create.InputAutorizzazione",
      {
        formatter: formatter,

        onInit: function () {
          var self = this;

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

          this.getRouter()
            .getRoute("soa.create.InputAutorizzazione")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
          var self = this;

          var oModelInputAutorizzazione = new JSONModel({
            SoaType: "",
            DocumentiLiquidati: true,
            DocumentiNonLiquidati: false,
            Gjahr: "",
          });

          var oArguments = oEvent.getParameter("arguments");

          oModelInputAutorizzazione.setProperty(
            "/SoaType",
            oArguments?.SoaType
          );

          self.getPermissionsListSoa(true, function (callback) {
            self.setModelAuthorityCheck(callback?.permissions);
          });

          this._setAutorizzazioneModel();
          self.setModel(oModelInputAutorizzazione, "InputAutorizzazione");
        },

        onNavBack: function () {
          var self = this;

          self.getRouter().navTo("soa.create.ChoseTypeSoa");
        },

        onNavForward: function () {
          var self = this;

          self._checkAuthOnAutorizzazione();
        },

        //#region SELECTION CHANGE

        onSelectEsercizioGestione: function () {
          this._setAutorizzazioneModel();
        },

        onChiaveAutorizzazioneChange: function (oEvent) {
          var self = this;
          var oModel = self.getModel();

          if (!oEvent.getParameter("value")) {
            this._setAutorizzazioneModel();
            return;
          }

          var sPath = oModel.createKey("/ChiaveAutorizzazioneSet", {
            Gjahr: "",
            Zchiaveaut: oEvent.getParameter("value"),
            Bukrs: "",
            ZstepAut: "",
          });

          self.getView().setBusy(true);

          oModel.read(sPath, {
            success: function (data, oResponse) {
              self.getView().setBusy(false);
              if (self.hasResponseError(oResponse)) {
                self._setAutorizzazioneModel();
                return;
              }
              self.setModelCustom("Autorizzazione", data);
              self._setSceltaOperativa();
            },
          });
        },

        onIdAutorizzazioneChange: function (oEvent) {
          var self = this;
          var oModel = self.getModel();
          var oModelAutorizzazione = self.getModel("Autorizzazione");
          var oAutorizzazione = oModelAutorizzazione?.getData();
          var sZgeber = oEvent.getParameter("value");

          if (!sZgeber) {
            return;
          }

          var sPath = oModel.createKey("/IdAutorizzazioneSet", {
            Zgeber: sZgeber,
            EsercizioFinanziario: oAutorizzazione.EsercizioFinanziario,
            Fipos: oAutorizzazione.Fipos,
            Fistl: oAutorizzazione.Fistl,
          });

          self.getView().setBusy(true);

          oModel.read(sPath, {
            success: function (oData, oResponse) {
              self.getView().setBusy(false);
              if (self.hasResponseError(oResponse)) {
                oModelAutorizzazione.setProperty("/Zgeber", "");
              }
            },
            error: function () {
              self.getView().setBusy(false);
              oModelAutorizzazione.setProperty("/Zgeber", "");
            },
          });
        },

        //#endregion SELECTION CHANGE

        //#region VALUE HELPS

        onValueHelpIdAutorizzazione: function () {
          var self = this;
          var oModel = self.getModel();
          var oAutorizzazione = self.getModel("Autorizzazione").getData();
          var oDialog = self.loadFragment(
            "rgssoa.view.fragment.soa.value-help.IdAutorizzazione"
          );

          var aFilters = [];

          self.setFilterEQ(
            aFilters,
            "EsercizioFinanziario",
            oAutorizzazione.EsercizioFinanziario
          );
          self.setFilterEQ(aFilters, "Fipos", oAutorizzazione.Fipos);
          self.setFilterEQ(aFilters, "Fistl", oAutorizzazione.Fistl);

          self.getView().setBusy(true);
          oModel.read("/IdAutorizzazioneSet", {
            filters: aFilters,
            success: function (data) {
              self.getView().setBusy(false);
              self.setModelDialog(
                "IdAutorizzazione",
                data,
                "sdIdAutorizzazione",
                oDialog
              );
            },
            error: function () {
              self.getView().setBusy(false);
            },
          });
        },

        onValueHelpIdAutorizzazioneClose: function (oEvent) {
          var self = this;
          var oModelAutorizzazione = self.getModel("Autorizzazione");
          var oSelectedItem = oEvent.getParameter("selectedItem");

          oModelAutorizzazione.setProperty(
            "/Zgeber",
            self.setBlank(oSelectedItem?.getTitle())
          );
        },

        //#endregion VALUE HELPS

        //#region PRIVATE METHODS

        _checkAuthOnAutorizzazione: function () {
          var self = this;
          var oModel = self.getModel();
          var oModelAuthoryCheckSoa = self.getModel("AuthorityCheckSoa");
          var oModelAutorizzazione = self.getModel("Autorizzazione");
          var oModelInputAutorizzazione = self.getModel("InputAutorizzazione");
          var oView = self.getView();

          var sSoaType = oModelInputAutorizzazione.getProperty("/SoaType");
          var bDocumentiLiquidati = oModelInputAutorizzazione.getProperty(
            "/DocumentiLiquidati"
          );
          var bDocumentiNonLiquidati = oModelInputAutorizzazione.getProperty(
            "/DocumentiNonLiquidati"
          );

          if (!oModelAuthoryCheckSoa.getProperty("/AgrName")) {
            return;
          }

          var oParameters = {
            Zchiaveaut: oModelAutorizzazione?.getProperty("/Zchiaveaut"),
            Bukrs: oModelAutorizzazione?.getProperty("/Bukrs"),
            Gjahr: oModelAutorizzazione?.getProperty("/Gjahr"),
            Zgeber: oModelAutorizzazione?.getProperty("/Zgeber")
              ? oModelAutorizzazione?.getProperty("/Zgeber")
              : "null",
          };

          if (
            !oParameters?.Zchiaveaut ||
            !oParameters?.Bukrs ||
            !oParameters?.Gjahr
          ) {
            MessageBox.error("Inserire una Autorizzazione valida");
            return;
          }

          oView.setBusy(true);
          oModel.callFunction("/AutorityCheckOnAutorizzazione", {
            method: "GET",
            urlParameters: {
              AgrName: oModelAuthoryCheckSoa.getProperty("/AgrName"),
              Fikrs: oModelAuthoryCheckSoa.getProperty("/Fikrs"),
              Fipos: oModelAutorizzazione.getProperty("/Fipos"),
              Fistl: oModelAutorizzazione.getProperty("/Fistl"),
              Gjahr: oModelAutorizzazione.getProperty("/Gjahr"),
              Prctr: oModelAuthoryCheckSoa.getProperty("/Prctr"),
            },
            success: function (data, oResponse) {
              oView.setBusy(false);
              if (self.hasResponseError(oResponse)) {
                return;
              }

              if (sSoaType === "1" && bDocumentiLiquidati) {
                self
                  .getRouter()
                  .navTo("soa.create.scenery.Scenario1", oParameters);
              }
              if (sSoaType === "1" && bDocumentiNonLiquidati) {
                self
                  .getRouter()
                  .navTo("soa.create.scenery.Scenario2", oParameters);
              }
              if (sSoaType === "2" && bDocumentiLiquidati) {
                self
                  .getRouter()
                  .navTo("soa.create.scenery.Scenario3", oParameters);
              }
              if (sSoaType === "2" && bDocumentiNonLiquidati) {
                self
                  .getRouter()
                  .navTo("soa.create.scenery.Scenario4", oParameters);
              }
            },
            error: function (error) {
              oView.setBusy(false);
            },
          });
        },

        _setAutorizzazioneModel: function () {
          var self = this;

          var oModelAutorizzazione = new JSONModel({
            Gjahr: "",
            Zchiaveaut: "",
            Bukrs: "",
            ZstepAut: "",
            Zzamministr: "",
            DataStato: null,
            Zimpaut: "",
            Zimpdispaut: "",
            Ztipodisp2: "",
            Zdesctipodisp2: "",
            Ztipodisp3: "",
            Zdesctipodisp3: "",
            Znoteaut: "",
            ZufficioCont: "",
            ZvimDescrufficio: "",
            Zfunzdel: "",
            Zdescriz: "",
            ZflagFipos: false,
            Fipos: "",
            Fistl: "",
            DescrEstesa: "",
            Zgeber: "",
          });
          self.setModel(oModelAutorizzazione, "Autorizzazione");
        },

        _setSceltaOperativa: function () {
          var self = this;
          var oModelAutorizzazione = self.getModel("Autorizzazione");
          var oModelInputAutorizzazione = self.getModel("InputAutorizzazione");

          if (oModelAutorizzazione.getProperty("/Zfunzdel")) {
            oModelInputAutorizzazione.setProperty("/DocumentiLiquidati", false);
            oModelInputAutorizzazione.setProperty(
              "/DocumentiNonLiquidati",
              true
            );
            return;
          }

          oModelInputAutorizzazione.setProperty("/DocumentiLiquidati", true);
          oModelInputAutorizzazione.setProperty(
            "/DocumentiNonLiquidati",
            false
          );
        },

        functionReturnZchiaveaut: function (oData) {
          var self = this;

          var oModel = self.getModel();
          var oModelAutorizzazione = self.getModel("Autorizzazione");

          oModelAutorizzazione.setProperty("/Gjahr", oData.Gjahr);
          oModelAutorizzazione.setProperty("/Zchiaveaut", oData.Zchiaveaut);
          oModelAutorizzazione.setProperty("/Bukrs", oData.Bukrs);
          oModelAutorizzazione.setProperty("/ZstepAut", oData.ZstepAut);

          var sPath = oModel.createKey("/ChiaveAutorizzazioneSet", {
            Gjahr: oData.Gjahr,
            Zchiaveaut: oData.Zchiaveaut,
            Bukrs: oData.Bukrs,
            ZstepAut: oData.ZstepAut,
          });

          self.getView().setBusy(true);

          oModel.read(sPath, {
            success: function (data) {
              self.getView().setBusy(false);
              self.setModelCustom("Autorizzazione", data);
              self._setSceltaOperativa();
            },
          });
        },

        //#endregion PRIVATE METHODS
      }
    );
  }
);
