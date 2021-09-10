(function($){
    
    "use strict";
    
    //===== Prealoder
    
    $(window).on('load', function(event) {
        $('.preloader').delay(500).fadeOut(500);
    });
    
    
    //===== Mobile Menu 
    
    $(".navbar-toggler").on('click', function() {
        $(this).toggleClass('active');
    });
    
    $(".navbar-nav a").on('click', function() {
        $(".navbar-toggler").removeClass('active');
    });
    
    
    //===== close navbar-collapse when a  clicked
    
    $(".navbar-nav a").on('click', function () {
        $(".navbar-collapse").removeClass("show");
    });
    

    //SEND MAIL

    $("#contact-form-detalle").on('submit', function (event) {
        // event.preventDefault();
        // var nombre = $("#valueNombre").val();
        // var mail = $("#valueMail").val();
        // var telefono = $("#valueMessage").val();
        




        // console.log(nombre);
    });

}(jQuery));