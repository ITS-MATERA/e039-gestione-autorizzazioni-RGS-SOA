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

      hasResponseError: function (oResponse) {
        var bError = false;
        if (oResponse?.headers["sap-message"]) {
          var oMessage = this._getMessage(oResponse);

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

      _getMessage: function (oResponse) {
        return JSON.parse(oResponse.headers["sap-message"]);
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

      setModelDialog: function (sNameModel, aData, sNameDialog, oDialog) {
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

      acceptOnlyImport: function (sId) {
        var oInput = this.getView().byId(sId);
        oInput.attachBrowserEvent("keypress", function (oEvent) {
          if (oEvent.key === "." || oEvent.key === "-") {
            oEvent.preventDefault();
          }
        });
      },

      acceptOnlyNumber: function (sId) {
        var oInput = this.getView().byId(sId);
        oInput.attachBrowserEvent("keypress", function (oEvent) {
          if (isNaN(oEvent.key)) {
            oEvent.preventDefault();
          }
        });
      },

      getUfficio: function () {
        var self = this;
        var oModel = self.getModel();
        var sKey = oModel.createKey("/UserParamSet", {
          ParameterName: "/PRA/PN_DN_FUNC_AREA",
        });
        self.getView().setBusy(true);
        return new Promise(async function (resolve, reject) {
          await oModel.read(sKey, {
            success: function (data, oResponse) {
              self.getView().setBusy(false);
              if (self.hasResponseError(oResponse)) return;
              resolve(data.ParameterValue);
            },
            error: function (e) {
              self.getView().setBusy(false);
              reject(e);
            },
          });
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

      setFilterEQ: function (aFilters, sPropertyModel, sValue) {
        if (sValue) {
          aFilters.push(new Filter(sPropertyModel, EQ, sValue));
        }
      },

      setFilterBT: function (aFilters, sPropertyModel, sValueFrom, sValueTo) {
        if (sValueFrom && sValueTo) {
          aFilters.push(new Filter(sPropertyModel, BT, sValueFrom, sValueTo));
          return;
        }
        if (sValueFrom || sValueTo) {
          this.setFilterEQ(aFilters, sPropertyModel, sValueFrom);
          this.setFilterEQ(aFilters, sPropertyModel, sValueTo);
          return;
        }
      },

      /** --------------CONTROLLI AUTORIZZATIVI AUTORIZZAZIONI--------------- */
      //#region

      getAuthorityCheck: function (callback) {
        var self = this,
          oAuthModel = self
            .getOwnerComponent()
            .getModel("ZSS4_CA_CONI_VISIBILITA_SRV"),
          oModelJson = new sap.ui.model.json.JSONModel(),
          aFilters = [];
        aFilters.push(
          new sap.ui.model.Filter({
            path: "SEM_OBJ",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: "ZS4_SOA_SRV",
          })
        );
        aFilters.push(
          new sap.ui.model.Filter({
            path: "AUTH_OBJ",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: "Z_GEST_AUT",
          })
        );
        self
          .getOwnerComponent()
          .getModel("ZSS4_CA_CONI_VISIBILITA_SRV")
          .metadataLoaded()
          .then(function () {
            oAuthModel.read("/ZES_CONIAUTH_SET", {
              filters: aFilters,
              success: function (data) {
                var model = {
                  AGR_NAME: data.results[0].AGR_NAME,
                  FIKRS: data.results[0].FIKRS,
                  BUKRS: data.results[0].BUKRS,
                  PRCTR: data.results[0].PRCTR,
                  Z26Enabled: self._isIncluded(data.results, "ACTV_4", "Z26"),
                  Z01Enabled: self._isIncluded(data.results, "ACTV_1", "Z01"),
                  Z03Enabled: self._isIncluded(data.results, "ACTV_3", "Z03"),
                };
                oModelJson.setData(model);
                self.setModel(oModelJson, self.AUTHORITY_CHECK_AUTH);
                callback({ success: true, permission: model });
              },
              error: function (error) {
                var model = {
                  AGR_NAME: null,
                  FIKRS: null,
                  BUKRS: null,
                  PRCTR: null,
                  Z26Enabled: false,
                  Z01Enabled: false,
                  Z03Enabled: false,
                };
                oModelJson.setData(model);
                self.setModel(oModelJson, self.AUTHORITY_CHECK_AUTH);
                callback({ success: false, permission: model });
              },
            });
          });
      },

      _isIncluded: function (array, param, value) {
        return array.filter((x) => x[param] === value).length > 0;
      },

      //#endregion

      /** --------------------CONTROLLI AUTORIZZATIVI SOA-------------------- */
      //#region

      getPermissionsListSoa: function (bRedirect, callback) {
        var self = this;
        var oAuthModel = self.getModel("ZSS4_CA_CONI_VISIBILITA_SRV");

        var aFilters = [];

        self.setFilterEQ(aFilters, "SEM_OBJ", "ZS4_SOA_SRV");
        self.setFilterEQ(aFilters, "AUTH_OBJ", "Z_GEST_SOA");

        var oAuthoryCheck = {
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
        };

        oAuthModel.read("/ZES_CONIAUTH_SET", {
          filters: aFilters,
          success: function (data) {
            var aData = data.results;
            self._setUserPermissions(aData, oAuthoryCheck);
            callback({
              success: true,
              permissions: oAuthoryCheck,
            });
          },
          error: function (error) {
            callback({
              success: false,
              permissions: oAuthoryCheck,
            });
            if (bRedirect) {
              self.getRouter().navTo("startpage");
            }
          },
        });
      },

      _setUserPermissions: function (aData, oAuth) {
        oAuth.AgrName = aData[0].AGR_NAME;
        oAuth.Fikrs = aData[0].FIKRS;
        oAuth.Prctr = aData[0].PRCTR;
        oAuth.Gestione = this._isUserAuthorized(aData, "ACTV_4", "Z28");
        oAuth.Registra = this._isUserAuthorized(aData, "ACTV_1", "Z01");
        oAuth.Dettaglio = this._isUserAuthorized(aData, "ACTV_3", "Z03");
        oAuth.Annullamento = this._isUserAuthorized(aData, "ACTV_4", "Z07");
        oAuth.InvioFirma = this._isUserAuthorized(aData, "ACTV_4", "Z04");
        oAuth.RevocaInvioFirma = this._isUserAuthorized(aData, "ACTV_4", "Z05");
        oAuth.Firma = this._isUserAuthorized(aData, "ACTV_4", "Z06");
        oAuth.RevocaFirma = this._isUserAuthorized(aData, "ACTV_4", "Z27");
        oAuth.RegistrazioneRichAnn = this._isUserAuthorized(
          aData,
          "ACTV_4",
          "Z08"
        );
        oAuth.CancellazioneRichAnn = this._isUserAuthorized(
          aData,
          "ACTV_4",
          "Z09"
        );
      },

      setModelAuthorityCheck: function (oAuth) {
        var self = this;
        var oModel = self.getModel("AuthorityCheckSoa");

        oModel.setProperty("/AgrName", oAuth.AgrName);
        oModel.setProperty("/Fikrs", oAuth.Fikrs);
        oModel.setProperty("/Prctr", oAuth.Prctr);
        oModel.setProperty("/Gestione", oAuth.Gestione);
        oModel.setProperty("/Registra", oAuth.Registra);
        oModel.setProperty("/Dettaglio", oAuth.Dettaglio);
        oModel.setProperty("/Annullamento", oAuth.Annullamento);
        oModel.setProperty("/InvioFirma", oAuth.InvioFirma);
        oModel.setProperty("/RevocaInvioFirma", oAuth.RevocaInvioFirma);
        oModel.setProperty("/Firma", oAuth.Firma);
        oModel.setProperty("/RevocaFirma", oAuth.RevocaFirma);
        oModel.setProperty("/RegistrazioneRichAnn", oAuth.RegistrazioneRichAnn);
        oModel.setProperty("/CancellazioneRichAnn", oAuth.CancellazioneRichAnn);
      },

      _isUserAuthorized: function (array, param, value) {
        return array.filter((x) => x[param] === value).length > 0;
      },

      //#endregion
    });
  }
);
