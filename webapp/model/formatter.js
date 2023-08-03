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

    convertFormattedNumber: function (sValue) {
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
  };
});
