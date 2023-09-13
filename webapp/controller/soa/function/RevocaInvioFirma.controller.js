sap.ui.define(
  ["../BaseSoaController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"],
  function (BaseSoaController, JSONModel, MessageBox) {
    "use strict";

    return BaseSoaController.extend(
      "rgssoa.controller.soa.function.RevocaInvioFirma",
      {
        onInit: function () {
          var self = this;

          self
            .getRouter()
            .getRoute("soa.function.RevocaInvioFirma")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        onNavBack: function () {
          var self = this;

          self.getRouter().navTo("soa.list.ListSoa", {
            Reload: true,
          });
        },

        onIconTabChange: function (oEvent) {
          var self = this;
          var sKey = oEvent.getParameter("selectedKey");

          var oModelUtility = self.getModel("Utility");

          oModelUtility.setProperty("/Function", sKey);

          switch (sKey) {
            case "Dettaglio": {
              oModelUtility.setProperty("/VisibleBtnStart", true);
              oModelUtility.setProperty("/TableMode", "SingleSelectLeft");
              break;
            }
            case "RevocaInvioFirma": {
              self.clearModel("WFStateSoa");
              oModelUtility.setProperty("/SelectedItem", {});
              oModelUtility.setProperty("/VisibleBtnStart", false);
              oModelUtility.setProperty("/TableMode", "None");
              break;
            }
            case "Workflow": {
              oModelUtility.setProperty("/VisibleBtnStart", false);
              oModelUtility.setProperty("/TableMode", "SingleSelectLeft");
              break;
            }
          }
        },

        onSelectedItem: function (oEvent) {
          var self = this;
          var oListItem = oEvent.getParameter("listItem");
          var oModelListSoa = self.getModel("ListSoa");
          var oModelUtility = self.getModel("Utility");

          //Recupero l'oggetto selezionato
          var oSelectedItem = oModelListSoa.getObject(
            oListItem.getBindingContextPath()
          );

          oModelUtility.setProperty("/SelectedItem", oSelectedItem);

          self.setWorkflowInFunction(oSelectedItem);
        },

        onStart: function () {
          var self = this;

          var oModelUtility = self.getModel("Utility");
          var oSelectedItem = oModelUtility.getProperty("/SelectedItem");

          var oParameters = {
            Gjahr: oSelectedItem.Gjahr,
            Zchiavesop: oSelectedItem.Zchiavesop,
            Bukrs: oSelectedItem.Bukrs,
            Zstep: oSelectedItem.Zstep,
            Ztipososp: oSelectedItem.Ztipososp,
            DetailFromFunction: true,
          };

          switch (oSelectedItem?.Ztipopag) {
            case "1":
              self
                .getRouter()
                .navTo("soa.detail.scenery.Scenario1", oParameters);
              break;
            case "2":
              self
                .getRouter()
                .navTo("soa.detail.scenery.Scenario2", oParameters);
              break;
            case "3":
              self
                .getRouter()
                .navTo("soa.detail.scenery.Scenario3", oParameters);
              break;
            case "4":
              self
                .getRouter()
                .navTo("soa.detail.scenery.Scenario4", oParameters);
              break;
          }
        },

        _onObjectMatched: function () {
          var self = this;

          //Setto i modelli
          var oModelUtility = new JSONModel({
            Function: "RevocaInvioFirma",
            TableMode: "None",
            SelectedItem: {},
            EnableEdit: false,
            EnableAnnullamento: false,
            EnableRevocaInvioFirma: true,
            EnableFirma: false,
            EnableRevocaFirma: false,
            EnableInvioFirma: false,
            EnableRegistrazioneRichAnn: false,
            EnableCancellazioneRichAnn: false,
            VisibleBtnStart: false,
          });
          self.setModel(oModelUtility, "Utility");

          //Controllo se l'utente è autorizzato
          self.getPermissionsListSoa(false, function (callback) {
            if (!callback.permissions.RevocaInvioFirma) {
              MessageBox.error("Utente Non Autorizzato", {
                actions: [MessageBox.Action.OK],
                onClose: function () {
                  self.getRouter().navTo("soa.list.ListSoa", {
                    Reload: false,
                  });
                },
              });
            }
          });

          //Controllo se ci sono record selezionati dalla lista
          var oModelSelectedItems = sap.ui.getCore().getModel("SelectedItems");

          if (!oModelSelectedItems) {
            self.getRouter().navTo("soa.list.ListSoa", {
              Reload: false,
            });
          }

          //Setto il modello per la tabella
          self.setModel(oModelSelectedItems, "ListSoa");
          self.getLogModel();
        },

        onRevocaInvioFirma: function () {
          var self = this;
          var oModel = self.getModel();
          var oBundle = self.getResourceBundle();

          var sMessage =
            aModelListSoa.length === 1
              ? oBundle.getText("msgWarningRevocaInviaFirma")
              : oBundle.getText("msgWarningRevocaInviaFirmaMulti");

          MessageBox.warning(sMessage, {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            title: "Revoca Invio alla Firma SOA",
            onClose: function (oAction) {
              if (oAction === "OK") {
                var aModelListSoa = self.getModel("ListSoa").getData();

                var aSospesi = [];

                aModelListSoa.map((oSoa) => {
                  var oSospeso = {
                    Bukrs: oSoa.Bukrs,
                    Gjahr: oSoa.Gjahr,
                    Zchiavesop: oSoa.Zchiavesop,
                    Zstep: oSoa.Zstep,
                    Ztipososp: oSoa.Ztipososp,
                  };

                  aSospesi.push(oSospeso);
                });

                var oFunzionalitaDeep = {
                  Funzionalita: "REVOCA_INVIO_FIRMA",
                  ZuffcontFirm: "",
                  Zcodord: "",
                  ZdirigenteAmm: "",
                  Sospeso: aSospesi,
                  Messaggio: [],
                };

                oModel.create("/FunzionalitaDeepSet", oFunzionalitaDeep, {
                  success: function (result) {
                    self.printMessage(result, "Revoca Invio alla Firma SOA");
                  },
                  error: function () {},
                });
              }
            },
          });
        },
      }
    );
  }
);
