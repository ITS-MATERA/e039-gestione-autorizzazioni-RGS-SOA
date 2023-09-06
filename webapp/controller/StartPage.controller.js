sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"],
  function (BaseController, JSONModel, MessageBox) {
    "use strict";

    return BaseController.extend("rgssoa.controller.StartPage", {
      onInit: function () {},

      onNavBack: function () {
        history.go(-1);
      },

      onAuth: function () {
        var self = this;

        self.getAuthorityCheck(function (callback) {
          if (!callback.success) {
            return;
          }

          if (!callback?.permission?.Z26Enabled && callback.success) {
            MessageBox.error("Utente Non Autorizzato", {
              actions: [MessageBox.Action.OK],
            });
            return;
          }

          self.getRouter().navTo("auth.authPage");
        });
      },

      onSOA: function () {
        var self = this;

        self.getPermissionsListSoa(false, function (callback) {
          if (!callback?.success) {
            return;
          }

          if (!callback?.permissions?.Gestione) {
            MessageBox.error("Utente Non Autorizzato", {
              actions: [MessageBox.Action.OK],
            });
            return;
          }

          self.getRouter().navTo("soa.list.ListSoa");
        });
      },
    });
  }
);
