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
        self.getAuthorityCheck(function(callback){});  
      },
      onNavBack: function () {
        history.go(-1);
      },

      onAuth: function () {
        var self = this;

        if(!self.getModel(self.AUTHORITY_CHECK_AUTH)){
          self.getAuthorityCheck(function(callback){
            console.log(callback);//TODO:da canc
            if(callback.success && callback.permission.Z26Enabled){
              self.getRouter().navTo("auth.authPage");
            }
          });     
        }else{
          if(self.getModel(self.AUTHORITY_CHECK_AUTH).getProperty("/Z26Enabled"))
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
