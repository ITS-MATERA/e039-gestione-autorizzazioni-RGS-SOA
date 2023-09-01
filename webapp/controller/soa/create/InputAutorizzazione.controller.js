sap.ui.define(
  [
    "../BaseSoaController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "../../../model/formatter",
    "sap/m/MessageBox",
  ],
  function (
    BaseSoaController,
    Filter,
    FilterOperator,
    JSONModel,
    formatter,
    MessageBox
  ) {
    "use strict";

    return BaseSoaController.extend(
      "rgssoa.controller.soa.create.InputAutorizzazione",
      {
        formatter: formatter,

        /**
         * @override
         *
        /**
         * @override
         */
        onInit: function () {
          var self = this;

          var oModelInputAutorizzazione = new JSONModel({
            SoaType: "",
          });
          self.setModel(oModelInputAutorizzazione, "InputAutorizzazione");

          var oModelAuthoryCheckSoa = new JSONModel({
            AgrName: "",
            Fikrs: "",
            Prctr: "",
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

          self.setModel(new JSONModel({}), "ChiaveAutorizzazione");
        },
        onSelectEsercizioGestione: function (oEvent) {
          var self = this;
          var oView = self.getView();
          var oInputChiaveAutorizzazione = oView.byId(
            "fltChiaveAutorizzazione"
          );

          oInputChiaveAutorizzazione.resetProperty("value");

          var oChiaveAutorizzazioneModel = new JSONModel({
            dataAutorizzazione: null,
            impAutorizzato: null,
            dispAutorizzato: null,
            tipoAutorizzato: null,
            tipoDisposizione: null,
            noteAutorizzazione: null,
            ufficioOrdinante: null,
            descUfficioOrdinante: null,
            codiceFD: null,
            descCodiceFD: null,
            posFinanziaria: null,
            strAmmResponsabile: null,
            pianoGestione: null,
            dataStatoString: null,
          });

          oView.setModel(oChiaveAutorizzazioneModel, "ChiaveAutorizzazione");
        },
        onValueHelpChiaveAutorizzazione: function (oEvent) {
          var self = this;
          var oDataModel = self.getModel();
          var oSourceData = oEvent.getSource().data();
          var sFragmentName = oSourceData.fragmentName;
          var dialogName = oSourceData.dialogName;
          var oDialog = self.loadFragment(
            "rgssoa.view.fragment.valueHelp." + sFragmentName
          );
          var oInputEsercizioGestione = self
            .getView()
            .byId("fltEsercizioGestione");

          if (oInputEsercizioGestione?.getSelectedKey()) {
            var oFilter = [];
            oFilter.push(
              new Filter(
                "Gjahr",
                FilterOperator.EQ,
                oInputEsercizioGestione.getSelectedKey()
              )
            );
          }

          var oModelInputAutorizzazione = self.getModel("InputAutorizzazione");

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + "ChiaveAutorizzazioneSet", {
                urlParameters: {
                  isDocumentCost:
                    oModelInputAutorizzazione.getProperty("/SoaType") === "1"
                      ? ""
                      : "X",
                },
                filters: oFilter,
                success: function (data, oResponse) {
                  self.setResponseMessage(oResponse);
                  var oModelJson = new JSONModel();
                  oModelJson.setData(data.results);
                  var oSelectDialog = sap.ui.getCore().byId(dialogName);
                  oSelectDialog?.setModel(oModelJson, "ChiaveAutorizzazione");
                  oDialog.open();
                },
                error: function (error) {},
              });
            });
        },
        onValueHelpChiaveAutorizzazioneClose: function (oEvent) {
          var self = this;
          var oView = self.getView();
          var oSelectedItem = oEvent.getParameter("selectedItem");
          var oSource = oEvent.getSource();
          var sInput = oSource.data().input;
          var oRbTipoDocumentiLiquidati = oView.byId(
            "rbTipoDocumentiLiquidati"
          );

          var oInput = self.getView().byId(sInput);

          var oChiaveAutorizzazioneModel = new JSONModel({
            zChiaveAut: oSelectedItem?.data("zChiaveAut"),
            bukrs: oSelectedItem?.data("bukrs"),
            gjahr: oSelectedItem?.data("gjahr"),
            dataAutorizzazione: oSelectedItem?.data("dataAutorizzazione"),
            impAutorizzato: oSelectedItem?.data("impAutorizzato"),
            dispAutorizzato: oSelectedItem?.data("dispAutorizzato"),
            tipoAutorizzato: oSelectedItem?.data("tipoAutorizzato"),
            tipoDisposizione: oSelectedItem?.data("tipoDisposizione"),
            noteAutorizzazione: oSelectedItem?.data("noteAutorizzazione"),
            ufficioOrdinante: oSelectedItem?.data("ufficioOrdinante"),
            descUfficioOrdinante: oSelectedItem?.data("descUfficioOrdinante"),
            codiceFD: oSelectedItem?.data("codiceFD"),
            descCodiceFD: oSelectedItem?.data("descCodiceFD"),
            posFinanziaria: oSelectedItem?.data("posFinanziaria"),
            strAmmResponsabile: oSelectedItem?.data("strAmmResponsabile"),
            pianoGestione: oSelectedItem?.data("pianoGestione"),
            dataStatoString: oSelectedItem?.data("dataStatoString"),
            flagFipos: oSelectedItem?.data("flagFipos"),
          });

          oView.setModel(oChiaveAutorizzazioneModel, "ChiaveAutorizzazione");

          oRbTipoDocumentiLiquidati.setSelected(true);

          var oInputFlagFipos = self.getView().byId("cbxFlagFipos");
          if (oSelectedItem?.data("flagFipos")) {
            oInputFlagFipos.setSelected(true);
          } else {
            oInputFlagFipos.setSelected(false);
          }

          if (!oSelectedItem) {
            oInput.resetProperty("value");
            self.unloadFragment();
            return;
          }

          oInput.setValue(oSelectedItem.getTitle());
          self.unloadFragment();
        },
        onNavForward: function () {
          var self = this;

          self._checkAuthOnAutorizzazione();
        },

        _checkAuthOnAutorizzazione: function () {
          var self = this;

          var oModel = self.getModel();
          var oModelAuthoryCheckSoa = self.getModel("AuthorityCheckSoa");
          var oModelAutorizzazione = self.getModel("ChiaveAutorizzazione");

          var oModelInputAutorizzazione = self.getModel("InputAutorizzazione");
          var oRbTipoDocumenti = self.getView().byId("rbTipoDocumenti");

          var sSoaType = oModelInputAutorizzazione.getProperty("/SoaType");
          var sRbTipoDocumenti = oRbTipoDocumenti.getSelectedIndex();

          if (!oModelAuthoryCheckSoa.getProperty("/AgrName")) {
            return;
          }

          var oView = self.getView();
          var oChiaveAutorizzazioneModel = oView.getModel(
            "ChiaveAutorizzazione"
          );

          var oParameters = {
            Zchiaveaut: oChiaveAutorizzazioneModel?.getProperty("/zChiaveAut"),
            Bukrs: oChiaveAutorizzazioneModel?.getProperty("/bukrs"),
            Gjahr: oChiaveAutorizzazioneModel?.getProperty("/gjahr"),
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
              Fipos: oModelAutorizzazione.getProperty("/posFinanziaria"),
              Fistl: oModelAutorizzazione.getProperty("/strAmmResponsabile"),
              Gjahr: oModelAutorizzazione.getProperty("/gjahr"),
              Prctr: oModelAuthoryCheckSoa.getProperty("/Prctr"),
            },
            success: function (data, oResponse) {
              //TODO - Rimettere
              // if (self.setResponseMessage(oResponse)) {
              //   return;
              // }

              if (sSoaType === "1" && sRbTipoDocumenti === 0) {
                self
                  .getRouter()
                  .navTo("soa.create.scenery.Scenario1", oParameters);
              }
              if (sSoaType === "1" && sRbTipoDocumenti === 1) {
                self
                  .getRouter()
                  .navTo("soa.create.scenery.Scenario2", oParameters);
              }
              if (sSoaType === "2" && sRbTipoDocumenti === 0) {
                self
                  .getRouter()
                  .navTo("soa.create.scenery.Scenario3", oParameters);
              }
              if (sSoaType === "2" && sRbTipoDocumenti === 1) {
                self
                  .getRouter()
                  .navTo("soa.create.scenery.Scenario4", oParameters);
              }
            },
            error: function (error) {},
          });
        },
      }
    );
  }
);
