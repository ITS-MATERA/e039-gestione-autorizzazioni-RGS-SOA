sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    const AUTH_MODEL = "authModel";
    const PAGINATOR_MODEL = "paginatorModel";
    const AUTORIZZAZIONE_ENTITY_SET = "AutorizzazioneSet";  
    const AUTORIZZAZIONE_MODEL= "AutorizzazioneSet";
    return BaseController.extend("rgssoa.controller.AuthPage", {

        onInit: function () {
            var self= this,
                oAuthModel,
                oPaginatorModel;
                
                oAuthModel = new JSONModel({
                    authTableTitle: self.getResourceBundle().getText("authPageTitleCountNoRows"),
                    total: 0,
                    // areFiltersValid: true,
                    // isSelectedAll: false,
                    btnDetailEnabled: false
                  });

            oPaginatorModel = new JSONModel({
                btnPrevEnabled: false,
                btnFirstEnabled: false,
                btnNextEnabled: false,
                btnLastEnabled: false,
                recordForPageEnabled: false,
                currentPageEnabled: true,
                stepInputDefault: 3,
                currentPage: 1,
                maxPage: 1,
                paginatorSkip: 0,
                paginatorClick: 0,
            });
            
            self.setModel(oAuthModel, AUTH_MODEL);
            self.setModel(oPaginatorModel, PAGINATOR_MODEL);
             
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
                // btnSend = self.getView().byId("sendButton"),
                skip = self.getModel("paginatorModel").getProperty("/paginatorSkip"),
                numRecordsForPage = self.getModel("paginatorModel").getProperty("/stepInputDefault");
                            
            oView.setBusy(true); 
            var headerObject = self.getAuthFilterBar()          
            self.getModel().metadataLoaded().then( function() {
                oDataModel.read("/" + AUTORIZZAZIONE_ENTITY_SET, {
                    urlParameters: {
                            '$top': numRecordsForPage, 
                            '$skip': skip, 
                            '$inlinecount':'allpages'
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
                self.getRouter().navTo("authDetail", {
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
        },


        onTipologiaAutorizzazioneChange:function(oEvent){
            var self = this,
                filters = [],    
                oDataModel = self.getModel(),
                key = oEvent.getParameters().selectedItem.getKey();

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
			var self = this,
				object = [],
				filters = [],
                authfEsercizio = self.getView().byId("authfEsercizio"),
                authfAmministrazione = self.getView().byId("authfAmministrazione"),  
                authfAutorizzazioneDa = self.getView().byId("authfAutorizzazioneDa"),
                authfAutorizzazioneA = self.getView().byId("authfAutorizzazioneA"),
                authfStatoAutorizzazione = self.getView().byId("authfStatoAutorizzazione"),
                authfUfficioOrdinante = self.getView().byId("authfUfficioOrdinante"),
                authfTipologiaAutorizzazione = self.getView().byId("authfTipologiaAutorizzazione"),
                authfTipologiaDisposizione = self.getView().byId("authfTipologiaDisposizione"),
                authfdataAutorizzazioneDa = self.getView().byId("authfdataAutorizzazioneDa"),
                authfdataAutorizzazioneA = self.getView().byId("authfdataAutorizzazioneA"),
                authfPosizioneFinanziariaDa = self.getView().byId("authfPosizioneFinanziariaDa"),
                authfPosizioneFinanziariaA = self.getView().byId("authfPosizioneFinanziariaA"),
                authfStruttAmmResp = self.getView().byId("authfStruttAmmResp");

                /*Fill Filters*/
                if(authfEsercizio?.getSelectedKey() && authfEsercizio.getSelectedKey() !== ""){
                    filters.push(new sap.ui.model.Filter("Gjahr",sap.ui.model.FilterOperator.EQ, authfEsercizio.getSelectedKey()));
                }
                if(authfAmministrazione?.getValue() && authfAmministrazione.getValue() !== ""){
                    filters.push(new sap.ui.model.Filter("Zzamministr",sap.ui.model.FilterOperator.EQ, authfAmministrazione.getValue()));
                }

                if(authfAutorizzazioneDa?.getValue() && authfAutorizzazioneDa.getValue() !== ""){
                    if(authfAutorizzazioneA && authfAutorizzazioneA.getValue() && authfAutorizzazioneA.getValue() !== ""){
                        filters.push(new sap.ui.model.Filter("Znumaut",sap.ui.model.FilterOperator.BT, authfAutorizzazioneDa.getValue(),authfAutorizzazioneA.getValue() ));
                    }
                    else
                        filters.push(new sap.ui.model.Filter("Znumaut",sap.ui.model.FilterOperator.EQ, authfAutorizzazioneDa.getValue()));                    
                }

                if(authfStatoAutorizzazione?.getSelectedKey() && authfStatoAutorizzazione.getSelectedKey() !== ""){
                    filters.push(new sap.ui.model.Filter("ZzstatoAut",sap.ui.model.FilterOperator.EQ, authfStatoAutorizzazione.getSelectedKey()));
                }
                // authfUfficioOrdinante //TODO:da fare
                if(authfTipologiaAutorizzazione?.getSelectedKey() && authfTipologiaAutorizzazione.getSelectedKey() !== ""){
                    filters.push(new sap.ui.model.Filter("Ztipodisp2",sap.ui.model.FilterOperator.EQ, authfTipologiaAutorizzazione.getSelectedKey()));
                }
                if(authfTipologiaDisposizione?.getSelectedKey() && authfTipologiaDisposizione.getSelectedKey() !== ""){
                    filters.push(new sap.ui.model.Filter("Ztipodisp3",sap.ui.model.FilterOperator.EQ, authfTipologiaDisposizione.getSelectedKey()));
                }

                if(authfdataAutorizzazioneDa?.getValue() && authfdataAutorizzazioneDa.getValue() !== ""){
                    if(authfdataAutorizzazioneA && authfdataAutorizzazioneA.getValue() && authfdataAutorizzazioneA.getValue() !== ""){
                        filters.push(new sap.ui.model.Filter("Zdata",sap.ui.model.FilterOperator.BT, authfdataAutorizzazioneDa.getValue(),authfdataAutorizzazioneA.getValue() ));
                    }
                    else
                        filters.push(new sap.ui.model.Filter("Zdata",sap.ui.model.FilterOperator.EQ, authfdataAutorizzazioneDa.getValue()));                    
                }

                if(authfPosizioneFinanziariaDa?.getValue() && authfPosizioneFinanziariaDa.getValue() !== ""){
                    if(authfPosizioneFinanziariaA && authfPosizioneFinanziariaA.getValue() && authfPosizioneFinanziariaA.getValue() !== ""){
                        filters.push(new sap.ui.model.Filter("Fipos",sap.ui.model.FilterOperator.BT, authfPosizioneFinanziariaDa.getValue(),authfPosizioneFinanziariaA.getValue() ));
                    }
                    else
                        filters.push(new sap.ui.model.Filter("Fipos",sap.ui.model.FilterOperator.EQ, authfPosizioneFinanziariaDa.getValue()));                    
                }
                //authfStruttAmmResp //TODO:da fare

			object.filters = filters;
			return object;
		},



    });
});