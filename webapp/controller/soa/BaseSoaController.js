sap.ui.define(
  [
    "../BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "../../model/formatter",
    "sap/m/MessageBox",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
  ],
  function (
    BaseController,
    Filter,
    FilterOperator,
    JSONModel,
    formatter,
    MessageBox,
    Spreadsheet,
    exportLibrary
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
        self.acceptOnlyImport("iptAddImpDaOrd");
        self.acceptOnlyImport("iptImpDaAssociare");
        self.acceptOnlyImport("iptImpDaAssociareCpv");
        self.acceptOnlyImport("iptImpDaAssociareCig");
        self.acceptOnlyImport("iptImpDaAssociareCup");
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
            error: function () {
              oModelFilter.setProperty("/Lifnr", "");
            },
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

      onQuoteEsigibiliChange: function () {
        var self = this;
        var oModelFilter = self.getModel("FilterDocumenti");

        oModelFilter.setProperty("/DataEsigibilitaFrom", null);
        oModelFilter.setProperty("DataEsigibilitaTo", null);
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
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");

        var sZwels = self.setBlank(oSelectedItem?.data("Zwels"));
        var sDesczwels = self.setBlank(oSelectedItem?.getTitle());

        oModel.callFunction("/CheckImportoModPagamento", {
          method: "GET",
          urlParameters: {
            Zwels: sZwels,
            Zimptot: oModelSoa.getProperty("/Zimptot"),
          },
          success: function (data, oResponse) {
            if (self.setResponseMessage(oResponse)) {
              oModelSoa.setProperty("/Zdescwels", "");
              oModelSoa.setProperty("/Zwels", "");
              return;
            }

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

            self.setDatiVaglia();
            self.setInpsData();
          },
          error: function (error) {},
        });

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
        oModelSoa.setProperty("/Zperiodrifda", null);
        oModelSoa.setProperty("/Zperiodrifa", null);
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
      checkClassificazione: function () {
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
        aListClassificazione.map((oClassificazione) => {
          if (oClassificazione.ZimptotClass === "0.00") {
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
          aListClassificazione.push(oCos);
        });

        aListCpv.map((oCpv) => {
          aListClassificazione.push(oCpv);
        });

        aListCig.map((oCig) => {
          aListClassificazione.push(oCig);
        });

        aListCup.map((oCup) => {
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
      onSave: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var aSoaPosizione = oModelSoa.getProperty("/data");
        var aSoaClassificazione = oModelSoa.getProperty("/Classificazione");

        var aPosizioniDeep = [];
        var aClassificazioneDeep = [];

        aSoaPosizione.map((oPosizione) => {
          var oPosizioneDeep = {
            Znumliq: oPosizione.Znumliq,
            Zposizione: oPosizione.Zposizione,
            ZdescProsp: oPosizione.DescProspLiquidazione,
            Belnr: oPosizione.Belnr,
            GjahrDc: oModelSoa.getProperty("/Gjahr"),
            Xblnr: oPosizione.Xblnr,
            Blart: oPosizione.Blart,
            Bldat: oPosizione.Bldat,
            Zbenalt: oModelSoa.getProperty("/Lifnr"),
            ZbenaltName: oPosizione.ZbenaltName,
            Wrbtr: oModelSoa.getProperty("/Zimptot"),
            Zimpliq: oPosizione.Zimpliq,
            Zimppag: oPosizione.Zimppag,
            Zimpdaord: oPosizione.Zimpdaord,
          };

          aPosizioniDeep.push(oPosizioneDeep);
        });

        aSoaClassificazione.map((oClassificazione) => {
          var oClassificazioneDeep = {
            Zchiavesop: oClassificazione.Zchiavesop,
            Bukrs: oClassificazione.Bukrs,
            Zetichetta: oClassificazione.Zetichetta,
            Zposizione: oClassificazione.Zposizione,
            ZstepSop: oClassificazione.ZstepSop,
            Zzcig: oClassificazione.Zzcig,
            Zzcup: oClassificazione.Zzcup,
            Zcpv: oClassificazione.Zcpv,
            ZcpvDesc: oClassificazione.ZcpvDesc,
            Zcos: oClassificazione.Zcos,
            ZcosDesc: oClassificazione.ZcosDesc,
            Belnr: oClassificazione.Belnr,
            ZimptotClass: oClassificazione.ZimptotClass,
            Zflagcanc: oClassificazione.Zflagcanc,
            ZstatoClass: oClassificazione.ZstatoClass,
          };

          aClassificazioneDeep.push(oClassificazioneDeep);
        });

        var oSoaDeep = {
          Bukrs: oModelSoa.getProperty("/Bukrs"),
          Fipos: oModelSoa.getProperty("/Fipos"),
          Fistl: oModelSoa.getProperty("/Fistl"),
          Gjahr: oModelSoa.getProperty("/Gjahr"),
          Hkont: oModelSoa.getProperty("/Hkont"),
          Iban: oModelSoa.getProperty("/Iban"),
          Kostl: oModelSoa.getProperty("/Kostl"),
          Lifnr: oModelSoa.getProperty("/Lifnr"),
          Swift: oModelSoa.getProperty("/Swift"),
          Witht: oModelSoa.getProperty("/Witht"),
          Zcausale: oModelSoa.getProperty("/Zcausale"),
          ZCausaleval: oModelSoa.getProperty("/ZCausaleval"),
          Zcfcommit: oModelSoa.getProperty("/Zcfcommit"),
          Zcfvers: oModelSoa.getProperty("/Zcfvers"),
          Zchiaveaut: oModelSoa.getProperty("/Zchiaveaut"),
          Zchiavesop: oModelSoa.getProperty("/Zchiavesop"),
          Zcodinps: oModelSoa.getProperty("/Zcodinps"),
          Zcodprov: oModelSoa.getProperty("/Zcodprov"),
          ZcodStatosop: oModelSoa.getProperty("/ZcodStatosop"),
          Zcodtrib: oModelSoa.getProperty("/Zcodtrib"),
          Zcodvers: oModelSoa.getProperty("/Zcodvers"),
          Zcoordest: oModelSoa.getProperty("/Zcoordest"),
          Zdataprot: oModelSoa.getProperty("/Zdataprot"),
          Zdatasop: oModelSoa.getProperty("/Zdatasop"),
          ZE2e: oModelSoa.getProperty("/ZE2e"),
          Zfunzdel: oModelSoa.getProperty("/Zfunzdel"),
          Zidsede: oModelSoa.getProperty("/Zidsede"),
          Zimptot: oModelSoa.getProperty("/Zimptot"),
          Zlocpag: oModelSoa.getProperty("/Zlocpag"),
          Zmotivaz: oModelSoa.getProperty("/Zmotivaz"),
          Znumprot: oModelSoa.getProperty("/Znumprot"),
          Znumsop: oModelSoa.getProperty("/Znumsop"),
          Zperiodrifa: oModelSoa.getProperty("/Zperiodrifa"),
          Zperiodrifda: oModelSoa.getProperty("/Zperiodrifda"),
          ZpersCognomeQuiet1: oModelSoa.getProperty("/ZpersCognomeQuiet1"),
          ZpersCognomeQuiet2: oModelSoa.getProperty("/ZpersCognomeQuiet2"),
          ZpersCognomeVaglia: oModelSoa.getProperty("/ZpersCognomeVaglia"),
          ZpersNomeQuiet1: oModelSoa.getProperty("/ZpersNomeQuiet1"),
          ZpersNomeQuiet2: oModelSoa.getProperty("/ZpersNomeQuiet2"),
          ZpersNomeVaglia: oModelSoa.getProperty("/ZpersNomeVaglia"),
          Zricann: oModelSoa.getProperty("/Zricann"),
          ZspecieSop: oModelSoa.getProperty("/ZspecieSop"),
          ZstatTest: oModelSoa.getProperty("/ZstatTest"),
          Zstcd1: oModelSoa.getProperty("/Zstcd1"),
          Zstcd12: oModelSoa.getProperty("/Zstcd12"),
          Zstcd13: oModelSoa.getProperty("/Zstcd13"),
          Zstep: oModelSoa.getProperty("/Zstep"),
          Ztipofirma: oModelSoa.getProperty("/Ztipofirma"),
          Ztipopag: oModelSoa.getProperty("/Ztipopag"),
          Ztipososp: oModelSoa.getProperty("/Ztipososp"),
          ZufficioCont: oModelSoa.getProperty("/ZufficioCont"),
          Zutenza: oModelSoa.getProperty("/Zutenza"),
          Zwels: oModelSoa.getProperty("/Zwels"),
          Zzamministr: oModelSoa.getProperty("/Zzamministr"),
          ZzCebenra: oModelSoa.getProperty("/ZzCebenra"),
          Zzonaint: oModelSoa.getProperty("/Zzonaint"),
          Zztipologia: oModelSoa.getProperty("/Zztipologia"),
          Ztipodisp2: oModelSoa.getProperty("/Ztipodisp2"),
          Ztipodisp3: oModelSoa.getProperty("/Ztipodisp3"),
          Classificazione: aClassificazioneDeep,
          Posizione: aPosizioniDeep,
          Messaggio: [],
        };

        oModel.create("/SoaDeepSet", oSoaDeep, {
          success: function (result) {
            var aMessaggio = result?.Messaggio.results;

            if (aMessaggio.length !== 0) {
              self.setLogModel(aMessaggio);
              sap.m.MessageBox.error("Operazione non eseguita correttamente");
              return;
            }
            sap.m.MessageBox.success(
              "SOA n. " + result.Zchiavesop + " registrato correttamente",
              {
                actions: [MessageBox.Action.CLOSE],
                onClose: function () {
                  self.getRouter().navTo("soa.list.ListSoa", {
                    Reload: true,
                  });
                },
              }
            );
          },
          error: function () {},
        });
      },

      //#endregion

      /** -------------------------GESTIONE LOG------------------------------ */
      //#region
      onLog: function () {
        var self = this;
        var oDialog = self.loadFragment("rgssoa.view.fragment.pop-up.TableLog");

        oDialog.open();
      },

      onCloseLog: function () {
        var self = this;
        var oDialog = sap.ui.getCore().byId("dlgLog");
        oDialog.close();
        self.unloadFragment();
      },

      onExportLog: function () {
        var self = this;
        const EDM_TYPE = exportLibrary.EdmType;

        var oBundle = self.getResourceBundle();

        var oTable = sap.ui.getCore().byId("tblLog");
        var oTableModel = oTable.getModel("Log");

        var aCols = [
          {
            label: oBundle.getText("labelMessageType"),
            property: "Type",
            type: EDM_TYPE.String,
          },
          {
            label: oBundle.getText("labelMessageId"),
            property: "Id",
            type: EDM_TYPE.String,
          },
          {
            label: oBundle.getText("labelMessageNumber"),
            property: "Number",
            type: EDM_TYPE.String,
          },
          {
            label: oBundle.getText("labelMessageText"),
            property: "Message",
            type: EDM_TYPE.String,
          },
        ];

        var oSettings = {
          workbook: {
            columns: aCols,
          },
          dataSource: oTableModel.getData()?.Messaggio,
          fileName: "Lista Log.xlsx",
        };

        var oSheet = new Spreadsheet(oSettings);
        oSheet.build().finally(function () {
          oSheet.destroy();
        });
      },

      getLogModel: function () {
        var self = this;
        var oEmptyModel = new JSONModel({
          Messaggio: [],
        });

        var oGlobalModelLog = sap.ui.getCore().getModel("GlobalLog");

        if (!oGlobalModelLog) {
          oGlobalModelLog = oEmptyModel;
        }

        self.setModel(oGlobalModelLog, "Log");
        sap.ui.getCore().setModel(oEmptyModel, "GlobalLog");
      },

      setLogModel: function (aLog) {
        var self = this;
        var oModel = new JSONModel({
          Messaggio: aLog,
        });

        sap.ui.getCore().setModel(oModel, "GlobalLog");
        self.setModel(oModel, "Log");
      },
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

      setSoaModel: function (oData) {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty("/Ztipopag", oData.Ztipopag);
        oModelSoa.setProperty("/Bukrs", oData.Bukrs);
        oModelSoa.setProperty("/Zchiavesop", oData.Zchiavesop);
        oModelSoa.setProperty("/Ztipososp", oData.Ztipososp);
        oModelSoa.setProperty("/Zstep", oData.Zstep);
        oModelSoa.setProperty("/Gjahr", oData.Gjahr);
        oModelSoa.setProperty("/Zimptot", oData.Zimptot);
        oModelSoa.setProperty("/Zzamministr", oData.Zzamministr);
        oModelSoa.setProperty("/ZufficioCont", oData.ZufficioCont);
        oModelSoa.setProperty("/NameFirst", oData.NameFirst);
        oModelSoa.setProperty("/NameLast", oData.NameLast);
        oModelSoa.setProperty("/ZzragSoc", oData.ZzragSoc);
        oModelSoa.setProperty("/TaxnumCf", oData.TaxnumCf);
        oModelSoa.setProperty("/TaxnumPiva", oData.TaxnumPiva);
        oModelSoa.setProperty("/Fipos", oData.Fipos);
        oModelSoa.setProperty("/Fistl", oData.Fistl);
        oModelSoa.setProperty("/Lifnr", oData.Lifnr);
        oModelSoa.setProperty("/Witht", oData.Witht);
        oModelSoa.setProperty("/Text40", oData.Text40);
        oModelSoa.setProperty("/ZzCebenra", oData.ZzCebenra);
        oModelSoa.setProperty("/ZzDescebe", oData.ZzDescebe);
        oModelSoa.setProperty("/Zchiaveaut", oData.Zchiaveaut);
        oModelSoa.setProperty("/Ztipodisp2", oData.Ztipodisp2);
        oModelSoa.setProperty("/Zdesctipodisp2", oData.Zdesctipodisp2);
        oModelSoa.setProperty("/Ztipodisp3", oData.Ztipodisp3);
        oModelSoa.setProperty("/Zdesctipodisp3", oData.Zdesctipodisp3);
        oModelSoa.setProperty("/Zimpaut", oData.Zimpaut);
        oModelSoa.setProperty("/Zimpdispaut", oData.Zimpdispaut);
        oModelSoa.setProperty("/Zztipologia", oData.Zztipologia);
        oModelSoa.setProperty("/DescZztipologia", oData.DescZztipologia);
        oModelSoa.setProperty("/Zfunzdel", oData.Zfunzdel);
        oModelSoa.setProperty("/Zdescriz", oData.Zdescriz);
        oModelSoa.setProperty("/ZspecieSop", oData.ZspecieSop);
        oModelSoa.setProperty("/DescZspecieSop", oData.DescZspecieSop);
        oModelSoa.setProperty("/Kostl", oData.Kostl);
        oModelSoa.setProperty("/Hkont", oData.Hkont);
        oModelSoa.setProperty("/DescKostl", oData.DescKostl);
        oModelSoa.setProperty("/DescHkont", oData.DescHkont);
        oModelSoa.setProperty("/BuType", oData.BuType);
        oModelSoa.setProperty("/Taxnumxl", oData.Taxnumxl);
        oModelSoa.setProperty("/Zsede", oData.Zsede);
        oModelSoa.setProperty("/Zdenominazione", oData.Zdenominazione);
        oModelSoa.setProperty("/Zdurc", oData.Zdurc);
        oModelSoa.setProperty("/ZfermAmm", oData.ZfermAmm);
        oModelSoa.setProperty("/Zwels", oData.Zwels);
        oModelSoa.setProperty("/ZCausaleval", oData.ZCausaleval);
        oModelSoa.setProperty("/Swift", oData.Swift);
        oModelSoa.setProperty("/Zcoordest", oData.Zcoordest);
        oModelSoa.setProperty("/Iban", oData.Iban);
        oModelSoa.setProperty("/Zmotivaz", oData.Zmotivaz);
        oModelSoa.setProperty("/Zdescwels", oData.Zdescwels);
        oModelSoa.setProperty("/Banks", oData.Banks);
        oModelSoa.setProperty("/ZDesccauval", oData.ZDesccauval);
        oModelSoa.setProperty("/Ztipofirma", oData.Ztipofirma);
        oModelSoa.setProperty("/ZpersCognomeQuiet1", oData.ZpersCognomeQuiet1);
        oModelSoa.setProperty("/ZpersCognomeQuiet2", oData.ZpersCognomeQuiet2);
        oModelSoa.setProperty("/ZpersNomeQuiet1", oData.ZpersNomeQuiet1);
        oModelSoa.setProperty("/ZpersNomeQuiet2", oData.ZpersNomeQuiet2);
        oModelSoa.setProperty("/ZpersNomeVaglia", oData.ZpersNomeVaglia);
        oModelSoa.setProperty("/ZpersCognomeVaglia", oData.ZpersCognomeVaglia);
        oModelSoa.setProperty("/Zstcd1", oData.Zstcd1);
        oModelSoa.setProperty("/Zstcd12", oData.Zstcd12);
        oModelSoa.setProperty("/Zstcd13", oData.Zstcd13);
        oModelSoa.setProperty("/Zqindiriz", oData.Zqindiriz);
        oModelSoa.setProperty("/Zqcitta", oData.Zqcitta);
        oModelSoa.setProperty("/Zqcap", oData.Zqcap);
        oModelSoa.setProperty("/Zqprovincia", oData.Zqprovincia);
        oModelSoa.setProperty("/Zqindiriz12", oData.Zqindiriz12);
        oModelSoa.setProperty("/Zqcitta12", oData.Zqcitta12);
        oModelSoa.setProperty("/Zqcap12", oData.Zqcap12);
        oModelSoa.setProperty("/Zqprovincia12", oData.Zqprovincia12);
        oModelSoa.setProperty("/Zcodprov", oData.Zcodprov);
        oModelSoa.setProperty("/Zcfcommit", oData.Zcfcommit);
        oModelSoa.setProperty("/Zcodtrib", oData.Zcodtrib);
        oModelSoa.setProperty("/Zperiodrifda", oData.Zperiodrifda);
        oModelSoa.setProperty("/Zperiodrifa", oData.Zperiodrifa);
        oModelSoa.setProperty("/Zcodinps", oData.Zcodinps);
        oModelSoa.setProperty("/Zcfvers", oData.Zcfvers);
        oModelSoa.setProperty("/Zcodvers", oData.Zcodvers);
        oModelSoa.setProperty("/Zidsede", oData.Zidsede);
        oModelSoa.setProperty("/Stras", oData.Stras);
        oModelSoa.setProperty("/Ort01", oData.Ort01);
        oModelSoa.setProperty("/Regio", oData.Regio);
        oModelSoa.setProperty("/Pstlz", oData.Pstlz);
        oModelSoa.setProperty("/Land1", oData.Land1);
        oModelSoa.setProperty("/Zcausale", oData.Zcausale);
        oModelSoa.setProperty("/ZE2e", oData.ZE2e);
        oModelSoa.setProperty("/Zlocpag", oData.Zlocpag);
        oModelSoa.setProperty("/Zzonaint", oData.Zzonaint);
        oModelSoa.setProperty("/Znumprot", oData.Znumprot);
        oModelSoa.setProperty("/Zdataprot", oData.Zdataprot);
        oModelSoa.setProperty("/Zdataesig", oData.Zdataesig);
      },

      //#endregion

      /** --------------------------FUNZIONALITA----------------------------- */
      //#region

      setDatiFirmatario: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelListSoa = self.getModel("ListSoa");
        var aListSoa = oModelListSoa.getData();

        var oModelDatiFirmatatario = new JSONModel({
          ZuffcontFirm: "",
          ZvimDescrufficio: "",
          Zcodord: "",
          ZcodordDesc: "",
          Fistl: "",
          ZdirigenteAmm: "",
        });

        if (aListSoa.length === 1) {
          oModelDatiFirmatatario.setProperty("/Fistl", aListSoa[0].Fistl);
        }

        oModel.read("/DatiFirmatarioSet", {
          success: function (data) {
            var oData = data.results[0];
            oModelDatiFirmatatario.setProperty(
              "/ZuffcontFirm",
              oData.ZuffcontFirm
            );
            oModelDatiFirmatatario.setProperty(
              "/ZvimDescrufficio",
              oData.ZvimDescrufficio
            );
          },
        });

        self.setModel(oModelDatiFirmatatario, "DatiFirmatario");
      },

      setWorkflowInFunction: function (oSelectedItem) {
        var self = this;
        var oModel = self.getModel();

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
        });
      },

      printMessage: function (oResult, sTitle) {
        var self = this;
        var aMessage = oResult?.Messaggio.results;

        if (aMessage.length === 1) {
          var oMessage = aMessage[0];

          if (oResult.IsSuccess) {
            MessageBox.success(oMessage.Message, {
              actions: [MessageBox.Action.OK],
              title: sTitle,
              onClose: function () {
                self.getRouter().navTo("soa.list.ListSoa", {
                  Reload: true,
                });
              },
            });
          } else {
            MessageBox.error(oMessage.Message, {
              actions: [MessageBox.Action.OK],
              title: sTitle,
            });
          }
        } else {
          self.setLogModel(aMessage);

          if (oResult.IsSuccess) {
            MessageBox.success("Operazione eseguita correttamente", {
              actions: [MessageBox.Action.OK],
              title: sTitle,
              onClose: function () {
                self.getRouter().navTo("soa.list.ListSoa", {
                  Reload: true,
                });
              },
            });
          } else {
            MessageBox.error("Operazione non eseguita correttamente", {
              actions: [MessageBox.Action.OK],
              title: sTitle,
            });
          }
        }
      },

      //#endregion
    });
  }
);
