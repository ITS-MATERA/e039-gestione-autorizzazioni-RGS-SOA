sap.ui.define(
  ["../BaseSoaController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"],
  function (BaseSoaController, JSONModel, MessageBox) {
    "use strict";

    return BaseSoaController.extend(
      "rgssoa.controller.soa.function.Annullamento",
      {
        onInit: function () {
          var self = this;

          var oModelAuthoryCheckSoa = new JSONModel({
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
          });
          self.setModel(oModelAuthoryCheckSoa, "AuthorityCheckSoa");

          self
            .getRouter()
            .getRoute("soa.function.Annullamento")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        onNavBack: function () {
          var self = this;

          self.getRouter().navTo("soa.list.ListSoa");
        },

        onIconTabChange: function (oEvent) {
          var self = this;
          var sKey = oEvent.getParameter("selectedKey");

          var oModelUtility = self.getModel("Utility");

          oModelUtility.setProperty("/Function", sKey);

          switch (sKey) {
            case "Dettaglio": {
              oModelUtility.setProperty("/TableMode", "SingleSelectLeft");
              break;
            }
            case "Annullamento": {
              oModelUtility.setProperty("/TableMode", "None");
              break;
            }
            case "Workflow": {
              break;
            }
          }
        },

        _onObjectMatched: function () {
          var self = this;

          //Setto i modelli
          var oModelUtility = new JSONModel({
            Function: "Annullamento",
            TableMode: "None",
            EnableEdit: false,
            EnableAnnullamento: true,
          });
          self.setModel(oModelUtility, "Utility");

          //Controllo se l'utente è autorizzato
          self.getPermissionsListSoa(false, function (callback) {
            if (!callback.permission.Annullamento) {
              MessageBox.error("Utente Non Autorizzato", {
                actions: [MessageBox.Action.OK],
                onClose: function () {
                  self.getRouter().navTo("soa.list.ListSoa");
                },
              });
            }
          });

          //Controllo se ci sono record selezionati dalla lista
          var oModelSelectedItems = sap.ui.getCore().getModel("SelectedItems");

          if (!oModelSelectedItems) {
            self.getRouter().navTo("soa.list.ListSoa");
          }

          //Setto il modello per la tabella
          self.setModel(oModelSelectedItems, "ListSoa");
        },
      }
    );
  }
);
