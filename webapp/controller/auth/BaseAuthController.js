sap.ui.define([
	"sap/ui/base/ManagedObject",
    "../BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "../../model/formatter",
    "sap/m/MessageBox",
], function(
	ManagedObject,
    BaseController,
    Filter,
    FilterOperator,
    JSONModel,
    formatter,
    MessageBox
) {
	"use strict";
    const AUTHORITY_CHECK_AUTH ="AuthorityCheckAuth";
    return BaseController.extend("rgssoa.controller.auth.BaseSoaController", {
        formatter: formatter,

        onInit: function () {
            var self = this;
        },

        setModelGlobal: function (oModel, sName) {
          return this.getOwnerComponent().setModel(oModel, sName);
        },

        createFilter: function (key, operator, value, useToLower) {
          return new sap.ui.model.Filter(
            useToLower ? "tolower(" + key + ")" : key,
            operator,
            useToLower ? "'" + value.toLowerCase() + "'" : value
          );
        },
        setFilterEQWithKey: function (sKey, sValue) {
          return new sap.ui.model.Filter({
            path: sKey,
            operator: sap.ui.model.FilterOperator.EQ,
            value1: sValue,
          });
        },

        _saveRettifica:function(key, entity, callback){
          var self =this,
            oModel = self.getModel();
            console.log(entity);
          self.getModel().metadataLoaded().then( function() {
            oModel.update("/"+key, entity, {
              success: function(data, oResponse) {
                var sapMessage = JSON.parse(oResponse.headers["sap-message"]);
                callback({
                  success: sapMessage.severity === "error" ? false : true,
                  message: sapMessage.message
                });              
              },
              error: function(e) {
                console.log(e);
                callback({success:false, message:"Si è verificato un errore durante la rettifica"});
              }
            });
          });
        },

        _getEntityForRettifica:function(entity){
          var self =this,
            oEntity = {};
          
            oEntity.ZufficioIgepa=	entity.ZufficioIgepa;
            oEntity.ZufficioRich=	entity.ZufficioRich;
            oEntity.ZufficioUcb= entity.ZufficioUcb;
            oEntity.Fipos=	entity.Fipos;
            oEntity.Fistl=	entity.Fistl;
            oEntity.ZflagFipos=	entity.ZflagFipos ? 'X' : null;
            oEntity.Ztipodisp2=	entity.Ztipodisp2;
            oEntity.Ztipodisp3=	entity.Ztipodisp3;
            oEntity.Znoteaut=entity.Znoteaut;
            oEntity.ZufficioCont=	entity.ZufficioCont; 
            oEntity.Znumprot=entity.Znumprot;	
            oEntity.Zdataprot=entity.Zdataprot && entity.Zdataprot !== "" ? new Date(formatter.formatDate(entity.Zdataprot)): null;	
            oEntity.Zimpaut=entity.Zimpaut;	
            oEntity.Bukrs=entity.Bukrs;
            oEntity.Gjahr=entity.Gjahr;
            oEntity.Zchiaveaut=entity.Zchiaveaut;
            oEntity.ZstepAut=entity.ZstepAut;

          return oEntity;
        },

        _saveAnnullamento:function(key, callback){
          var self = this,
            oModel = self.getModel();

          oModel.remove("/"+key, {
            // method: "DELETE",
            success: function(data, oResponse) {
              var sapMessage = JSON.parse(oResponse.headers["sap-message"]);
              callback({
                success: sapMessage.severity === "error" ? false : true,
                message: sapMessage.message
              });   
            },
            error: function(e) {
              console.log(e);
              callback({success:false, message:"Si è verificato un errore durante l'annullamento"});
            }
          });
        },


        callDeep: function (operation, entity, callback) {
          var self = this,
              oDataModel = self.getModel();

          var entityRequestBody = {
            Bukrs:entity.Bukrs,
            Gjahr:entity.Gjahr,
            Zchiaveaut:entity.Zchiaveaut,
            Funzionalita:operation,
            Autorizzazione:{
              Bukrs:entity.Bukrs,
              Gjahr:entity.Gjahr,
              Zchiaveaut:entity.Zchiaveaut,
              ZstepAut:entity.ZstepAut
            }
          };

          oDataModel.create("/DeepAutorizzazioneStepSet", entityRequestBody, {
            success: function (result, oResponse) {
              console.log(oResponse);
              var sapMessage = JSON.parse(oResponse.headers["sap-message"]);
              callback({
                success: sapMessage.severity === "error" ? false : true,
                message: sapMessage.message
              });
            },
            error: function (err) {
              console.log(err);
              callback({success:false, message:"Si è verificato un errore durante l'operazione"});
            }
          });
      },



	});
});