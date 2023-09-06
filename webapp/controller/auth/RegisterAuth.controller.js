sap.ui.define(
  [
    "./BaseAuthController",
    "sap/ui/model/json/JSONModel",
    "../../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
  ],
  function (
    BaseAuthController,
    JSONModel,
    formatter,
    Filter,
    FilterOperator,
    MessageBox
  ) {
    "use strict";

    const MODEL_ENTITY = "EntityModel";
    return BaseAuthController.extend("rgssoa.controller.auth.RegisterAuth", {
      onInit: function () {
        var self = this;
        var oModelJson = new JSONModel({
          RegisterSet: {
            Gjahr: null,
            Zimpaut: null,
            Ztipodisp2: null,
            Ztipodisp3: null,
            Znoteaut: null,
            ZufficioIgepa: null,
            ZufficioRich: null,
            ZufficioUcb: null,
            EsercicioFinanziario: null,
            Zfunzdel: null,
            Zdescriz: null,
            Znumprot: null,
            Zdataprot: null,
            ZufficioCont: null,
            Fipos: null,
            Fistl: null,
            Beschr: null,
            ZflagFipos: null,
            Descufficio: null,
          },
        });
        self.getView().setModel(oModelJson, MODEL_ENTITY);
        self
          .getRouter()
          .getRoute("auth.registerAuth")
          .attachPatternMatched(self._onObjectMatched, self);
      },

      _onObjectMatched: function (oEvent) {
        var self = this;

        self.getAuthorityCheck(function (callback) {});
      },

      onRegisterAuth: function (oEvent) {
        var self = this,
          entity = self
            .getView()
            .getModel(MODEL_ENTITY)
            .getProperty("/RegisterSet");

        var oModelAuthorityCheck = self.getModel(self.AUTHORITY_CHECK_AUTH);

        if (
          !entity.Gjahr ||
          !entity.Zimpaut ||
          !entity.Ztipodisp2 ||
          !entity.Ztipodisp3 ||
          !entity.EsercicioFinanziario ||
          !entity.Fipos ||
          !entity.ZufficioCont
        ) {
          MessageBox.warning("Alimentare tutti i campi obbligatori", {
            title: "Esito Operazione",
            actions: [sap.m.MessageBox.Action.OK],
            emphasizedAction: MessageBox.Action.OK,
          });
          return false;
        }

        MessageBox.warning(
          self.getResourceBundle().getText("RegisterAuthMessage"),
          {
            title: self.getResourceBundle().getText("RegisterAuthTitle"),
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
            emphasizedAction: MessageBox.Action.YES,
            onClose: function (oAction) {
              if (oAction === sap.m.MessageBox.Action.YES) {
                self.getView().setBusy(true);
                var oModel = self.getOwnerComponent().getModel();
                var entityCreate = {
                  Gjahr: entity.Gjahr,
                  Fipos: entity.Fipos,
                  Fistl: entity.Fistl,
                  Znumprot: entity.Znumprot,
                  Zdataprot: entity.Zdataprot
                    ? new Date(formatter.formatDate(entity.Zdataprot))
                    : null,
                  Zimpaut: entity.Zimpaut,
                  Ztipodisp2: entity.Ztipodisp2,
                  Ztipodisp3: entity.Ztipodisp3,
                  Znoteaut: entity.Znoteaut,
                  ZufficioCont: entity.ZufficioCont,
                  ZufficioIgepa: entity.ZufficioIgepa,
                  ZufficioRich: entity.ZufficioRich,
                  ZufficioUcb: entity.ZufficioUcb,
                  ZflagFipos: entity.ZflagFipos ? "X" : null,
                };

                oModel.create("/AutorizzazioneSet", entityCreate, {
                  urlParameters: {
                    AutorityRole:
                      oModelAuthorityCheck?.getProperty("/AGR_NAME"),
                    AutorityFikrs: oModelAuthorityCheck?.getProperty("/FIKRS"),
                    AutorityPrctr: oModelAuthorityCheck?.getProperty("/PRCTR"),
                  },
                  success: function (data, oResponse) {
                    var sapMessage = JSON.parse(
                      oResponse.headers["sap-message"]
                    );
                    self.getView().setBusy(false);
                    if (sapMessage.severity === "error") {
                      MessageBox.error(sapMessage.message, {
                        title: "Registrazione Autorizzazione",
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: MessageBox.Action.OK,
                      });
                    } else {
                      MessageBox.success(sapMessage.message, {
                        title: "Registrazione Autorizzazione",
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: MessageBox.Action.OK,
                        onClose: function (oAction) {
                          self.onNavBack();
                        },
                      });
                    }
                  },
                  error: function (e) {
                    self.getView().setBusy(false);
                    MessageBox.error("Operazione non eseguita", {
                      title: "Registrazione Autorizzazione",
                      actions: [sap.m.MessageBox.Action.OK],
                      emphasizedAction: MessageBox.Action.OK,
                    });
                  },
                });
              }
            },
          }
        );
      },

      posizioneFinanziariaLiveChange: function (oEvent) {
        var self = this,
          value =
            oEvent.getParameters().value && oEvent.getParameters().value !== ""
              ? oEvent.getParameters().value
              : null,
          prop = oEvent.getSource().data("propertyModel");
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/" + prop, oEvent.getParameters().value);
      },

      strutturaAmministrativaLiveChange: function (oEvent) {
        var self = this,
          value =
            oEvent.getParameters().value && oEvent.getParameters().value !== ""
              ? oEvent.getParameters().value
              : null,
          prop = oEvent.getSource().data("propertyModel");
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/" + prop, oEvent.getParameters().value);

        if (value) {
          self.getView().setBusy(true);
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              var path = self.getModel().createKey("/DescFistlSet", {
                Fistl: value,
              });
              var oDataModel = self.getModel();
              oDataModel.read(path, {
                success: function (data) {
                  self.getView().setBusy(false);
                  if (data && data.Beschr && data.Beschr !== "")
                    self
                      .getView()
                      .getModel(MODEL_ENTITY)
                      .setProperty("/RegisterSet/Beschr", data.Beschr);
                  else
                    self
                      .getView()
                      .getModel(MODEL_ENTITY)
                      .setProperty("/RegisterSet/Beschr", null);
                },
                error: function (error) {
                  oView.setBusy(false);
                  self
                    .getView()
                    .getModel(MODEL_ENTITY)
                    .setProperty("/RegisterSet/Beschr", null);
                },
              });
            });
        } else
          self
            .getView()
            .getModel(MODEL_ENTITY)
            .setProperty("/RegisterSet/Beschr", null);
      },

      checkZUfficioCont: function (oEvent) {
        var self = this,
          value =
            oEvent.getParameters().value && oEvent.getParameters().value !== ""
              ? oEvent.getParameters().value
              : null;

        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/ZufficioCont", value);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Descufficio", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Zfunzdel", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Zdescriz", null);

        if (value) {
          self.getView().setBusy(true);
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              var path = self.getModel().createKey("/UfficioContSet", {
                Ztipodisp2: self
                  .getView()
                  .getModel(MODEL_ENTITY)
                  .getProperty("/RegisterSet/Ztipodisp2"),
                Ztipodisp3: self
                  .getView()
                  .getModel(MODEL_ENTITY)
                  .getProperty("/RegisterSet/Ztipodisp3"),
                ZufficioCont: value,
              });
              var oDataModel = self.getModel();
              oDataModel.read(path, {
                success: function (data, oResponse) {
                  var sapMessage = oResponse.headers["sap-message"]
                    ? JSON.parse(oResponse.headers["sap-message"])
                    : null;
                  self.getView().setBusy(false);
                  if (sapMessage) {
                    self
                      .getView()
                      .getModel(MODEL_ENTITY)
                      .setProperty("/RegisterSet/Descufficio", null);
                    self
                      .getView()
                      .getModel(MODEL_ENTITY)
                      .setProperty("/RegisterSet/ZufficioCont", null);
                    MessageBox.error(sapMessage.message, {
                      title: "Ufficio Contabile",
                      actions: [sap.m.MessageBox.Action.OK],
                      emphasizedAction: MessageBox.Action.OK,
                    });
                  } else {
                    if (
                      data &&
                      data.ZvimDescrufficio &&
                      data.ZvimDescrufficio !== ""
                    )
                      self
                        .getView()
                        .getModel(MODEL_ENTITY)
                        .setProperty(
                          "/RegisterSet/Descufficio",
                          data.ZvimDescrufficio
                        );
                    else
                      self
                        .getView()
                        .getModel(MODEL_ENTITY)
                        .setProperty("/RegisterSet/Descufficio", null);
                  }
                },
                error: function (error) {
                  self.getView().setBusy(false);
                  self
                    .getView()
                    .getModel(MODEL_ENTITY)
                    .setProperty("/RegisterSet/Descufficio", null);
                },
              });
            });
        }
      },

      setPropertyComboFromChange: function (oEvent) {
        var self = this,
          value =
            oEvent.getSource().getSelectedKey() &&
            oEvent.getSource().getSelectedKey() !== ""
              ? oEvent.getSource().getSelectedKey()
              : null,
          prop = oEvent.getSource().data("propertyModel"),
          functionName = oEvent.getSource().data("propertyCallFunction");
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/" + prop, value);
        if (functionName && functionName !== "") {
          eval(`this.${functionName}(value)`);
        }
      },

      _loadTipologiaDisposizione: function (key) {
        var self = this,
          oDataModel = self.getModel(),
          filters = [];
        self.getView().setBusy(true);
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
                self.getView().setBusy(false);
                var oModelJson = new sap.ui.model.json.JSONModel();
                oModelJson.setData(data.results);
                self.getView().setModel(oModelJson, "TipoDisp3Set");
              },
              error: function (error) {
                self.getView().setBusy(false);
              },
            });
          });
      },

      setPropertyDatePickerFromChange: function (oEvent) {
        var self = this,
          value = oEvent.getParameters().valid
            ? oEvent.getSource().getDateValue()
            : null,
          prop = oEvent.getSource().data("propertyModel");
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/" + prop, value);
      },

      onNavBack: function (oEvent) {
        var self = this;
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Gjahr", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Zimpaut", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Ztipodisp2", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Ztipodisp3", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Znoteaut", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/ZufficioIgepa", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/ZufficioRich", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/ZufficioUcb", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/EsercicioFinanziario", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Zfunzdel", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Zdescriz", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Znumprot", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Zdataprot", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/ZufficioCont", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Fipos", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Fistl", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Beschr", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/ZflagFipos", null);
        self
          .getView()
          .getModel(MODEL_ENTITY)
          .setProperty("/RegisterSet/Descufficio", null);
        self.getRouter().navTo("auth.authPage");
      },
    });
  }
);
