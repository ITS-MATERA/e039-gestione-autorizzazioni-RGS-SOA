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

          var oModelInputAutorizzazione = new JSONModel({
            SoaType: "",
            DocumentiLiquidati: true,
            DocumentiNonLiquidati: false,
            Gjahr: "",
          });
          self.setModel(oModelInputAutorizzazione, "InputAutorizzazione");

          var oModelAutorizzazione = new JSONModel({
            Gjahr: "",
            Zchiaveaut: "",
            Bukrs: "",
            ZstepAut: "",
            Zzamministr: "",
            DataStatoString: null,
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
            ZflagFipos: "",
            Fipos: "",
            Fistl: "",
            DescrEstesa: "",
          });
          self.setModel(oModelAutorizzazione, "Autorizzazione");

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
          var oModelInputAutorizzazione = self.getModel("InputAutorizzazione");

          var oArguments = oEvent.getParameter("arguments");

          oModelInputAutorizzazione.setProperty(
            "/SoaType",
            oArguments?.SoaType
          );

          self.getPermissionsListSoa();
        },
        onNavBack: function () {
          var self = this;
          history.go(-1);

          self._resetAutorizzazione();
        },
        onNavForward: function () {
          var self = this;

          self._checkAuthOnAutorizzazione();
        },

        //#region SELECTION CHANGE
        onSelectEsercizioGestione: function () {
          var self = this;

          var oModelAutorizzazione = new JSONModel({
            Gjahr: "",
            Zchiaveaut: "",
            Bukrs: "",
            ZstepAut: "",
            Zzamministr: "",
            DataStatoString: null,
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
            ZflagFipos: "",
            Fipos: "",
            Fistl: "",
            DescrEstesa: "",
          });
          self.setModel(oModelAutorizzazione, "Autorizzazione");
        },
        //#endregion SELECTION CHANGE

        //#region VALUE HELPS
        onValueHelpChiaveAutorizzazione: function () {
          var self = this;
          var oModel = self.getModel();
          var oDialog = self.loadFragment(
            "rgssoa.view.fragment.valueHelp.ChiaveAutorizzazione"
          );

          var aFilters = [];

          var oModelInputAutorizzazione = self.getModel("InputAutorizzazione");

          self.setFilterEQ(
            aFilters,
            "Gjahr",
            oModelInputAutorizzazione.getProperty("/Gjahr")
          );

          oModel.read("/" + "ChiaveAutorizzazioneSet", {
            urlParameters: {
              isDocumentCost:
                oModelInputAutorizzazione.getProperty("/SoaType") === "1"
                  ? ""
                  : "X",
            },
            filters: aFilters,
            success: function (data, oResponse) {
              self.setResponseMessage(oResponse);
              self.setModelSelectDialog(
                "ChiaveAutorizzazione",
                data,
                "sdChiaveAutorizzazione",
                oDialog
              );
            },
            error: function (error) {},
          });
        },
        onValueHelpChiaveAutorizzazioneClose: function (oEvent) {
          var self = this;
          var oModelAutorizzazione = self.getModel("Autorizzazione");
          var oModelInputAutorizzazione = self.getModel("InputAutorizzazione");
          var oSelectedItem = oEvent.getParameter("selectedItem");

          if (!oSelectedItem) {
            return;
          }
          var oData = oSelectedItem.data();

          oModelAutorizzazione.setProperty("/Gjahr", oData.Gjahr);
          oModelAutorizzazione.setProperty("/Zchiaveaut", oData.Zchiaveaut);
          oModelAutorizzazione.setProperty("/Bukrs", oData.Bukrs);
          oModelAutorizzazione.setProperty("/ZstepAut", oData.ZstepAut);
          oModelAutorizzazione.setProperty("/Zzamministr", oData.Zzamministr);
          oModelAutorizzazione.setProperty(
            "/DataStatoString",
            oData.DataStatoString
          );
          oModelAutorizzazione.setProperty("/DataStato", oData.DataStato);
          oModelAutorizzazione.setProperty("/Zimpaut", oData.Zimpaut);
          oModelAutorizzazione.setProperty("/Zimpdispaut", oData.Zimpdispaut);
          oModelAutorizzazione.setProperty("/Ztipodisp2", oData.Ztipodisp2);
          oModelAutorizzazione.setProperty(
            "/Zdesctipodisp2",
            oData.Zdesctipodisp2
          );
          oModelAutorizzazione.setProperty("/Ztipodisp3", oData.Ztipodisp3);
          oModelAutorizzazione.setProperty(
            "/Zdesctipodisp3",
            oData.Zdesctipodisp3
          );
          oModelAutorizzazione.setProperty("/Znoteaut", oData.Znoteaut);
          oModelAutorizzazione.setProperty("/ZufficioCont", oData.ZufficioCont);
          oModelAutorizzazione.setProperty(
            "/ZvimDescrufficio",
            oData.ZvimDescrufficio
          );
          oModelAutorizzazione.setProperty("/Zfunzdel", oData.Zfunzdel);
          oModelAutorizzazione.setProperty("/Zdescriz", oData.Zdescriz);
          oModelAutorizzazione.setProperty("/ZflagFipos", oData.ZflagFipos);
          oModelAutorizzazione.setProperty("/Fipos", oData.Fipos);
          oModelAutorizzazione.setProperty("/Fistl", oData.Fistl);
          oModelAutorizzazione.setProperty("/DescrEstesa", oData.DescrEstesa);

          oModelInputAutorizzazione.setProperty(
            "/DocumentiLiquidati",
            oData.ZflagFipos ? false : true
          );
          oModelInputAutorizzazione.setProperty(
            "/DocumentiNonLiquidati",
            oData.ZflagFipos ? true : false
          );

          self.unloadFragment();
        },
        //#endregion VALUE HELPS

        //#region PRIVATE METHODS
        _checkAuthOnAutorizzazione: function () {
          var self = this;
          var oModel = self.getModel();
          var oModelAuthoryCheckSoa = self.getModel("AuthorityCheckSoa");
          var oModelAutorizzazione = self.getModel("Autorizzazione");
          var oModelInputAutorizzazione = self.getModel("InputAutorizzazione");

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
          };

          if (
            !oParameters?.Zchiaveaut ||
            !oParameters?.Bukrs ||
            !oParameters?.Gjahr
          ) {
            MessageBox.error("Inserire una Autorizzazione valida");
            return;
          }

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
              //TODO - Rimettere
              // if (self.setResponseMessage(oResponse)) {
              //   return;
              // }

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
            error: function (error) {},
          });
        },

        _resetAutorizzazione: function () {
          var self = this;
          var oModelInputAutorizzazione = new JSONModel({
            SoaType: "",
            DocumentiLiquidati: true,
            DocumentiNonLiquidati: false,
            Gjahr: "",
          });
          self.setModel(oModelInputAutorizzazione, "InputAutorizzazione");

          var oModelAutorizzazione = new JSONModel({
            Gjahr: "",
            Zchiaveaut: "",
            Bukrs: "",
            ZstepAut: "",
            Zzamministr: "",
            DataStatoString: null,
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
            ZflagFipos: "",
            Fipos: "",
            Fistl: "",
            DescrEstesa: "",
          });
          self.setModel(oModelAutorizzazione, "Autorizzazione");
        },
        //#endregion PRIVATE METHODS
      }
    );
  }
);
