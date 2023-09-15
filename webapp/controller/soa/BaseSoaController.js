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

      //#region ----------------------WIZARD---------------------------------- /

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

        oDataModel.read("/" + "RicercaAnnoDocBeneSet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setModelCustom("AnnoDocBeneficiario", data?.results);
          },
          error: function (error) {},
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
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.CodiceGestionale"
        );

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
        var dialogName = oSourceData.dialogName;
        var oDialog = self.loadFragment("rgssoa.view.fragment.valueHelp.Cpv");

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
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

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
        var oView = self.getView();

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

        oView.setBusy(true);

        oModel.create("/SoaDeepSet", oSoaDeep, {
          success: function (result) {
            oView.setBusy(false);
            var aMessaggio = result?.Messaggio.results;

            if (aMessaggio.length !== 0) {
              self._setLogModel(aMessaggio);
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
          error: function () {
            oView.setBusy(false);
          },
        });
      },

      //#endregion

      //#endregion

      //#region -------------------GESTIONE LOG------------------------------- /

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

        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

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

      _setLogModel: function (aLog) {
        var self = this;
        var oModel = new JSONModel({
          Messaggio: aLog,
        });

        sap.ui.getCore().setModel(oModel, "GlobalLog");
        self.setModel(oModel, "Log");
      },
      //#endregion

      //#region ----------------------DETTAGLIO------------------------------- /

      //#region SET MODELLI
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

          oModel.read("/" + sPath, {
            success: function (data) {
              oModelSoa.setProperty(
                "/FlagInpsEditabile",
                data?.FlagInpsEditabile ? true : false
              );
            },
            error: function () {},
          });
        }
      },

      _setSoa: function (oData) {
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
        oModelSoa.setProperty("/ZcodStatosop", oData.ZcodStatosop);
        oModelSoa.setProperty("/Zricann", oData.Zricann);
        oModelSoa.setProperty("/DescStateSoa", oData.DescStateSoa);
        oModelSoa.setProperty("/Zdatarichann", oData.Zdatarichann);
      },

      enableFunctions: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oSoa = oModelSoa.getData();
        var oModelUtility = self.getModel("Utility");

        self.getPermissionsListSoa(false, function (callback) {
          var oPermissions = callback.permissions;

          if (oSoa.ZcodStatosop === "00" && oPermissions.Annullamento) {
            oModelUtility.setProperty("/EnableBtnAnnullamento", true);
          }

          oModelUtility.setProperty(
            "/EnableBtnInvioFirma",
            oSoa.ZcodStatosop === "00" && oPermissions.InvioFirma
          );
          oModelUtility.setProperty(
            "/EnableBtnRevocaInvioFirma",
            oSoa.ZcodStatosop === "01" && oPermissions.RevocaInvioFirma
          );
          oModelUtility.setProperty(
            "/EnableBtnFirma",
            oSoa.ZcodStatosop === "01" && oPermissions.Firma
          );
          oModelUtility.setProperty(
            "/EnableBtnRevocaFirma",
            oSoa.ZcodStatosop === "02" && oPermissions.RevocaFirma
          );
          oModelUtility.setProperty(
            "/EnableBtnRegistrazioneRichAnn",
            oSoa.ZcodStatosop === "00" &&
              oPermissions.RegistrazioneRichAnn &&
              oSoa.Zricann === "0000000"
          );
          oModelUtility.setProperty(
            "/EnableBtnCancellazioneRichAnn",
            oSoa.ZcodStatosop === "00" &&
              oPermissions.CancellazioneRichAnn &&
              oSoa.Zricann === "0000000"
          );
        });
      },

      setSoaModel: function (oParameters, callback) {
        var self = this;
        var oModel = self.getModel();
        var oView = self.getView();
        var sPath = self.getModel().createKey("/SOASet", {
          Gjahr: oParameters.Gjahr,
          Zchiavesop: oParameters.Zchiavesop,
          Bukrs: oParameters.Bukrs,
          Zstep: oParameters.Zstep,
          Ztipososp: oParameters.Ztipososp,
        });

        var oModelSoa = new JSONModel({
          EnableEdit: false,
          visibleBtnEdit: true,
          /**  CHIAVI */
          Gjahr: "",
          Bukrs: "",
          Zchiavesop: "",
          Ztipososp: "",
          Zstep: "",

          Ztipopag: "", //Tipo Pagamento

          /**   Dati SOA (Parte celeste in alto)   */
          Zimptot: "", //Importo
          Zzamministr: "", //Amministrazione
          ZufficioCont: "", //Ufficio Contabile
          NameFirst: "", //Nome Beneficiairo
          NameLast: "", //Cognome Beneficiario
          ZzragSoc: "", //Ragione Sociale
          TaxnumCf: "", //Codice Fiscale
          TaxnumPiva: "", //Partita Iva
          Fipos: "", //Posizione Finanziaria
          Fistl: "", //Struttura Amministrativa Responsabile
          Lifnr: "", //Beneficiario
          Witht: "", //Codice Ritenuta
          Text40: "", //Descrizione Ritenuta
          ZzCebenra: "", //Codice Ente Beneficiario
          ZzDescebe: "", //Descrizione Ente Beneficiario
          Zchiaveaut: "", //Identificativo Autorizzazione
          Ztipodisp2: "", //Codice Tipologia Autorizzazione
          Zdesctipodisp2: "", //Tipologia Autorizzazione
          Ztipodisp3: "", //Codice Tipologia Disponibilità
          Zdesctipodisp3: "", //Tipologia Disponibilità
          Zimpaut: "", //Importo autorizzato
          Zimpdispaut: "", //Disponibilità autorizzazione
          Zztipologia: "", //Tipololgia SOA
          DescZztipologia: "", //Descrizione Tipologia SOA
          Zfunzdel: "", //Codice FD
          Zdescriz: "", //Descrizione Codice FD
          ZspecieSop: "", //Specie SOA
          DescZspecieSop: "", //Descrizione Specie SOA

          /**   WIZARD 1 - SCENARIO 4 */
          Kostl: "", //Centro Costo
          Hkont: "", // Conto Co.Ge.
          DescKostl: "", //Descrizione Centro Costo
          DescHkont: "", //Descrizione Conto Co.Ge.

          data: [], //Quote Documenti

          /**   WIZARD 2 - Beneficiario SOA   */
          BuType: "", //Tipologia Persona
          Taxnumxl: "", //Codice Fiscale Estero
          Zsede: "", //Sede Estera
          Zdenominazione: "", //Descrizione Sede Estera
          Zdurc: "", //Numero identificativo Durc
          ZfermAmm: "", //Fermo amministrativo

          /**   WIZARD 2 - Modalità Pagamento   */
          Zwels: "", //Codice Modalità Pagamento
          ZCausaleval: "", //Causale Valutaria
          Swift: "", //BIC
          Zcoordest: "", //Cordinate Estere
          Iban: "", //IBAN
          Zmotivaz: "", //Motivazione cambio IBAN
          Zdescwels: "", //Descrizione Modalità Pagamento
          Banks: "", //Paese di Residenza (Primi 2 digit IBAN)
          ZDesccauval: "", //Descrizione Causale Valutaria

          /**   WIZARD 2 - Dati Quietanzante/Destinatario Vaglia    */
          Ztipofirma: "", //Tipologia Firma
          ZpersCognomeQuiet1: "", //Cognome primo quietanzante
          ZpersCognomeQuiet2: "", //Cognome secondo quietanzante
          ZpersNomeQuiet1: "", //Nome primo quietanzante
          ZpersNomeQuiet2: "", //Nome secondo quietanzante
          ZpersNomeVaglia: "", //Nome persona vagliaesigibilità
          ZpersCognomeVaglia: "", //Cognome persona vaglia
          Zstcd1: "", //Codice Fiscale Utilizzatore
          Zstcd12: "", //Codice fiscale secondo quietanzante
          Zstcd13: "", //Codice fiscale destinatario vaglia
          Zqindiriz: "", //Indirizzo primo quietanzante
          Zqcitta: "", //Citta primo quietanzantez
          Zqcap: "", //Cap primo quietanzante
          Zqprovincia: "", //Provincia primo quietanzante
          Zqindiriz12: "", //Indirizzo secondo quietanzante
          Zqcitta12: "", //Citta secondo quietanzante
          Zqcap12: "", //Cap secondo quietanzante
          Zqprovincia12: "", //Provincia secondo quietanzante

          /**   WIZARD 2 - INPS    */
          Zcodprov: "", //INPS - Codice Provenienza
          Zcfcommit: "", //INPS - Codice Fiscale Committente
          Zcodtrib: "", //INPS - Codice tributo
          Zperiodrifda: "", //INPS - Periodo riferimento da
          Zperiodrifa: "", //INPS - Periodo riferimento a
          Zcodinps: "", //INPS - Matricola INPS/Codice INPS/Filiale azienda
          Zcfvers: "", //INPS - Codice Fiscale Versante
          Zcodvers: "", //INPS - Codice Versante
          FlagInpsEditabile: false,

          /**   WIZARD 2 - Sede Beneficiario */
          Zidsede: "", //Sede Beneficiario
          Stras: "", //Via,numero civico
          Ort01: "", //Località
          Regio: "", //Regione
          Pstlz: "", //Codice di avviamento postale
          Land1: "", //Codice paese

          /**   WIZARD 3    */
          Classificazione: [], //Classificazioni

          /**   WIZARD 4    */
          Zcausale: "", //Causale di pagamento
          ZE2e: "", //E2E ID
          Zlocpag: "", //Località pagamento
          Zzonaint: "", //Zona di intervento
          Znumprot: "", //Numero protocollo
          Zdataprot: "", //Data protocollo
          Zdataesig: "", //Data esigibilità
        });
        self.setModel(oModelSoa, "Soa");

        oView.setBusy(true);

        oModel.read(sPath, {
          success: function (data, oResponse) {
            self._setSoa(data);
            self._getPosizioniSoa();
            self._getClassificazioniSoa();
            oView.setBusy(false);
            callback(data);
          },
          error: function () {
            oView.setBusy(true);
          },
        });
      },

      _getPosizioniSoa: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var aFilters = [];

        self.setFilterEQ(aFilters, "Bukrs", oModelSoa.getProperty("/Bukrs"));
        self.setFilterEQ(aFilters, "Gjahr", oModelSoa.getProperty("/Gjahr"));
        self.setFilterEQ(
          aFilters,
          "Zchiavesop",
          oModelSoa.getProperty("/Zchiavesop")
        );

        oModel.read("/SoaPosizioneSet", {
          filters: aFilters,
          success: function (data) {
            oModelSoa.setProperty("/data", data.results);
          },
          error: function () {},
        });
      },

      setStepScenarioModel: function () {
        var self = this;
        var oModelStepScenario = new JSONModel({
          wizard1Step1: false,
          wizard1Step2: false,
          wizard1Step3: true,
          wizard2: false,
          wizard3: false,
          wizard4: false,
          visibleBtnForward: true,
          visibleBtnStart: false,
        });

        self.setModel(oModelStepScenario, "StepScenario");
      },

      setUtilityModel: function (bDetailFromFunction, bRemoveFunctionButtons) {
        var self = this;
        var oModelUtility = new JSONModel({
          Function: "Dettaglio",
          DeleteSelectedPositions: [],
          AddSelectedPositions: [],
          AddPositions: false,
          DetailAfter: false,
          EnableBtnDeleteSoa: false,
          EnableEdit: false,
          EnableAnnullamento: false,
          EnableRevocaInvioFirma: false,
          EnableFirma: false,
          EnableRevocaFirma: false,
          EnableInvioFirma: false,
          EnableRegistrazioneRichAnn: false,
          EnableCancellazioneRichAnn: false,
          DetailFromFunction: bDetailFromFunction,
          RemoveFunctionButtons: bRemoveFunctionButtons,
        });
        self.setModel(oModelUtility, "Utility");
      },

      _setClassificazioneModel: function (aData) {
        var self = this;

        var oDataClassificazione = {
          Cos: [],
          Cpv: [],
          Cig: [],
          Cup: [],
          ImpTotAssociareCos: 0.0,
          ImpTotAssociareCpv: 0.0,
          ImpTotAssociareCig: 0.0,
          ImpTotAssociareCup: 0.0,
        };

        aData.map((oClassificazione) => {
          switch (oClassificazione.Zetichetta) {
            case "COS":
              oDataClassificazione.ImpTotAssociareCos += parseFloat(
                oClassificazione.ZimptotClass
              );

              oClassificazione.Index = oDataClassificazione.Cos.length;
              oDataClassificazione.Cos.push(oClassificazione);
              break;
            case "CPV":
              oDataClassificazione.ImpTotAssociareCpv += parseFloat(
                oClassificazione.ZimptotClass
              );
              oClassificazione.Index = oDataClassificazione.Cpv.length;
              oDataClassificazione.Cpv.push(oClassificazione);
              break;
            case "CIG":
              oDataClassificazione.ImpTotAssociareCig += parseFloat(
                oClassificazione.ZimptotClass
              );
              oClassificazione.Index = oDataClassificazione.Cig.length;
              oDataClassificazione.Cig.push(oClassificazione);
              break;
            case "CUP":
              oDataClassificazione.ImpTotAssociareCup += parseFloat(
                oClassificazione.ZimptotClass
              );
              oClassificazione.Index = oDataClassificazione.Cup.length;
              oDataClassificazione.Cup.push(oClassificazione);
              break;
          }
        });

        oDataClassificazione.ImpTotAssociareCos =
          oDataClassificazione.ImpTotAssociareCos.toFixed(2);
        oDataClassificazione.ImpTotAssociareCpv =
          oDataClassificazione.ImpTotAssociareCpv.toFixed(2);
        oDataClassificazione.ImpTotAssociareCig =
          oDataClassificazione.ImpTotAssociareCig.toFixed(2);
        oDataClassificazione.ImpTotAssociareCup =
          oDataClassificazione.ImpTotAssociareCup.toFixed(2);

        self.setModel(new JSONModel(oDataClassificazione), "Classificazione");
      },

      setFiltersPosizioniModel: function () {
        var self = this;
        var oModelFilterDocumenti = new JSONModel({
          CodRitenuta: "",
          DescRitenuta: "",
          CodEnte: "",
          DescEnte: "",
          QuoteEsigibili: true,
          DataEsigibilitaFrom: "",
          DataEsigibilitaTo: "",
          TipoBeneficiario: "",
          Lifnr: "",
          UfficioContabile: "",
          UfficioPagatore: "",
          AnnoRegDocumento: [],
          NumRegDocFrom: "",
          NumRegDocTo: "",
          AnnoDocBeneficiario: [],
          NDocBen: [],
          Cig: "",
          Cup: "",
          ScadenzaDocFrom: null,
          ScadenzaDocTo: null,
        });
        self._setPrevalUfficio(oModelFilterDocumenti);
        self.setModel(oModelFilterDocumenti, "FilterDocumenti");
      },

      _getClassificazioniSoa: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var aFilters = [];

        self.setFilterEQ(aFilters, "Bukrs", oModelSoa.getProperty("/Bukrs"));
        self.setFilterEQ(
          aFilters,
          "Zchiavesop",
          oModelSoa.getProperty("/Zchiavesop")
        );

        oModel.read("/SoaClassificazioneSet", {
          filters: aFilters,
          success: function (data) {
            oModelSoa.setProperty("/Classificazione", data.results);
            self._setClassificazioneModel(data.results);
          },
          error: function () {
            self._setClassificazioneModel([]);
          },
        });
      },

      setMode: function (sMode) {
        if (sMode === "Dettaglio") {
          return;
        }

        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        oModelUtility.setProperty("/RemoveFunctionButtons", true);
        oModelUtility.setProperty("/Function", sMode);
        oModelUtility.setProperty("/Enable" + sMode, true);
        oModelStepScenario.setProperty("/visibleBtnForward", false);

        if (
          sMode === "InvioFirma" ||
          sMode === "RegistrazioneRichAnn" ||
          sMode === "CancellazioneRichAnn"
        ) {
          self.setDatiFirmatario();
        }
      },

      //#endregion SET MODELLI

      //#endregion

      //#region ---------------------FUNZIONALITA----------------------------- /

      //#region FUNZIONALITA - EVENTI
      onAnnulla: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableAnnullamento")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "Annullamento");
          oModelUtility.setProperty("/EnableAnnullamento", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
        } else {
          self.doAnnulla();
        }
      },

      onInviaFirma: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableInvioFirma")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "InvioFirma");
          oModelUtility.setProperty("/EnableInvioFirma", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
          self.setDatiFirmatario();
        } else {
          self.doInviaFirma();
        }
      },

      onRevocaInvioFirma: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableRevocaInvioFirma")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "RevocaInvioFirma");
          oModelUtility.setProperty("/EnableRevocaInvioFirma", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
        } else {
          self.doRevocaInvioFirma();
        }
      },

      onFirma: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableFirma")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "Firma");
          oModelUtility.setProperty("/EnableFirma", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
        } else {
          self.doFirma();
        }
      },

      onRevocaFirma: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableRevocaFirma")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "RevocaFirma");
          oModelUtility.setProperty("/EnableRevocaFirma", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
        } else {
          self.doRevocaFirma();
        }
      },

      onRegistraRichAnn: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableRegistrazioneRichAnn")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "RegistrazioneRichAnn");
          oModelUtility.setProperty("/EnableRegistrazioneRichAnn", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
          self.setDatiFirmatario();
        } else {
          self.doRegistraRichAnn();
        }
      },

      onCancellaRichAnn: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var oModelStepScenario = self.getModel("StepScenario");
        var oModelSoa = self.getModel("Soa");

        var aListSoa = [];
        aListSoa.push(oModelSoa.getData());
        self.setModel(new JSONModel(aListSoa), "ListSoa");

        if (!oModelUtility.getProperty("/EnableCancellazioneRichAnn")) {
          oModelUtility.setProperty("/RemoveFunctionButtons", true);
          oModelUtility.setProperty("/Function", "CancellazioneRichAnn");
          oModelUtility.setProperty("/EnableCancellazioneRichAnn", true);
          oModelStepScenario.setProperty("/visibleBtnForward", false);
          self.setDatiFirmatario();
        } else {
          self.doCancellaRichAnn();
        }
      },
      onValorizzaDataProt: function () {
        var self = this;
        var oModelUtility = self.getModel("Utility");
        var aListSoa = self.getModel("ListSoa").getData();

        aListSoa.map((oSoa) => {
          oSoa.Zdataprot = oModelUtility.getProperty("/Zdataprot");
        });

        self.setModel(new JSONModel(aListSoa), "ListSoa");
      },

      onNumProtocolloChange: function (oEvent) {
        var self = this;
        var oInput = self.getView().byId(oEvent.getParameter("id"));

        if (oEvent.getParameter("newValue")) {
          oInput.setValue(
            parseInt(oEvent.getParameter("newValue"))
              .toString()
              .padStart(6, "0")
          );
        }
      },

      //#endregion FUNZIONALITA - EVENTI

      //#region FUNZIONALITA - METHODS
      doAnnulla: function () {
        var self = this;
        var oModel = self.getModel();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
        var aListSoa = self.getModel("ListSoa").getData();

        var sMessage =
          aListSoa.length === 1
            ? oBundle.getText("msgWarningAnnulla")
            : oBundle.getText("msgWarningAnnullaMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Annullamento SOA",
          onClose: function (oAction) {
            if (oAction === "OK") {
              var aSospesi = [];

              aListSoa.map((oSoa) => {
                var oSospeso = {
                  Bukrs: oSoa.Bukrs,
                  Gjahr: oSoa.Gjahr,
                  Zchiavesop: oSoa.Zchiavesop,
                  Zstep: oSoa.Zstep,
                  Ztipososp: oSoa.Ztipososp,
                  Ztipopag: oSoa.Ztipopag,
                  Lifnr: oSoa.Lifnr,
                  Witht: oSoa.Witht,
                  ZzCebenra: oSoa.ZzCebenra,
                };

                aSospesi.push(oSospeso);
              });

              var oFunzionalitaDeep = {
                Funzionalita: "ANNULLAMENTO",
                ZuffcontFirm: "",
                Zcodord: "",
                ZdirigenteAmm: "",
                Sospeso: aSospesi,
                Messaggio: [],
              };

              oModel.create("/FunzionalitaDeepSet", oFunzionalitaDeep, {
                success: function (result) {
                  self._printMessage(result, "Annullamento SOA");
                },
                error: function () {},
              });
            }
          },
        });
      },

      doInviaFirma: function () {
        var self = this;
        var oModel = self.getModel();
        var oDatiFirma = self.getModel("DatiFirmatario")?.getData();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
        var aModelListSoa = self.getModel("ListSoa").getData();

        var sMessage =
          aModelListSoa.length === 1
            ? oBundle.getText("msgWarningInviaFirma")
            : oBundle.getText("msgWarningInviaFirmaMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Invio alla firma SOA",
          onClose: function (oAction) {
            if (oAction === "OK") {
              var aSospesi = [];

              aModelListSoa.map((oSoa) => {
                var oSospeso = {
                  Bukrs: oSoa.Bukrs,
                  Gjahr: oSoa.Gjahr,
                  Zchiavesop: oSoa.Zchiavesop,
                  Zstep: oSoa.Zstep,
                  Ztipososp: oSoa.Ztipososp,
                  Znumprot: oSoa.Znumprot,
                  Zdataprot: oSoa.Zdataprot ? oSoa.Zdataprot : null,
                  Zcdr: oSoa.Fistl,
                };

                aSospesi.push(oSospeso);
              });

              var oFunzionalitaDeep = {
                Funzionalita: "INVIO_FIRMA",
                ZuffcontFirm: self.setBlank(oDatiFirma.ZuffcontFirm),
                Zcodord: self.setBlank(oDatiFirma.Zcodord),
                ZdirigenteAmm: self.setBlank(oDatiFirma.ZdirigenteAmm),
                Sospeso: aSospesi,
                Messaggio: [],
              };

              oModel.create("/FunzionalitaDeepSet", oFunzionalitaDeep, {
                success: function (result) {
                  self._printMessage(result, "Invio alla firma SOA");
                },
                error: function () {},
              });
            }
          },
        });
      },

      doRevocaInvioFirma: function () {
        var self = this;
        var oModel = self.getModel();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
        var aModelListSoa = self.getModel("ListSoa").getData();

        var sMessage =
          aModelListSoa.length === 1
            ? oBundle.getText("msgWarningRevocaInviaFirma")
            : oBundle.getText("msgWarningRevocaInviaFirmaMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Revoca Invio alla Firma SOA",
          onClose: function (oAction) {
            if (oAction === "OK") {
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
                  self._printMessage(result, "Revoca Invio alla Firma SOA");
                },
                error: function () {},
              });
            }
          },
        });
      },

      doFirma: function () {
        var self = this;
        var oModel = self.getModel();
        var aModelListSoa = self.getModel("ListSoa").getData();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        var sMessage =
          aModelListSoa.length === 1
            ? oBundle.getText("msgWarningFirma", aModelListSoa[0].Zchiavesop)
            : oBundle.getText("msgWarningFirmaMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Firma SOA",
          onClose: function (oAction) {},
        });
      },

      doRevocaFirma: function () {
        var self = this;
        var oModel = self.getModel();
        var aModelListSoa = self.getModel("ListSoa").getData();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        var sMessage =
          aModelListSoa.length === 1
            ? oBundle.getText(
                "msgWarningRevocaFirma",
                aModelListSoa[0].Zchiavesop
              )
            : oBundle.getText("msgWarningRevocaFirmaMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Revoca firma SOA",
          onClose: function (oAction) {
            if (oAction === "OK") {
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
                Funzionalita: "REVOCA_FIRMA",
                ZuffcontFirm: "",
                Zcodord: "",
                ZdirigenteAmm: "",
                Sospeso: aSospesi,
                Messaggio: [],
              };

              oModel.create("/FunzionalitaDeepSet", oFunzionalitaDeep, {
                success: function (result) {
                  self._printMessage(result, "Revoca firma SOA");
                },
                error: function () {},
              });
            }
          },
        });
      },

      doRegistraRichAnn: function () {
        var self = this;
        var oModel = self.getModel();
        var aModelListSoa = self.getModel("ListSoa").getData();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        var sMessage =
          aModelListSoa.length === 1
            ? oBundle.getText("msgWarningRegistraRichAnn", [
                aModelListSoa[0].Zchiavesop,
              ])
            : oBundle.getText("msgWarningRegistraRichAnnMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Registrazione Richiesta di annullamento",
          onClose: function (oAction) {},
        });
      },

      doCancellaRichAnn: function () {
        var self = this;
        var oModel = self.getModel();
        var aModelListSoa = self.getModel("ListSoa").getData();
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        var sMessage =
          aModelListSoa.length === 1
            ? oBundle.getText("msgWarningCancellaRichAnn", [
                aModelListSoa[0].Zricann,
                aModelListSoa[0].Zchiavesop,
              ])
            : oBundle.getText("msgWarningCancellaRichAnnMulti");

        MessageBox.warning(sMessage, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: "Cancellazione Richiesta di annullamento",
          onClose: function (oAction) {},
        });
      },

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

      setWorkflowModel: function (oSoa) {
        var self = this;
        var oModel = self.getModel();

        //Carico il workflow
        var aFilters = [];
        self.setFilterEQ(aFilters, "Esercizio", oSoa.Gjahr);
        self.setFilterEQ(aFilters, "Bukrs", oSoa.Bukrs);
        self.setFilterEQ(aFilters, "Zchiavesop", oSoa.Zchiavesop);

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

      _printMessage: function (oResult, sTitle) {
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
          self._setLogModel(aMessage);

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

      //#endregion FUNZIONALITA - METHODS

      //#endregion

      //#region ------------------------GLOBAL-------------------------------- /

      resetWizard: function (sId) {
        var self = this;
        var oWizard = self.getView().byId(sId);
        for (var i = 0; i < oWizard.getProgress(); i++) {
          oWizard.previousStep();
        }
      },

      _setPrevalUfficio: function (oModelFilter) {
        var self = this;
        var oModel = self.getModel();

        oModel.read("/" + "PrevalUfficioContabileSet", {
          success: function (data) {
            oModelFilter.setProperty(
              "/UfficioContabile",
              data?.results[0]?.Fkber
            );
            oModelFilter.setProperty(
              "/UfficioPagatore",
              data?.results[0]?.Fkber
            );
          },
          error: function (error) {},
        });
      },
      //#endregion

      //#region -------------------GESTIONE FILTRI-----------------------------/
      setFiltersScenario1: function () {
        var self = this;
        var aFilters = [];
        var oModelSoa = self.getModel("Soa");
        var oModelFilter = self.getModel("FilterDocumenti");

        //Estremi di ricerca per Ritenute
        self.setFilterEQ(
          aFilters,
          "CodRitenuta",
          oModelFilter.getProperty("/CodRitenuta")
        );
        self.setFilterEQ(
          aFilters,
          "CodEnte",
          oModelFilter.getProperty("/CodEnte")
        );
        self.setFilterEQ(
          aFilters,
          "QuoteEsigibili",
          oModelFilter.getProperty("/QuoteEsigibili")
        );
        self.setFilterBT(
          aFilters,
          "DataEsigibilita",
          oModelFilter.getProperty("/DataEsigibilitaFrom"),
          oModelFilter.getProperty("/DataEsigibilitaTo")
        );

        //Estremi di ricerca per Beneficiario
        self.setFilterEQ(aFilters, "Lifnr", oModelFilter.getProperty("/Lifnr"));
        self.setFilterEQ(
          aFilters,
          "TipoBeneficiario",
          oModelFilter.getProperty("/TipoBeneficiario")
        );

        //Estremi di ricerca per Documento di Costo
        self.setFilterEQ(
          aFilters,
          "UfficioContabile",
          oModelFilter.getProperty("/UfficioContabile")
        );
        self.setFilterEQ(
          aFilters,
          "UfficioPagatore",
          oModelFilter.getProperty("/UfficioPagatore")
        );
        var aAnnoRegDocumento = oModelFilter.getProperty("/AnnoRegDocumento");
        aAnnoRegDocumento.map((sAnno) => {
          self.setFilterEQ(aFilters, "AnnoRegDocumento", sAnno);
        });
        self.setFilterBT(
          aFilters,
          "Belnr",
          oModelFilter.getProperty("/NumRegDocFrom"),
          oModelFilter.getProperty("/NumRegDocTo")
        );
        var aAnnoDocBeneficiario = oModelFilter.getProperty(
          "/AnnoDocBeneficiario"
        );
        aAnnoDocBeneficiario.map((sAnno) => {
          self.setFilterEQ(aFilters, "AnnoDocBeneficiario", sAnno);
        });
        var aNDocBen = oModelFilter.getProperty("/NDocBen");
        aNDocBen.map((sNDocBen) => {
          self.setFilterEQ(aFilters, "Xblnr", sNDocBen);
        });
        self.setFilterEQ(aFilters, "Cig", oModelFilter.getProperty("/Cig"));
        self.setFilterEQ(aFilters, "Cup", oModelFilter.getProperty("/Cup"));
        self.setFilterBT(
          aFilters,
          "ScadenzaDoc",
          oModelFilter.getProperty("/ScadenzaDocFrom"),
          oModelFilter.getProperty("/ScadenzaDocTo")
        );

        self.setFilterEQ(
          aFilters,
          "EsercizioContabile",
          oModelSoa.getProperty("/Gjahr")
        );
        self.setFilterEQ(aFilters, "Fipex", oModelSoa.getProperty("/Fipos"));
        self.setFilterEQ(aFilters, "Fistl", oModelSoa.getProperty("/Fistl"));

        return aFilters;
      },
      checkPosizioniScenario1: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        var fImpTot = parseFloat(oModelSoa.getProperty("/Zimptot"));
        var fImpDispAutorizzazione = parseFloat(
          oModelSoa.getProperty("/Zimpdispaut")
        );

        if (fImpTot > fImpDispAutorizzazione) {
          sap.m.MessageBox.error(oBundle.getText("msgImpTotGreaterImpDispAut"));
          return false;
        }

        if (
          oModelSoa.getProperty("/data").length === 0 ||
          oModelSoa.getProperty("/Zimptot") === "0.00"
        ) {
          sap.m.MessageBox.error(oBundle.getText("msgNoDocuments"));
          return false;
        }

        return true;
      },

      //#endregion-----------------GESTIONE FILTRI-----------------------------/

      //#endregion
    });
  }
);
