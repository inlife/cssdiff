$(document).ready(function() {
    var cssdiff = require('.');

    $('#diff-calculate').click(function(e) {
        var cssold = $('#diff-old').val() || '';
        var cssnew = $('#diff-new').val() || '';

        var result = cssdiff.calculate(cssold, cssnew);

        $("#removed").html(result.removed);
        $("#added").html(result.added);

        $("#result").show();
        // $(window).scroll($("#result"));
        $('html, body').animate({ scrollTop: $("#result").offset().top }, 250);
    });
});
