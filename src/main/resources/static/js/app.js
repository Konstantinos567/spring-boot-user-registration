$(function () {
$("#birthdate").datepicker({
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true,
        yearRange: "1900:+0",
        maxDate: 0
    });

    $("#register-form").on("submit", submitRegistration);

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
         clearFormErrors();
    } else if (hash.startsWith("#/users/")) {
              const id = hash.split("/")[2];
                      $("#view-details").show();
                      loadUserDetails(id);

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
        row.css("cursor", "pointer");
        row.on("click", function () {
            window.open("#/users/" + user.id, "_blank");
        });

        row.append($("<td>").text(user.name));
        row.append($("<td>").text(user.surname));

        const deleteButton = $("<button>")
            .addClass("btn btn-sm btn-outline-danger")
            .text("Delete");

        deleteButton.on("click", function (event) {
            event.stopPropagation();
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

function loadUserDetails(id) {
    $("#details-content").hide();
    $("#details-not-found").hide();

    $.ajax({
        url: "/api/users/" + id,
        method: "GET"
    }).done(function (user) {
        $("#details-name").text(user.name);
        $("#details-surname").text(user.surname);
        $("#details-gender").text(user.gender === "M" ? "Male" : "Female");
        $("#details-birthdate").text(user.birthdate);
        $("#details-work-address").text(user.workAddress || "—");
        $("#details-home-address").text(user.homeAddress || "—");
        $("#details-content").show();
    }).fail(function (xhr) {
        if (xhr.status === 404) {
            $("#details-not-found").show();
        } else {
            alert("Could not load the user details.");
            console.log("Load details failed. Status:", xhr.status, xhr.responseText);
        }
    });
}

function submitRegistration(event) {
    event.preventDefault();
        clearFormErrors();

    const request = {
        name: $("#name").val(),
        surname: $("#surname").val(),
        gender: $("#gender").val(),
        birthdate: $("#birthdate").val(),
        workAddress: $("#workAddress").val(),
        homeAddress: $("#homeAddress").val()
    };

    $.ajax({
        url: "/api/users",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(request)
    }).done(function (createdUser) {
        $("#register-form")[0].reset();
        alert("User " + createdUser.name + " " + createdUser.surname + " was registered successfully.");
        window.location.hash = "#/users";
    }).fail(function (xhr) {
        const problem = xhr.responseJSON;

                if (xhr.status === 400 && problem && problem.errors) {
                    showFormErrors(problem.errors);
                } else if (xhr.status === 400 && problem) {
                    alert(problem.detail);
                } else {
                    alert("Could not register the user. Please try again later.");
                    console.log("Registration failed. Status:", xhr.status, xhr.responseText);
                }
    });
}

function showFormErrors(errors) {
    Object.keys(errors).forEach(function (field) {
        $("#" + field).addClass("is-invalid");
        $("#error-" + field).text(errors[field]);
    });
}

function clearFormErrors() {
    $("#register-form .is-invalid").removeClass("is-invalid");
    $("#register-form .invalid-feedback").text("");
}