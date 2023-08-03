sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/m/MessageBox",
], function (BaseController, JSONModel, History, formatter, MessageBox) {
    "use strict";

    const AUTORIZZAZIONE_ENTITY_SET = "AutorizzazioneSet";  
    const AUTORIZZAZIONE_DETAIL_MODEL= "AutorizzazioneDetailSet";
    const AUTH_BUTTON_MODEL="AuthButtonSet";
    const AUTH_STATE_MODEL="AuthStateSet";
    const KEY_MODEL="KeyModel";
    const PAGINATOR_MODEL = "paginatorModel";

    return BaseController.extend("rgssoa.controller.AuthDetail", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            var self= this;
            var oViewModel = new JSONModel({
                    busy : true,
                    delay : 0
                });
   
            var oModelJsonKey = new JSONModel({  
                sBukrs:"",
                sGjahr:"",
                sZchiaveaut:"",
                sZstepAut:"",
            });  

            var oModelJson = new JSONModel({
                GjahrHeader:"",
                ZchiaveautHeader:"",
                ZimpautHeader:"",
                DesTipoDisp2Header:"",
                DesTipoDisp3Header:"",
                FiposHeader:"",
                FistlHeader:"",
                ZnoteautHeader:"",
                ZzamministrHeader:"",
                ZufficioContHeader:"",
                DescufficioHeader:"",

                ZzstatoAut:"",
                Zchiaveaut:"", //ID autorizzazione
                Bukrs:"",    
                Gjahr:"",
                Zimpaut:"",
                Ztipodisp2:"", //tipologia autorizzazione
                Ztipodisp3:"", //tipologia disposizione
                Znoteaut:"",
                Fipos:"",
                Fistl:"", //struttura amministrazione responsabile
                Beschr:"", //descrizione struttura amministrazione responsabile
                ZufficioCont:"",
                ZflagFipos:false, //posizione finanziaria non istituita       
                DesTipoDisp2:"",
                DesTipoDisp3:"",
                Zfunzdel:"",
                Znumprot:"",
                Zdataprot:"",
                ZufficioUcb:"",
                ZufficioRich:"",
                ZufficioIgepa:"",
                Zdescriz:""   ,  
                Descufficio:""
                });

            var oModelJsonButton = new JSONModel({
                btnRettificaAutorizzazioneEnabled:false,
                btnSaveRettificaAuthVisible:false,
                btnAnnullamentoAuthVisible:true,
                btnFirmaAuthVisible:true,
                btnRevocaFirmaAuthVisible:true
            });    

            var oModelJsonState = new JSONModel({
                isDetailVisible:true
            });    

            
            self.getView().setModel(oModelJsonKey, KEY_MODEL);   
            self.getView().setModel(oModelJson, AUTORIZZAZIONE_DETAIL_MODEL);   
            self.getView().setModel(oModelJsonButton, AUTH_BUTTON_MODEL);   
            self.getView().setModel(oModelJsonState, AUTH_STATE_MODEL);   
            
            self.getRouter().getRoute("authDetail").attachPatternMatched(this._onObjectMatched, this);
            self.setModel(oViewModel, "objectView");

            
            
        },

        onAfterRendering: function() {
            var self = this,
                authDetailTabBarControl = self.getView().byId("authDetailTabBar");
            if(authDetailTabBarControl)
                authDetailTabBarControl.setSelectedKey("detail");            
        },
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        onNavBack : function(oEvent) {
            var self =this,
                authDetailTabBarControl = self.getView().byId("authDetailTabBar");
            if(authDetailTabBarControl)
                authDetailTabBarControl.setSelectedKey("detail");
            
            self.getRouter().navTo("authPage", {}, true);            
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        // _onObjectMatched : function (oEvent) {
        //     var sObjectId =  oEvent.getParameter("arguments").objectId;
        //     this._bindView("/AutorizzazioneSet" + sObjectId);
        // },

        _onObjectMatched : function (oEvent) {
            var self = this, 
               
                sBukrs = oEvent.getParameter("arguments").Bukrs,
                sGjahr = oEvent.getParameter("arguments").Gjahr,
                sZchiaveaut = oEvent.getParameter("arguments").Zchiaveaut,
                sZstepAut = oEvent.getParameter("arguments").ZstepAut;

            self.getModel(KEY_MODEL).setProperty("/sBukrs",sBukrs),
            self.getModel(KEY_MODEL).setProperty("/sGjahr",sGjahr),
            self.getModel(KEY_MODEL).setProperty("/sZchiaveaut",sZchiaveaut),
            self.getModel(KEY_MODEL).setProperty("/sZstepAut",sZstepAut)

            self._getAutorizzazioneSet();    
        },

        _getAutorizzazioneSet:function(){
            var self = this,
                oDataModel = self.getModel();

            self.getView().setBusy(true);
            var path = self.getModel().createKey(AUTORIZZAZIONE_ENTITY_SET, {
                Bukrs: self.getModel(KEY_MODEL).getProperty("/sBukrs"),
                Gjahr: self.getModel(KEY_MODEL).getProperty("/sGjahr"),
                Zchiaveaut: self.getModel(KEY_MODEL).getProperty("/sZchiaveaut"),
                ZstepAut: self.getModel(KEY_MODEL).getProperty("/sZstepAut")
            });

            

            self.getModel().metadataLoaded().then( function() {
				oDataModel.read("/" + path, {
					success: function(data, oResponse){
                        self._loadTipologiaDisposizione(data.Ztipodisp2);
                        self.setDetailModel(data);
                        self.getView().setBusy(false);
					},
					error: function(error){
						self.getView().setBusy(false);
					}
				});
			});
        },

        onTipologiaAutorizzazioneChange:function(oEvent){
            var self = this,
                filters = [],    
                oDataModel = self.getModel(),
                key = oEvent.getParameters().selectedItem.getKey();

            if(key){
                self._loadTipologiaDisposizione(key);
            }
        },

        _loadTipologiaDisposizione:function(key){
            var self =this,
                oDataModel = self.getModel(),
                filters = [];

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
        },

        setDetailModel:function(data){
            var self = this,
                model = self.getView().getModel(AUTORIZZAZIONE_DETAIL_MODEL),
                modelButton = self.getView().getModel(AUTH_BUTTON_MODEL);
            
            modelButton.setProperty("/btnRettificaAutorizzazioneEnabled", data.ZzstatoAut === '00' ? true : false);

            model.setProperty("/GjahrHeader",data.Gjahr);
            model.setProperty("/ZchiaveautHeader",data.Zchiaveaut);
            model.setProperty("/ZimpautHeader",data.Zimpaut);
            model.setProperty("/DesTipoDisp2Header",data.DesTipoDisp2);
            model.setProperty("/DesTipoDisp3Header",data.DesTipoDisp3);
            model.setProperty("/FiposHeader",data.Fipos);
            model.setProperty("/FistlHeader",data.Fistl);
            model.setProperty("/ZnoteautHeader",data.Znoteaut);
            model.setProperty("/ZzamministrHeader", data.Zzamministr);
            model.setProperty("/ZufficioContHeader",data.ZufficioCont);
            model.setProperty("/DescufficioHeader",data.DescufficioHeader);
            
            model.setProperty("/ZzstatoAut", data.ZzstatoAut);
            model.setProperty("/Bukrs", data.Bukrs);  
            model.setProperty("/Gjahr", data.Gjahr);      
            model.setProperty("/Zchiaveaut", data.Zchiaveaut);  
            model.setProperty("/Zimpaut", data.Zimpaut);  
            model.setProperty("/Ztipodisp2", data.Ztipodisp2);  
            model.setProperty("/Ztipodisp3", data.Ztipodisp3);  
            model.setProperty("/Znoteaut", data.Znoteaut);  
            model.setProperty("/Fistl", data.Fistl);  
            model.setProperty("/Fipos", data.Fipos); 
            model.setProperty("/Beschr", data.Beschr); 
            model.setProperty("/ZflagFipos", !data.ZflagFipos || data.ZflagFipos === "" ? false : data.ZflagFipos );  
            model.setProperty("/DesTipoDisp2", data.DesTipoDisp2);  
            model.setProperty("/DesTipoDisp3", data.DesTipoDisp3);  
            model.setProperty("/Zfunzdel", data.Zfunzdel);
            model.setProperty("/Znumprot", data.Znumprot);
            model.setProperty("/Zdataprot", data.Zdataprot.toLocaleDateString()); 
            model.setProperty("/ZufficioUcb",data.ZufficioUcb);
            model.setProperty("/ZufficioRich",data.ZufficioRich);
            model.setProperty("/ZufficioIgepa",data.ZufficioIgepa);
            model.setProperty("/Zdescriz", data.Zdescriz);
            model.setProperty("/Descufficio", data.Descufficio);
            
            

        },

        onRettificaAutorizzazione:function(oEvent){
            var self = this,
                oBundle = self.getResourceBundle(),
                modelButton = self.getView().getModel(AUTH_BUTTON_MODEL),
                btnSaveRettificaState = modelButton.getProperty("/btnSaveRettificaAuthVisible");

            if(btnSaveRettificaState){
                MessageBox.information(
                    oBundle.getText("msg-authDetailOnRettificaAutorizzazione"),
                    {
                    actions: [
                    oBundle.getText("dialogYes"),
                    oBundle.getText("dialogNo"),
                    ],
                    emphasizedAction: oBundle.getText("dialogYes"),
                    onClose: function (sAction) {
                        if (sAction === oBundle.getText("dialogYes")) {
                            self._getAutorizzazioneSet();
                            modelButton.setProperty("/btnSaveRettificaAuthVisible", !btnSaveRettificaState );
                            modelButton.setProperty("/btnAnnullamentoAuthVisible", btnSaveRettificaState);
                            modelButton.setProperty("/btnFirmaAuthVisible", btnSaveRettificaState);
                            modelButton.setProperty("/btnRevocaFirmaAuthVisible", btnSaveRettificaState);
                            return;
                        }else{
                            //TODO:da canc
                            // self._getAutorizzazioneSet();
                            // modelButton.setProperty("/btnSaveRettificaAuthVisible", !btnSaveRettificaState );
                            // modelButton.setProperty("/btnAnnullamentoAuthVisible", btnSaveRettificaState);
                            // modelButton.setProperty("/btnFirmaAuthVisible", btnSaveRettificaState);
                            // modelButton.setProperty("/btnRevocaFirmaAuthVisible", btnSaveRettificaState);
                            return;
                        }
                    },
                });    
            }
            modelButton.setProperty("/btnSaveRettificaAuthVisible", !btnSaveRettificaState );
            modelButton.setProperty("/btnAnnullamentoAuthVisible", false);
            modelButton.setProperty("/btnFirmaAuthVisible", false);
            modelButton.setProperty("/btnRevocaFirmaAuthVisible", false);
        },




        onSaveRettificaAuth:function(oEvent){
            var self= this,
                oBundle = self.getResourceBundle();
            MessageBox.warning(
                oBundle.getText("msg-authDetailOnSaveRettificaAuth"),
                {
                actions: [
                oBundle.getText("dialogOk"),
                oBundle.getText("dialogCancel"),
                ],
                emphasizedAction: oBundle.getText("dialogOk"),
                onClose: function (sAction) {
                    if (sAction === oBundle.getText("dialogOk")) {
                        //TODO:fare il salvataggio della rettifica    

                        await self._saveRettifica();//TODO:da fare


                        MessageBox.success(oBundle.getText("msg-authDetailOnSaveRettificaAuthSuccess"), {
                            actions: [MessageBox.Action.CLOSE],
                            onClose: function (sAction) {
                                self.onNavBack();
                            }
                        });      
                    }
                },
            });  
        },
        
        onAnnullamentoAuth:function(oEvent){
            var self= this,
                oBundle = self.getResourceBundle();
            MessageBox.warning(
                oBundle.getText("msg-authDetailOnAnnullamentoAuth"),
                {
                actions: [
                oBundle.getText("dialogOk"),
                oBundle.getText("dialogCancel"),
                ],
                emphasizedAction: oBundle.getText("dialogOk"),
                onClose: function (sAction) {
                    if (sAction === oBundle.getText("dialogOk")) {
                        //TODO:fare l'annullamento della rettifica    
                        MessageBox.success(oBundle.getText("msg-authDetailOnAnnullamentoAuthSuccess"), {
                            actions: [MessageBox.Action.CLOSE],
                            onClose: function (sAction) {
                                self.onNavBack();
                            }
                        });      
                    }
                },
            });  
        },

        onFirmaAuth:function(oEvent){
            var self= this,
            oBundle = self.getResourceBundle();
            //TODO:fare l'a firma     
            MessageBox.success(oBundle.getText("msg-onFirmaAuthSuccess"), {
                actions: [MessageBox.Action.CLOSE],
                onClose: function (sAction) {
                    self.onNavBack();
                }
            });      
        },

        onRevocaFirmaAuth:function(oEvent){
            var self= this,
                oBundle = self.getResourceBundle();
            MessageBox.warning(
                oBundle.getText("msg-authDetailOnRevocaFirmaAuth"),
                {
                actions: [
                oBundle.getText("dialogOk"),
                oBundle.getText("dialogCancel"),
                ],
                emphasizedAction: oBundle.getText("dialogOk"),
                onClose: function (sAction) {
                    if (sAction === oBundle.getText("dialogOk")) {
                        //TODO:fare la revoca     
                        MessageBox.success(oBundle.getText("msg-authDetailOnRevocaFirmaAuthSuccess"), {
                            actions: [MessageBox.Action.CLOSE],
                            onClose: function (sAction) {
                                self.onNavBack();
                            }
                        });      
                    }
                },
            });  
        },
        
        onBack: function () {
            history.go(-1);
        },

        onAuthDetailTabBarSelect:function(oEvent){
            var self = this,
                filters = [],
                btnAnnullamentoAuth=self.getView().byId("btnAnnullamentoAuth"),
                btnFirmaAuth = self.getView().byId("btnFirmaAuth"),
                btnRevocaFirmaAuth = self.getView().byId("btnRevocaFirmaAuth"),
                modelState = self.getView().getModel(AUTH_STATE_MODEL),
                key = oEvent.getParameters().selectedKey;

            btnAnnullamentoAuth.setVisible(key === 'detail' ? true : false);   
            btnFirmaAuth.setVisible(key === 'detail' ? true : false);
            btnRevocaFirmaAuth.setVisible(key === 'detail' ? true : false);                
            modelState.setProperty("/isDetailVisible",key === 'detail' ? true : false);
            
            if(key==="workflow"){
                var oDataModel = self.getModel();
                self.getView().setBusy(true);
                filters.push(new sap.ui.model.Filter("Esercizio",sap.ui.model.FilterOperator.EQ, self.getModel(KEY_MODEL).getProperty("/sGjahr")));
                filters.push(new sap.ui.model.Filter("Zchiaveaut",sap.ui.model.FilterOperator.EQ, self.getModel(KEY_MODEL).getProperty("/sZchiaveaut")));
                filters.push(new sap.ui.model.Filter("Bukrs",sap.ui.model.FilterOperator.EQ, self.getModel(KEY_MODEL).getProperty("/sBukrs")));
                self.getModel().metadataLoaded().then( function() {
                    oDataModel.read("/WFStateAutSet", {
                        filters:filters,
                        success: function(data, oResponse){
                            var oModelJson = new sap.ui.model.json.JSONModel();
                            oModelJson.setData(data.results);
                            self.getView().setModel(oModelJson, "WFStateAutSet");  
                            self.getView().setBusy(false);
                        },
                        error: function(error){
                            self.getView().setBusy(false);
                        }
                    });
                });
            }
            
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




        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        // _bindView : function (sObjectPath) {
        //     var oViewModel = this.getModel("objectView");

        //     this.getView().bindElement({
        //         path: sObjectPath,
        //         events: {
        //             change: this._onBindingChange.bind(this),
        //             dataRequested: function () {
        //                 oViewModel.setProperty("/busy", true);
        //             },
        //             dataReceived: function () {
        //                 oViewModel.setProperty("/busy", false);
        //             }
        //         }
        //     });
        // },

        // _onBindingChange : function () {
        //     var oView = this.getView(),
        //         oViewModel = this.getModel("objectView"),
        //         oElementBinding = oView.getElementBinding();

        //     // No data for the binding
        //     if (!oElementBinding.getBoundContext()) {
        //         this.getRouter().getTargets().display("objectNotFound");
        //         return;
        //     }

        //     var oResourceBundle = this.getResourceBundle(),
        //         oObject = oView.getBindingContext().getObject(),
        //         sObjectId = oObject.Bukrs,
        //         sObjectName = oObject.AutorizzazioneSet;

        //         oViewModel.setProperty("/busy", false);
        //         oViewModel.setProperty("/shareSendEmailSubject",
        //             oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
        //         oViewModel.setProperty("/shareSendEmailMessage",
        //             oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        // }
    });

});
