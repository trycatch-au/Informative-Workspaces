define(['d8'], function(D8) {
    return  function(date) {
        var dateParts = (date + "").split(/[-T\+ :]/),
            dateObj = new Date(dateParts[0], dateParts[1]-1, dateParts[2], dateParts[3], dateParts[4], dateParts[5]);

        return D8.create(dateObj);
    }
});
