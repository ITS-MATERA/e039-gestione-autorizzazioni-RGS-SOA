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

      onValueHelpDescProspLiquidazione: function () {
        var self = this;
        var oDataModel = self.getModel();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.filtersDocumentiProspetti.DescProspLiquidazione"
        );

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

      /**--------------------------SCENARIO 4-------------------------------- */

      onValueHelpBeneficiarioScen4: function () {
        var self = this;
        var oModel = self.getModel();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.BeneficiarioScen4"
        );

        self;
        oModel.read("/RicercaBeneficiarioSet", {
          success: function (data, oResponse) {
            self.setResponseMessage(oResponse);
            var oModelJson = new JSONModel();
            oModelJson.setData(data.results);
            var oSelectDialog = sap.ui.getCore().byId("sdBeneficiarioScen4");
            oSelectDialog?.setModel(oModelJson, "Beneficiario");
            oDialog.open();
          },
          error: function (error) {},
        });
      },

      onValueHelpBeneficiarioScen4Close: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");

        oModelSoa.setProperty(
          "/Lifnr",
          self.setBlank(oSelectedItem?.getTitle())
        );
        oModelSoa.setProperty("/NameFirst", oSelectedItem?.data("NameFirst"));
        oModelSoa.setProperty("/NameLast", oSelectedItem?.data("NameLast"));
        oModelSoa.setProperty("/ZzragSoc", oSelectedItem?.data("ZzragSoc"));
        oModelSoa.setProperty("/TaxnumCf", oSelectedItem?.data("TaxnumCf"));
        oModelSoa.setProperty("/TaxnumPiva", oSelectedItem?.data("TaxnumPiva"));
        oModelSoa.setProperty("/Taxnumxl", oSelectedItem?.data("Taxnumxl"));
        oModelSoa.setProperty("/BuType", oSelectedItem?.data("BuType"));

        oModelSoa.setProperty("/Zwels", "");
        oModelSoa.setProperty("/Iban", "");
        self.getModalitaPagamentoList();
        self.setDurc();
        self.setFermoAmministrativo();

        self.unloadFragment();
      },

      onValueHelpCentroCosto: function () {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.CentroCosto"
        );

        oModel.read("/" + "CentroCostoSet", {
          success: function (data, oResponse) {
            self.setModelSelectDialog(
              "CentroCosto",
              data,
              "sdCentroCosto",
              oDialog
            );
          },
          error: function (error) {},
        });
      },

      onValueHelpCentroCostoClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");

        oModelSoa.setProperty(
          "/Kostl",
          self.setBlank(oSelectedItem?.getTitle())
        );
        oModelSoa.setProperty(
          "/DescKostl",
          self.setBlank(oSelectedItem?.data("Description"))
        );

        self.unloadFragment();
      },

      onValueHelpContoCoGe: function () {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.ContoCoGe"
        );

        var aFilters = [];

        self.setFilterEQ(aFilters, "Fipos", oModelSoa.getProperty("/Fipos"));
        self.setFilterEQ(aFilters, "Gjahr", oModelSoa.getProperty("/Gjahr"));

        oModel.read("/" + "ContoCoGeSet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setModelSelectDialog(
              "ContoCoGe",
              data,
              "sdContoCoGe",
              oDialog
            );
          },
          error: function (error) {},
        });
      },

      onValueHelpContoCoGeClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");

        oModelSoa.setProperty(
          "/Hkont",
          self.setBlank(oSelectedItem?.getTitle())
        );
        oModelSoa.setProperty(
          "/DescHkont",
          self.setBlank(oSelectedItem?.data("Description"))
        );

        self.unloadFragment();
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

      onModalitaPagamentoChange: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oSelectedItem = oEvent.getParameter("selectedItem");

        oModelSoa.setProperty(
          "/Zdescwels",
          self.setBlank(oSelectedItem.getText())
        );

        self._resetDataModalitaPagamento();
        self.setIbanBeneficiario();
        self.setDataBancaAccIntermediario();
        self.setDataInps();
      },

      onBeneficiarioScen4Change: function (oEvent) {
        var self = this;

        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        if (!oEvent.getParameter("value")) {
          oModelSoa.setProperty("/NameFirst", "");
          oModelSoa.setProperty("/NameLast", "");
          oModelSoa.setProperty("/ZzragSoc", "");
          oModelSoa.setProperty("/TaxnumCf", "");
          oModelSoa.setProperty("/Taxnumxl", "");
          oModelSoa.setProperty("/TaxnumPiva", "");
          oModelSoa.setProperty("/Zsede", "");
          oModelSoa.setProperty("/Zdenominazione", "");
          oModelSoa.setProperty("/ZzDescebe", "");
          oModelSoa.setProperty("/Zdurc", "");
          oModelSoa.setProperty("/ZfermAmm", "");
          oModelSoa.setProperty("/Zdstatodes", "");
          oModelSoa.setProperty("/Zdscadenza", "");
          oModelSoa.setProperty("/BuType", "");
          oModelSoa.setProperty("/Zwels", "");
          oModelSoa.setProperty("/Iban", "");
          return;
        }

        var sPath = self.getModel().createKey("/RicercaBeneficiarioSet", {
          Beneficiario: oEvent.getParameter("value"),
        });

        oModel.read(sPath, {
          success: function (oData, oResponse) {
            if (self.setResponseMessage(oResponse)) {
              oModelSoa.setProperty("/Lifnr", "");
              oModelSoa.setProperty("/NameFirst", "");
              oModelSoa.setProperty("/NameLast", "");
              oModelSoa.setProperty("/ZzragSoc", "");
              oModelSoa.setProperty("/TaxnumCf", "");
              oModelSoa.setProperty("/Taxnumxl", "");
              oModelSoa.setProperty("/TaxnumPiva", "");
              oModelSoa.setProperty("/Zsede", "");
              oModelSoa.setProperty("/Zdenominazione", "");
              oModelSoa.setProperty("/ZzDescebe", "");
              oModelSoa.setProperty("/Zdurc", "");
              oModelSoa.setProperty("/ZfermAmm", "");
              oModelSoa.setProperty("/Zdstatodes", "");
              oModelSoa.setProperty("/Zdscadenza", "");
              oModelSoa.setProperty("/BuType", "");
              oModelSoa.setProperty("/Zwels", "");
              oModelSoa.setProperty("/Iban", "");
              return;
            }

            self.setDataBenficiario();
            oModelSoa.setProperty("/BuType", oData.Type);
            oModelSoa.setProperty("/NameFirst", oData.Nome);
            oModelSoa.setProperty("/NameLast", oData.Cognome);
            oModelSoa.setProperty("/ZzragSoc", oData.RagSoc);
            oModelSoa.setProperty("/TaxnumCf", oData.CodFisc);
            oModelSoa.setProperty("/Taxnumxl", oData.CodFiscEst);
            oModelSoa.setProperty("/TaxnumPiva", oData.PIva);

            self.getModalitaPagamentoList();
            self.setDurc();
            self.setFermoAmministrativo();
          },
        });
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

        oModel.read("/" + sPath, {
          success: function (data, oResponse) {
            oModelSoa.setProperty("/DescZspecieSop", data?.ZdescSpecieSoa);
            oModelSoa.setProperty("/ZspecieSop", data?.ZspecieSoa);
          },
          error: function () {},
        });
      },

      getModalitaPagamentoList: function () {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oModelSoa.getProperty("/Lifnr"));

        oModel.read("/ModalitaPagamentoScen4Set", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setModelCustom("ModalitaPagamento", data.results);
          },
          error: function (error) {},
        });
      },

      setDurc: function () {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty("/Zdurc", "");

        if (oModelSoa.getProperty("/Lifnr")) {
          var sPath = self.getModel().createKey("PrevalDurcSet", {
            Lifnr: oModelSoa.getProperty("/Lifnr"),
          });

          oModel.read("/" + sPath, {
            success: function (data, oResponse) {
              oModelSoa.setProperty("/Zdurc", data?.Zdurc);
            },
            error: function () {},
          });
        }
      },

      setFermoAmministrativo: function () {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty("/ZfermAmm", "");

        if (oModelSoa.getProperty("/Lifnr")) {
          var sPath = self
            .getModel()
            .createKey("PrevalFermoAmministrativoSet", {
              Lifnr: oModelSoa.getProperty("/Lifnr"),
            });

          oModel.read("/" + sPath, {
            success: function (data, oResponse) {
              oModelSoa.setProperty("/ZfermAmm", data?.ZfermAmm);
            },
            error: function () {},
          });
        }
      },

      setSoaRegModel: function (sTipopag) {
        var self = this;
        var oModelSoa = {
          EnableEdit: true,
          visibleBtnEdit: false,
          /**  CHIAVI */
          Gjahr: "",
          Bukrs: "",
          Zchiavesop: "",
          Ztipososp: "2",
          Zstep: "",

          /**   Scenario    */
          Ztipopag: sTipopag, //Tipo Pagamento

          /**   Dati SOA (Parte celeste in alto)   */
          Zimptot: "0.00", //Importo
          Zzamministr: "", //Amministrazione
          ZufficioCont: "", //Ufficio Contabile
          NameFirst: "", //Nome Beneficiairo
          NameLast: "", //Cognome Beneficiario
          ZzragSoc: "", //Ragione Sociale
          TaxnumCf: "", //Codice Fiscale
          TaxnumPiva: "", //Partita Iva
          Zgeber: "", //Id Autorizzazione
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
          ZflagFipos: false,

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
          Zdstatodes: "", //Stato DURC
          Zdscadenza: null, //Scandenza DURC

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
          Zalias: "", //Alias RGS
          AccTypeId: "", //Tipo conto
          RegioConto: "", //Provincia
          ZaccText: "", //Descrizione conto
          Zzposfinent: "", //Posizione finanziaria entrate
          Zpurpose: "", //Purpose
          Zflagfrutt: "", //Flag Fruttifero/Infruttifero
          Zcausben: "", //Causale Per Beneficiario
          Seqnr: "",

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
          Zstcd14: "", //Identificativo Fiscale Estero (Primo quietanzante)
          Zstcd15: "", //Identificativo Fiscale Estero (Secondo quietanzante)
          ZzragSocQuietanzante: "", //Ragione sociale
          Land1Quietanzante: "", //Nazione
          Land1Quietanzante2: "", //Nazione
          Znumquiet: "", //Numero Queitanzante 1
          Znumquiet2: "", //Numero Queitanzante 1

          /**   WIZARD 2 - Versante    */
          Zcodprov: "", //INPS - Codice Provenienza
          Zcfcommit: "", //INPS - Codice Fiscale Committente
          Zcodtrib: "", //INPS - Codice tributo
          Zperiodrifda: null, //INPS - Periodo riferimento da
          Zperiodrifa: null, //INPS - Periodo riferimento a
          Zcodinps: "", //INPS - Matricola INPS/Codice INPS/Filiale azienda
          Zcfvers: "", //INPS - Codice Fiscale Versante
          Zcodvers: "", //INPS - Codice Versante
          FlagInpsEditabile: false,
          Zdescvers: "", //Descrizione versante
          Zdatavers: null, //Data versamento
          Zprovvers: "", //Provincia versante
          Zsedevers: "", //Sede versante

          /**   WIZARD 2 - Sede Beneficiario */
          Zidsede: "", //Sede Beneficiario
          Stras: "", //Via,numero civico
          Ort01: "", //Località
          Regio: "", //Regione
          Pstlz: "", //Codice di avviamento postale
          Land1: "", //Codice paese

          /**   WIZARD 2 - Banca Accredito */
          Zibanb: "", //IBAN
          Zbicb: "", //BIC
          Zcoordestb: "", //Coordinate estere
          Zdenbancab: "", //Denominazione banca
          Zclearsystb: "", //ClearingSystemid
          Strasb: "", //Via
          Zcivicob: "", //Civico
          Ort01b: "", //Città
          Regiob: "", //Provincia
          Pstlzb: "", //CAP
          Land1b: "", //Nazione

          /**   WIZARD 2 - Intestatario 1 */
          Zibani: "", //IBAN
          Zbici: "", //BIC
          Zcoordesti: "", //Coordinate estere
          Zdenbancai: "", //Denominazione banca
          Zclearsysti: "", //ClearingSystemid
          Zstrasi: "", //Via
          Zcivicoi: "", //Civico
          Zort01i: "", //Città
          Zregioi: "", //Provincia
          Zpstlzi: "", //CAP
          Zland1i: "", //Nazione

          /**   WIZARD 3    */
          Classificazione: [], //Classificazioni

          /**   WIZARD 4    */
          Zcausale: "", //Causale di pagamento
          ZE2e: "", //E2E ID
          Zlocpag: "", //Località pagamento
          Zzonaint: "", //Zona di intervento
          Znumprot: "", //Numero protocollo
          Zdataprot: null, //Data protocollo
          Zdataesig: null, //Data esigibilità

          ZcodStatosop: "",
          Zdatasop: null,
          Znumsop: "",
          Zricann: "",
          ZstatTest: "",
          Zutenza: "",
          Messaggio: [], //Messaggi di error
        };

        self.setModel(new JSONModel(oModelSoa), "Soa");
      },

      setDataAutorizzazione: function (oParameters) {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        oModelSoa.setProperty(
          "/Zgeber",
          oParameters.Zgeber === "null" ? "" : oParameters.Zgeber
        );

        var sPath = oModel.createKey("ChiaveAutorizzazioneSet", {
          Gjahr: oParameters.Gjahr,
          Zchiaveaut: oParameters.Zchiaveaut,
          Bukrs: oParameters.Bukrs,
          ZstepAut: "",
        });

        self.getView().setBusy(true);
        oModel.read("/" + sPath, {
          success: function (data, oResponse) {
            self.getView().setBusy(false);

            oModelSoa.setProperty("/Gjahr", data?.Gjahr);
            oModelSoa.setProperty("/Zzamministr", data?.Zzamministr);
            oModelSoa.setProperty("/ZufficioCont", data?.ZufficioCont);
            oModelSoa.setProperty("/Fipos", data?.Fipos);
            oModelSoa.setProperty("/Fistl", data?.Fistl);
            oModelSoa.setProperty("/Zchiaveaut", data?.Zchiaveaut);
            oModelSoa.setProperty("/Ztipodisp2", data?.Ztipodisp2);
            oModelSoa.setProperty("/Zdesctipodisp2", data?.Zdesctipodisp2);
            oModelSoa.setProperty("/Ztipodisp3", data?.Ztipodisp3);
            oModelSoa.setProperty("/Zdesctipodisp3", data?.Zdesctipodisp3);
            oModelSoa.setProperty("/Zdesctipodisp3", data?.Zdesctipodisp3);
            oModelSoa.setProperty("/Zimpaut", data?.Zimpaut);
            oModelSoa.setProperty("/Zimpdispaut", data?.Zimpdispaut);
            oModelSoa.setProperty("/Zfunzdel", data?.Zfunzdel);
            oModelSoa.setProperty("/Zdescriz", data?.Zdescriz);
            oModelSoa.setProperty("/ZflagFipos", data?.ZflagFipos);
            if (oModelSoa.getProperty("/Ztipopag") === "4") {
              oModelSoa.setProperty("/ZspecieSop", "1");
              oModelSoa.setProperty("/DescZspecieSop", "Sosp Ben.");
            }
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      setClassificazioneRegModel: function () {
        var self = this;

        var oModelClassificazione = new JSONModel({
          Cos: [],
          Cpv: [],
          Cig: [],
          Cup: [],
          ImpTotAssociareCos: "0.00",
          ImpTotAssociareCpv: "0.00",
          ImpTotAssociareCig: "0.00",
          ImpTotAssociareCup: "0.00",
        });

        self.setModel(oModelClassificazione, "Classificazione");
      },

      setUtilityRegModel: function () {
        var self = this;
        var oModelUtility = new JSONModel({
          EnableEdit: true,
          DetailFromFunction: true,
          RemoveFunctionButtons: true,
          IbanPrevalorizzato: false,
        });

        self.setModel(oModelUtility, "Utility");
      },

      setStepScenarioRegModel: function () {
        var self = this;
        var oModelStepScenario = new JSONModel({
          wizard1Step1: true,
          wizard1Step2: false,
          wizard1Step3: false,
          wizard2: false,
          wizard3: false,
          wizard4: false,
          visibleBtnForward: false,
          visibleBtnStart: true,
          visibleBtnSave: false,
        });

        self.setModel(oModelStepScenario, "StepScenario");
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
              sZwels = "";
              sDesczwels = "";
            }

            oModelSoa.setProperty("/Zdescwels", sDesczwels);
            oModelSoa.setProperty("/Zwels", sZwels);

            self._resetDataModalitaPagamento();
            self.setIbanBeneficiario();
            self.setDataBancaAccIntermediario();
            self.setDataInps();
          },
          error: function (error) {},
        });

        this.unloadFragment();
      },

      onValueHelpCoordEstere: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var sLifnr = self.setBlank(oModelSoa?.getProperty("/Lifnr"));

        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.CoordinateEstere"
        );
        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", sLifnr);

        oDataModel.read("/CordEstereBenSOASet", {
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
      },

      onValueHelpCoordEstereClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sSwift = self.setBlank(oSelectedItem?.data("Swift"));
        var sZcoordest = self.setBlank(oSelectedItem?.getTitle());

        if (!self._checkIbanCoordEstere("CoordinateEstere")) {
          return;
        }

        oModelSoa.setProperty("/Zcoordest", sZcoordest);
        oModelSoa.setProperty("/Swift", sSwift);
        self._setBanksSeqnr();

        this.unloadFragment();
      },

      onValueHelpCFQuietanzante: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.CodiceFiscaleQuietanzante"
        );

        var oSelectDialog = sap.ui
          .getCore()
          .byId("sdCodiceFiscaleQuietanzante");

        oSelectDialog.data(
          "Quietanzante",
          oEvent.getSource().data().Quietanzante
        );

        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oModelSoa?.getProperty("/Lifnr"));
        self.setFilterEQ(aFilters, "Zwels", oModelSoa?.getProperty("/Zwels"));
        self.setFilterEQ(
          aFilters,
          "TipoFirma",
          oModelSoa?.getProperty("/Ztipofirma")
        );

        oDataModel.read("/" + "CodFiscUtilizzatoreBenSOASet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setModelSelectDialog(
              "CodiceFiscaleQuietanzante",
              data,
              "sdCodiceFiscaleQuietanzante",
              oDialog
            );
          },
          error: function (error) {},
        });
      },

      onValueHelpCFQuietanzanteClose: function (oEvent) {
        var self = this;
        //Load Models
        var oModelSoa = self.getModel("Soa");

        var sQuietanzante = oEvent.getSource().data("Quietanzante");

        var oSelectedItem = oEvent?.getParameter("selectedItem");
        var sCodiceFiscale = self.setBlank(oSelectedItem?.getTitle());
        var sZnumquiet = oEvent
          ?.getParameter("selectedItem")
          ?.data("Znumquiet");

        switch (sQuietanzante) {
          case "Primo": {
            oModelSoa.setProperty("/Znumquiet", sZnumquiet);

            if (oModelSoa.getProperty("/Zwels") === "ID1") {
              oModelSoa.setProperty("/Zstcd1", sCodiceFiscale);
            } else if (oModelSoa.getProperty("/Zwels") === "ID2") {
              oModelSoa.setProperty("/Zstcd13", sCodiceFiscale);
            }
            if (!self._checkCFQuietanzante()) {
              self._resetCodiceFiscale1();
              break;
            }
            self.setDataQuietanzante();
            break;
          }
          case "Secondo": {
            oModelSoa.setProperty("/Znumquiet2", sZnumquiet);
            oModelSoa.setProperty("/Zstcd12", sCodiceFiscale);
            if (!self._checkCFQuietanzante()) {
              self._resetCodiceFiscale2();
              break;
            }
            self.setDataQuietanzante2();
            break;
          }
        }

        this.unloadFragment();
      },

      onValueHelpCFEsteroQuietanzante: function (oEvent) {
        var self = this;
        //Load Models
        var oDataModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oDialog = self.loadFragment(
          "rgssoa.view.fragment.valueHelp.CodiceFiscaleEsteroQuietanzante"
        );

        var oSelectDialog = sap.ui.getCore().byId("sdCFEsteroQuietanzante");

        oSelectDialog.data(
          "Quietanzante",
          oEvent.getSource().data().Quietanzante
        );

        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oModelSoa?.getProperty("/Lifnr"));
        self.setFilterEQ(
          aFilters,
          "TipoFirma",
          oModelSoa?.getProperty("/Ztipofirma")
        );
        self.setFilterEQ(aFilters, "Zwels", oModelSoa?.getProperty("/Zwels"));

        oDataModel.read("/CFEsteroQuietanzante1Set", {
          filters: aFilters,
          success: function (data) {
            self.setModelSelectDialog(
              "CFEsteroQuietanzante",
              data,
              "sdCFEsteroQuietanzante",
              oDialog
            );
          },
        });
      },

      onValueHelpCFEsteroQuietanzanteClose: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sQuietanzante = oEvent.getSource().data("Quietanzante");

        var sCodiceFiscale = self.setBlank(oSelectedItem?.getTitle());
        var sZnumquiet = self.setBlank(oSelectedItem?.data("Znumquiet"));

        switch (sQuietanzante) {
          case "Primo": {
            oModelSoa.setProperty("/Zstcd14", sCodiceFiscale);
            oModelSoa.setProperty("/Znumquiet", sZnumquiet);
            if (!self._checkCFEsteroQuietanzante()) {
              self._resetCodiceFiscale1();
              break;
            }
            self.setDataQuietanzante();
            break;
          }
          case "Secondo": {
            oModelSoa.setProperty("/Znumquiet2", sZnumquiet);
            oModelSoa.setProperty("/Zstcd15", sCodiceFiscale);
            if (!self._checkCFEsteroQuietanzante()) {
              self._resetCodiceFiscale2();
              break;
            }
            self.setDataQuietanzante2();
            break;
          }
        }

        this.unloadFragment();
      },

      //#endregion

      //#region SELECTION CHANGE

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

      onTipoFirmaChange: function (oEvent) {
        var sTipoFirma = oEvent?.getSource()?.getSelectedKey();

        if (sTipoFirma !== "03" && sTipoFirma !== "04") {
          this._resetCodiceFiscale2();
        }
      },

      onIbanChange: function (oEvent) {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var aFilters = [];
        var sIban = oEvent.getParameter("value");

        if (!sIban) {
          return;
        }

        if (!self._checkIbanCoordEstere("Iban")) {
          return;
        }

        self.setFilterEQ(aFilters, "Iban", sIban);
        self.setFilterEQ(aFilters, "Lifnr", oModelSoa.getProperty("/Lifnr"));

        self.getView().setBusy(true);
        oModel.read("/PrevalIbanSet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.getView().setBusy(false);
            if (self.setResponseMessage(oResponse)) {
              oModelSoa.setProperty("/Iban", "");
            }
            self._setBanksSeqnr();
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      onAliasChange: function () {
        var self = this;
        self.setIbanBeneficiario();
        self._setDataAlias();
      },

      onPosFinanziariaEntrateChange: function () {
        var self = this;
        self.setIbanBeneficiario();
      },

      onCausaleValutariaChange: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        var sDesc = oEvent.getParameter("value");

        if (!sDesc) {
          oModelSoa.setProperty("/ZCausaleval", "");
        }
      },

      onCoordinateEstereChange: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oModel = self.getModel();

        var sZcoordest = oEvent.getParameter("value");

        if (!sZcoordest) {
          oModelSoa.setProperty("/Zcoordest", "");
          oModelSoa.setProperty("/Swift", "");
          oModelSoa.setProperty("/Banks", "");
          oModelSoa.setProperty("/Seqnr", "");
          return;
        }

        if (!self._checkIbanCoordEstere("CoordinateEstere")) {
          return;
        }

        var sPath = oModel.createKey("/CordEstereBenSOASet", {
          Lifnr: oModelSoa.getProperty("/Lifnr"),
          Zcoordest: sZcoordest,
        });

        oModel.read(sPath, {
          success: function (data, oResponse) {
            if (self.setResponseMessage(oResponse)) {
              oModelSoa.setProperty("/Zcoordest", "");
              oModelSoa.setProperty("/Swift", "");
              oModelSoa.setProperty("/Banks", "");
              oModelSoa.setProperty("/Seqnr", "");
              return;
            }

            self._setBanksSeqnr();
            oModelSoa.setProperty("/Swift", data.Swift);
          },
          error: function () {},
        });
      },

      onFlagFruttiferoChange: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        var sDesc = oEvent.getSource()?.getValue()?.toLowerCase();

        switch (sDesc) {
          case "fruttifero": {
            oModelSoa.setProperty("/Zflagfrutt", "1");
            break;
          }
          case "infruttifero": {
            oModelSoa.setProperty("/Zflagfrutt", "2");
            break;
          }
          default: {
            oModelSoa.setProperty("/Zflagfrutt", "");
            oEvent.getSource().setValue("");
            break;
          }
        }
      },

      onCausaleTributoChange: function (oEvent) {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var oParameters = {
          Lifnr: oModelSoa.getProperty("/Lifnr"),
          Zwels: oModelSoa.getProperty("/Zwels"),
          Zcodtrib: oModelSoa.getProperty("/Zcodtrib"),
        };

        if (!oEvent.getParameter("value")) {
          oModelSoa.setProperty("/Zcodinps", "");
          oModelSoa.setProperty("/Zperiodrifa", null);
          oModelSoa.setProperty("/Zperiodrifda", null);
          return;
        }

        var sPath = self.getModel().createKey("/InpsSOASet", oParameters);

        oModel.read(sPath, {
          success: function (data, oResponse) {
            if (self.setResponseMessage(oResponse)) {
              oModelSoa.setProperty("/Zcodtrib", "");
              oModelSoa.setProperty("/Zcodinps", "");
              oModelSoa.setProperty("/Zperiodrifa", null);
              oModelSoa.setProperty("/Zperiodrifda", null);
              return;
            }

            oModelSoa.setProperty("/Zcodinps", data.Zcodinps);
            oModelSoa.setProperty("/Zperiodrifa", data.Zperiodrifa);
            oModelSoa.setProperty("/Zperiodrifda", data.Zperiodrifda);
          },
          error: function () {},
        });
      },

      onCFQuietanzanteChange: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        var sQuietanzante = oEvent.getSource().data().Quietanzante;

        switch (sQuietanzante) {
          case "Primo": {
            if (!oEvent.getParameter("value")) {
              self._resetCodiceFiscale1();
              return;
            }

            if (oModelSoa.getProperty("/Zwels") === "ID1") {
              oModelSoa.setProperty("/Zstcd1", oEvent.getParameter("value"));
            } else if (oModelSoa.getProperty("/Zwels") === "ID2") {
              oModelSoa.setProperty("/Zstcd13", oEvent.getParameter("value"));
            }

            if (!self._checkCFQuietanzante()) {
              self._resetCodiceFiscale1();
              break;
            }
            self.setDataQuietanzante();
            break;
          }
          case "Secondo": {
            if (!oEvent.getParameter("value")) {
              self._resetCodiceFiscale2();
              return;
            }

            oModelSoa.setProperty("/Zstcd12", oEvent.getParameter("value"));
            if (!self._checkCFQuietanzante()) {
              self._resetCodiceFiscale2();
              break;
            }
            self.setDataQuietanzante2();
            break;
          }
        }
      },

      onCFEsteroQuietanzanteChange: function (oEvent) {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var sQuietanzante = oEvent.getSource().data().Quietanzante;

        switch (sQuietanzante) {
          case "Primo": {
            if (!oEvent.getParameter("value")) {
              self._resetCodiceFiscale1();
              return;
            }
            oModelSoa.setProperty("/Zstcd14", oEvent.getParameter("value"));
            if (!self._checkCFEsteroQuietanzante()) {
              self._resetCodiceFiscale2();
              break;
            }
            self.setDataQuietanzante();
            break;
          }
          case "Secondo": {
            if (!oEvent.getParameter("value")) {
              self._resetCodiceFiscale2();
              return;
            }
            oModelSoa.setProperty("/Zstcd15", oEvent.getParameter("value"));
            if (!self._checkCFEsteroQuietanzante()) {
              self._resetCodiceFiscale2();
              break;
            }
            self.setDataQuietanzante2();
            break;
          }
        }
      },

      //Cambio IBAN
      onOkMotivazione: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var sMotivazione = sap.ui.getCore().byId("txtMotivazione")?.getValue();
        var oDialogMotivazione = sap.ui.getCore().byId("dlgMotivazione");

        oDialogMotivazione.close();
        self.unloadFragment();

        if (!sMotivazione) {
          MessageBox.error("Motivazione cambio IBAN obbligatoria", {
            title: "Errore",
          });
          oModelSoa.setProperty("/Iban", "");
          return;
        }

        oModelSoa.setProperty("/Zmotivaz", sMotivazione);
      },

      onCloseMotivazione: function () {
        var self = this;
        var oDialogMotivazione = sap.ui.getCore().byId("dlgMotivazione");
        oDialogMotivazione.close();
        self.unloadFragment();
      },

      //#endregion

      //#region PRIVATE METHODS

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
          .createKey("/BeneficiarioSOASet", oParameters);

        oDataModel.read(sPath, {
          success: function (data, oResponse) {
            self.setResponseMessage(oResponse);
            oModelSoa.setProperty("/Lifnr", data?.Beneficiario);
            oModelSoa.setProperty("/Zsede", data?.Sede);
            oModelSoa.setProperty("/Zdenominazione", data?.DescrSede);
            oModelSoa.setProperty("/ZzDescebe", data?.EnteBen);
            oModelSoa.setProperty("/Zdurc", data?.Zdurc);
            oModelSoa.setProperty("/ZfermAmm", data?.ZfermAmm);
            oModelSoa.setProperty("/Zdstatodes", data?.Zdstatodes);
            oModelSoa.setProperty("/Zdscadenza", data?.Zdscadenza);
          },
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
            .createKey("/ModalitaPagamentoSet", oParameters);

          oDataModel.read(sPath, {
            success: function (data, oResponse) {
              oModelSoa.setProperty("/Zwels", data?.Zwels);
              oModelSoa.setProperty("/Zdescwels", data?.Zdescwels);
            },
            error: function () {},
          });
        }
      },

      setIbanBeneficiario: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var sZwels = oModelSoa.getProperty("/Zwels");

        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oModelSoa.getProperty("/Lifnr"));
        self.setFilterEQ(aFilters, "Text40", oModelSoa.getProperty("/Text40"));
        self.setFilterEQ(
          aFilters,
          "ZzCebenra",
          oModelSoa.getProperty("/ZzCebenra")
        );
        self.setFilterEQ(aFilters, "Zwels", oModelSoa.getProperty("/Zwels"));
        self.setFilterEQ(aFilters, "Zalias", oModelSoa.getProperty("/Zalias"));
        self.setFilterEQ(
          aFilters,
          "Zzposfinent",
          oModelSoa.getProperty("/Zzposfinent")
        );

        if (
          sZwels !== "ID1" &&
          sZwels !== "ID2" &&
          sZwels !== "ID3" &&
          sZwels !== "ID4" &&
          oModelSoa.getProperty("/Ztipopag") === "1"
        ) {
          var aPosizioniSoa = oModelSoa.getProperty("/data");

          if (aPosizioniSoa) {
            var aPosizioniFormatted = aPosizioniSoa.map((oPosizioneSoa) => {
              var oPosizioneFormatted = {
                Prospetto: oPosizioneSoa.Znumliq,
                RigaProsp: oPosizioneSoa.Zposizione,
              };

              return oPosizioneFormatted;
            });

            self.setFilterEQ(
              aFilters,
              "Json",
              JSON.stringify(aPosizioniFormatted)
            );
          }
        }

        self.getView().setBusy(true);

        oModel.read("/PrevalIbanSet", {
          filters: aFilters,
          success: function (data) {
            self.getView().setBusy(false);
            var oData = data.results[0];
            if (oData) {
              oModelSoa.setProperty("/Iban", oData.Iban);
              oModelSoa.setProperty(
                "/IbanPrevalorizzato",
                oData.IbanPrevalorizzato
              );
              self._setBanksSeqnr();
            }
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
      },

      setDataQuietanzante: function () {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        if (
          oModelSoa.getProperty("/Zwels") !== "ID1" &&
          oModelSoa.getProperty("/Zwels") !== "ID2"
        ) {
          return;
        }

        var sPath = oModel.createKey("/DatiQuietanzanteSet", {
          Lifnr: oModelSoa.getProperty("/Lifnr"),
          Zwels: oModelSoa.getProperty("/Zwels"),
          Zstcd1:
            oModelSoa.getProperty("/Zwels") === "ID1"
              ? oModelSoa.getProperty("/Zstcd1")
              : oModelSoa.getProperty("/Zstcd13"),
          Zstcd14: oModelSoa.getProperty("/Zstcd14"),
        });

        oModel.read(sPath, {
          success: function (oData, oResponse) {
            if (self.setResponseMessage(oResponse)) {
              self._resetCodiceFiscale1();
              return;
            }

            switch (oModelSoa.getProperty("/Zwels")) {
              case "ID1": {
                oModelSoa.setProperty("/ZpersNomeQuiet1", oData?.Zqnome);
                oModelSoa.setProperty("/ZpersCognomeQuiet1", oData?.Zqcognome);
                break;
              }
              case "ID2": {
                oModelSoa.setProperty("/ZpersNomeVaglia", oData?.Zqnome);
                oModelSoa.setProperty("/ZpersCognomeVaglia", oData?.Zqcognome);
                break;
              }
            }
            oModelSoa.setProperty("/Zqindiriz", oData?.Zqindiriz);
            oModelSoa.setProperty("/Zqcitta", oData?.Zqcitta);
            oModelSoa.setProperty("/Zqcap", oData?.Zqcap);
            oModelSoa.setProperty("/Zqprovincia", oData?.Zqprovincia);
            oModelSoa.setProperty("/Land1Quietanzante", oData?.Land1);
            oModelSoa.setProperty("/ZzragSocQuietanzante", oData?.ZzragSoc);
          },
        });
      },

      setDataQuietanzante2: function () {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        if (
          oModelSoa.getProperty("/Zwels") !== "ID1" &&
          oModelSoa.getProperty("/Zwels") !== "ID2"
        ) {
          return;
        }

        var sPath = oModel.createKey("/DatiQuietanzanteSet", {
          Lifnr: oModelSoa.getProperty("/Lifnr"),
          Zwels: oModelSoa.getProperty("/Zwels"),
          Zstcd1: oModelSoa.getProperty("/Zstcd12"),
          Zstcd14: oModelSoa.getProperty("/Zstcd15"),
        });

        oModel.read(sPath, {
          success: function (oData, oResponse) {
            if (self.setResponseMessage(oResponse)) {
              self._resetCodiceFiscale2();
              return;
            }

            oModelSoa.setProperty("/ZpersCognomeQuiet2", oData?.Zqcognome);
            oModelSoa.setProperty("/ZpersNomeQuiet2", oData?.Zqnome);
            oModelSoa.setProperty("/Land1Quietanzante2", oData?.Land1);
            oModelSoa.setProperty("/Zqindiriz12", oData?.Zqindiriz);
            oModelSoa.setProperty("/Zqcitta12", oData?.Zqcitta);
            oModelSoa.setProperty("/Zqcap12", oData?.Zqcap);
            oModelSoa.setProperty("/Zqprovincia12", oData?.Zqprovincia);
          },
        });
      },

      setDataInps: function () {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        if (
          oModelSoa.getProperty("/Zwels") === "ID3" ||
          oModelSoa.getProperty("/Zwels") === "ID4"
        ) {
          var oParameters = {
            Lifnr: oModelSoa.getProperty("/Lifnr"),
            Zwels: oModelSoa.getProperty("/Zwels"),
            Zcodtrib: "",
          };

          var sPath = self.getModel().createKey("/InpsSOASet", oParameters);

          oModel.read(sPath, {
            success: function (data) {
              oModelSoa.setProperty(
                "/FlagInpsEditabile",
                data?.FlagInpsEditabile ? true : false
              );
              oModelSoa.setProperty("/Zcodprov", data?.Zcodprov);
            },
            error: function () {},
          });
        }
      },

      setDataBancaAccIntermediario: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var aFilters = [];
        var sZwels = oModelSoa.getProperty("/Zwels");

        if (sZwels !== "06" && sZwels !== "10") {
          return;
        }

        self.setFilterEQ(aFilters, "Lifnr", oModelSoa.getProperty("/Lifnr"));
        self.setFilterEQ(aFilters, "Iban", oModelSoa.getProperty("/Iban"));
        self.setFilterEQ(
          aFilters,
          "Zcoordest",
          oModelSoa.getProperty("/Zcoordest")
        );
        self.setFilterEQ(aFilters, "Seqnr", oModelSoa.getProperty("/Seqnr"));

        self.getView().setBusy(true);

        oModel.read("/BancaAccIntermediarioSet", {
          filters: aFilters,
          success: function (data) {
            self.getView().setBusy(false);
            var oData = data.results[0];

            oModelSoa.setProperty("/Zibanb", oData.Zibanb);
            oModelSoa.setProperty("/Zbicb", oData.Zbicb);
            oModelSoa.setProperty("/Zcoordestb", oData.Zcoordestb);
            oModelSoa.setProperty("/Zdenbancab", oData.Zdenbanca);
            oModelSoa.setProperty("/Zclearsystb", oData.Zclearsyst);
            oModelSoa.setProperty("/Strasb", oData.Stras);
            oModelSoa.setProperty("/Zcivicob", oData.Zcivico);
            oModelSoa.setProperty("/Ort01b", oData.Ort01);
            oModelSoa.setProperty("/Regiob", oData.Regio);
            oModelSoa.setProperty("/Pstlzb", oData.Stlz);
            oModelSoa.setProperty("/Land1b", oData.Land1);

            oModelSoa.setProperty("/Zibani", oData.Zibani);
            oModelSoa.setProperty("/Zbici", oData.Zbici);
            oModelSoa.setProperty("/Zcoordesti", oData.Zcoordesti);
            oModelSoa.setProperty("/Zdenbancai", oData.Zdenbancai);
            oModelSoa.setProperty("/Zclearsysti", oData.Zclearsysti);
            oModelSoa.setProperty("/Zstrasi", oData.Zstrasi);
            oModelSoa.setProperty("/Zcivicoi", oData.Zcivicoi);
            oModelSoa.setProperty("/Zort01i", oData.Zort01i);
            oModelSoa.setProperty("/Zregioi", oData.Zregioi);
            oModelSoa.setProperty("/Zpstlzi", oData.Zpstlzi);
            oModelSoa.setProperty("/Zland1i", oData.Zland1i);
          },
          error: function () {
            self.getView().setBusy(false);
          },
        });
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

        oDataModel.read("/SedeBeneficiarioSOASet", {
          filters: aFilters,
          success: function (data, oResponse) {
            self.setResponseMessage(oResponse);
            self.setModelCustom("SedeBeneficiario", data?.results);
          },
          error: function (error) {},
        });
      },

      _setBanksSeqnr: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var sIban = oModelSoa.getProperty("/Iban");
        var sZcoordest = oModelSoa.getProperty("/Zcoordest");
        var sZwels = oModelSoa.getProperty("/Zwels");
        var sLifnr = oModelSoa.getProperty("/Lifnr");

        var sPath = self.getModel().createKey("/PrevalBanksSeqnrSet", {
          Iban: sIban,
          Zcoordest: sZcoordest,
          Zwels: sZwels,
          Lifnr: sLifnr,
        });

        if (!sIban && !sZcoordest) {
          return;
        }

        oModel.read(sPath, {
          success: function (data) {
            oModelSoa.setProperty("/Banks", data.Banks);
            oModelSoa.setProperty("/Seqnr", data.Seqnr);
          },
          error: function (data) {},
        });
      },

      _setDataAlias: function () {
        var self = this;
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");

        var sZalias = oModelSoa.getProperty("/Zalias");

        if (!sZalias) {
          oModelSoa.setProperty("/AccTypeId", "");
          oModelSoa.setProperty("/RegioConto", "");
          oModelSoa.setProperty("/ZaccText", "");
          return;
        }

        var sPath = oModel.createKey("/PrevalAliasSet", {
          Zalias: sZalias,
        });

        oModel.read(sPath, {
          success: function (data) {
            oModelSoa.setProperty("/AccTypeId", data.AccTypeId);
            oModelSoa.setProperty("/RegioConto", data.Regio);
            oModelSoa.setProperty("/ZaccText", data.ZaccText);
          },
          error: function () {},
        });
      },

      _resetDataModalitaPagamento: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var sZwels = oModelSoa.getProperty("/Zwels");

        if (sZwels !== "ID3") {
          oModelSoa.setProperty("/Zalias", "");
          oModelSoa.setProperty("/AccTypeId", "");
          oModelSoa.setProperty("/RegioConto", "");
          oModelSoa.setProperty("/ZaccText", "");
          oModelSoa.setProperty("/Zflagfrutt", "");
          oModelSoa.setProperty("/Zcausben", "");
        }
        if (sZwels !== "ID4") {
          oModelSoa.setProperty("/Zzposfinent", "");
        }
        if (sZwels !== "ID6" && sZwels !== "ID10") {
          oModelSoa.setProperty("/Swift", "");
          oModelSoa.setProperty("/Zcoordest", "");
          oModelSoa.setProperty("/Zpurpose", "");

          oModelSoa.setProperty("/Zibanb", "");
          oModelSoa.setProperty("/Zbicb", "");
          oModelSoa.setProperty("/Zcoordestb", "");
          oModelSoa.setProperty("/Zdenbancab", "");
          oModelSoa.setProperty("/Zclearsystb", "");
          oModelSoa.setProperty("/Strasb", "");
          oModelSoa.setProperty("/Zcivicob", "");
          oModelSoa.setProperty("/Ort01b", "");
          oModelSoa.setProperty("/Regiob", "");
          oModelSoa.setProperty("/Pstlzb", "");
          oModelSoa.setProperty("/Land1b", "");

          oModelSoa.setProperty("/Zibani", "");
          oModelSoa.setProperty("/Zbici", "");
          oModelSoa.setProperty("/Zcoordesti", "");
          oModelSoa.setProperty("/Zdenbancai", "");
          oModelSoa.setProperty("/Zclearsysti", "");
          oModelSoa.setProperty("/Zstrasi", "");
          oModelSoa.setProperty("/Zcivicoi", "");
          oModelSoa.setProperty("/Zort01i", "");
          oModelSoa.setProperty("/Zregioi", "");
          oModelSoa.setProperty("/Zpstlzi", "");
          oModelSoa.setProperty("/Zland1i", "");
        }

        oModelSoa.setProperty("/Ztipofirma", "");
        this._resetCodiceFiscale1();
        this._resetCodiceFiscale2();

        if (sZwels !== "ID3" && sZwels !== "ID4") {
          oModelSoa.setProperty("/Zcodprov", "");
          oModelSoa.setProperty("/Zcfcommit", "");
          oModelSoa.setProperty("/Zcodtrib", "");
          oModelSoa.setProperty("/Zperiodrifda", null);
          oModelSoa.setProperty("/Zperiodrifa", null);
          oModelSoa.setProperty("/Zcodinps", "");
          oModelSoa.setProperty("/FlagInpsEditabile", false);
          oModelSoa.setProperty("/Zdescvers", "");
          oModelSoa.setProperty("/Zdatavers", null);
          oModelSoa.setProperty("/Zprovvers", "");
          oModelSoa.setProperty("/Zsedevers", "");
        }
      },

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
        oModelSoa.setProperty("/Zstcd14", "");
        oModelSoa.setProperty("/Land1Quietanzante", "");
        oModelSoa.setProperty("/ZzragSocQuietanzante", "");
        oModelSoa.setProperty("/Znumquiet", "");
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
        oModelSoa.setProperty("/Zstcd15", "");
        oModelSoa.setProperty("/Land1Quietanzante2", "");
        oModelSoa.setProperty("/Znumquiet2", "");
      },

      _checkCFQuietanzante: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        var sCodiceFiscale =
          oModelSoa.getProperty("/Zwels") === "ID1"
            ? oModelSoa.getProperty("/Zstcd1")
            : oModelSoa.getProperty("/Zwels") === "ID2"
            ? oModelSoa.getProperty("/Zstcd13")
            : "";

        var sCodiceFiscale2 = oModelSoa.getProperty("/Zstcd12");

        if (!sCodiceFiscale && !sCodiceFiscale2) {
          return true;
        }

        if (sCodiceFiscale === sCodiceFiscale2) {
          MessageBox.error(
            "Il codice fiscale è già stato inserito per un quietanzante"
          );
          return false;
        }

        return true;
      },

      _checkCFEsteroQuietanzante: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        var sCodiceFiscale = oModelSoa.getProperty("/Zstcd14");
        var sCodiceFiscale2 = oModelSoa.getProperty("/Zstcd15");

        if (!sCodiceFiscale && !sCodiceFiscale2) {
          return true;
        }

        if (sCodiceFiscale === sCodiceFiscale2) {
          MessageBox.error(
            "Il codice fiscale è già stato inserito per un quietanzante"
          );
          return false;
        }

        return true;
      },

      _checkIbanCoordEstere: function (sField) {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        var sIban = oModelSoa.getProperty("/Iban");
        var sZcooordEst = oModelSoa.getProperty("/Zcoordest");

        if (sField === "Iban" && sZcooordEst) {
          MessageBox.error("Valorizzare IBAN o Coordinate estere");
          oModelSoa.setProperty("/Iban", "");
          return false;
        }

        if (sField === "CoordinateEstere" && sIban) {
          MessageBox.error("Valorizzare IBAN o Coordinate estere");
          oModelSoa.setProperty("/Zcoordest", "");
          return false;
        }

        return true;
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
            Zchiavesop: self.setBlank(oPosizione?.Zchiavesop),
            Bukrs: self.setBlank(oPosizione?.Bukrs),
            Gjahr: self.setBlank(oPosizione?.Gjahr),
            Zpossop: self.setBlank(oPosizione?.Zpossop),
            ZstepSop: self.setBlank(oPosizione?.ZstepSop),
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
          Zdescvers: oModelSoa.getProperty("/Zdescvers"),
          Zdatavers: oModelSoa.getProperty("/Zdatavers"),
          Zprovvers: oModelSoa.getProperty("/Zprovvers"),
          Zsedevers: oModelSoa.getProperty("/Zsedevers"),
          Zstcd14: oModelSoa.getProperty("/Zstcd14"),
          Zstcd15: oModelSoa.getProperty("/Zstcd15"),
          Zalias: oModelSoa.getProperty("/Zalias"),
          AccTypeId: oModelSoa.getProperty("/AccTypeId"),
          Regio: oModelSoa.getProperty("/RegioConto"),
          ZaccText: oModelSoa.getProperty("/ZaccText"),
          Zflagfrutt: oModelSoa.getProperty("/Zflagfrutt"),
          Zcausben: oModelSoa.getProperty("/Zcausben"),
          Zpurpose: oModelSoa.getProperty("/Zpurpose"),
          Zzposfinent: oModelSoa.getProperty("/Zzposfinent"),
          Seqnr: oModelSoa.getProperty("/Seqnr"),
          Znumquiet: oModelSoa.getProperty("/Znumquiet"),
          Znumquiet2: oModelSoa.getProperty("/Znumquiet2"),
          ZflagFipos: oModelSoa.getProperty("/ZflagFipos"),
          Zgeber: oModelSoa.getProperty("/Zgeber"),
          Banks: oModelSoa.getProperty("/Banks"),

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

      setCausalePagamento: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        var aListDocumenti = oModelSoa.getProperty("/data");

        var sZcausale = "";
        aListDocumenti.map((oDocumento) => {
          if (sZcausale) {
            sZcausale + " ";
          }

          sZcausale =
            sZcausale +
            oDocumento.Belnr +
            " " +
            formatter.dateWithPoints(oDocumento.Bldat);
        });

        oModelSoa.setProperty("/Zcausale", sZcausale);
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

        if (
          oModelSoa.getProperty("/Zwels") === "ID4" ||
          oModelSoa.getProperty("/Zwels") === "ID3"
        ) {
          var oParameters = {
            Lifnr: oModelSoa.getProperty("/Lifnr"),
            Zwels: oModelSoa.getProperty("/Zwels"),
            Zcodtrib: "",
          };

          var sPath = self.getModel().createKey("/InpsSOASet", oParameters);

          oModel.read(sPath, {
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
        oModelSoa.setProperty("/Zdstatodes", oData.Zdstatodes);
        oModelSoa.setProperty("/Zdscadenza", oData.Zdscadenza);
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
        oModelSoa.setProperty(
          "/Znumprot",
          oData.Znumprot === "000000" ? "" : oData.Znumprot
        );
        oModelSoa.setProperty("/Zdataprot", oData.Zdataprot);
        oModelSoa.setProperty("/Zdataesig", oData.Zdataesig);
        oModelSoa.setProperty("/ZcodStatosop", oData.ZcodStatosop);
        oModelSoa.setProperty("/Zricann", oData.Zricann);
        oModelSoa.setProperty("/DescStateSoa", oData.DescStateSoa);
        oModelSoa.setProperty("/Zdatarichann", oData.Zdatarichann);
        oModelSoa.setProperty("/AccTypeId", oData.AccTypeId);
        oModelSoa.setProperty("/RegioConto", oData.RegioConto);
        oModelSoa.setProperty("/ZaccText", oData.ZaccText);
        oModelSoa.setProperty("/Zzposfinent", oData.Zzposfinent);
        oModelSoa.setProperty("/Zpurpose", oData.Zpurpose);
        oModelSoa.setProperty("/Zflagfrutt", oData.Zflagfrutt);
        oModelSoa.setProperty("/Zcausben", oData.Zcausben);
        oModelSoa.setProperty("/Zstcd14", oData.Zstcd14);
        oModelSoa.setProperty("/Zstcd15", oData.Zstcd15);
        oModelSoa.setProperty(
          "/ZzragSocQuietanzante",
          oData.ZzragSocQuietanzante
        );
        oModelSoa.setProperty("/Land1Quietanzante", oData.Land1Quietanzante);
        oModelSoa.setProperty("/Land1Quietanzante2", oData.Land1Quietanzante2);
        oModelSoa.setProperty("/Zdescvers", oData.Zdescvers);
        oModelSoa.setProperty("/Zdatavers", oData.Zdatavers);
        oModelSoa.setProperty("/Zprovvers", oData.Zprovvers);
        oModelSoa.setProperty("/Zsedevers", oData.Zsedevers);
        oModelSoa.setProperty("/Seqnr", oData.Seqnr);
        oModelSoa.setProperty("/Znumquiet", oData.Znumquiet);
        oModelSoa.setProperty("/Znumquiet2", oData.Znumquiet2);
        oModelSoa.setProperty("/ZflagFipos", oData.ZflagFipos);
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
            oSoa.ZcodStatosop === "10" &&
              oPermissions.RegistrazioneRichAnn &&
              oSoa.Zricann === "0000000"
          );
          oModelUtility.setProperty(
            "/EnableBtnCancellazioneRichAnn",
            oSoa.ZcodStatosop === "10" &&
              oPermissions.CancellazioneRichAnn &&
              oSoa.Zricann !== "0000000"
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

          /**   Scenario    */
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
          Zgeber: "", //Id Autorizzazione
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
          ZflagFipos: false,

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
          Zdstatodes: "", //Stato DURC
          Zdscadenza: null, //Scandenza DURC

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
          Zalias: "", //Alias RGS
          AccTypeId: "", //Tipo conto
          RegioConto: "", //Provincia
          ZaccText: "", //Descrizione conto
          Zzposfinent: "", //Posizione finanziaria entrate
          Zpurpose: "", //Purpose
          Zflagfrutt: "", //Flag Fruttifero/Infruttifero
          Zcausben: "", //Causale Per Beneficiario
          Seqnr: "",

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
          Zstcd14: "", //Identificativo Fiscale Estero (Primo quietanzante)
          Zstcd15: "", //Identificativo Fiscale Estero (Secondo quietanzante)
          ZzragSocQuietanzante: "", //Ragione sociale
          Land1Quietanzante: "", //Nazione
          Land1Quietanzante2: "", //Nazione
          Znumquiet: "", //Numero Queitanzante 1
          Znumquiet2: "", //Numero Queitanzante 1

          /**   WIZARD 2 - Versante    */
          Zcodprov: "", //INPS - Codice Provenienza
          Zcfcommit: "", //INPS - Codice Fiscale Committente
          Zcodtrib: "", //INPS - Codice tributo
          Zperiodrifda: null, //INPS - Periodo riferimento da
          Zperiodrifa: null, //INPS - Periodo riferimento a
          Zcodinps: "", //INPS - Matricola INPS/Codice INPS/Filiale azienda
          Zcfvers: "", //INPS - Codice Fiscale Versante
          Zcodvers: "", //INPS - Codice Versante
          FlagInpsEditabile: false,
          Zdescvers: "", //Descrizione versante
          Zdatavers: null, //Data versamento
          Zprovvers: "", //Provincia versante
          Zsedevers: "", //Sede versante

          /**   WIZARD 2 - Sede Beneficiario */
          Zidsede: "", //Sede Beneficiario
          Stras: "", //Via,numero civico
          Ort01: "", //Località
          Regio: "", //Regione
          Pstlz: "", //Codice di avviamento postale
          Land1: "", //Codice paese

          /**   WIZARD 2 - Banca Accredito */
          Zibanb: "", //IBAN
          Zbicb: "", //BIC
          Zcoordestb: "", //Coordinate estere
          Zdenbancab: "", //Denominazione banca
          Zclearsystb: "", //ClearingSystemid
          Strasb: "", //Via
          Zcivicob: "", //Civico
          Ort01b: "", //Città
          Regiob: "", //Provincia
          Pstlzb: "", //CAP
          Land1b: "", //Nazione

          /**   WIZARD 2 - Intestatario 1 */
          Zibani: "", //IBAN
          Zbici: "", //BIC
          Zcoordesti: "", //Coordinate estere
          Zdenbancai: "", //Denominazione banca
          Zclearsysti: "", //ClearingSystemid
          Zstrasi: "", //Via
          Zcivicoi: "", //Civico
          Zort01i: "", //Città
          Zregioi: "", //Provincia
          Zpstlzi: "", //CAP
          Zland1i: "", //Nazione

          /**   WIZARD 3    */
          Classificazione: [], //Classificazioni

          /**   WIZARD 4    */
          Zcausale: "", //Causale di pagamento
          ZE2e: "", //E2E ID
          Zlocpag: "", //Località pagamento
          Zzonaint: "", //Zona di intervento
          Znumprot: "", //Numero protocollo
          Zdataprot: null, //Data protocollo
          Zdataesig: null, //Data esigibilità

          ZcodStatosop: "",
          Zdatasop: null,
          Znumsop: "",
          Zricann: "",
          ZstatTest: "",
          Zutenza: "",
          Messaggio: [], //Messaggi di error
        });
        self.setModel(oModelSoa, "Soa");

        oView.setBusy(true);

        oModel.read(sPath, {
          success: function (data, oResponse) {
            self._setSoa(data);
            self._getPosizioniSoa();
            self._getClassificazioniSoa();
            self._setBanksSeqnr();
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
          visibleBtnSave: false,
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
          IbanPrevalorizzato: false,
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
          Gjahr: "",
          Zuffliq: [],
          ZnumliqFrom: "",
          ZnumliqTo: "",
          ZdescProsp: "",
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
                };

                aSospesi.push(oSospeso);
              });

              var oFunzionalitaDeep = {
                Funzionalita: "INVIO_FIRMA",
                ZuffcontFirm: self.setBlank(oDatiFirma.ZuffcontFirm),
                Zcodord: self.setBlank(oDatiFirma.Zcodord),
                ZdirigenteAmm: self.setBlank(oDatiFirma.ZdirigenteAmm),
                Zcdr: self.setBlank(oDatiFirma.Fistl),
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
        var iCurrentWizard = oWizard.getProgress();
        for (var i = 0; i < iCurrentWizard - 1; i++) {
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

      setFiltersScenario2: function () {
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
          "Zquoteesi",
          oModelFilter.getProperty("/QuoteEsigibili")
        );
        self.setFilterBT(
          aFilters,
          "DateEsigibilita",
          oModelFilter.getProperty("/DataEsigibilitaFrom"),
          oModelFilter.getProperty("/DataEsigibilitaTo")
        );

        //Estremi di ricerca per Beneficiario
        self.setFilterEQ(aFilters, "Lifnr", oModelFilter.getProperty("/Lifnr"));

        //Estremi di ricerca per Documento di Costo
        self.setFilterEQ(
          aFilters,
          "UfficioContabile",
          oModelFilter.getProperty("/UfficioContabile")
        );
        self.setFilterEQ(
          aFilters,
          "AreaFunz",
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
          self.setFilterEQ(aFilters, "NDocBen", sNDocBen);
        });
        self.setFilterEQ(aFilters, "Cig", oModelFilter.getProperty("/Cig"));
        self.setFilterEQ(aFilters, "Cup", oModelFilter.getProperty("/Cup"));
        self.setFilterBT(
          aFilters,
          "ScadenzaDoc",
          oModelFilter.getProperty("/ScadenzaDocFrom"),
          oModelFilter.getProperty("/ScadenzaDocTo")
        );

        self.setFilterEQ(aFilters, "Gjahr", oModelSoa.getProperty("/Gjahr"));
        self.setFilterEQ(aFilters, "Fipex", oModelSoa.getProperty("/Fipos"));
        self.setFilterEQ(aFilters, "Fistl", oModelSoa.getProperty("/Fistl"));
        return aFilters;
      },

      setFiltersScenario3: function () {
        var self = this;
        var aFilters = [];
        var oModelSoa = self.getModel("Soa");
        var oModelFilter = self.getModel("FilterDocumenti");

        self.setFilterEQ(aFilters, "Fipex", oModelSoa?.getProperty("/Fipos"));
        self.setFilterEQ(aFilters, "Fistl", oModelSoa?.getProperty("/Fistl"));
        self.setFilterEQ(aFilters, "Gjahr", oModelSoa?.getProperty("/Gjahr"));
        self.setFilterEQ(
          aFilters,
          "Lifnr",
          oModelFilter?.getProperty("/Lifnr")
        );

        var aUfficioLiquidatore = oModelFilter.getProperty("/Zuffliq");
        aUfficioLiquidatore.map((sUfficioLiquidatore) => {
          self.setFilterEQ(aFilters, "Zuffliq", sUfficioLiquidatore);
        });
        self.setFilterBT(
          aFilters,
          "Znumliq",
          oModelFilter.getProperty("/ZnumliqFrom"),
          oModelFilter.getProperty("/ZnumliqTo")
        );
        self.setFilterEQ(
          aFilters,
          "ZdescProsp",
          oModelFilter.getProperty("/ZdescProsp")
        );

        return aFilters;
      },

      checkPosizioniScenario1: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        var fImpTot = parseFloat(oModelSoa.getProperty("/Zimptot"));

        var o;

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

      checkPosizioniScen2: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oBundle = self.getResourceBundle();

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

      checkPosizioniScen4: function () {
        var self = this;
        var oModelSoa = self.getModel("Soa");
        var oBundle = self.getResourceBundle();

        if (!oModelSoa.getProperty("/Kostl")) {
          sap.m.MessageBox.error(oBundle.getText("msgKostlRequired"));
          return false;
        }

        if (!oModelSoa.getProperty("/Hkont")) {
          sap.m.MessageBox.error(oBundle.getText("msgHkontRequired"));
          return false;
        }

        return true;
      },

      setPosizioneScen4: function () {
        var self = this;
        //Load Models
        var oModel = self.getModel();
        var oModelSoa = self.getModel("Soa");
        var oModelStepScenario = self.getModel("StepScenario");

        var aFilters = [];

        self.setFilterEQ(aFilters, "Lifnr", oModelSoa?.getProperty("/Lifnr"));
        self.setFilterEQ(aFilters, "Zwels", oModelSoa?.getProperty("/Zwels"));
        self.setFilterEQ(
          aFilters,
          "Zimpliq",
          oModelSoa?.getProperty("/Zimptot")
        );
        self.setFilterEQ(aFilters, "Iban", oModelSoa?.getProperty("/Iban"));

        oModel.read("/RegProspettoLiquidazioneSet", {
          filters: aFilters,
          success: function (data, oResponse) {
            if (!self.setResponseMessage(oResponse)) {
              self.setModelCustom("NewProspettoLiquidazione", data?.results);
              oModelStepScenario.setProperty("/wizard1Step1", false);
              oModelStepScenario.setProperty("/wizard1Step2", true);
              oModelStepScenario.setProperty("/visibleBtnForward", false);
              oModelStepScenario.setProperty(
                "/visibleBtnInserisciProspLiquidazione",
                true
              );
            }
          },
          error: function () {},
        });
      },

      //#endregion-----------------GESTIONE FILTRI-----------------------------/

      //#endregion

      //#region ---------------CREAZIONE ANAGRAFICA/PAGAMENTO------------------/
      functionReturnValueAnag: function (obj) {
        var oData = obj?.data;
        var aDataQuietaVaglia = obj?.data?.QuietVaglia?.results;
        var self = this;
        var oModelSoa = self.getModel("Soa");

        if (oData.MessageType !== "S") {
          return;
        }

        //Dati beneficiario
        oModelSoa.setProperty("/Lifnr", oData.Lifnr);
        oModelSoa.setProperty("/BuType", oData.Type);
        oModelSoa.setProperty("/TaxnumCf", oData.Stcd1);
        oModelSoa.setProperty("/TaxnumPiva", oData.Stcd2);
        oModelSoa.setProperty("/Taxnumxl", oData.Stcd3);
        oModelSoa.setProperty("/NameFirst", oData.Name);
        oModelSoa.setProperty("/NameLast", oData.Surname);
        oModelSoa.setProperty("/ZzragSoc", oData.Ragsoc);
        oModelSoa.setProperty("/Zdurc", oData.Durc);
        oModelSoa.setProperty("/Zdstatodes", oData.Statodurc);
        oModelSoa.setProperty("/Zdscadenza", oData.Scadenzadurc);
        oModelSoa.setProperty("/ZfermAmm", oData.ZfermAmm);

        //Modalita di pagamento
        oModelSoa.setProperty("/Banks", oData.CountryRes);
        oModelSoa.setProperty("/Zwels", oData.Zwels);
        oModelSoa.setProperty("/Zdescwels", oData.Zdescwels);
        oModelSoa.setProperty("/Swift", oData.Swift);
        oModelSoa.setProperty("/Zcoordest", oData.Zcoordest);
        oModelSoa.setProperty("/Iban", oData.Iban);
        oModelSoa.setProperty("/Ztipofirma", oData.Ztipofirma);

        //Banca Accredito
        oModelSoa.setProperty("/Zibanb", oData.Zibanb);
        oModelSoa.setProperty("/Zbicb", oData.Zbicb);
        oModelSoa.setProperty("/Zcoordestb", oData.Zcoordestb);
        oModelSoa.setProperty("/Zdenbancab", oData.Zdenbanca);
        oModelSoa.setProperty("/Zclearsystb", oData.Zclearsyst);
        oModelSoa.setProperty("/Strasb", oData.Stras);
        oModelSoa.setProperty("/Zcivicob", oData.Zcivico);
        oModelSoa.setProperty("/Ort01b", oData.Ort01);
        oModelSoa.setProperty("/Regiob", oData.Regio);
        oModelSoa.setProperty("/Pstlzb", oData.Stlz);
        oModelSoa.setProperty("/Land1b", oData.Land1);

        //Intermediario 1
        oModelSoa.setProperty("/Zibani", oData.Zibani);
        oModelSoa.setProperty("/Zbici", oData.Zbici);
        oModelSoa.setProperty("/Zcoordesti", oData.Zcoordesti);
        oModelSoa.setProperty("/Zdenbancai", oData.Zdenbancai);
        oModelSoa.setProperty("/Zclearsysti", oData.Zclearsysti);
        oModelSoa.setProperty("/Zstrasi", oData.Zstrasi);
        oModelSoa.setProperty("/Zcivicoi", oData.Zcivicoi);
        oModelSoa.setProperty("/Zort01i", oData.Zort01i);
        oModelSoa.setProperty("/Zregioi", oData.Zregioi);
        oModelSoa.setProperty("/Zpstlzi", oData.Zpstlzi);
        oModelSoa.setProperty("/Zland1i", oData.Zland1i);

        //Sede beneficiario
        oModelSoa.setProperty("/Ort01", oData.City);
        oModelSoa.setProperty("/Regio", oData.Region);
        oModelSoa.setProperty("/Pstlz", oData.Pstlz);
        oModelSoa.setProperty("/Land1", oData.Country);
        oModelSoa.setProperty("/Stras", oData.Street + ", " + oData.Housenum);

        this._setDatiQuagliaVaglia(aDataQuietaVaglia, false);
      },

      functionReturnValueModPag: function (obj) {
        var aDataQuietaVaglia = obj?.data?.QuietVaglia?.results;
        var oData = obj?.data;

        if (oData.MessageType !== "S" || aDataQuietaVaglia.length === 0) {
          return;
        }

        this._setDatiQuagliaVaglia(aDataQuietaVaglia, true);
      },

      _setDatiQuagliaVaglia: function (aData, bModPag) {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        aData.map((oData) => {
          if (oData.TipVis === "P" && bModPag) {
            oModelSoa.setProperty("/Banks", oData.Country_res);
            oModelSoa.setProperty("/Zwels", oData.Zwels);
            oModelSoa.setProperty("/Zdescwels", oData.Zdescwels);
            oModelSoa.setProperty("/Swift", oData.Swift);
            oModelSoa.setProperty("/Zcoordest", oData.Zcoordest);
            oModelSoa.setProperty("/Iban", oData.Iban);
            oModelSoa.setProperty("/Ztipofirma", oData.Ztipofirma);

            //Banca Accredito
            oModelSoa.setProperty("/Zibanb", oData.Zibanb);
            oModelSoa.setProperty("/Zbicb", oData.Zbicb);
            oModelSoa.setProperty("/Zcoordestb", oData.Zcoordestb);
            oModelSoa.setProperty("/Zdenbancab", oData.Zdenbanca);
            oModelSoa.setProperty("/Zclearsystb", oData.Zclearsyst);
            oModelSoa.setProperty("/Strasb", oData.Stras);
            oModelSoa.setProperty("/Zcivicob", oData.Zcivico);
            oModelSoa.setProperty("/Ort01b", oData.Ort01);
            oModelSoa.setProperty("/Regiob", oData.Regio);
            oModelSoa.setProperty("/Pstlzb", oData.Stlz);
            oModelSoa.setProperty("/Land1b", oData.Land1);

            //Intermediario 1
            oModelSoa.setProperty("/Zibani", oData.Zibani);
            oModelSoa.setProperty("/Zbici", oData.Zbici);
            oModelSoa.setProperty("/Zcoordesti", oData.Zcoordesti);
            oModelSoa.setProperty("/Zdenbancai", oData.Zdenbancai);
            oModelSoa.setProperty("/Zclearsysti", oData.Zclearsysti);
            oModelSoa.setProperty("/Zstrasi", oData.Zstrasi);
            oModelSoa.setProperty("/Zcivicoi", oData.Zcivicoi);
            oModelSoa.setProperty("/Zort01i", oData.Zort01i);
            oModelSoa.setProperty("/Zregioi", oData.Zregioi);
            oModelSoa.setProperty("/Zpstlzi", oData.Zpstlzi);
            oModelSoa.setProperty("/Zland1i", oData.Zland1i);
          } else if (oData.TipVis === "D") {
            //Se D = Destinatario
            oModelSoa.setProperty("/ZpersNomeVaglia", oData.ZQNome);
            oModelSoa.setProperty("/ZpersCognomeVaglia", oData.ZQCognome);
            oModelSoa.setProperty("/Zstcd13", oData.Stcd3);
            oModelSoa.setProperty("/Zqindiriz", oData.ZQIndiriz);
            oModelSoa.setProperty("/Zqcitta", oData.ZQCitta);
            oModelSoa.setProperty("/Zqcap", oData.ZQCAP);
            oModelSoa.setProperty("/Zqprovincia", oData.ZQProvincia);
            oModelSoa.setProperty("/Land1Quietanzante", oData.Land1);
            oModelSoa.setProperty("/ZzRagSocQuietanzante", oData.Zzrag_soc);
          } else if (oData.TipVis === "Q") {
            //Se Q = Quietanzante
            //Se non sono valorizzati sia il CF del primo quietanzante e sia
            //il CF del destinatario vuol dire che quello inserito è il primo
            //quietanzante
            if (
              !oModelSoa.getProperty("/Zstcd1") &&
              !oModelSoa.getProperty("/Zstcd13")
            ) {
              oModelSoa.setProperty("/ZpersNomeQuiet1", oData.ZQNome);
              oModelSoa.setProperty("/ZpersCognomeQuiet1", oData.ZQCognome);
              oModelSoa.setProperty("/Zstcd1", oData.Stcd1);
              oModelSoa.setProperty("/Zqindiriz", oData.ZQIndiriz);
              oModelSoa.setProperty("/Zqcitta", oData.ZQCitta);
              oModelSoa.setProperty("/Zqcap", oData.ZQCAP);
              oModelSoa.setProperty("/Zqprovincia", oData.ZQProvincia);
              oModelSoa.setProperty("/Land1Quietanzante", oData.Zzrag_soc);
              oModelSoa.setProperty("/ZzRagSocQuietanzante", oData.Land1);
            } else {
              oModelSoa.setProperty("/ZpersCognomeQuiet2", oData.ZQCognome);
              oModelSoa.setProperty("/ZpersNomeQuiet2", oData.ZQNome);
              oModelSoa.setProperty("/Zstcd12", oData.Stcd2);
              oModelSoa.setProperty("/Zqindiriz12", oData.ZQIndiriz);
              oModelSoa.setProperty("/Zqcitta12", oData.ZQCitta);
              oModelSoa.setProperty("/Zqcap12", oData.ZQCAP);
              oModelSoa.setProperty("/Zqprovincia12", oData.ZQProvincia);
              oModelSoa.setProperty("/Land1Quietanzante2", oData.Land1);
            }
          }
        });
      },

      //#endregion ------------CREAZIONE ANAGRAFICA/PAGAMENTO------------------/

      functionReturnValueMC: function (obj) {
        var self = this;
        var oModelSoa = self.getModel("Soa");

        if (obj?.Iban) {
          if (!self._checkIbanCoordEstere("Iban")) {
            return;
          }

          if (oModelSoa.getProperty("/IbanPrevalorizzato")) {
            var oDialogMotivazione = self.loadFragment(
              "rgssoa.view.fragment.pop-up.Motivazione"
            );
            oDialogMotivazione.open();
          }

          self._setBanksSeqnr();
        }

        if (obj?.ZCausaleval) {
          oModelSoa.setProperty("/ZCausaleval", obj?.ZCausaleval);
          oModelSoa.setProperty("/ZDesccauval", obj?.ZDesccauval);
        }

        if (obj?.Zcodtrib) {
          oModelSoa.setProperty("/Zcodinps", obj.Zcodinps);
          oModelSoa.setProperty(
            "/Zperiodrifa",
            obj.Zperiodrifa ? obj.Zperiodrifa : null
          );
          oModelSoa.setProperty(
            "/Zperiodrifda",
            obj.Zperiodrifda ? obj.Zperiodrifda : null
          );
        }
      },
    });
  }
);
