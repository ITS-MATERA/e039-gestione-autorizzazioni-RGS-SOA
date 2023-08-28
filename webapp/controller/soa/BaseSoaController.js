sap.ui.define(
  [
    "../BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "../../model/formatter",
    "sap/m/MessageBox",
  ],
  function (
    BaseController,
    Filter,
    FilterOperator,
    JSONModel,
    formatter,
    MessageBox
  ) {
    "use strict";

    return BaseController.extend("rgssoa.controller.soa.BaseSoaController", {
      formatter: formatter,
      /**
       * @override
       */
      onInit: function () {
        var self = this;

        self.acceptOnlyImport("iptImpDaOrd");
        // self.acceptOnlyImport("iptImpDaAssociare");
        // self.acceptOnlyImport("iptImpDaAssociareCpv");

        //TODO - Inserire l'acceptOnlyImport anche per CIG e CUP
      },
      //#region WIZARD 1

      //#region VALUE HELP

      onValueHelpBeneficiario: function () {
        var self = this;
        var oDataModel = self.getModel();
        self.unloadFragment();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti.Beneficiario"
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaBeneficiarioSet", {
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                self.setModelSelectDialog(
                  "Beneficiario",
                  data,
                  "sdBeneficiario",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },
      onValueHelpBeneficiarioClose: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oModelFilter = self.getModel("FilterDocumenti");

        var oSelectedItem = oEvent.getParameter("selectedItem");

        //Imposto i valori del dettaglio
        oModelSoa.setProperty(
          "/Lifnr",
          self.setBlank(oSelectedItem?.getTitle())
        );
        oModelSoa.setProperty(
          "/NameFirst",
          self.setBlank(oSelectedItem?.data("NameFirst"))
        );
        oModelSoa.setProperty(
          "/NameLast",
          self.setBlank(oSelectedItem?.data("NameLast"))
        );
        oModelSoa.setProperty(
          "/ZzragSoc",
          self.setBlank(oSelectedItem?.data("ZzragSoc"))
        );
        oModelSoa.setProperty(
          "/TaxnumCf",
          self.setBlank(oSelectedItem?.data("TaxnumCf"))
        );
        oModelSoa.setProperty(
          "/TaxnumPiva",
          self.setBlank(oSelectedItem?.data("TaxnumPiva"))
        );
        oModelSoa.setProperty(
          "/BuType",
          self.setBlank(oSelectedItem?.data("BuType"))
        );
        oModelSoa.setProperty(
          "/Taxnumxl",
          self.setBlank(oSelectedItem?.data("Taxnumxl"))
        );

        oModelFilter.setProperty(
          "/TipoBeneficiario",
          self.setBlank(oSelectedItem?.data("BuType"))
        );
        oModelFilter.setProperty(
          "/Lifnr",
          self.setBlank(oSelectedItem?.getTitle())
        );

        oModelSoa.setProperty("/DescZspecieSop", "");
        oModelSoa.setProperty("/ZspecieSop", "");
        if (oSelectedItem) {
          this._setSpecieSoaDesc("1");
        }

        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oSelectedItem?.getTitle());

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaAnnoDocBeneSet", {
              filters: aFilters,
              success: function (data, oResponse) {
                self.setModelCustom("AnnoDocBeneficiario", data?.results);
              },
              error: function (error) {},
            });
          });

        self.unloadFragment();
      },

      onValueHelpUffContabile: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti.UfficioContabile"
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaUfficioContabileSet", {
              success: function (data, oResponse) {
                self.setModelSelectDialog(
                  "UfficioContabile",
                  data,
                  "sdUfficioContabile",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },
      onValueHelpUffContabileClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelFilter = self.getModel("FilterDocumenti");
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sFkber = self.setBlank(oSelectedItem?.getTitle());

        oModelFilter.setProperty("/UfficioContabile", sFkber);

        this.unloadFragment();
      },

      onValueHelpUffPagatore: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti.UfficioPagatore"
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaUfficioPagatoreSet", {
              success: function (data, oResponse) {
                self.setModelSelectDialog(
                  "UfficioPagatore",
                  data,
                  "sdUfficioPagatore",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },
      onValueHelpUffPagatoreClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelFilter = self.getModel("FilterDocumenti");
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sFkber = self.setBlank(oSelectedItem?.getTitle());

        oModelFilter.setProperty("/UfficioPagatore", sFkber);

        this.unloadFragment();
      },

      onValueHelpNRegDocumento: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oModelFilter = self.getModel("FilterDocumenti");
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti.NRegDocumento"
        );

        var oSelectDialog = sap.ui.getCore().byId("sdNRegDocumento");
        oSelectDialog.data(
          "PropertyModel",
          oEvent.getSource().data().PropertyModel
        );

        var aFilters = [];
        var aGjahr = oModelFilter.getProperty("/AnnoRegDocumento");

        aGjahr.map((sGjahr) => {
          self.setFilterEQ(aFilters, "Gjahr", sGjahr);
        });

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaNumRegDocSet", {
              filters: aFilters,
              success: function (data, oResponse) {
                self.setModelSelectDialog(
                  "NRegDocumento",
                  data,
                  "sdNRegDocumento",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },
      onValueHelpNRegDocumentoClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelFilter = self.getModel("FilterDocumenti");
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sBelnr = self.setBlank(oSelectedItem?.getTitle());

        oModelFilter.setProperty(
          "/" + oEvent.getSource().data("PropertyModel"),
          sBelnr
        );

        this.unloadFragment();
      },

      onValueHelpNumDocBene: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oModelFilter = self.getModel("FilterDocumenti");
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti.NDocBeneficiario"
        );
        var aFilters = [];
        var aGjahr = oModelFilter.getProperty("/AnnoDocBeneficiario");

        aGjahr.map((sGjahr) => {
          self.setFilterEQ(aFilters, "Gjahr", sGjahr);
        });

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaNumDocBeneSet", {
              filters: aFilters,
              success: function (data, oResponse) {
                self.setModelSelectDialog(
                  "NDocBeneficiario",
                  data,
                  "sdNDocBeneficiario",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },
      onValueHelpNumDocBeneClose: function (oEvent) {
        var self = this;
        var oContexts = oEvent.getParameter("selectedContexts");
        var oModelFilter = self.getModel("FilterDocumenti");

        oModelFilter.setProperty("/NDocBen", []);

        if (oContexts?.length) {
          var aData = oContexts.map((oContext) => {
            return oContext.getObject()["NDocBen"];
          });

          oModelFilter.setProperty("/NDocBen", aData);
        }
        this.unloadFragment();
      },

      /** -------------SCENARIO 3------------ */
      onValueHelpNProspLiquidazione: function (oEvent) {
        var self = this;
        var oDataModel = self.getModel();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti.NProspLiquidazione"
        );

        var oSelectDialog = sap.ui.getCore().byId("sdNProspLiquidazione");
        oSelectDialog.data(
          "PropertyModel",
          oEvent.getSource().data().PropertyModel
        );
        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaNProspLiqSet", {
              success: function (data, oResponse) {
                self.setModelSelectDialog(
                  "NProspLiquidazione",
                  data,
                  "sdNProspLiquidazione",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },
      onValueHelpNProspLiquidazioneClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelFilter = self.getModel("FilterDocumenti");
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sZnumliq = self.setBlank(oSelectedItem?.getTitle());

        oModelFilter.setProperty(
          "/" + oEvent.getSource().data("PropertyModel"),
          sZnumliq
        );

        this.unloadFragment();
      },

      onValueHelpDescProspLiquidazione: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti.DescProspLiquidazione"
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaDescProspLiqSet", {
              success: function (data, oResponse) {
                self.setModelSelectDialog(
                  "DescProspLiquidazione",
                  data,
                  "sdDescProspLiquidazione",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },
      onValueHelpDescProspLiquidazioneClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelFilter = self.getModel("FilterDocumenti");
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sZdescProsp = self.setBlank(oSelectedItem?.getTitle());

        oModelFilter.setProperty("/ZdescProsp", sZdescProsp);

        this.unloadFragment();
      },

      onValueHelpUffLiquidatore: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti.UfficioLiquidatore"
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "RicercaUffLiquidatoreSet", {
              success: function (data, oResponse) {
                self.setModelSelectDialog(
                  "UfficioLiquidatore",
                  data,
                  "sdUfficioLiquidatore",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },
      onValueHelpUffLiquidatoreClose: function (oEvent) {
        var self = this;
        var oContexts = oEvent.getParameter("selectedContexts");
        var oModelFilter = self.getModel("FilterDocumenti");

        oModelFilter.setProperty("/Zuffliq", []);

        if (oContexts?.length) {
          var aData = oContexts.map((oContext) => {
            return oContext.getObject()["Zuffliq"];
          });

          oModelFilter.setProperty("/Zuffliq", aData);
        }
        this.unloadFragment();
      },

      //#endregion

      //#region SELECTION CHANGE
      onBeneficiarioChange: function (oEvent) {
        var self = this;

        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oModelFilter = self.getModel("FilterDocumenti");

        oModelSoa.setProperty("/DescZspecieSop", "");
        oModelSoa.setProperty("/ZspecieSop", "");

        if (oEvent.getParameter("value")) {
          var sPath = self.getModel().createKey("RicercaBeneficiarioSet", {
            Beneficiario: oEvent.getParameter("value"),
          });

          oModel.read("/" + sPath, {
            success: function (data, oResponse) {
              if (!self.setResponseMessage(oResponse)) {
                oModelSoa.setProperty("/Lifnr", data.Beneficiario);
                oModelSoa.setProperty("/NameFirst", data.Nome);
                oModelSoa.setProperty("/NameLast", data.Cognome);
                oModelSoa.setProperty("/ZzragSoc", data.RagSoc);
                oModelSoa.setProperty("/TaxnumCf", data.CodFisc);
                oModelSoa.setProperty("/TaxnumPiva", data.PIva);
                oModelSoa.setProperty("/BuType", data.Type);
                oModelSoa.setProperty("/Taxnumxl", data.CodFiscEst);

                oModelFilter.setProperty("/TipoBeneficiario", data.Type);
                self._setSpecieSoaDesc("1");
              }
            },
            error: function () {},
          });
        } else {
          oModelSoa.setProperty("/Lifnr", "");
          oModelSoa.setProperty("/NameFirst", "");
          oModelSoa.setProperty("/NameLast", "");
          oModelSoa.setProperty("/ZzragSoc", "");
          oModelSoa.setProperty("/TaxnumCf", "");
          oModelSoa.setProperty("/TaxnumPiva", "");
          oModelSoa.setProperty("/BuType", "");
          oModelSoa.setProperty("/Taxnumxl", "");

          oModelFilter.setProperty("/TipoBeneficiario", "");
        }

        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oEvent.getParameter("value"));

        oModel.read("/RicercaAnnoDocBeneSet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setModelCustom("AnnoDocBeneficiario", data?.results);
          },
          error: function (error) {},
        });
      },

      onRitenutaChange: function (oEvent) {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oModelFilter = self.getModel("FilterDocumenti");
        var oSelectedItem = oEvent.getParameter("selectedItem");

        var sCodRitenuta = self.setBlank(oSelectedItem?.getKey());
        var sDescRitenuta = self.setBlank(oSelectedItem?.getText());

        oModelSoa.setProperty("/Witht", sCodRitenuta);
        oModelSoa.setProperty("/Text40", sDescRitenuta);
        oModelFilter.setProperty("/DescRitenuta", sDescRitenuta);

        oModelSoa.setProperty("/ZzCebenra", "");
        oModelSoa.setProperty("/ZzDescebe", "");
        oModelFilter.setProperty("/CodEnte", "");
        oModelFilter.setProperty("/DescEnte", "");

        if (oSelectedItem) {
          this._setSpecieSoaDesc("2");
        } else {
          oModelSoa.setProperty("/DescZspecieSop", "");
          oModelSoa.setProperty("/ZspecieSop", "");
        }

        var aFilters = [];

        self.setFilterEQ(aFilters, "CodRitenuta", sCodRitenuta);

        oModel.read("/RicercaEnteBeneficiarioSet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setModelCustom("RicercaEnteBeneficiario", data?.results);
          },
        });
      },

      onEnteBeneficiarioChange: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oModelFilter = self.getModel("FilterDocumenti");
        var oSelectedItem = oEvent?.getSource()?.getSelectedItem();

        var sCodEnte = self.setBlank(oSelectedItem?.getKey());
        var sDescEnte = self.setBlank(oSelectedItem?.getText());

        oModelSoa.setProperty("/ZzCebenra", self.setBlank(sCodEnte));
        oModelSoa.setProperty("/ZzDescebe", self.setBlank(sDescEnte));
        oModelFilter.setProperty("/DescEnte", self.setBlank(sDescEnte));
      },

      //#endregion

      //#region PRIVATE METHODS

      _setSpecieSoaDesc: function (sValue) {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oParameters = {
          ZspecieSoa: sValue,
        };
        var sPath = self.getModel().createKey("SpecieSOASet", oParameters);
        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oModel.read("/" + sPath, {
              success: function (data, oResponse) {
                oModelSoa.setProperty("/DescZspecieSop", data?.ZdescSpecieSoa);
                oModelSoa.setProperty("/ZspecieSop", data?.ZspecieSoa);
              },
              error: function () {},
            });
          });
      },

      //#endregion PRIVATE METHODS

      //#endregion

      //#region WIZARD 2

      //#region VALUE HELP

      onValueHelpModPagamento: function () {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var sZzCebenra = self.setBlank(oModelSoa.getProperty("/ZzCebenra"));
        var sLifnr = self.setBlank(oModelSoa.getProperty("/Lifnr"));

        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.ModalitaPagamento"
        );
        var aFitlers = [];

        self.setFilterEQ(aFitlers, "CodEnte", sZzCebenra);
        self.setFilterEQ(aFitlers, "Lifnr", sLifnr);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "ModalitaPagamentoSet", {
              filters: aFitlers,
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                self.setModelSelectDialog(
                  "ModalitaPagamento",
                  data,
                  "sdModalitaPagamento",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpModPagamentoClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");

        var sZwels = self.setBlank(oSelectedItem?.data("Zwels"));
        var sDesczwels = self.setBlank(oSelectedItem?.getTitle());

        oModelSoa.setProperty("/Zdescwels", sDesczwels);
        oModelSoa.setProperty("/Zwels", sZwels);

        if (sZwels !== "ID6") {
          //Resetto il valore di causale valutaria
          oModelSoa.setProperty("/ZCausaleval", "");
          oModelSoa.setProperty("/ZDesccauval", "");
          //Resetto Coordinate estere e BIC
          oModelSoa.setProperty("/Swift", "");
          oModelSoa.setProperty("/Zcoordest", "");
        }

        if (sZwels !== "ID1") {
          //Resetto Tipo Firma
          oModelSoa.setProperty("/Ztipofirma", "");
        }

        this.setDatiVaglia();
        this.setInpsData();

        this.unloadFragment();
      },

      onValueHelpCausaleValutaria: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();

        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.CausaleValutaria"
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "CausaleValutariaSet", {
              success: function (data, oResponse) {
                self.setModelSelectDialog(
                  "CausaleValutaria",
                  data,
                  "sdCausaleValutaria",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCausaleValutariaClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sZDesccauval = self.setBlank(oSelectedItem?.getTitle());
        var sZCausaleval = self.setBlank(oSelectedItem?.data("ZCausaleval"));

        oModelSoa.setProperty("/ZDesccauval", sZDesccauval);
        oModelSoa.setProperty("/ZCausaleval", sZCausaleval);

        this.unloadFragment();
      },

      onValueHelpCoordEstere: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var sZwels = self.setBlank(oModelSoa?.getProperty("/Zwels"));
        var sLifnr = self.setBlank(oModelSoa?.getProperty("/Lifnr"));

        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.CoordinateEstere"
        );
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", sLifnr);
        self.setFilterEQ(aFilters, "Zwels", sZwels);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "CordEstereBenSOASet", {
              filters: aFilters,
              success: function (data, oResponse) {
                self.setModelSelectDialog(
                  "CoordinateEstere",
                  data,
                  "sdCoordEstere",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCoordEstereClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sSwift = self.setBlank(oSelectedItem?.data("Swift"));
        var sZcoordest = self.setBlank(oSelectedItem?.getTitle());

        oModelSoa.setProperty("/Zcoordest", sZcoordest);
        oModelSoa.setProperty("/Swift", sSwift);

        this.unloadFragment();
      },

      onValueHelpIban: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        if (oModelSoa.getProperty("/Iban")) {
          var oDialogMotivazione = self.loadFragment(
            "rgssoa.view.fragment.pop-up.Motivazione"
          );
          oDialogMotivazione.open();
        } else {
          //Load Models
          var oModel = self.getModel();
          var oDialog = self.loadFragment(
            "rgssoa.view.fragment.valueHelp.IbanBeneficiario"
          );
          var aFilters = [];

          if (oModelSoa?.getProperty("/Lifnr")) {
            aFilters.push(
              new Filter(
                "Lifnr",
                FilterOperator.EQ,
                oModelSoa?.getProperty("/Lifnr")
              )
            );
          }

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oModel.read("/" + "IbanBeneficiarioSOASet", {
                filters: aFilters,
                success: function (data, oResponse) {
                  self.setModelSelectDialog(
                    "IbanBeneficiario",
                    data,
                    "sdIbanBeneficiario",
                    oDialog
                  );
                },
                error: function (error) {},
              });
            });
        }
      },

      onOk: function () {
        var self = this;
        var sMotivazione = sap.ui.getCore().byId("txtMotivazione")?.getValue();
        var oDialogMotivazione = sap.ui.getCore().byId("dlgMotivazione");

        oDialogMotivazione.close();
        self.unloadFragment();

        if (sMotivazione) {
          //Load Models
          var oDataModel = self.getModel();
          var oModelSoa = self.getModel("Soa");
          var oDialog = self.loadFragment(
            "rgssoa.view.fragment.valueHelp.IbanBeneficiario"
          );
          var aFilters = [];

          if (oModelSoa?.getProperty("/Lifnr")) {
            aFilters.push(
              new Filter(
                "Lifnr",
                FilterOperator.EQ,
                oModelSoa?.getProperty("/Lifnr")
              )
            );
          }

          oModelSoa.setProperty("/Zmotivaz", sMotivazione);

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + "IbanBeneficiarioSOASet", {
                filters: aFilters,
                success: function (data, oResponse) {
                  self.setModelSelectDialog(
                    "IbanBeneficiario",
                    data,
                    "sdIbanBeneficiario",
                    oDialog
                  );
                },
                error: function (error) {},
              });
            });
        }
      },

      onClose: function () {
        var self = this;
        var oDialogMotivazione = sap.ui.getCore().byId("dlgMotivazione");
        oDialogMotivazione.close();
        self.unloadFragment();
      },

      onValueHelpIbanClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sIban = self.setBlank(oSelectedItem?.getTitle());
        var sBanks = sIban ? sIban.slice(0, 2) : "";

        oModelSoa.setProperty("/Iban", sIban);
        oModelSoa.setProperty("/Banks", sBanks);

        if (
          oModelSoa.getProperty("/Banks") === "IT" &&
          oModelSoa.getProperty("/Zwels") !== "ID6"
        ) {
          oModelSoa.setProperty("/ZCausaleval", "");
          oModelSoa.setProperty("/ZDesccauval", "");
        }

        this.unloadFragment();
      },

      onValueHelpCodiceFiscale1Close: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sCodiceFiscale = self.setBlank(oSelectedItem?.getTitle());

        this._resetCodiceFiscale1();

        if (oModelSoa.getProperty("/Zwels") === "ID1") {
          oModelSoa.setProperty("/Zstcd1", sCodiceFiscale);
        } else if (oModelSoa.getProperty("/Zwels") === "ID2") {
          oModelSoa.setProperty("/Zstcd3", sCodiceFiscale);
        }

        this.unloadFragment();
      },

      onValueHelpCodiceFiscale1: function () {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var sLifnr = self.setBlank(oModelSoa?.getProperty("/Lifnr"));
        var sTipoFirma = self.setBlank(oModelSoa?.getProperty("/Ztipofirma"));
        var sZwels = self.setBlank(oModelSoa?.getProperty("/Zwels"));

        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.CodiceFiscale1"
        );
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", sLifnr);
        self.setFilterEQ(aFilters, "TipoFirma", sTipoFirma);
        self.setFilterEQ(aFilters, "Zwels", sZwels);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "CodFiscUtilizzatoreBenSOASet", {
              filters: aFilters,
              success: function (data, oResponse) {
                self.setModelSelectDialog(
                  "CodiceFiscale1",
                  data,
                  "sdCodiceFiscale1",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCodiceFiscale2Close: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sZstcd12 = self.setBlank(oSelectedItem?.getTitle());

        this._resetCodiceFiscale2();

        oModelSoa.setProperty("/Zstcd12", sZstcd12);

        this.unloadFragment();
      },

      onValueHelpCodiceFiscale2: function () {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var sLifnr = self.setBlank(oModelSoa?.getProperty("/Lifnr"));
        var sTipoFirma = self.setBlank(oModelSoa?.getProperty("/Ztipofirma"));

        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.CodiceFiscale2"
        );
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", sLifnr);
        self.setFilterEQ(aFilters, "TipoFirma", sTipoFirma);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "CodFiscSecondoQBenSOASet", {
              filters: aFilters,
              success: function (data, oResponse) {
                self.setModelSelectDialog(
                  "CodiceFiscale2",
                  data,
                  "sdCodiceFiscale2",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCodiceTributo: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.CodiceTributo"
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "InpsSOASet", {
              success: function (data) {
                self.setModelSelectDialog(
                  "CodiceTributo",
                  data,
                  "sdCodiceTributo",
                  oDialog
                );
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCodiceTributoClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sZcodtrib = self.setBlank(oSelectedItem?.getTitle());

        oModelSoa.setProperty("/Zcodtrib", sZcodtrib);

        this.unloadFragment();
      },

      //#endregion

      //#region SELECTION CHANGE
      onPaeseResidenzaChange: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty(
          "/Banks",
          oEvent.getParameter("value")
            ? oEvent.getParameter("value").toUpperCase()
            : ""
        );
      },

      onSedeBeneficiarioChange: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oInputData = oEvent?.getSource()?.getSelectedItem()?.data();

        oModelSoa.setProperty("/Ort01", oInputData?.Ort01);
        oModelSoa.setProperty("/Regio", oInputData?.Regio);
        oModelSoa.setProperty("/Zlocpag", oInputData?.Regio);
        oModelSoa.setProperty("/Pstlz", oInputData?.Pstlz);
        oModelSoa.setProperty("/Land1", oInputData?.Land1);
      },

      //#endregion

      //#region PRIVATE METHODS

      _resetCodiceFiscale1: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty("/ZpersNomeQuiet1", "");
        oModelSoa.setProperty("/ZpersCognomeQuiet1", "");
        oModelSoa.setProperty("/Zstcd1", "");
        oModelSoa.setProperty("/ZpersNomeVaglia", "");
        oModelSoa.setProperty("/ZpersCognomeVaglia", "");
        oModelSoa.setProperty("/Zstcd13", "");
        oModelSoa.setProperty("/Zqindiriz", "");
        oModelSoa.setProperty("/Zqcitta", "");
        oModelSoa.setProperty("/Zqcap", "");
        oModelSoa.setProperty("/Zqprovincia", "");
      },

      _resetCodiceFiscale2: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty("/ZpersCognomeQuiet2", "");
        oModelSoa.setProperty("/ZpersNomeQuiet2", "");
        oModelSoa.setProperty("/Zstcd12", "");
        oModelSoa.setProperty("/Zqindiriz12", "");
        oModelSoa.setProperty("/Zqcitta12", "");
        oModelSoa.setProperty("/Zqcap12", "");
        oModelSoa.setProperty("/Zqprovincia12", "");
      },

      //#endregion

      //#region PUBLIC METHODS

      setDataBenficiario: function () {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");
        var oDataModel = self.getModel();

        var sLifnr = oModelSoa?.getProperty("/Lifnr")
          ? oModelSoa?.getProperty("/Lifnr")
          : "";
        var sZzCebenra = oModelSoa?.getProperty("/ZzCebenra")
          ? oModelSoa?.getProperty("/ZzCebenra")
          : "";
        var sZzDescebe = oModelSoa?.getProperty("/ZzDescebe")
          ? oModelSoa?.getProperty("/ZzDescebe")
          : "";

        var oParameters = {
          Beneficiario: sLifnr,
          CodEnte: sZzCebenra,
          EnteBen: sZzDescebe,
        };
        var sPath = self
          .getModel()
          .createKey("BeneficiarioSOASet", oParameters);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + sPath, {
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                oModelSoa.setProperty("/Lifnr", data?.Beneficiario);
                oModelSoa.setProperty("/NameFirst", data?.Nome);
                oModelSoa.setProperty("/NameLast", data?.Cognome);
                oModelSoa.setProperty("/ZzragSoc", data?.RagSoc);
                oModelSoa.setProperty("/TaxnumCf", data?.CodFisc);
                oModelSoa.setProperty("/Taxnumxl", data?.CodFiscEst);
                oModelSoa.setProperty("/TaxnumPiva", data?.PIva);
                oModelSoa.setProperty("/Zsede", data?.Sede);
                oModelSoa.setProperty("/Zdenominazione", data?.DescrSede);
                oModelSoa.setProperty("/ZzDescebe", data?.EnteBen);
                oModelSoa.setProperty("/Zdurc", data?.Zdurc);
                oModelSoa.setProperty("/ZfermAmm", data?.ZfermAmm);
              },
              error: function (error) {},
            });
          });
      },

      setModalitaPagamento: function () {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        if (oModelSoa?.getProperty("/Witht")) {
          var oParameters = {
            Witht: oModelSoa?.getProperty("/Witht"),
            Text40: oModelSoa?.getProperty("/Text40"),
          };

          var sPath = self
            .getModel()
            .createKey("ModalitaPagamentoSet", oParameters);

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + sPath, {
                success: function (data, oResponse) {
                  oModelSoa.setProperty("/Zwels", data?.Zwels);
                  oModelSoa.setProperty("/Zdescwels", data?.Zdescwels);
                },
                error: function () {},
              });
            });
        }
      },

      setIbanBeneficiario: function () {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var aPosizioniSoa = oModelSoa.getProperty("/data");

        var aPosizioniFormatted = aPosizioniSoa.map((oPosizioneSoa) => {
          var oPosizioneFormatted = {
            Anno: oPosizioneSoa.AnnoRegDocumento,
            NumRegDoc: oPosizioneSoa.NumRegDoc,
            TipoDoc: oPosizioneSoa.TipoDoc,
            DataDocBen: oPosizioneSoa.DataDocBen,
            NDocBen: oPosizioneSoa.NDocBen,
            DenBen: oPosizioneSoa.DenBen,
            ImpLiq: oPosizioneSoa.ImpLiq,
            ImpOrd: oPosizioneSoa.ImpOrd,
            ImpDaOrd: oPosizioneSoa.ImpDaOrd,
            Prospetto: oPosizioneSoa.NProspLiquidazione,
            RigaProsp: oPosizioneSoa.RigaProsp,
            Zresvers: oPosizioneSoa.Zresvers,
            Zresesig: oPosizioneSoa.Zresesig,
          };

          return oPosizioneFormatted;
        });

        var oParameters = {
          JSON: JSON.stringify(aPosizioniFormatted),
          CodEnte: oModelSoa?.getProperty("/ZzCebenra"),
          Lifnr: oModelSoa?.getProperty("/Lifnr"),
          DescEnte: oModelSoa?.getProperty("/ZzDescebe"),
          Witht: oModelSoa?.getProperty("/Witht"),
          Text40: oModelSoa?.getProperty("/Text40"),
          Zwels: oModelSoa?.getProperty("/Zwels"),
        };

        oDataModel.callFunction("/SingoloIbanBenSOA", {
          method: "GET",
          urlParameters: oParameters,
          success: function (data, oResponse) {
            oModelSoa.setProperty("/Iban", data?.Iban);
            oModelSoa.setProperty("/Banks", data?.Iban.slice(0, 2));
          },
          error: function (error) {},
        });
      },

      setDatiVaglia: function () {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var sLifnr = self.setBlank(oModelSoa.getProperty("/Lifnr"));
        var sZwels = self.setBlank(oModelSoa.getProperty("/Zwels"));

        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", sLifnr);
        self.setFilterEQ(aFilters, "Zwels", sZwels);

        this._resetCodiceFiscale1();
        this._resetCodiceFiscale2();

        if (
          oModelSoa.getProperty("/Zwels") === "ID1" ||
          oModelSoa.getProperty("/Zwels") === "ID2"
        ) {
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + "DatiVagliaBenSOASet", {
                filters: aFilters,
                success: function (data) {
                  var oData = data?.results[0];

                  switch (oModelSoa.getProperty("/Zwels")) {
                    case "ID1": {
                      oModelSoa.setProperty("/ZpersNomeQuiet1", oData?.Zqnome);
                      oModelSoa.setProperty(
                        "/ZpersCognomeQuiet1",
                        oData?.Zqcognome
                      );
                      oModelSoa.setProperty("/Zstcd1", oData?.Zstcd1);
                      break;
                    }
                    case "ID2": {
                      oModelSoa.setProperty("/ZpersNomeVaglia", oData?.Zqnome);
                      oModelSoa.setProperty(
                        "/ZpersCognomeVaglia",
                        oData?.Zqcognome
                      );
                      oModelSoa.setProperty("/Zstcd13", oData?.Zstcd1);
                      break;
                    }
                  }
                  oModelSoa.setProperty(
                    "/ZpersCognomeQuiet2",
                    oData?.ZpersCognomeQuiet2
                  );
                  oModelSoa.setProperty(
                    "/ZpersNomeQuiet2",
                    oData?.ZpersNomeQuiet2
                  );
                  oModelSoa.setProperty("/Zstcd12", oData?.Zstcd12);
                  oModelSoa.setProperty("/Zqindiriz", oData?.Zqindiriz);
                  oModelSoa.setProperty("/Zqcitta", oData?.Zqcitta);
                  oModelSoa.setProperty("/Zqcap", oData?.Zqcap);
                  oModelSoa.setProperty("/Zqprovincia", oData?.Zqprovincia);
                  oModelSoa.setProperty("/Zqindiriz12", oData?.Zqindiriz12);
                  oModelSoa.setProperty("/Zqcitta12", oData?.Zqcitta12);
                  oModelSoa.setProperty("/Zqcap12", oData?.Zqcap12);
                  oModelSoa.setProperty("/Zqprovincia12", oData?.Zqprovincia12);
                },
                error: function (error) {},
              });
            });
        }
      },

      getSedeBeneficiario: function () {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var sLifnr = self.setBlank(oModelSoa.getProperty("/Lifnr"));
        var sWitht = self.setBlank(oModelSoa.getProperty("/Witht"));
        var sZzCebenra = self.setBlank(oModelSoa.getProperty("/ZzCebenra"));

        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", sLifnr);
        self.setFilterEQ(aFilters, "CodRitenuta", sWitht);
        self.setFilterEQ(aFilters, "CodEnte", sZzCebenra);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "SedeBeneficiarioSOASet", {
              filters: aFilters,
              success: function (data, oResponse) {
                self.setResponseMessage(oResponse);
                self.setModelCustom("SedeBeneficiario", data?.results);
              },
              error: function (error) {},
            });
          });
      },

      setInpsData: function () {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty("/FlagInpsEditabile", false);
        oModelSoa.setProperty("/Zcodprov", "");
        oModelSoa.setProperty("/Zcfcommit", "");
        oModelSoa.setProperty("/Zcodtrib", "");
        oModelSoa.setProperty("/Zperiodrifda", "");
        oModelSoa.setProperty("/Zperiodrifa", "");
        oModelSoa.setProperty("/Zcodinps", "");
        oModelSoa.setProperty("/Zcfvers", "");
        oModelSoa.setProperty("/Zcodvers", "");

        if (oModelSoa.getProperty("/Zwels") === "ID4") {
          var oParameters = {
            Lifnr: oModelSoa.getProperty("/Lifnr"),
            Zwels: oModelSoa.getProperty("/Zwels"),
          };

          var sPath = self.getModel().createKey("InpsSOASet", oParameters);

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oModel.read("/" + sPath, {
                success: function (data) {
                  oModelSoa.setProperty(
                    "/FlagInpsEditabile",
                    data?.FlagInpsEditabile ? true : false
                  );
                  oModelSoa.setProperty("/Zcodprov", data?.Zcodprov);
                },
                error: function () {},
              });
            });
        }
      },

      //#endregion

      //#endregion

      //#region WIZARD 3

      onAddRow: function (oEvent) {
        var self = this;
        var oModelClassificazione = self.getModel("Classificazione");

        var oData = oEvent?.getSource()?.data();
        var aListClassificazione = oModelClassificazione.getProperty(
          "/" + oData?.etichetta
        );

        aListClassificazione.push({
          Zchiavesop: "",
          Bukrs: "",
          Zetichetta: "",
          Zposizione: "",
          ZstepSop: "",
          Zzcig: "",
          Zzcup: "",
          Zcpv: "",
          ZcpvDesc: "",
          Zcos: "",
          ZcosDesc: "",
          Belnr: "",
          ZimptotClass: "0.00",
          Zflagcanc: "",
          ZstatoClass: "",
          Index: aListClassificazione.length,
        });

        oModelClassificazione.setProperty(
          "/" + oData?.etichetta,
          aListClassificazione
        );
      },

      onCancelRow: function (oEvent) {
        var self = this;
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");

        var oSourceData = oEvent?.getSource()?.data();
        var oTableClassificazione = self.getView().byId(oSourceData?.table);

        var aPathSelectedItems =
          oTableClassificazione.getSelectedContextPaths();

        var aListClassificazione = oModelClassificazione.getProperty(
          "/" + oSourceData?.etichetta
        );

        //Rimuovo i record selezionati
        aPathSelectedItems.map((sPath) => {
          var oItem = oModelClassificazione.getObject(sPath);
          aListClassificazione.splice(aListClassificazione.indexOf(oItem), 1);
        });

        //Resetto l'index
        aListClassificazione.map((oItem, iIndex) => {
          oItem.Index = iIndex;
        });

        //Rimuovo i record selezionati
        oTableClassificazione.removeSelections();

        oModelClassificazione.setProperty(
          "/" + oSourceData?.etichetta,
          aListClassificazione
        );

        //Resetto l'importo totale da associare
        this._setImpTotAssociare(oSourceData?.etichetta);
      },

      //#region VALUE HELP
      onValueHelpCos: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp." + sFragmentName
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "CodiceGestionaleClassificazioneSet", {
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "Cos");
                oSelectDialog?.data("index", oSourceData.index);
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCosClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");
        var aListClassificazione = oModelClassificazione.getProperty("/Cos");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sIndex = oSource.data().index;

        if (!oSelectedItem) {
          this.unloadFragment();
          return;
        }

        aListClassificazione[sIndex].Zcos = oSelectedItem.getTitle();
        aListClassificazione[sIndex].ZcosDesc = oSelectedItem.getDescription();
        oModelClassificazione.setProperty("/Cos", aListClassificazione);

        this.unloadFragment();
      },

      onValueHelpCpv: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();

        var oSourceData = oEvent.getSource().data();
        var sFragmentName = oSourceData.fragmentName;
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp." + sFragmentName
        );

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oDataModel.read("/" + "CPVClassificazioneSet", {
              success: function (data, oResponse) {
                var oModelJson = new JSONModel();
                oModelJson.setData(data.results);
                var oSelectDialog = sap.ui.getCore().byId(dialogName);
                oSelectDialog?.setModel(oModelJson, "Cpv");
                oSelectDialog?.data("index", oSourceData.index);
                oDialog.open();
              },
              error: function (error) {},
            });
          });
      },

      onValueHelpCpvClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");
        var aListClassificazione = oModelClassificazione.getProperty("/Cpv");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var oSource = oEvent.getSource();
        var sIndex = oSource.data().index;

        if (!oSelectedItem) {
          this.unloadFragment();
          return;
        }

        aListClassificazione[sIndex].Zcpv = oSelectedItem.getTitle();
        aListClassificazione[sIndex].ZcpvDesc = oSelectedItem.getDescription();
        oModelClassificazione.setProperty("/Cpv", aListClassificazione);

        this.unloadFragment();
      },
      //#endregion

      //#region SELECTION CHANGE

      onImpDaAssociareChange: function (oEvent) {
        var self = this;
        var oSourceData = oEvent.getSource().data();
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");

        var sValue = oEvent.getParameter("value");
        var aListClassificazione = oModelClassificazione.getProperty(
          "/" + oSourceData?.etichetta
        );

        if (sValue) {
          aListClassificazione[oSourceData?.index].ZimptotClass =
            parseFloat(sValue).toFixed(2);
        } else {
          aListClassificazione[oSourceData?.index].ZimptotClass = "0.00";
        }

        oModelClassificazione.setProperty(
          "/" + oSourceData?.etichetta,
          aListClassificazione
        );

        this._setImpTotAssociare(oSourceData?.etichetta);
      },

      //#region PRIVATE METHODS
      _setImpTotAssociare: function (sEtichetta) {
        var self = this;
        //Load Models
        var oModelClassificazione = self.getModel("Classificazione");

        var aListClassificazione = oModelClassificazione.getProperty(
          "/" + sEtichetta
        );

        var iTotalImpDaAssociare = 0;
        aListClassificazione.map((oItem) => {
          iTotalImpDaAssociare += parseFloat(oItem.ZimptotClass);
        });

        oModelClassificazione.setProperty(
          "/ImpTotAssociare" + sEtichetta,
          parseFloat(iTotalImpDaAssociare).toFixed(2)
        );
      },
      //#endregion

      //#endregion

      //#region PRIVATE METHODS
      _checkClassificazione: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oModelClassificazione = self.getModel("Classificazione");
        var oBundle = self.getResourceBundle();

        var aListCos = oModelClassificazione.getProperty("/Cos");
        var aListCpv = oModelClassificazione.getProperty("/Cpv");
        var aListCig = oModelClassificazione.getProperty("/Cig");
        var aListCup = oModelClassificazione.getProperty("/Cup");

        //Controllo se sono stati inseriti i Codici Gestionali
        if (aListCos?.length === 0) {
          sap.m.MessageBox.error(oBundle.getText("msgCosRequired"));
          return false;
        }

        //Controllo se i codici sono stati inseriti
        if (this._checkCodiceClassificazione(aListCos, "Zcos")) {
          sap.m.MessageBox.error(oBundle.getText("msgNoZcos"));
          return false;
        }

        //Controllo se i codici sono stati inseriti
        if (this._checkCodiceClassificazione(aListCpv, "Zcpv")) {
          sap.m.MessageBox.error(oBundle.getText("msgNoZcpv"));
          return false;
        }

        //Controllo se i codici sono stati inseriti
        if (this._checkCodiceClassificazione(aListCig, "Zzcig")) {
          sap.m.MessageBox.error(oBundle.getText("msgNoZcig"));
          return false;
        }

        //Controllo se i codici sono stati inseriti
        if (this._checkCodiceClassificazione(aListCup, "Zzcup")) {
          sap.m.MessageBox.error(oBundle.getText("msgNoZcup"));
          return false;
        }

        //Controllo gli importi
        var aListClassificazione = this._getClassificazioneList();

        var bImpZero = false;
        aListClassificazione.map((oClassificazioe) => {
          if (oClassificazioe.ZimptotClass === "0.00") {
            bImpZero = true;
          }
        });

        if (bImpZero) {
          sap.m.MessageBox.error(oBundle.getText("msgImportiZero"));
          return false;
        }

        //Controllo il totale degli importi con l'importo associato
        var iImpAssociato = parseFloat(oModelSoa.getProperty("/Zimptot"));
        var iImpAssociatoCodiceGestione = parseFloat(
          oModelClassificazione.getProperty("/ImpTotAssociareCos")
        );
        var iImpCpv = parseFloat(
          oModelClassificazione.getProperty("/ImpTotAssociareCpv")
        );
        var iImpCig = parseFloat(
          oModelClassificazione.getProperty("/ImpTotAssociareCig")
        );
        var iImpCup = parseFloat(
          oModelClassificazione.getProperty("/ImpTotAssociareCup")
        );

        var iTotaImpAssociato =
          iImpAssociatoCodiceGestione + iImpCpv + iImpCig + iImpCup;

        if (iImpAssociato !== iTotaImpAssociato) {
          sap.m.MessageBox.error(
            oBundle.getText(
              "msgDifferentImpAssociato",
              formatter.convertFormattedNumber(
                parseFloat(iImpAssociato).toFixed(2)
              )
            )
          );
          return false;
        }

        oModelSoa.setProperty("/Classificazione", aListClassificazione);
        return true;
      },

      _getClassificazioneList: function () {
        var self = this;
        var oModelClassificazione = self.getModel("Classificazione");

        var aListCos = oModelClassificazione.getProperty("/Cos");
        var aListCpv = oModelClassificazione.getProperty("/Cpv");
        var aListCig = oModelClassificazione.getProperty("/Cig");
        var aListCup = oModelClassificazione.getProperty("/Cup");

        var aListClassificazione = [];

        aListCos.map((oCos) => {
          delete oCos.Index;
          aListClassificazione.push(oCos);
        });

        aListCpv.map((oCpv) => {
          delete oCpv.Index;
          aListClassificazione.push(oCpv);
        });

        aListCig.map((oCig) => {
          delete oCig.Index;
          aListClassificazione.push(oCig);
        });

        aListCup.map((oCup) => {
          delete oCup.Index;
          aListClassificazione.push(oCup);
        });

        return aListClassificazione;
      },

      _checkCodiceClassificazione: function (aList, sCodice) {
        var bCodiceEmpty = false;
        if (aList.length !== 0) {
          aList.map((oItem) => {
            if (!oItem[sCodice]) {
              bCodiceEmpty = true;
            }
          });
        }

        return bCodiceEmpty;
      },

      //#endregion

      //#endregion

      //#region WIZARD 4
      onSave: function () {},

      //#endregion

      /** ------------------GESTIONE ANAGRAFICA BENEFICIARIO----------------- */
      //#region

      //#region INSERISCI MODALITA PAGAMENTO

      onNewModalitaPagamento: function () {
        var self = this;

        var oFragmentNewModPag = self.loadFragment(
          "rgssoa.view.fragment.pop-up.NewModalitaPagamento"
        );
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        this._getNmpModalitaPagamento();

        oFragmentNewModPag.open();

        oModelNewAnagraficaBen.setProperty(
          "/VisibleNewModalitaPagamento",
          true
        );
        var oDialogNewModPag = sap.ui.getCore().byId("dlgNewModalitaPagamento");
        oDialogNewModPag.attachBrowserEvent("keydown", function (oEvent) {
          if (oEvent.key === "Escape") {
            oEvent.stopPropagation();
          }
        });
      },

      onBackNewModalitaPagamento: function () {
        var self = this;
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");
        var oCore = sap.ui.getCore();
        var oBundle = self.getResourceBundle();

        if (
          oModelNewAnagraficaBen.getProperty("/VisibleNewModalitaPagamento")
        ) {
          var oDialogNewModPag = oCore.byId("dlgNewModalitaPagamento");
          oDialogNewModPag.close();
          self.unloadFragment();
          this._resetNewModalitaPagamento(true);
        } else if (
          oModelNewAnagraficaBen.getProperty("/VisibleNewQuietanzante")
        ) {
          oModelNewAnagraficaBen.setProperty("/VisibleNewQuietanzante", false);
          oModelNewAnagraficaBen.setProperty(
            "/VisibleNewModalitaPagamento",
            true
          );
          oModelNewAnagraficaBen.setProperty(
            "/TitleDialogNewModPag",
            oBundle.getText("titleNewModalitaPagamento")
          );
        } else if (
          oModelNewAnagraficaBen.getProperty("/VisibleNewDestinatario")
        ) {
          oModelNewAnagraficaBen.setProperty("/VisibleNewDestinatario", false);
          oModelNewAnagraficaBen.setProperty(
            "/VisibleNewModalitaPagamento",
            true
          );
          oModelNewAnagraficaBen.setProperty(
            "/TitleDialogNewModPag",
            oBundle.getText("titleNewModalitaPagamento")
          );
        }
      },

      _getNmpModalitaPagamento: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var aFilters = [];

        if (oModelSoa.getProperty("/Lifnr")) {
          aFilters.push(
            new Filter(
              "Lifnr",
              FilterOperator.EQ,
              oModelSoa.getProperty("/Lifnr")
            )
          );

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oModel.read("/NmpModalitaPagamentoSet", {
                filters: aFilters,
                success: function (data, oResponse) {
                  self.setModelCustom("NmpModalitaPagamento", data?.results);
                },
                error: function (error) {},
              });
            });
        }
      },

      //#endregion

      //#region CREA ANAGRAFICA BENEFICIARIO
      onNewBeneficiario: function () {
        var self = this;
        //Faccio questo per impostare la ComboBox a più di 100
        var oModel = self.getModel();
        oModel.setSizeLimit(300);
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        var oFragmentNewBen = self.loadFragment(
          "rgssoa.view.fragment.pop-up.NewBeneficiario"
        );

        oFragmentNewBen.open();

        oModelNewAnagraficaBen.setProperty("/VisibleNewBeneficiario", true);

        var oDialogNewBen = sap.ui.getCore().byId("dlgNewBeneficiario");
        oDialogNewBen.attachBrowserEvent("keydown", function (oEvent) {
          if (oEvent.key === "Escape") {
            oEvent.stopPropagation();
          }
        });
      },

      onBackNewBeneficiario: function () {
        var self = this;
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");
        var oCore = sap.ui.getCore();
        var oDialogNewBen = oCore.byId("dlgNewBeneficiario");
        var oBundle = self.getResourceBundle();

        if (oModelNewAnagraficaBen.getProperty("/VisibleNewBeneficiario")) {
          oDialogNewBen.close();
          self.unloadFragment();
          this._resetNewBeneficiario();
          this._resetNewModalitaPagamento(true);
        } else if (
          oModelNewAnagraficaBen.getProperty("/VisibleNewQuietanzante")
        ) {
          oModelNewAnagraficaBen.setProperty("/VisibleNewQuietanzante", false);
          oModelNewAnagraficaBen.setProperty("/VisibleNewBeneficiario", true);
          oModelNewAnagraficaBen.setProperty(
            "/TitleDialogNewBeneficiario",
            oBundle.getText("titleNewModalitaPagamento")
          );
        } else if (
          oModelNewAnagraficaBen.getProperty("/VisibleNewDestinatario")
        ) {
          oModelNewAnagraficaBen.setProperty("/VisibleNewDestinatario", false);
          oModelNewAnagraficaBen.setProperty("/VisibleNewBeneficiario", true);
          oModelNewAnagraficaBen.setProperty(
            "/TitleDialogNewBeneficiario",
            oBundle.getText("titleNewBeneficiario")
          );
        }
      },

      onNabPaeseChange: function (oEvent) {
        var self = this;
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        var sPaese = self.setBlank(
          oEvent.getParameter("selectedItem").getKey()
        );

        oModelNewAnagraficaBen.setProperty(
          "/Beneficiario/DescPaeseResidenza",
          self.setBlank(
            oEvent?.getParameter("selectedItem")?.data("Description")
          )
        );

        this._getProvinciaList(sPaese);

        oModelNewAnagraficaBen.setProperty("/Beneficiario/SRegion", "");
        oModelNewAnagraficaBen.setProperty("/Beneficiario/DescProvincia", "");

        if (sPaese === "IT") {
          oModelNewAnagraficaBen.setProperty("/Beneficiario/SStcd3", "");
        } else {
          oModelNewAnagraficaBen.setProperty("/Beneficiario/SStcd1", "");
          oModelNewAnagraficaBen.setProperty("/Beneficiario/SStcd2", "");
        }
      },

      onCategoriaBeneficiarioChange: function (oEvent) {
        var self = this;
        var oModel = self.getModel();
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");
        var aFilters = [];

        var sStype = self.setBlank(
          oEvent?.getParameter("selectedItem")?.getKey()
        );

        switch (sStype) {
          case "1":
            oModelNewAnagraficaBen.setProperty("/Beneficiario/SRagsoc");
            break;
          case "2":
            oModelNewAnagraficaBen.setProperty("/Beneficiario/SName");
            oModelNewAnagraficaBen.setProperty("/Beneficiario/SSurname");
            break;
          default:
            oModelNewAnagraficaBen.setProperty("/Beneficiario/SRagsoc");
            oModelNewAnagraficaBen.setProperty("/Beneficiario/SName");
            oModelNewAnagraficaBen.setProperty("/Beneficiario/SSurname");
        }

        self.setFilterEQ(aFilters, "SType", sStype);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oModel.read("/NmpModalitaPagamentoSet", {
              filters: aFilters,
              success: function (data, oResponse) {
                self.setModelCustom("NabModalitaPagamento", data?.results);
              },
              error: function (error) {},
            });
          });
      },

      _getProvinciaList: function (sSCountry) {
        var self = this;
        var oModel = self.getModel();
        var aFilters = [];

        self.setFilterEQ(aFilters, "SCountry", sSCountry);

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oModel.read("/" + "NabProvinciaSet", {
              filters: aFilters,
              success: function (data, oResponse) {
                self.setModelCustom("NabProvincia", data?.results);
              },
              error: function (error) {},
            });
          });
      },

      onProvinciaChange: function (oEvent) {
        var self = this;
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        oModelNewAnagraficaBen.setProperty(
          "/Beneficiario/DescProvincia",
          self.setBlank(
            oEvent?.getParameter("selectedItem")?.data("Description")
          )
        );
      },

      _resetNewBeneficiario: function () {
        var self = this;
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        oModelNewAnagraficaBen.setProperty("/BeneficiarioCreated", false);

        var oBeneficiario = oModelNewAnagraficaBen.getProperty("/Beneficiario");

        oBeneficiario.FlagSife = true;
        oBeneficiario.Lifnr = "";
        oBeneficiario.SCountry = "";
        oBeneficiario.SType = "";
        oBeneficiario.SRagsoc = "";
        oBeneficiario.SName = "";
        oBeneficiario.SSurname = "";
        oBeneficiario.SStreet = "";
        oBeneficiario.SHousenum = "";
        oBeneficiario.SCity = "";
        oBeneficiario.SRegion = "";
        oBeneficiario.SPstlz = "";
        oBeneficiario.SSedelegale = false;
        oBeneficiario.SStcd1 = "";
        oBeneficiario.SStcd2 = "";
        oBeneficiario.SStcd3 = "";

        oBeneficiario.DescPaeseResidenza = "";
        oBeneficiario.DescProvincia = "";

        oModelNewAnagraficaBen.setProperty("/Beneficiario", oBeneficiario);
      },

      //#endregion

      //#region SAVE ANAGRAFICA BENEFICIARIO

      onSaveNewBeneficiario: function () {
        var self = this;
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");
        var bBeneficiarioCreated = oModelNewAnagraficaBen.getProperty(
          "/BeneficiarioCreated"
        );
        var oModelSoa = self.getModel("Soa");

        if (!bBeneficiarioCreated) {
          //Se il Beneficiario non è stato creato procedo con la creazione
          this.saveBeneficiario(function (callback) {
            if (callback.Success) {
              var oItem = self.setParametersNewModPagamento(callback.Lifnr);
              self.saveModalitaPagamento(oItem, "dlgNewBeneficiario");
            }
          });
        } else {
          //Se il Beneficiario è stato creato ma l'inserimento della modalità
          //di pagamento è andata in errore se premo nuovamente salva
          //salva solo la modalita di pagamento e non il beneficiario
          var oItem = self.setParametersNewModPagamento(
            oModelSoa.getProperty("/Lifnr")
          );
          self.saveModalitaPagamento(oItem, "dlgNewBeneficiario");
        }
      },

      onSaveNewModalitaPagamento: function () {
        var self = this;

        var oModelSoa = self.getModel("Soa");

        var oItem = this.setParametersNewModPagamento(
          oModelSoa.getProperty("/Lifnr")
        );

        this.saveModalitaPagamento(oItem, "dlgNewModalitaPagamento");
      },

      saveBeneficiario: function (callback) {
        var self = this;
        var oModel = self.getModel();
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        var oBeneficiario = oModelNewAnagraficaBen.getProperty("/Beneficiario");
        oBeneficiario.FlagSife = true;
        delete oBeneficiario.DescPaeseResidenza;
        delete oBeneficiario.DescProvincia;

        oModel.create("/InserisciAnagraficaBeneficiarioSet", oBeneficiario, {
          success: function (data, oResponse) {
            var oMessage = self.getMessage(oResponse);
            //Se il messaggio è di tipo "warning" signiifica che non è andato a buon fine
            //il controllo SIFE
            switch (oMessage.severity) {
              case "warning": {
                MessageBox.warning(oMessage.message, {
                  actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                  onClose: function (oAction) {
                    //Se preme OK riparte l'inserimento del beneficiario senza
                    //il controllo sul SIFE
                    if (oAction === "OK") {
                      self.saveBeneficiarioNoSife(oBeneficiario, callback);
                    }
                  },
                });
                break;
              }
              case "error": {
                //Se il messaggio è di tipo "error" finisce il flow
                self.printMessage(oMessage);
                callback({ Success: false });
                break;
              }
              case "success": {
                //Se la creazione va a buon fine setto i dati del beneficiario
                //e continuo il flow
                self._setDataBeneficiario(data);
                callback({ Lifnr: data.Lifnr, Success: true });
                break;
              }
            }
          },
          error: function (err) {
            callback({ Success: false });
          },
        });
      },

      saveModalitaPagamento: function (oItem, sDialogName) {
        var self = this;
        var oModel = self.getModel();
        var oCore = sap.ui.getCore();
        var oDialog = oCore.byId(sDialogName);

        oModel.create("/InserisciModalitaPagamentoSet", oItem, {
          success: function (data, oResponse) {
            var oMessage = self.getMessage(oResponse);
            switch (oMessage.severity) {
              case "error": {
                self.printMessage(oMessage);
                break;
              }
              case "success": {
                self.printMessage(oMessage);
                self._setModalitaPagamento(data);
                self._resetNewBeneficiario();
                self._resetNewModalitaPagamento(true);
                oDialog.close();
                self.unloadFragment();
                break;
              }
            }
          },
          error: function (err) {},
        });
      },

      saveBeneficiarioNoSife: function (oBeneficiario, callback) {
        var self = this;
        var oModel = self.getModel();
        oBeneficiario.FlagSife = false;

        oModel.create("/InserisciAnagraficaBeneficiarioSet", oBeneficiario, {
          success: function (data, oResponse) {
            var oMessage = self.getMessage(oResponse);

            switch (oMessage.severity) {
              case "error": {
                self.printMessage(oMessage);
                callback({ Success: false });
                break;
              }
              case "success": {
                self._setDataBeneficiario(data);
                callback({ Lifnr: data.Lifnr, Success: true });
                break;
              }
            }
          },
          error: function (err) {
            callback({ Success: false });
          },
        });
      },

      _setDataBeneficiario: function (oData) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        oModelNewAnagraficaBen.setProperty("/BeneficiarioCreated", true);

        oModelSoa.setProperty("/Lifnr", oData.Lifnr);
        oModelSoa.setProperty("/BuType", oData.SType);
        oModelSoa.setProperty("/TaxnumCf", oData.SStcd1);
        oModelSoa.setProperty("/TaxnumPiva", oData.SStcd2);
        oModelSoa.setProperty("/Taxnumxl", oData.SStcd3);
        oModelSoa.setProperty("/NameFirst", oData.SName);
        oModelSoa.setProperty("/NameLast", oData.SSurname);
        oModelSoa.setProperty("/ZzragSoc", oData.SRagsoc);
      },

      setParametersNewModPagamento: function (sLifnr) {
        var self = this;
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        var oModalitaPagamento =
          oModelNewAnagraficaBen.getProperty("/ModalitaPagamento");
        var oQuietanzante = oModelNewAnagraficaBen.getProperty("/Quietanzante");
        var oDestinatario = oModelNewAnagraficaBen.getProperty("/Destinatario");

        var sSType = oModalitaPagamento.SType;

        oModalitaPagamento.ValidFromDats = self.setDateClass(
          oModalitaPagamento.ValidFromDats
        );
        oModalitaPagamento.ValidToDats = self.setDateClass(
          oModalitaPagamento.ValidToDats
        );
        delete oModalitaPagamento.DescPaeseResidenza;
        delete oModalitaPagamento.ZdescConto;
        delete oModalitaPagamento.SType;

        oQuietanzante.Zqdatanasc = self.setDateClass(oQuietanzante.Zqdatanasc);
        oDestinatario.Zqdatanascdest = self.setDateClass(
          oDestinatario.Zqdatanascdest
        );

        var oItem = {
          Lifnr: sLifnr,
          SType: sSType,
          Pagamento: oModalitaPagamento,
          Quietanzante: oQuietanzante,
          DestinatarioVaglia: oDestinatario,
        };

        return oItem;
      },

      _setModalitaPagamento: function (oData) {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty("/Zwels", oData.Pagamento.SZwels);
        oModelSoa.setProperty("/Zdescwels", oData.Pagamento.Zdescwels);
        oModelSoa.setProperty("/Banks", oData.Pagamento.SCountryRes);
        oModelSoa.setProperty("/Iban", oData.Pagamento.SIban);
        oModelSoa.setProperty("/Ztipofirma", oData.Pagamento.Ztipofirma);
        oModelSoa.setProperty("/Swift", oData.Pagamento.Swift);
        oModelSoa.setProperty("/Zcoordest", oData.Pagamento.Zcoordest);

        if (oData.Quietanzante.Zqnome) {
          oModelSoa.setProperty(
            "/ZpersCognomeQuiet1",
            oData.Quietanzante.Zqcognome
          );
          oModelSoa.setProperty("/ZpersNomeQuiet1", oData.Quietanzante.Zqnome);
          oModelSoa.setProperty("/Zstcd1", oData.Quietanzante.Stcd1);
          oModelSoa.setProperty("/Zqindiriz", oData.Quietanzante.Zqindiriz);
          oModelSoa.setProperty("/Zqcitta", oData.Quietanzante.Zqcitta);
          oModelSoa.setProperty("/Zqcap", oData.Quietanzante.Zqcap);
          oModelSoa.setProperty("/Zqprovincia", oData.Quietanzante.Zqprovincia);
        }

        if (oData.DestinatarioVaglia.Zqnomedest) {
          oModelSoa.setProperty(
            "/ZpersCognomeVaglia",
            oData.DestinatarioVaglia.Zqcognomedest
          );
          oModelSoa.setProperty(
            "/ZpersNomeVaglia",
            oData.DestinatarioVaglia.Zqnomedest
          );
          oModelSoa.setProperty("/Zstcd13", oData.DestinatarioVaglia.Stcd1Dest);
          oModelSoa.setProperty(
            "/Zqindiriz",
            oData.DestinatarioVaglia.Zqindirizdest
          );
          oModelSoa.setProperty(
            "/Zqcitta",
            oData.DestinatarioVaglia.Zqcittadest
          );
          oModelSoa.setProperty("/Zqcap", oData.DestinatarioVaglia.Zqcapdest);
          oModelSoa.setProperty(
            "/Zqprovincia",
            oData.DestinatarioVaglia.Zqprovinciadest
          );
        }
      },

      //#endregion

      //#region PRIVATE METHODS
      onNewModalitaPagamentoChange: function (oEvent) {
        var self = this;
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        oModelNewAnagraficaBen.setProperty(
          "/ModalitaPagamento/SZwels",
          self.setBlank(oEvent.getParameter("selectedItem")?.getKey())
        );
        oModelNewAnagraficaBen.setProperty(
          "/ModalitaPagamento/Zdescwels",
          self.setBlank(oEvent.getParameter("selectedItem")?.getText())
        );
        oModelNewAnagraficaBen.setProperty(
          "/ModalitaPagamento/SType",
          oEvent.getParameter("selectedItem")?.data()?.SType
        );

        this._resetNewModalitaPagamento();
        this._setPrevalorizzazioneModPag();
      },
      onNmpPaeseResidenzaChange: function (oEvent) {
        this._setNmpPaeseResidenzaDesc(oEvent.getParameter("value"));
      },
      onNewQuietanzante: function () {
        var self = this;
        var oBundle = self.getResourceBundle();
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        if (oModelNewAnagraficaBen.getProperty("/VisibleNewBeneficiario")) {
          oModelNewAnagraficaBen.setProperty("/VisibleNewBeneficiario", false);

          oModelNewAnagraficaBen.setProperty(
            "/TitleDialogNewBeneficiario",
            oBundle.getText("titleNewQuietanzante")
          );
        } else {
          oModelNewAnagraficaBen.setProperty(
            "/VisibleNewModalitaPagamento",
            false
          );
          oModelNewAnagraficaBen.setProperty(
            "/TitleDialogNewModPag",
            oBundle.getText("titleNewQuietanzante")
          );
        }
        oModelNewAnagraficaBen.setProperty("/VisibleNewQuietanzante", true);
      },
      onNewDestinatario: function () {
        var self = this;
        var oBundle = self.getResourceBundle();
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        if (oModelNewAnagraficaBen.getProperty("/VisibleNewBeneficiario")) {
          oModelNewAnagraficaBen.setProperty("/VisibleNewBeneficiario", false);
          oModelNewAnagraficaBen.setProperty(
            "/TitleDialogNewBeneficiario",
            oBundle.getText("titleNewDestinatario")
          );
        } else {
          oModelNewAnagraficaBen.setProperty(
            "/VisibleNewModalitaPagamento",
            false
          );
          oModelNewAnagraficaBen.setProperty(
            "/TitleDialogNewModPag",
            oBundle.getText("titleNewDestinatario")
          );
        }
        oModelNewAnagraficaBen.setProperty("/VisibleNewDestinatario", true);
      },
      _resetNewModalitaPagamento: function (bDeleteZwels = false) {
        var self = this;
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        var oModalitaPagamento =
          oModelNewAnagraficaBen.getProperty("/ModalitaPagamento");

        if (bDeleteZwels) {
          oModalitaPagamento.SZwels = "";
          oModalitaPagamento.Zdescwels = "";
        }
        oModalitaPagamento.SCountryRes = "";
        oModalitaPagamento.SIban = "";
        oModalitaPagamento.Ztipofirma = "";
        oModalitaPagamento.Swift = "";
        oModalitaPagamento.Zcoordest = "";
        oModalitaPagamento.ValidFromDats = null;
        oModalitaPagamento.ValidToDats = null;
        oModalitaPagamento.Gjahr = "";
        oModalitaPagamento.Zcapo = "";
        oModalitaPagamento.Zcapitolo = "";
        oModalitaPagamento.Zarticolo = "";
        oModalitaPagamento.Zconto = "";
        oModalitaPagamento.ZdescConto = "";
        oModalitaPagamento.DescPaeseResidenza = "";

        oModelNewAnagraficaBen.setProperty(
          "/ModalitaPagamento",
          oModalitaPagamento
        );

        this._resetQuietanzate();
        this._resetDestinatario();
      },
      _resetQuietanzate: function () {
        var self = this;

        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        var oQuietanzante = oModelNewAnagraficaBen.getProperty("/Quietanzante");

        oQuietanzante.Zqnome = "";
        oQuietanzante.Zqcognome = "";
        oQuietanzante.Zqqualifica = "";
        oQuietanzante.Stcd1 = "";
        oQuietanzante.Zqdatanasc = null;
        oQuietanzante.Zqluogonasc = "";
        oQuietanzante.Zqprovnasc = "";
        oQuietanzante.Zqindiriz = "";
        oQuietanzante.Zqcitta = "";
        oQuietanzante.Zqcap = "";
        oQuietanzante.Zqprovincia = "";
        oQuietanzante.Zqtelefono = "";

        oModelNewAnagraficaBen.setProperty("/Quietanzante", oQuietanzante);
      },
      _resetDestinatario: function () {
        var self = this;

        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        var oDestinatario = oModelNewAnagraficaBen.getProperty("/Destinatario");

        oDestinatario.Zqnomedest = "";
        oDestinatario.Zqcognomedest = "";
        oDestinatario.Zqqualificadest = "";
        oDestinatario.Stcd1Dest = "";
        oDestinatario.Zqdatanascdest = null;
        oDestinatario.Zqluogonascdest = "";
        oDestinatario.Zqprovnascdest = "";
        oDestinatario.Zqindirizdest = "";
        oDestinatario.Zqcittadest = "";
        oDestinatario.Zqcapdest = "";
        oDestinatario.Zqprovinciadest = "";
        oDestinatario.Zqtelefonodest = "";

        oModelNewAnagraficaBen.setProperty("/Destinatario", oDestinatario);
      },
      _setPrevalorizzazioneModPag: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        if (oModelNewAnagraficaBen.getProperty("/ModalitaPagamento/SZwels")) {
          var sPath = self.getModel().createKey("/NmpPrevalorizzazioneSet", {
            SZwels: oModelNewAnagraficaBen.getProperty(
              "/ModalitaPagamento/SZwels"
            ),
          });

          oModel.read(sPath, {
            success: function (data, oResponse) {
              oModelNewAnagraficaBen.setProperty(
                "/ModalitaPagamento/SCountryRes",
                data.SCountryRes
              );
              oModelNewAnagraficaBen.setProperty(
                "/ModalitaPagamento/DescPaeseResidenza",
                data.SCountryResDesc
              );
              oModelNewAnagraficaBen.setProperty(
                "/ModalitaPagamento/ValidFromDats",
                data.ValidFromDats
              );
              oModelNewAnagraficaBen.setProperty(
                "/ModalitaPagamento/ValidToDats",
                data.ValidToDats
              );
            },
            error: function (error) {},
            async: false,
          });
        }
      },
      _setNmpPaeseResidenzaDesc: function (sPaeseResidenza) {
        var self = this;
        var oModelNewAnagraficaBen = self.getModel("NewAnagraficaBen");

        var oModel = self.getModel();

        var sPath = self.getModel().createKey("NmpPaeseResidenzaDescSet", {
          SCountryRes: sPaeseResidenza,
        });

        self
          .getModel()
          .metadataLoaded()
          .then(function () {
            oModel.read("/" + sPath, {
              success: function (data, oResponse) {
                oModelNewAnagraficaBen.setProperty(
                  "/ModalitaPagamento/DescPaeseResidenza",
                  data?.Descrizione
                );
              },
              error: function () {},
              async: false,
            });
          });
      },

      //#endregion

      //#endregion

      /** ---------------------------DETTAGLIO------------------------------- */
      //#region
      setInpsEditable: function () {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        if (oModelSoa.getProperty("/Zwels") === "ID4") {
          var oParameters = {
            Lifnr: oModelSoa.getProperty("/Lifnr"),
            Zwels: oModelSoa.getProperty("/Zwels"),
          };

          var sPath = self.getModel().createKey("InpsSOASet", oParameters);

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oModel.read("/" + sPath, {
                success: function (data) {
                  oModelSoa.setProperty(
                    "/FlagInpsEditabile",
                    data?.FlagInpsEditabile ? true : false
                  );
                },
                error: function () {},
              });
            });
        }
      },
      //#endregion
    });
  }
);
