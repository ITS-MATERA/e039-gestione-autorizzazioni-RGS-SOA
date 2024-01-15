sap.ui.define([], function () {
  "use strict";

  return {
    /**
     * Rounds the number unit value to 2 digits
     * @public
     * @param {string} sValue the number string to be rounded
     * @returns {string} sValue with 2 digits rounded
     */
    numberUnit: function (sValue) {
      if (!sValue) {
        return "";
      }
      return parseFloat(sValue).toFixed(2);
    },

    convertImport: function (sValue) {
      if (!sValue) {
        return "";
      }
      sValue = sValue.replace(".", ",");
      return sValue.toString().replace(/\B(?<!\,\d*)(?=(\d{3})+(?!\d))/g, ".");
    },

    dateWithPoints: function (oDate) {
      {
        if (oDate) {
          oDate = new Date(oDate);
          var sDay = oDate.getDate().toString();
          var sMonth = (oDate.getMonth() + 1).toString();
          var sYear = oDate.getFullYear().toString();

          if (sDay.length === 1) {
            sDay = "0" + sDay;
          }

          if (sMonth.length === 1) {
            sMonth = "0" + sMonth;
          }

          return sDay + "." + sMonth + "." + sYear;
        }

        return null;
      }
    },

    formatDate: function (sValue) {
      if (!sValue) return; // new Date();

      if (sValue instanceof Date && !isNaN(sValue)) {
      } else return;

      var sDate = sValue.getDate();
      if (sDate < 10) sDate = "0" + sDate;

      var sMonth = sValue.getMonth() + 1;
      if (sMonth < 10) sMonth = "0" + sMonth;
      sValue = sValue.getFullYear() + "-" + sMonth + "-" + sDate;
      return sValue;
    },

    deleteFirstZeros: function (sValue) {
      if (parseInt(sValue) === 0 || !sValue) {
        return "";
      }
      return parseInt(sValue).toString();
    },

    /**
    * @param {Date} oDate
    * @returns {string}
    */
    dateToString: function (oDate) {
      if (!oDate) {
        return "";
      }

      var sDay = oDate.getDate();
      var sMonths = oDate.getMonth() + 1;
      var sYear = oDate.getFullYear();

      return sDay + "." + sMonths + "." + sYear;
    },

    /**
 *
 * @param {Date} oDate
 * @returns {Date}
 */
    UTCRome: function (oDate) {
      if (!oDate) {
        return null;
      }

      if (!oDate instanceof Date) {
        oDate = new Date(oDate);
      }

      var sDay = oDate.getDate();
      var iDay = parseInt(sDay)
      if (iDay < 10) {
        sDay = "0" + sDay
      }
      var sMonths = oDate.getMonth() + 1;
      var iMonth = parseInt(sMonths)
      if (iMonth < 10) {
        sMonths = "0" + sMonths
      }
      var sYear = oDate.getFullYear();
      var sDatetime = sYear + "-" + sMonths + "-" + sDay + "T00:00:00.000+00:00"
      oDate = new Date(sDatetime)

      return oDate
    },
  };
});
