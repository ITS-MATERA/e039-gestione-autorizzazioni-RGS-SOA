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
      onInit: function () {},
      onNavBack: function () {
        history.go(-1);
      },

      onAuth: function () {
        var self = this;
        self.getRouter().navTo("authPage");
      },
      onSOA: function () {
        var self = this;
        self.getRouter().navTo("soa.list.ListSoa");
      },
    });
  }
);
