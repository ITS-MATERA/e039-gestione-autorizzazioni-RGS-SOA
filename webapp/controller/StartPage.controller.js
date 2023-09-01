sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("rgssoa.controller.StartPage", {
      onInit: function () {
        var self = this;
        self.getAuthorityCheck(function (callback) {});

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
      },

      onBeforeRendering: function () {
        var self = this;

        self.getPermissionsListSoa();
      },

      onNavBack: function () {
        history.go(-1);
      },

      onAuth: function () {
        var self = this;

        if (!self.getModel(self.AUTHORITY_CHECK_AUTH)) {
          self.getAuthorityCheck(function (callback) {
            if (callback.success && callback.permission.Z26Enabled) {
              self.getRouter().navTo("auth.authPage");
            }
          });
        } else {
          if (
            self.getModel(self.AUTHORITY_CHECK_AUTH).getProperty("/Z26Enabled")
          )
            self.getRouter().navTo("auth.authPage");
        }
      },

      onSOA: function () {
        var self = this;
        self.getRouter().navTo("soa.list.ListSoa");
      },
    });
  }
);
