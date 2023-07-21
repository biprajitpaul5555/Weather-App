$(window).on("beforeunload", () => {
    $(".weather").addClass("loading");
});
$(window).on("load", () => {
    $(".weather").removeClass("loading");
});
