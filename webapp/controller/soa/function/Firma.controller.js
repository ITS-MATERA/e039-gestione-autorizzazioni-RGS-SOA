sap.ui.define(
  ["../BaseSoaController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"],
  function (BaseSoaController, JSONModel, MessageBox) {
    "use strict";

    return BaseSoaController.extend("rgssoa.controller.soa.function.Firma", {
      onInit: function () {
        var self = this;

        self
          .getRouter()
          .getRoute("soa.function.Firma")
          .attachPatternMatched(this._onObjectMatched, this);
      },

      onNavBack: function () {
        var self = this;

        self.getRouter().navTo("soa.list.ListSoa", {
          Reload: false,
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
          case "Firma": {
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

        //Setto i modelli
        var oModelUtility = new JSONModel({
          Function: "Firma",
          TableMode: "None",
          SelectedItem: {},
          EnableEdit: false,
          EnableAnnullamento: false,
          EnableRevocaInvioFirma: false,
          EnableFirma: true,
          EnableRevocaFirma: false,
          EnableInvioFirma: false,
          EnableRegistrazioneRichAnn: false,
          EnableCancellazioneRichAnn: false,
          DetailFromFunction: true,
          VisibleBtnStart: false,
          RemoveFunctionButtons: true,
          isLogVisible: false
        });
        self.setModel(oModelUtility, "Utility");

        //Controllo se l'utente è autorizzato
        self.getPermissionsListSoa(false, function (callback) {
          if (!callback.permissions.Firma) {
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
        self.getLogModel();
        self.setWorkflowModel(oSelectedItem);
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
          Mode: "Dettaglio",
        };

        switch (oSelectedItem?.Ztipopag) {
          case "1":
            self.getRouter().navTo("soa.detail.scenery.Scenario1", oParameters);
            break;
          case "2":
            self.getRouter().navTo("soa.detail.scenery.Scenario2", oParameters);
            break;
          case "3":
            self.getRouter().navTo("soa.detail.scenery.Scenario3", oParameters);
            break;
          case "4":
            self.getRouter().navTo("soa.detail.scenery.Scenario4", oParameters);
            break;
        }
      },

      onFirma: function () {
        var self = this;

        self.doFirma();
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

        self.setWorkflowModel(oSelectedItem);
      },
    });
  }
);
