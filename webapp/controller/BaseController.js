sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
  ],
  function (
    Controller,
    UIComponent,
    mobileLibrary,
    Filter,
    FilterOperator,
    JSONModel
  ) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;
    var sDialog;

    const EQ = FilterOperator.EQ;
    const BT = FilterOperator.BT;
    const CONTAINS = FilterOperator.Contains;


    return Controller.extend("rgssoa.controller.BaseController", {
      /**
       * Convenience method for accessing the router.
       * @public
       * @returns {sap.ui.core.routing.Router} the router for this component
       */

      AUTHORITY_CHECK_AUTH: "AuthorityCheckAuth",

      getRouter: function () {
        return UIComponent.getRouterFor(this);
      },

      /**
       * Convenience method for getting the view model by name.
       * @public
       * @param {string} [sName] the model name
       * @returns {sap.ui.model.Model} the model instance
       */
      getModel: function (sName) {
        return this.getView().getModel(sName);
      },

      /**
       * Convenience method for setting the view model.
       * @public
       * @param {sap.ui.model.Model} oModel the model instance
       * @param {string} sName the model name
       * @returns {sap.ui.mvc.View} the view instance
       */
      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },

      /**
       * Getter for the resource bundle.
       * @public
       * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
       */
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },

      /**
       * Event handler when the share by E-Mail button has been clicked
       * @public
       */
      onShareEmailPress: function () {
        var oViewModel =
          this.getModel("objectView") || this.getModel("worklistView");
        URLHelper.triggerEmail(
          null,
          oViewModel.getProperty("/shareSendEmailSubject"),
          oViewModel.getProperty("/shareSendEmailMessage")
        );
      },

      setResponseMessage: function (oResponse) {
        var bError = false;
        if (oResponse?.headers["sap-message"]) {
          var oMessage = this.getMessage(oResponse);

          switch (oMessage.severity) {
            case "error":
              sap.m.MessageBox.error(oMessage.message);
              bError = true;
              break;
            case "success":
              sap.m.MessageBox.success(oMessage.message);
              break;
            case "warning":
              sap.m.MessageBox.warning(oMessage.message);
              break;
          }
        }
        return bError;
      },

      getMessage: function (oResponse) {
        return JSON.parse(oResponse.headers["sap-message"]);
      },

      printMessage: function (oMessage) {
        switch (oMessage.severity) {
          case "error":
            sap.m.MessageBox.error(oMessage.message);
            break;
          case "success":
            sap.m.MessageBox.success(oMessage.message);
            break;
          case "warning":
            sap.m.MessageBox.warning(oMessage.message);
            break;
        }
      },

      setTitleTotalItems: function (
        modelName,
        totalItemsProperties,
        tableTitle,
        tableTitleCount
      ) {
        var sTitle;
        var oModel = this.getModel(modelName);

        var iTotalItems = oModel.getProperty("/" + totalItemsProperties);

        if (iTotalItems > 0) {
          sTitle = this.getResourceBundle().getText(tableTitleCount, [
            iTotalItems,
          ]);
        } else {
          sTitle = this.getResourceBundle().getText(tableTitle);
        }
        oModel.setProperty("/" + tableTitle, sTitle);
      },

      clearModel: function (sNameModel) {
        var oModelJSON = new JSONModel({});
        this.getView().setModel(oModelJSON, sNameModel);
      },

      setModelCustom: function (sNameModel, oData) {
        var oView = this.getView();
        var oModelJson = new JSONModel();
        oModelJson.setData(oData);
        oView.setModel(oModelJson, sNameModel);
      },

      setModelSelectDialog: function (sNameModel, aData, sNameDialog, oDialog) {
        var oModelJson = new JSONModel();
        oModelJson.setData(aData.results);
        var oSelectDialog = sap.ui.getCore().byId(sNameDialog);
        oSelectDialog?.setModel(oModelJson, sNameModel);
        oDialog.open();
      },

      setBlank: function (sValue) {
        if (!sValue) {
          return "";
        }

        return sValue;
      },

      setDateClass: function (sValue) {
        if (sValue) {
          sValue = new Date(sValue);
          return sValue;
        }

        return null;
      },

      acceptOnlyImport: function (sId) {
        var oInput = this.getView().byId(sId);
        oInput.attachBrowserEvent("keypress", function (oEvent) {
          if (oEvent.key === "." || oEvent.key === "-") {
            oEvent.preventDefault();
          }
        });
      },

      /** -------------------GESTIONE VALUE HELP--------------------------- */

      _createFilterValueHelp: function (key, operator, value, useToLower) {
        return new Filter(
          useToLower ? "tolower(" + key + ")" : key,
          operator,
          useToLower ? "'" + value.toLowerCase() + "'" : value
        );
      },

      onValueHelpChange: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oSource = oEvent.getSource();

        var sFilterValueHelp = oSource.data()?.FilterValueHelp;
        var oFilter = [];
        var qFilters = [];

        if (sFilterValueHelp) {
          oFilter.push(
            this._createFilterValueHelp(
              sFilterValueHelp,
              CONTAINS,
              sValue,
              false
            )
          );
          qFilters = new Filter({ filters: oFilter, and: false });
          oSource.getBinding("items").filter(qFilters);
        }
      },

      loadFragment: function (dialogPath) {
        this.unloadFragment();

        if (!sDialog) {
          sDialog = sap.ui.xmlfragment(dialogPath, this);
          this.getView().addDependent(sDialog);
        }
        return sDialog;
      },

      unloadFragment: function () {
        if (sDialog) {
          if (sDialog.close) {
            sDialog.close();
          }
          sDialog.destroy();
          sDialog = null;
        }
      },

      /** -------------------GESTIONE FILTRI--------------------- */

      checkBTFilter: function (aFilters) {
        var oBundle = this.getResourceBundle();

        var oIntervalFilters = aFilters.filter((oFilter) => {
          if (
            oFilter?.sOperator === "BT" &&
            (!oFilter?.oValue1 || !oFilter?.oValue2)
          ) {
            return oFilter;
          }
        });

        if (oIntervalFilters.length > 0) {
          return (
            oBundle.getText("checkBTFilter") +
            " '" +
            oBundle.getText("label" + oIntervalFilters[0]?.sPath) +
            "'"
          );
        }

        return;
      },

      setFilterEQ: function (aFilters, sPropertyModel, sValue) {
        if (sValue) {
          aFilters.push(new Filter(sPropertyModel, EQ, sValue));
        }
      },

      setFilterBT: function (aFilters, sPropertyModel, sValueFrom, sValueTo) {
        if (sValueFrom || sValueTo) {
          aFilters.push(new Filter(sPropertyModel, BT, sValueFrom, sValueTo));
        }
      },

      //#region PAGINATOR

      getChangePage: function (oEvent, modelName) {
        var oPaginatorModel = this.getModel(modelName);
        var numRecordsForPage =
          oPaginatorModel.getProperty("/numRecordsForPage");
        var maxPage = oPaginatorModel.getProperty("/maxPage");
        var currentPage = oEvent.getSource().getValue();
        var bLastEnabled = true;
        var bFirstEnabled = true;

        oPaginatorModel.setProperty(
          "/paginatorSkip",
          (currentPage - 1) * numRecordsForPage
        );

        if (currentPage === maxPage) {
          bLastEnabled = false;
          bFirstEnabled = true;
        } else if (currentPage === 1) {
          bFirstEnabled = false;
          if (currentPage < maxPage) {
            bLastEnabled = true;
          }
        } else if (currentPage > maxPage) {
          bLastEnabled = false;
        }

        oPaginatorModel.setProperty("/btnLastEnabled", bLastEnabled);
        oPaginatorModel.setProperty("/btnFirstEnabled", bFirstEnabled);
      },

      getLastPaginator: function (modelName) {
        var oPaginatorModel = this.getModel(modelName);
        var numRecordsForPage =
          oPaginatorModel.getProperty("/numRecordsForPage");
        var paginatorTotalPage = oPaginatorModel.getProperty(
          "/paginatorTotalPage"
        );
        var paginatorClick = paginatorTotalPage;

        oPaginatorModel.setProperty("/btnLastEnabled", false);
        oPaginatorModel.setProperty("/btnFirstEnabled", true);

        oPaginatorModel.setProperty("/paginatorClick", paginatorClick);
        oPaginatorModel.setProperty(
          "/paginatorSkip",
          (paginatorClick - 1) * numRecordsForPage
        );
        oPaginatorModel.setProperty(
          "/currentPage",
          paginatorTotalPage === 0 ? 1 : paginatorTotalPage
        );
      },

      getFirstPaginator: function (modelName) {
        var oPaginatorModel = this.getModel(modelName);

        oPaginatorModel.setProperty("/btnLastEnabled", true);
        oPaginatorModel.setProperty("/btnFirstEnabled", false);

        oPaginatorModel.setProperty("/paginatorClick", 0);
        oPaginatorModel.setProperty("/paginatorSkip", 0);
        oPaginatorModel.setProperty("/currentPage", 1);
      },

      resetPaginator: function (oPaginatorModel) {
        oPaginatorModel.setProperty("/btnPrevEnabled", false);
        oPaginatorModel.setProperty("/btnFirstEnabled", false);
        oPaginatorModel.setProperty("/btnNextEnabled", false);
        oPaginatorModel.setProperty("/btnLastEnabled", false);
        oPaginatorModel.setProperty("/recordForPageEnabled", false);
        oPaginatorModel.setProperty("/currentPageEnabled", true);
        oPaginatorModel.setProperty("/currentPage", 1);
        oPaginatorModel.setProperty("/maxPage", 1);
        oPaginatorModel.setProperty("/paginatorClick", 0);
        oPaginatorModel.setProperty("/paginatorSkip", 0);
        oPaginatorModel.setProperty("/paginatorTotalPage", 1);
      },

      setPaginatorVisible: function (oPaginatorModel, oData) {
        if (oData?.results.length > 0) {
          oPaginatorModel.setVisible(true);
        } else {
          oPaginatorModel.setVisible(false);
        }
      },

      setPaginatorProperties: function (
        oPaginatorModel,
        oData,
        iNumRecordsForPage
      ) {
        if (oData > iNumRecordsForPage) {
          oPaginatorModel.setProperty("/btnLastEnabled", true);

          var paginatorTotalPage = oData / iNumRecordsForPage;
          var moduleN = Number.isInteger(paginatorTotalPage);

          if (!moduleN) {
            paginatorTotalPage = Math.trunc(paginatorTotalPage) + 1;
          }
          oPaginatorModel.setProperty(
            "/paginatorTotalPage",
            paginatorTotalPage
          );
          oPaginatorModel.setProperty("/maxPage", paginatorTotalPage);
        } else {
          oPaginatorModel.setProperty("/maxPage", 1);
          oPaginatorModel.setProperty("/btnLastEnabled", false);
        }
      },

      //#endregion

      /** ---------------------CONTROLLI AUTORIZZATIVI------------------------ */
      //#region

      getPermissionsList: function () {
        var self = this;
        var oAuthModel = self.getModel("ZSS4_CA_CONI_VISIBILITA_SRV");

        var aFilters = [];

        self.setFilterEQ(aFilters, "SEM_OBJ", "ZS4_SOA_SRV");
        self.setFilterEQ(aFilters, "AUTH_OBJ", "Z_GEST_SOA");

        oAuthModel.read("/ZES_CONIAUTH_SET", {
          filters: aFilters,
          success: function (data) {
            console.log(data);
          },
          error: function (error) {},
        });
      },

      getAuthorityCheck:function(callback){
        var self = this,
          oAuthModel = self.getOwnerComponent().getModel("ZSS4_CA_CONI_VISIBILITA_SRV"),
          oModelJson = new sap.ui.model.json.JSONModel(),
          aFilters = [];
        aFilters.push(new sap.ui.model.Filter({path: "SEM_OBJ", operator: sap.ui.model.FilterOperator.EQ,value1: "COSP_R3_FIORI_E039"}));
        aFilters.push(new sap.ui.model.Filter({path: "AUTH_OBJ", operator: sap.ui.model.FilterOperator.EQ,value1: "Z_GEST_AUT"}));
        self.getOwnerComponent().getModel("ZSS4_CA_CONI_VISIBILITA_SRV")
          .metadataLoaded().then(function () {
            oAuthModel.read("/ZES_CONIAUTH_SET", {
              filters: aFilters,
              success: function (data) {
                var model = {  
                    AGR_NAME: data.results[0].AGR_NAME,
                    FIKRS: data.results[0].FIKRS,
                    BUKRS: data.results[0].BUKRS,
                    PRCTR: data.results[0].PRCTR,
                    Z26Enabled: self.isIncluded(data.results, "ACTV_4", "Z26"),
                    Z01Enabled: self.isIncluded(data.results, "ACTV_1", "Z01"),
                    Z03Enabled: self.isIncluded(data.results, "ACTV_2", "Z03")                     
                }; 
                oModelJson.setData(model);
                self.setModel(oModelJson, self.AUTHORITY_CHECK_AUTH);
                callback({success:true, permission:model});
              },
              error:function(error){
                var model = {  
                  AGR_NAME: null,
                    FIKRS: null,
                    BUKRS: null,
                    PRCTR: null,
                    Z26Enabled: false,
                    Z01Enabled: false,
                    Z03Enabled: false                
                }; 
                oModelJson.setData(model);
                self.setModel(oModelJson, self.AUTHORITY_CHECK_AUTH);
                callback({success:false, permission:model});
              }
            })
          });
      },

      isIncluded: function (array, param, value) {
        return array.filter((x) => x[param] === value).length > 0;
      },


      //#endregion
    });
  }
);
