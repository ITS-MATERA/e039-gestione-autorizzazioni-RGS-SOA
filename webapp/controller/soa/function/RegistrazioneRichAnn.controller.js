sap.ui.define(
  ["../BaseSoaController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"],
  function (BaseSoaController, JSONModel, MessageBox) {
    "use strict";

    return BaseSoaController.extend(
      "rgssoa.controller.soa.function.RegistrazioneRichAnn",
      {
        onInit: function () {
          var self = this;

          self
            .getRouter()
            .getRoute("soa.function.RegistrazioneRichAnn")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function () {
          var self = this;

          //Setto i modelli
          var oModelUtility = new JSONModel({
            Function: "RegistrazioneRichAnn",
            TableMode: "None",
            SelectedItem: {},
            EnableEdit: false,
            EnableAnnullamento: false,
            EnableRevocaInvioFirma: false,
            EnableFirma: false,
            EnableRevocaFirma: false,
            EnableInvioFirma: false,
            EnableRegistrazioneRichAnn: true,
            EnableCancellazioneRichAnn: false,
            VisibleBtnStart: false,
          });
          self.setModel(oModelUtility, "Utility");

          //Controllo se l'utente è autorizzato
          self.getPermissionsListSoa(false, function (callback) {
            if (!callback.permissions.RegistrazioneRichAnn) {
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
              oModelUtility.setProperty("/VisibleBtnStart", true);
              oModelUtility.setProperty("/TableMode", "SingleSelectLeft");
              break;
            }
            case "RegistrazioneRichAnn": {
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

        onSelectedItem: function (oEvent) {
          var self = this;
          var oListItem = oEvent.getParameter("listItem");
          var oModel = self.getModel();
          var oModelListSoa = self.getModel("ListSoa");
          var oModelUtility = self.getModel("Utility");

          //Recupero l'oggetto selezionato
          var oSelectedItem = oModelListSoa.getObject(
            oListItem.getBindingContextPath()
          );

          oModelUtility.setProperty("/SelectedItem", oSelectedItem);

          //Carico il workflow
          var aFilters = [];
          self.setFilterEQ(aFilters, "Esercizio", oSelectedItem.Gjahr);
          self.setFilterEQ(aFilters, "Bukrs", oSelectedItem.Bukrs);
          self.setFilterEQ(aFilters, "Zchiavesop", oSelectedItem.Zchiavesop);

          oModel.read("/WFStateSoaSet", {
            filters: aFilters,
            success: function (data) {
              data.results.map((oItem) => {
                oItem.DataOraString = new Date(oItem.DataOraString);
              });

              self.setModelCustom("WFStateSoa", data.results);
            },

            error: function () {},
          });
        },
      }
    );
  }
);
