sap.ui.define(["../../BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("rgssoa.controller.soa.create.ChoseTypeSoa", {
    onNavBack: function () {
      history.go(-1);
    },

    onDocumentiCosto: function () {
      var self = this;
      self.getRouter().navTo("soa.create.InputAutorizzazione", {
        SoaType: 1,
      });
    },

    onNoDocumentiCosto: function () {
      var self = this;
      self.getRouter().navTo("soa.create.InputAutorizzazione", {
        SoaType: 2,
      });
    },
  });
});
