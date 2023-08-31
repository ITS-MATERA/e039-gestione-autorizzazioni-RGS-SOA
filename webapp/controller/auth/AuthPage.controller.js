sap.ui.define([
    "./BaseAuthController",
    "sap/ui/model/json/JSONModel",
    "../../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    const AUTH_MODEL = "authModel";
    const PAGINATOR_MODEL = "paginatorModel";
    const AUTORIZZAZIONE_ENTITY_SET = "AutorizzazioneSet";  
    const AUTORIZZAZIONE_MODEL= "AutorizzazioneSet";
    return BaseController.extend("rgssoa.controller.auth.AuthPage", {
        onInit: function () {
            var self= this,
                oAuthModel,
                oPaginatorModel;
                
                oAuthModel = new JSONModel({
                    authTableTitle: self.getResourceBundle().getText("authPageTitleCountNoRows"),
                    total: 0,
                    // areFiltersValid: true,
                    // isSelectedAll: false,
                    btnDetailEnabled: false,
                    Zzamministr:null,
                    ufficioOrdinante:null,
                    authFrom:null,
                    authTo:null,
                    Gjahr:null,
                    statoAutorizzazione:null,
                    tipologiaDisposizione:null,
                    tipologiaAutorizzazione:null,
                    fipexFrom:null,
                    fipexTo:null,
                    fistl:null
                  });

            oPaginatorModel = new JSONModel({
                btnPrevEnabled: false,
                btnFirstEnabled: false,
                btnNextEnabled: false,
                btnLastEnabled: false,
                recordForPageEnabled: false,
                currentPageEnabled: true,
                stepInputDefault: 20,
                currentPage: 1,
                maxPage: 1,
                paginatorSkip: 0,
                paginatorClick: 0,
            });
            
            self.setModel(oAuthModel, AUTH_MODEL);
            self.setModel(oPaginatorModel, PAGINATOR_MODEL);

            self.getRouter().getRoute("auth.authPage").attachPatternMatched(this._onObjectMatched, this);
            // self.getAuthorityCheck(function(callback){
            //     console.log(callback);
            // });
        },

        _onObjectMatched : function (oEvent) {
          var self = this; 
          if(!self.getModel(self.AUTHORITY_CHECK_AUTH)){
            self.getAuthorityCheck(function(callback){
              if(!callback.success || !callback.permission.Z26Enabled){
                self.getRouter().navTo("startpage");
              }
            });
          }
        },
        
        onBeforeRendering: function () {
            var self = this;
            // self.resetPaginator(PAGINATOR_MODEL);
            // self._setEntityProperties();
  
            // var oTable = self.getView().byId(TABLE_LISTSON);
            // oTable._getSelectAllCheckbox().setVisible(false);
          },

        onNavBack: function () {
            history.go(-1);
        },

        onToggle: function () {
            var self = this,
                oView = self.getView(),
                oBundle = self.getResourceBundle();

            var btnArrow = oView.byId("btnToggle");
            var panelFilter = oView.byId("_authFilterToolbarGrid");
            if (btnArrow.getIcon() === "sap-icon://slim-arrow-up") {
                btnArrow.setIcon("sap-icon://slim-arrow-down");
                btnArrow.setTooltip(oBundle.getText("tooltipArrowShow"));
                panelFilter.setVisible(false);
            } else {
                btnArrow.setIcon("sap-icon://slim-arrow-up");
                btnArrow.setTooltip(oBundle.getText("tooltipArrowHide"));
                panelFilter.setVisible(true);
            }
        },

        onAuthfEsercizio_Change:function(oEvent){
          var self =this,
            value = oEvent.getParameters() ? oEvent.getParameters().selectedItem.getKey() : null;
          self.getView().getModel(AUTH_MODEL).setProperty("/Gjahr", value);
        },
  
        onBlockToggle: function () {
            var self = this,
                oView = self.getView();

            var btnArrow = oView.byId("btnToggle");
            btnArrow.getEnabled()
                ? btnArrow.setEnabled(false)
                : btnArrow.setEnabled(true);
        },

        onSearchAuthPress:function(oEvent){
            var self =this;
            self._search(false);
        },

        onUpdateFinished:function(oEvent){
            var self= this,
                sTitle,
                oTable = oEvent.getSource(),
                // oPaginatorPanel = this.getView().byId("paginatorPanel"),
                iTotalItems = self.getView().getModel(AUTH_MODEL).getProperty("/total");
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("authPageTitleCount",[iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("authPageTitleCountNoRows");
                // if (isChange) {
                //     sTitle = this.getResourceBundle().getText("changeAuthPageTitle");
                // } else {
                //     sTitle = this.getResourceBundle().getText("listAuthPageTitle");
                // }
            }
            self.getView().getModel(AUTH_MODEL).setProperty("/authTableTitle", sTitle);
            // oPaginatorPanel.setVisible(!isChange);
            self.getView().setBusy(false);
        },

        /* PAGINAZIONE - start */

        getChangePage: function (sNameModel, maxPage) {
          var self = this,
            bFirst = false,
            bLast = false,
            paginatorModel = self.getModel(sNameModel),
            numRecordsForPage = paginatorModel.getProperty("/stepInputDefault"),
            currentPage = paginatorModel.getProperty("/currentPage");

          if (currentPage === 0) {
            return;
          }

          paginatorModel.setProperty(
            "/paginatorSkip",
            (currentPage - 1) * numRecordsForPage
          );

          if (currentPage === maxPage) {
            bFirst = true;
            bLast = false;
            if (currentPage === 1) {
              bFirst = false;
            }
          } else if (currentPage === 1) {
            bFirst = false;
            if (currentPage < maxPage) {
              bLast = true;
            }
          } else if (currentPage > maxPage) {
            bFirst = false;
            bLast = false;
          } else {
            if (currentPage > 1) {
              bFirst = true;
            }
            bLast = true;
          }
          paginatorModel.setProperty("/btnLastEnabled", bLast);
          paginatorModel.setProperty("/btnFirstEnabled", bFirst);
        },

        getFirstPaginator: function (sNameModel) {
            var self = this,
            paginatorModel = self.getModel(sNameModel);

            paginatorModel.setProperty("/btnLastEnabled", true);
            paginatorModel.setProperty("/btnFirstEnabled", false);
            paginatorModel.setProperty("/paginatorClick", 0);
            paginatorModel.setProperty("/paginatorSkip", 0);
            paginatorModel.setProperty("/currentPage", 1);
        },

        getLastPaginator: function (sNameModel) {
            var self = this,
              paginatorModel = self.getModel(sNameModel),
              numRecordsForPage = paginatorModel.getProperty("/stepInputDefault");
  
            paginatorModel.setProperty("/btnLastEnabled", false);
            paginatorModel.setProperty("/btnFirstEnabled", true);
            var paginatorClick = self.paginatorTotalPage;
  
            paginatorModel.setProperty("/paginatorClick", paginatorClick);
            paginatorModel.setProperty(
              "/paginatorSkip",
              (paginatorClick - 1) * numRecordsForPage
            );
  
            paginatorModel.setProperty(
              "/currentPage",
              self.paginatorTotalPage === 0 ? 1 : self.paginatorTotalPage
            );
        },

        onFirstPaginator: function (oEvent) {
            var self = this;
            self.getFirstPaginator(PAGINATOR_MODEL);
            self._search(true);
          },
  
        onLastPaginator: function (oEvent) {
            var self = this;
            self.getLastPaginator(PAGINATOR_MODEL);
            self._search(true);
        },
  
        onChangePage: function (oEvent) {
            var self = this,
                paginatorModel = self.getModel(PAGINATOR_MODEL),
                maxPage = paginatorModel.getProperty("/maxPage");
            self.getChangePage(PAGINATOR_MODEL, maxPage);
            self._search(true);
        },

        /* PAGINAZIONE - end */
        _search:function(fromPaginator=false){
            var self = this,
                oDataModel = self.getModel(),
                oView = self.getView(),                
                skip = self.getModel("paginatorModel").getProperty("/paginatorSkip"),
                numRecordsForPage = self.getModel("paginatorModel").getProperty("/stepInputDefault");
                            
            oView.setBusy(true); 
            var headerObject = self.getAuthFilterBar()          
            self.getModel().metadataLoaded().then( function() {
             oDataModel.read("/" + AUTORIZZAZIONE_ENTITY_SET, {
                    urlParameters: {
                          '$top': numRecordsForPage, 
                          '$skip': skip, 
                          '$inlinecount':'allpages',                           
                          'AutorityRole':self.getModel(self.AUTHORITY_CHECK_AUTH).getProperty("/AGR_NAME") ? self.getModel(self.AUTHORITY_CHECK_AUTH).getProperty("/AGR_NAME"): null,
                          'AutorityFikrs':self.getModel(self.AUTHORITY_CHECK_AUTH).getProperty("/FIKRS") ? self.getModel(self.AUTHORITY_CHECK_AUTH).getProperty("/FIKRS") : null,
                          'AutorityPrctr':self.getModel(self.AUTHORITY_CHECK_AUTH).getProperty("/PRCTR") ? self.getModel(self.AUTHORITY_CHECK_AUTH).getProperty("/PRCTR") : null
                        },
                    filters: headerObject.filters,
                    success: function(data, oResponse){
                        var oModelJson = new sap.ui.model.json.JSONModel();
                        var linesCounter = data.__count;
                        self.getView().getModel(AUTH_MODEL).setProperty("/total", linesCounter);
                        self.counterRecords(linesCounter);
                        oModelJson.setData(data.results);
                        oView.setModel(oModelJson, AUTORIZZAZIONE_MODEL);
                        self.getView().setBusy(false);
                    },
                    error: function(error){
                        oView.setBusy(false);
                    }
                });
            });            
        }, 

        counterRecords: function (data) {
            var self = this,
              paginatorModel = self.getModel(PAGINATOR_MODEL),
              numRecordsForPage = paginatorModel.getProperty("/stepInputDefault");
  
            if (data > numRecordsForPage) {
              paginatorModel.setProperty("/btnLastEnabled", true);
              self.paginatorTotalPage = data / numRecordsForPage;
              var moduleN = Number.isInteger(self.paginatorTotalPage);
              if (!moduleN) {
                self.paginatorTotalPage = Math.trunc(self.paginatorTotalPage) + 1;
              }
              paginatorModel.setProperty("/maxPage", self.paginatorTotalPage);
            } else {
              paginatorModel.setProperty("/maxPage", 1);
              paginatorModel.setProperty("/btnLastEnabled", false);
            }
          },


        onDetail:function(oEvent){
            var self = this,
                oTable = self.getView().byId("authTable"),
                selectedItems = oTable.getSelectedItems(),
                item = oTable.getModel(AUTORIZZAZIONE_MODEL).getObject(selectedItems[0].getBindingContextPath());
                         
            if(item && item.Bukrs && item.Gjahr && item.Zchiaveaut && item.ZstepAut){
                self.getRouter().navTo("auth.authDetail", {
                    Bukrs:item.Bukrs,
                    Gjahr:item.Gjahr,
                    Zchiaveaut:item.Zchiaveaut,
                    ZstepAut:item.ZstepAut
                });        
            }
            else
                return;
        },

        onRegisterAuth:function(oEvent){
            var self = this;
            self.getOwnerComponent().getRouter().navTo("auth.registerAuth");
        },

        onAuthfStatoAutorizzazione_Change:function(oEvent){
          var self =this,
            value = oEvent.getParameters() ? oEvent.getParameters().selectedItem.getKey() : null;
          self.getView().getModel(AUTH_MODEL).setProperty("/statoAutorizzazione", value);
        },

        onAuthfTipologiaDisposizione_change:function(oEvent){
          var self =this,
            value = oEvent.getParameters() ? oEvent.getParameters().selectedItem.getKey() : null;
          self.getView().getModel(AUTH_MODEL).setProperty("/tipologiaDisposizione", value);
        },

        onAuthfTipologiaAutorizzazione_Change:function(oEvent){
            var self = this,
                filters = [],    
                oDataModel = self.getModel(),
                key = oEvent.getParameters().selectedItem.getKey();

            self.getView().getModel(AUTH_MODEL).setProperty("/tipologiaAutorizzazione",key);
            if(key){
                filters.push(new sap.ui.model.Filter("Ztipodisp2",sap.ui.model.FilterOperator.EQ,key));

                self.getModel().metadataLoaded().then( function() {
                    oDataModel.read("/TipoDisp3Set", {
                        filters: filters,
                        success: function(data, oResponse){
                            var oModelJson = new sap.ui.model.json.JSONModel();
                            oModelJson.setData(data.results);
                            self.getView().setModel(oModelJson, "TipoDisp3Set");
                        },
                        error: function(error){}
                    });
                }); 
            }
        },


        onAuthfAutorizzazioneDaLiveChange:function(oEvent){
            var self = this,
                authfAutorizzazioneDaControl = self.getView().byId("authfAutorizzazioneA");

            if(oEvent.getParameters().value && oEvent.getParameters().value !== ""){
                authfAutorizzazioneDaControl.setEnabled(true);
            }
            else{
                authfAutorizzazioneDaControl.setValue("");
                authfAutorizzazioneDaControl.setEnabled(false);
            }
        },

        onAuthfPosizioneFinanziariaDaLiveChange:function(oEvent){
            var self = this,
                authfPosizioneFinanziariaAControl = self.getView().byId("authfPosizioneFinanziariaA");

            if(oEvent.getParameters().value && oEvent.getParameters().value !== ""){
                authfPosizioneFinanziariaAControl.setEnabled(true);
            }
            else{
                authfPosizioneFinanziariaAControl.setValue("");
                authfPosizioneFinanziariaAControl.setEnabled(false);
            }
        },

        onAuthfdataAutorizzazioneDaChangeDatePicker:function(oEvent){
            var self =this,
                onAuthfdataAutorizzazioneAControl = self.getView().byId("authfdataAutorizzazioneA");
            var bValid = oEvent.getParameter("valid");
            var newValue = oEvent.getParameter("newValue");
            if (!bValid || newValue === "" ) {
              oEvent.getSource().setValue("");
              onAuthfdataAutorizzazioneAControl.setEnabled(false);
              return;
            }
            oEvent.getSource().setValue(newValue);
            onAuthfdataAutorizzazioneAControl.setEnabled(true);
        },

        handleChangeDatePicker: function (oEvent) {
            var bValid = oEvent.getParameter("valid");
  
            if (!bValid) {
              oEvent.getSource().setValue("");
              return;
            }
            var newValue = oEvent.getParameter("newValue");
            oEvent.getSource().setValue(newValue);
          },

        onSelectedItem:function(oEvent){
            var self =this,
                oTable = self.getView().byId("authTable"),
                selectedItems = oTable.getSelectedItems();

            if(selectedItems.length>0)
                self.getView().getModel(AUTH_MODEL).setProperty("/btnDetailEnabled",true);
            else
                self.getView().getModel(AUTH_MODEL).setProperty("/btnDetailEnabled",false);
        }, 


        getAuthFilterBar:function(){
          var self =this,
            object = {},
            filters = [],
            dataRegFromControl=self.getView().byId("authfdataAutorizzazioneDa"),
            dataRegToControl=self.getView().byId("authfdataAutorizzazioneA");
          
          var entityFilters = self.getView().getModel(AUTH_MODEL).getData();

          if(entityFilters.Gjahr && entityFilters.Gjahr !== "")
            filters.push(new sap.ui.model.Filter("Gjahr",sap.ui.model.FilterOperator.EQ, entityFilters.Gjahr));
          if(entityFilters.Zzamministr && entityFilters.Zzamministr !== "")
            filters.push(new sap.ui.model.Filter("Zzamministr",sap.ui.model.FilterOperator.EQ, entityFilters.Zzamministr));

          if(entityFilters.authFrom && entityFilters.authFrom !== ""){
            if(entityFilters.authTo && entityFilters.authTo !== "")
              filters.push(new sap.ui.model.Filter("Znumaut",sap.ui.model.FilterOperator.BT, entityFilters.authFrom, entityFilters.authTo));            
            else
              filters.push(new sap.ui.model.Filter("Znumaut",sap.ui.model.FilterOperator.EQ, entityFilters.authFrom));
          }

          if(entityFilters.statoAutorizzazione && entityFilters.statoAutorizzazione !== "")
            filters.push(new sap.ui.model.Filter("ZzstatoAut",sap.ui.model.FilterOperator.EQ, entityFilters.statoAutorizzazione));

          if(entityFilters.ufficioOrdinante && entityFilters.ufficioOrdinante !== "")
            filters.push(new sap.ui.model.Filter("ZzstatoAut",sap.ui.model.FilterOperator.EQ, entityFilters.ufficioOrdinante)); //TODO

          if(entityFilters.tipologiaAutorizzazione && entityFilters.tipologiaAutorizzazione !== "")
            filters.push(new sap.ui.model.Filter("Ztipodisp2",sap.ui.model.FilterOperator.EQ, entityFilters.tipologiaAutorizzazione)); 

          if(entityFilters.tipologiaDisposizione && entityFilters.tipologiaDisposizione !== "")
            filters.push(new sap.ui.model.Filter("Ztipodisp3",sap.ui.model.FilterOperator.EQ, entityFilters.tipologiaDisposizione)); 

          if(dataRegFromControl && dataRegFromControl.getDateValue() && dataRegFromControl.getDateValue() !== "" ){
            if(dataRegToControl && dataRegToControl.getDateValue() && dataRegToControl.getDateValue() !== "")
              filters.push(new sap.ui.model.Filter("Zdata",sap.ui.model.FilterOperator.BT, dataRegFromControl.getDateValue(), dataRegToControl.getDateValue()));            
            else
            filters.push(new sap.ui.model.Filter("Zdata",sap.ui.model.FilterOperator.BT, dataRegFromControl.getDateValue()));      
          }

          if(entityFilters.fipexFrom && entityFilters.fipexFrom !== ""){
            if(entityFilters.fipexTo && entityFilters.fipexTo !== "")
              filters.push(new sap.ui.model.Filter("Fipos",sap.ui.model.FilterOperator.BT, entityFilters.fipexFrom, entityFilters.fipexTo));            
            else
              filters.push(new sap.ui.model.Filter("Fipos",sap.ui.model.FilterOperator.EQ, entityFilters.fipexFrom));
          }

          if(entityFilters.fistl && entityFilters.fistl !== "")
            filters.push(new sap.ui.model.Filter("Fistl",sap.ui.model.FilterOperator.EQ, entityFilters.fistl)); 

          object.filters = filters;
			    return object;
        },

      posizioneFinanziariaLiveChange:function(oEvent) {
        var self = this,
          prop = oEvent.getSource().data("search_model");
        self.getView().getModel(AUTH_MODEL).setProperty("/" + prop ,oEvent.getParameters().value);
      },

      strutturaAmministrativaLiveChange:function(oEvent){
        var self = this;
        self.getView().getModel(AUTH_MODEL).setProperty("/fistl" + prop ,oEvent.getParameters().value);
    },

    });
});