$(function () {
    $(window).on("hashchange", route);
    route();
});

function route() {
    const hash = window.location.hash;

    $(".view").hide();

    if (hash === "#/users") {
        $("#view-users").show();
    } else if (hash === "#/register") {
        $("#view-register").show();
    } else if (hash.startsWith("#/users/")) {
              const id = hash.split("/")[2];
              console.log("Show details for user", id);
              $("#view-details").show();

       } else {
        $("#view-home").show();
    }
}