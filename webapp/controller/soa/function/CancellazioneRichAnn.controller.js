sap.ui.define(
  ["../BaseSoaController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"],
  function (BaseSoaController, JSONModel, MessageBox) {
    "use strict";

    return BaseSoaController.extend(
      "rgssoa.controller.soa.function.CancellazioneRichAnn",
      {
        onInit: function () {
          var self = this;

          self
            .getRouter()
            .getRoute("soa.function.CancellazioneRichAnn")
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
              break;
            }
            case "CancellazioneRichAnn": {
              oModelUtility.setProperty("/VisibleBtnStart", false);
              break;
            }
            case "Workflow": {
              oModelUtility.setProperty("/VisibleBtnStart", false);
              break;
            }
          }
        },

        _onObjectMatched: function () {
          var self = this;

          //Controllo se ci sono record selezionati dalla lista
          var oModelSelectedItems = sap.ui.getCore().getModel("SelectedItems");
          if (!oModelSelectedItems) {
            self.getRouter().navTo("soa.list.ListSoa", {
              Reload: false,
            });
            return;
          }

          //Carico il workflow
          var oSelectedItem = oModelSelectedItems.getData()[0];

          //Setto i modelli
          var oModelUtility = new JSONModel({
            Function: "CancellazioneRichAnn",
            TableMode: "None",
            SelectedItem: oSelectedItem,
            EnableEdit: false,
            EnableAnnullamento: false,
            EnableRevocaInvioFirma: false,
            EnableFirma: false,
            EnableRevocaFirma: false,
            EnableInvioFirma: false,
            EnableRegistrazioneRichAnn: false,
            EnableCancellazioneRichAnn: true,
            DetailFromFunction: true,
            VisibleBtnStart: false,
          });
          self.setModel(oModelUtility, "Utility");

          //Controllo se l'utente è autorizzato
          self.getPermissionsListSoa(false, function (callback) {
            if (!callback.permissions.CancellazioneRichAnn) {
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

          //Setto il modello per la tabella
          self.setModel(oModelSelectedItems, "ListSoa");
          this._setHeaderSoa(oSelectedItem);

          self.setWorkflowInFunction(oSelectedItem);
          self.setDatiFirmatario();
        },

        _setHeaderSoa: function (oSoa) {
          var self = this;

          var oModel = self.getModel();
          var sPath = self.getModel().createKey("SOASet", {
            Gjahr: oSoa.Gjahr,
            Zchiavesop: oSoa.Zchiavesop,
            Bukrs: oSoa.Bukrs,
            Zstep: oSoa.Zstep,
            Ztipososp: oSoa.Ztipososp,
          });

          oModel.read("/" + sPath, {
            success: function (data, oResponse) {
              self.setModelCustom("Soa", data);
            },
            error: function () {},
          });
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
      }
    );
  }
);
