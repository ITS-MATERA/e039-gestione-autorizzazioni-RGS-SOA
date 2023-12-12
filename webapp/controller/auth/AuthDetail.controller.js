sap.ui.define(
  [
    "./BaseAuthController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../../model/formatter",
    "sap/m/MessageBox",
  ],
  function (BaseController, JSONModel, History, formatter, MessageBox) {
    "use strict";

    const AUTORIZZAZIONE_ENTITY_SET = "AutorizzazioneSet";
    const AUTORIZZAZIONE_DETAIL_MODEL = "AutorizzazioneDetailSet";
    const AUTH_BUTTON_MODEL = "AuthButtonSet";
    const AUTH_STATE_MODEL = "AuthStateSet";
    const KEY_MODEL = "KeyModel";

    return BaseController.extend("rgssoa.controller.auth.AuthDetail", {
      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function () {
        var self = this;
        var oViewModel = new JSONModel({
          busy: true,
          delay: 0,
        });

        var oModelJsonKey = new JSONModel({
          sBukrs: "",
          sGjahr: "",
          sZchiaveaut: "",
          sZstepAut: "",
        });

        var oModelJson = new JSONModel({
          GjahrHeader: "",
          ZchiaveautHeader: "",
          ZimpautHeader: "",
          DesTipoDisp2Header: "",
          DesTipoDisp3Header: "",
          FiposHeader: "",
          FistlHeader: "",
          ZnoteautHeader: "",
          ZzamministrHeader: "",
          ZufficioContHeader: "",
          DescufficioHeader: "",

          ZzstatoAut: "",
          Zchiaveaut: "", //ID autorizzazione
          Bukrs: "",
          Gjahr: "",
          Zimpaut: "",
          Ztipodisp2: "", //tipologia autorizzazione
          Ztipodisp3: "", //tipologia disposizione
          Znoteaut: "",
          Fipos: "",
          Fistl: "", //struttura amministrazione responsabile
          DescrEstesa: "", //descrizione struttura amministrazione responsabile
          ZufficioCont: "",
          ZflagFipos: false, //posizione finanziaria non istituita
          DesTipoDisp2: "",
          DesTipoDisp3: "",
          Zfunzdel: "",
          Znumprot: "",
          Zdataprot: "",
          ZufficioUcb: "",
          ZufficioRich: "",
          ZufficioIgepa: "",
          Zdescriz: "",
          Descufficio: "",
          ZstepAut: "",
        });

        self.getView().setModel(oModelJsonKey, KEY_MODEL);
        self.getView().setModel(oModelJson, AUTORIZZAZIONE_DETAIL_MODEL);

        self
          .getRouter()
          .getRoute("auth.authDetail")
          .attachPatternMatched(this._onObjectMatched, this);
        self.setModel(oViewModel, "objectView");
      },

      onAfterRendering: function () {
        var self = this,
          authDetailTabBarControl = self.getView().byId("authDetailTabBar");
        if (authDetailTabBarControl)
          authDetailTabBarControl.setSelectedKey("detail");
      },

      onNavBack: function (oEvent) {
        var self = this,
          authDetailTabBarControl = self.getView().byId("authDetailTabBar");
        if (authDetailTabBarControl)
          authDetailTabBarControl.setSelectedKey("detail");

        self.getRouter().navTo("auth.authPage");
      },

      _onObjectMatched: function (oEvent) {
        var self = this,
          sBukrs = oEvent.getParameter("arguments").Bukrs,
          sGjahr = oEvent.getParameter("arguments").Gjahr,
          sZchiaveaut = oEvent.getParameter("arguments").Zchiaveaut,
          sZstepAut = oEvent.getParameter("arguments").ZstepAut;

        self.getModel(KEY_MODEL).setProperty("/sBukrs", sBukrs),
          self.getModel(KEY_MODEL).setProperty("/sGjahr", sGjahr),
          self.getModel(KEY_MODEL).setProperty("/sZchiaveaut", sZchiaveaut),
          self.getModel(KEY_MODEL).setProperty("/sZstepAut", sZstepAut);

        if (!self.getModel(self.AUTHORITY_CHECK_AUTH)) {
          self.getAuthorityCheck(function (callback) {
            if (!callback.success || !callback.permission.Z03Enabled) {
              self.getRouter().navTo("auth.authPage");
              return;
            }
          });
        }

        var oModelJsonButton = new JSONModel({
          btnRettificaAutorizzazioneEnabled: false,
          btnSaveRettificaAuthVisible: false,
          btnAnnullamentoAuthVisible: true,
          btnFirmaAuthVisible: true,
          btnRevocaFirmaAuthVisible: true,
        });
        self.getView().setModel(oModelJsonButton, AUTH_BUTTON_MODEL);

        var oModelJsonState = new JSONModel({
          isDetailVisible: true,
        });
        self.getView().setModel(oModelJsonState, AUTH_STATE_MODEL);

        self._getAutorizzazioneSet();

        var oModelUtility = {
          EnableEdit: false,
        };

        self.setModel(new JSONModel(oModelUtility), "Utility");
      },

      _getAutorizzazioneSet: function () {
        var self = this,
          oDataModel = self.getModel();

        self.getView().setBusy(true);
        var path = self.getModel().createKey(AUTORIZZAZIONE_ENTITY_SET, {
          Bukrs: self.getModel(KEY_MODEL).getProperty("/sBukrs"),
          Gjahr: self.getModel(KEY_MODEL).getProperty("/sGjahr"),
          Zchiaveaut: self.getModel(KEY_MODEL).getProperty("/sZchiaveaut"),
          ZstepAut: self.getModel(KEY_MODEL).getProperty("/sZstepAut"),
        });

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + path, {
              success: function (data, oResponse) {
                self.getTipoAutorizzazioneModel();
                self.getTipoDisposizioneModel(data.Ztipodisp2);
                self.setDetailModel(data);
                self.getView().setBusy(false);
              },
              error: function (error) {
                self.getView().setBusy(false);
              },
            });
          });
      },

      // onTipologiaAutorizzazioneChange:function(oEvent){
      //     var self = this,
      //         filters = [],
      //         oDataModel = self.getModel(),
      //         key = oEvent.getParameters().selectedItem.getKey();

      //     if(key){
      //         self._loadTipologiaDisposizione(key);
      //     }
      // },

      setPropertyComboFromChange: function (oEvent) {
        var self = this,
          value =
            oEvent.getSource().getSelectedKey() &&
              oEvent.getSource().getSelectedKey() !== ""
              ? oEvent.getSource().getSelectedKey()
              : null,
          prop = oEvent.getSource().data("propertyModel"),
          functionName = oEvent.getSource().data("propertyCallFunction");
        self
          .getView()
          .getModel(AUTORIZZAZIONE_DETAIL_MODEL)
          .setProperty("/" + prop, value);
        if (functionName && functionName !== "") {
          eval(`this.${functionName}(value)`);
        }
      },

      _clearFiposFistl: function (value) {
        var self = this;
        self
          .getView()
          .getModel(AUTORIZZAZIONE_DETAIL_MODEL)
          .setProperty("/Fipos", null);
        self
          .getView()
          .getModel(AUTORIZZAZIONE_DETAIL_MODEL)
          .setProperty("/Fistl", null);
        self
          .getView()
          .getModel(AUTORIZZAZIONE_DETAIL_MODEL)
          .setProperty("/DescrEstesa", null);
      },

      posizioneFinanziariaLiveChange: function (oEvent) {
        var self = this,
          value =
            oEvent.getParameters().value && oEvent.getParameters().value !== ""
              ? oEvent.getParameters().value
              : null,
          prop = oEvent.getSource().data("propertyModel");
        self
          .getView()
          .getModel(AUTORIZZAZIONE_DETAIL_MODEL)
          .setProperty("/" + prop, oEvent.getParameters().value);
      },

      strutturaAmministrativaLiveChange: function (oEvent) {
        var self = this,
          value =
            oEvent.getParameters().value && oEvent.getParameters().value !== ""
              ? oEvent.getParameters().value
              : null,
          prop = oEvent.getSource().data("propertyModel");
        self
          .getView()
          .getModel(AUTORIZZAZIONE_DETAIL_MODEL)
          .setProperty("/" + prop, oEvent.getParameters().value);

        if (value) {
          self.getView().setBusy(true);
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              var path = self.getModel().createKey("/DescFistlSet", {
                Fistl: value,
              });
              var oDataModel = self.getModel();
              oDataModel.read(path, {
                success: function (data) {
                  self.getView().setBusy(false);
                  self
                    .getView()
                    .getModel(AUTORIZZAZIONE_DETAIL_MODEL)
                    .setProperty(
                      "/DescrEstesa",
                      data?.DescrEstesa ? data?.DescrEstesa : null
                    );
                },
                error: function (error) {
                  oView.setBusy(false);
                  self
                    .getView()
                    .getModel(AUTORIZZAZIONE_DETAIL_MODEL)
                    .setProperty("/DescrEstesa", null);
                },
              });
            });
        } else
          self
            .getView()
            .getModel(AUTORIZZAZIONE_DETAIL_MODEL)
            .setProperty("/DescrEstesa", null);
      },

      onUfficioContabileChange: function (oEvent) {
        var self = this;
        var oModel = self.getModel();
        var oModelAutorizzazione = self.getModel(AUTORIZZAZIONE_DETAIL_MODEL);
        var oAutorizzazione = oModelAutorizzazione?.getData();

        var sCodiceUfficio = oEvent.getParameter("value");

        if (!sCodiceUfficio) {
          oModelAutorizzazione.setProperty("/ZufficioCont", null);
          oModelAutorizzazione.setProperty("/Descufficio", null);
          oModelAutorizzazione.setProperty("/Zfunzdel", null);
          oModelAutorizzazione.setProperty("/Zdescriz", null);
        }

        var sPath = oModel.createKey("/UfficioContSet", {
          Ztipodisp2: self.setBlank(oAutorizzazione.Ztipodisp2),
          Gjahr: self.setBlank(oAutorizzazione.Gjahr),
          Ztipodisp3: self.setBlank(oAutorizzazione.Ztipodisp3),
          ZufficioCont: self.setBlank(oAutorizzazione.ZufficioCont),
        });

        self.getView().setBusy(true);

        oModel.read(sPath, {
          success: function (oData, oResponse) {
            self.getView().setBusy(false);
            var oMessage = JSON.parse(oResponse.headers["sap-message"]);

            if (oMessage.code === "ZF_SOA/054") {
              sap.m.MessageBox.error(oMessage.message);
              oModelAutorizzazione.setProperty(
                "/Descufficio",
                oData.DescrEstesa
              );
              oModelAutorizzazione.setProperty("/Zfunzdel", null);
              oModelAutorizzazione.setProperty("/Zdescriz", null);
              return;
            }

            if (self.hasResponseError(oResponse)) {
              oModelAutorizzazione.setProperty("/ZufficioCont", null);
              oModelAutorizzazione.setProperty("/Descufficio", null);
              oModelAutorizzazione.setProperty("/Zfunzdel", null);
              oModelAutorizzazione.setProperty("/Zdescriz", null);
              return;
            }

            oModelAutorizzazione.setProperty("/Descufficio", oData.DescrEstesa);
            oModelAutorizzazione.setProperty("/Zfunzdel", oData.Zfunzdel);
            oModelAutorizzazione.setProperty("/Zdescriz", oData.Zdescrizbreve);
          },
          error: function () {
            self.getView().setBusy(false);
            oModelAutorizzazione.setProperty("/ZufficioCont", null);
            oModelAutorizzazione.setProperty("/Descufficio", null);
            oModelAutorizzazione.setProperty("/Zfunzdel", null);
            oModelAutorizzazione.setProperty("/Zdescriz", null);
          },
        });
      },

      setDetailModel: function (data) {
        var self = this,
          model = self.getView().getModel(AUTORIZZAZIONE_DETAIL_MODEL),
          modelButton = self.getView().getModel(AUTH_BUTTON_MODEL);

        modelButton.setProperty(
          "/btnRettificaAutorizzazioneEnabled",
          data.ZzstatoAut === "00" ? true : false
        );
        model.setProperty("/GjahrHeader", data.Gjahr);
        model.setProperty("/ZchiaveautHeader", data.Zchiaveaut);
        model.setProperty("/ZimpautHeader", data.Zimpaut);
        model.setProperty("/DesTipoDisp2Header", data.DesTipoDisp2);
        model.setProperty("/DesTipoDisp3Header", data.DesTipoDisp3);
        model.setProperty("/FiposHeader", data.Fipos);
        model.setProperty("/FistlHeader", data.Fistl);
        model.setProperty("/ZnoteautHeader", data.Znoteaut);
        model.setProperty("/ZzamministrHeader", data.Zzamministr);
        model.setProperty("/ZufficioContHeader", data.ZufficioCont);
        model.setProperty("/DescufficioHeader", data.ZufficioCont);

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
        model.setProperty("/DescrEstesa", data.DescrEstesa);
        model.setProperty(
          "/ZflagFipos",
          !data.ZflagFipos || data.ZflagFipos === "" ? false : true
        );
        model.setProperty("/DesTipoDisp2", data.DesTipoDisp2);
        model.setProperty("/DesTipoDisp3", data.DesTipoDisp3);
        model.setProperty("/Zfunzdel", data.Zfunzdel);
        model.setProperty("/Znumprot", data.Znumprot);
        model.setProperty(
          "/Zdataprot",
          data.Zdataprot /*.toLocaleDateString()*/
        );
        model.setProperty("/ZufficioUcb", data.ZufficioUcb);
        model.setProperty("/ZufficioRich", data.ZufficioRich);
        model.setProperty("/ZufficioIgepa", data.ZufficioIgepa);
        model.setProperty("/ZufficioCont", data.ZufficioCont);
        model.setProperty("/Zdescriz", data.Zdescriz);
        model.setProperty("/Descufficio", data.Descufficio);
        model.setProperty("/ZstepAut", data.ZstepAut);
        model.setProperty("/EsercizioFinanziario", data.EsercizioFinanziario);
      },

      onRettificaAutorizzazione: function (oEvent) {
        var self = this,
          oBundle = self.getResourceBundle(),
          modelButton = self.getView().getModel(AUTH_BUTTON_MODEL),
          btnSaveRettificaState = modelButton.getProperty(
            "/btnSaveRettificaAuthVisible"
          );

        var oModelUtility = self.getModel("Utility");
        oModelUtility.setProperty("/EnableEdit", true);
        oModelUtility.setProperty("/Function", "Rettifica");

        var oIconTabBar = self.getView().byId("authDetailTabBar");
        oIconTabBar.setSelectedKey("Rettifica");

        if (btnSaveRettificaState) {
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
                  modelButton.setProperty(
                    "/btnSaveRettificaAuthVisible",
                    !btnSaveRettificaState
                  );
                  modelButton.setProperty(
                    "/btnAnnullamentoAuthVisible",
                    btnSaveRettificaState
                  );
                  modelButton.setProperty(
                    "/btnFirmaAuthVisible",
                    btnSaveRettificaState
                  );
                  modelButton.setProperty(
                    "/btnRevocaFirmaAuthVisible",
                    btnSaveRettificaState
                  );
                  return;
                } else {
                  return;
                }
              },
            }
          );
        }
        modelButton.setProperty(
          "/btnSaveRettificaAuthVisible",
          !btnSaveRettificaState
        );
        modelButton.setProperty("/btnAnnullamentoAuthVisible", false);
        modelButton.setProperty("/btnFirmaAuthVisible", false);
        modelButton.setProperty("/btnRevocaFirmaAuthVisible", false);
      },

      onSaveRettificaAuth: function (oEvent) {
        var self = this,
          oBundle = self.getResourceBundle();

        var entity = self
          .getView()
          .getModel(AUTORIZZAZIONE_DETAIL_MODEL)
          .getData();
        if (
          !entity.Gjahr ||
          !entity.Zimpaut ||
          !entity.Ztipodisp2 ||
          !entity.Ztipodisp3 ||
          !entity.Fipos ||
          !entity.ZufficioCont
        ) {
          MessageBox.warning("Alimentare tutti i campi obbligatori", {
            title: "Esito Operazione",
            actions: [sap.m.MessageBox.Action.OK],
            emphasizedAction: MessageBox.Action.OK,
          });
          return false;
        }

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
                self.getView().setBusy(true);
                var key = self.getModel().createKey(AUTORIZZAZIONE_ENTITY_SET, {
                  Bukrs: self.getModel(KEY_MODEL).getProperty("/sBukrs"),
                  Gjahr: self.getModel(KEY_MODEL).getProperty("/sGjahr"),
                  Zchiaveaut: self
                    .getModel(KEY_MODEL)
                    .getProperty("/sZchiaveaut"),
                  ZstepAut: self.getModel(KEY_MODEL).getProperty("/sZstepAut"),
                });
                self._saveRettifica(
                  key,
                  self._getEntityForRettifica(
                    self
                      .getView()
                      .getModel(AUTORIZZAZIONE_DETAIL_MODEL)
                      .getData()
                  ),
                  function (callback) {
                    self.getView().setBusy(false);
                    if (callback.success) {
                      MessageBox.success(callback.message, {
                        actions: [MessageBox.Action.CLOSE],
                        onClose: function (sAction) {
                          self.onNavBack();
                          location.reload();
                        },
                      });
                    } else {
                      MessageBox.error(callback.message, {
                        actions: [MessageBox.Action.CLOSE],
                        onClose: function (sAction) {
                          // self.onNavBack();
                        },
                      });
                    }
                  }
                );
              }
            },
          }
        );
      },

      onAnnullamentoAuth: function (oEvent) {
        var self = this,
          oBundle = self.getResourceBundle();
        MessageBox.warning(
          oBundle.getText("msg-authDetailOnAnnullamentoAuth"),
          {
            title: "Annullamento Autorizzazione",
            actions: [
              oBundle.getText("dialogOk"),
              oBundle.getText("dialogCancel"),
            ],
            emphasizedAction: oBundle.getText("dialogOk"),
            onClose: function (sAction) {
              if (sAction === oBundle.getText("dialogOk")) {
                self.getView().setBusy(true);
                var key = self.getModel().createKey(AUTORIZZAZIONE_ENTITY_SET, {
                  Bukrs: self.getModel(KEY_MODEL).getProperty("/sBukrs"),
                  Gjahr: self.getModel(KEY_MODEL).getProperty("/sGjahr"),
                  Zchiaveaut: self
                    .getModel(KEY_MODEL)
                    .getProperty("/sZchiaveaut"),
                  ZstepAut: self.getModel(KEY_MODEL).getProperty("/sZstepAut"),
                });
                self._saveAnnullamento(key, function (callback) {
                  self.getView().setBusy(false);
                  if (callback.success) {
                    MessageBox.success(callback.message, {
                      title: "Annullamento Autorizzazione",
                      actions: [MessageBox.Action.CLOSE],
                      onClose: function (sAction) {
                        self.onNavBack();
                        location.reload();
                      },
                    });
                  } else {
                    MessageBox.error(callback.message, {
                      actions: [MessageBox.Action.CLOSE],
                      onClose: function (sAction) { },
                    });
                  }
                });
              }
            },
          }
        );
      },

      onFirmaAuth: function (oEvent) {
        var self = this;

        self.callDeep(
          "FIRMA",
          self.getView().getModel(AUTORIZZAZIONE_DETAIL_MODEL).getData(),
          function (callback) {
            self.getView().setBusy(false);
            if (callback.success) {
              MessageBox.success(callback.message, {
                title: "Firma Autorizzazione",
                actions: [MessageBox.Action.CLOSE],
                onClose: function (sAction) {
                  self.onNavBack();
                  location.reload();
                },
              });
            } else {
              MessageBox.error(callback.message, {
                actions: [MessageBox.Action.CLOSE],
                onClose: function (sAction) { },
              });
            }
          }
        );
      },

      onRevocaFirmaAuth: function (oEvent) {
        var self = this,
          oBundle = self.getResourceBundle();
        MessageBox.warning(oBundle.getText("msg-authDetailOnRevocaFirmaAuth"), {
          title: "Revoca Firma Autorizzazione",
          actions: [
            oBundle.getText("dialogOk"),
            oBundle.getText("dialogCancel"),
          ],
          emphasizedAction: oBundle.getText("dialogOk"),
          onClose: function (sAction) {
            if (sAction === oBundle.getText("dialogOk")) {
              self.getView().setBusy(true);
              self.callDeep(
                "REVOCA_FIRMA",
                self.getView().getModel(AUTORIZZAZIONE_DETAIL_MODEL).getData(),
                function (callback) {
                  self.getView().setBusy(false);
                  if (callback.success) {
                    MessageBox.success(callback.message, {
                      title: "Revoca Firma Autorizzazione",
                      actions: [MessageBox.Action.CLOSE],
                      onClose: function (sAction) {
                        self.onNavBack();
                        location.reload();
                      },
                    });
                  } else {
                    MessageBox.error(callback.message, {
                      actions: [MessageBox.Action.CLOSE],
                      onClose: function (sAction) { },
                    });
                  }
                }
              );
            }
          },
        });
      },

      onAuthDetailTabBarSelect: function (oEvent) {
        var self = this,
          filters = [],
          btnAnnullamentoAuth = self.getView().byId("btnAnnullamentoAuth"),
          btnFirmaAuth = self.getView().byId("btnFirmaAuth"),
          btnRevocaFirmaAuth = self.getView().byId("btnRevocaFirmaAuth"),
          modelState = self.getView().getModel(AUTH_STATE_MODEL),
          key = oEvent.getParameters().selectedKey;

        var oModelAuthButton = self.getModel("AuthButtonSet");

        switch (key) {
          case "detail": {
            self._getAutorizzazioneSet();
            oModelAuthButton.setProperty("/btnSaveRettificaAuthVisible", false);
            break;
          }
          case "Rettifica": {
            oModelAuthButton.setProperty("/btnSaveRettificaAuthVisible", true);
            break;
          }
          case "file": {
            oModelAuthButton.setProperty("/btnSaveRettificaAuthVisible", false);
          }
        }

        btnAnnullamentoAuth.setVisible(key === "detail" ? true : false);
        btnFirmaAuth.setVisible(key === "detail" ? true : false);
        btnRevocaFirmaAuth.setVisible(key === "detail" ? true : false);
        modelState.setProperty(
          "/isDetailVisible",
          key === "detail" ? true : false
        );

        if (key === "workflow") {
          var oDataModel = self.getModel();
          self.getView().setBusy(true);
          filters.push(
            new sap.ui.model.Filter(
              "Esercizio",
              sap.ui.model.FilterOperator.EQ,
              self.getModel(KEY_MODEL).getProperty("/sGjahr")
            )
          );
          filters.push(
            new sap.ui.model.Filter(
              "Zchiaveaut",
              sap.ui.model.FilterOperator.EQ,
              self.getModel(KEY_MODEL).getProperty("/sZchiaveaut")
            )
          );
          filters.push(
            new sap.ui.model.Filter(
              "Bukrs",
              sap.ui.model.FilterOperator.EQ,
              self.getModel(KEY_MODEL).getProperty("/sBukrs")
            )
          );
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/WFStateAutSet", {
                filters: filters,
                success: function (data, oResponse) {
                  var oModelJson = new sap.ui.model.json.JSONModel();
                  var res = data.results;
                  for (var i = 0; i < res.length; i++) {
                    res[i].DataStato = new Date(res[i].DataOraString);
                  }
                  oModelJson.setData(res);
                  self.getView().setModel(oModelJson, "WFStateAutSet");
                  self.getView().setBusy(false);
                },
                error: function (error) {
                  self.getView().setBusy(false);
                },
              });
            });
        }
      },

      setPropertyDatePickerFromChange: function (oEvent) {
        var self = this,
          value = oEvent.getParameters().valid
            ? oEvent.getSource().getDateValue()
            : null,
          prop = oEvent.getSource().data("propertyModel");
        self
          .getView()
          .getModel(AUTORIZZAZIONE_DETAIL_MODEL)
          .setProperty("/" + prop, value);
      },
    });
  }
);
