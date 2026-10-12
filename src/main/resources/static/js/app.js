$(function () {
    $(window).on("hashchange", route);
    route();
});

function route() {
    const hash = window.location.hash;

    $(".view").hide();

    if (hash === "#/users") {
        $("#view-users").show();
         loadUsers();
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

function loadUsers() {
    $.ajax({
        url: "/api/users",
        method: "GET"
    }).done(function (users) {
        renderUsers(users);
    }).fail(function (xhr) {
        console.log("Request failed. Status:", xhr.status, xhr.responseText);
    });
}

function renderUsers(users) {
    const tbody = $("#users-table-body");
    tbody.empty();

    if (users.length === 0) {
        tbody.append('<tr><td colspan="3" class="text-muted">No users registered yet.</td></tr>');
        return;
    }

    users.forEach(function (user) {
        const row = $("<tr>");
        row.append($("<td>").text(user.name));
        row.append($("<td>").text(user.surname));

        const deleteButton = $("<button>")
            .addClass("btn btn-sm btn-outline-danger")
            .text("Delete");

        deleteButton.on("click", function () {
            deleteUser(user);
        });

        row.append($("<td>").addClass("text-end").append(deleteButton));
        tbody.append(row);
    });
}

function deleteUser(user) {
    const confirmed = confirm("Delete " + user.name + " " + user.surname + "?");
    if (!confirmed) {
        return;
    }

    $.ajax({
        url: "/api/users/" + user.id,
        method: "DELETE"
    }).done(function () {
        loadUsers();
    }).fail(function (xhr) {
        alert("Could not delete the user.");
        console.log("Delete failed. Status:", xhr.status, xhr.responseText);
    });
}