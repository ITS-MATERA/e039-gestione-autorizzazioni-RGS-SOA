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
              oModelUtility.setProperty("/VisibleBtnStart", true);
              oModelUtility.setProperty("/TableMode", "SingleSelectLeft");
              break;
            }
            case "Annullamento": {
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

          //Setto i modelli
          var oModelUtility = new JSONModel({
            Function: "Annullamento",
            TableMode: "None",
            SelectedItem: {},
            EnableEdit: false,
            EnableAnnullamento: true,
            VisibleBtnStart: false,
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
          //TODO - Rimettere
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

        onStart: function () {
          var self = this;

          var oModelUtility = self.getModel("Utility");
          var oSelectedItem = oModelUtility.getProperty("/SelectedItem");

          self.getRouter().navTo("soa.detail.scenery.Scenario1", {
            Gjahr: oSelectedItem.Gjahr,
            Zchiavesop: oSelectedItem.Zchiavesop,
            Bukrs: oSelectedItem.Bukrs,
            Zstep: oSelectedItem.Zstep,
            Ztipososp: oSelectedItem.Ztipososp,
            DetailFromFunction: true,
          });
        },
      }
    );
  }
);
