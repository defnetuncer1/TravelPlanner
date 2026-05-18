
//SEARCH & FILTER
function filterPlaces(){

var destinationInput = document.getElementById("destination");
var keywordInput = document.getElementById("keyword");
var categoryInput = document.getElementById("category");
var resultMessage = document.getElementById("resultMessage");

var placeCards =document.getElementsByClassName("place-card-wrapper");
var destinationValue = destinationInput.value.toLowerCase();
var keywordValue = keywordInput.value.toLowerCase();
var categoryValue = categoryInput.value.toLowerCase();

var visibleCount=0;
for(var i=0; i<placeCards.length;i++){
    var card = placeCards[i];

    var placeDestination = card.getAttribute("data-destination").toLowerCase();
    var placeCategory = card.getAttribute("data-category").toLowerCase();
    var placeKeywords = card.getAttribute("data-keywords").toLowerCase();

    var destinationMatch = destinationValue === "" || placeDestination.includes(destinationValue);
    var keywordMatch = keywordValue === "" || placeKeywords.includes(keywordValue);
    var categoryMatch = categoryValue === "all" || placeCategory === categoryValue;

    if(destinationMatch&&keywordMatch&&categoryMatch){
        card.style.display="block";
        visibleCount++;
    }else{
        card.style.display="none";
    }
}
   if (
    destinationValue === "" &&
    keywordValue === "" &&
    categoryValue === "all"
) {
    resultMessage.innerHTML = "Showing popular recommendations.";
} else {
    resultMessage.innerHTML = visibleCount + " place(s) found.";
}
}
var searchForm=document.getElementById("searchForm");
if(searchForm){
    searchForm.onsubmit=function(event){
        event.preventDefault();
        filterPlaces();
    }
}

//LOGIN 
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        const loginMessage = document.getElementById("loginMessage");

        fetch("../api/users.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "login",
                email: email,
                password: password
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            loginMessage.textContent = data.message;

            if (data.success) {
                loginMessage.style.color = "green";

                localStorage.setItem("loggedInUser", data.fullName);
                localStorage.setItem("loggedInEmail", data.email);

                window.location.href = "plans.html";
            } else {
                loginMessage.style.color = "red";
            }
        });
    });
}

//REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const registerMessage = document.getElementById("registerMessage");

        if (password !== confirmPassword) {
            registerMessage.textContent = "Passwords do not match.";
            registerMessage.style.color = "red";
            return;
        }

        fetch("../api/users.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "register",
                fullName: fullName,
                email: email,
                password: password
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            registerMessage.textContent = data.message;

            if (data.success) {
                registerMessage.style.color = "green";
                registerForm.reset();
            } else {
                registerMessage.style.color = "red";
            }
        });
    });
}

//LOAD PLACES FROM API
var placesContainer = document.getElementById("placesContainer");

if (placesContainer) {
    fetch("../api/places.php")
        .then(function(response) {
            return response.json();
        })
        .then(function(places) {
            placesContainer.innerHTML = "";

            for (var i = 0; i < places.length; i++) {
                var place = places[i];

                placesContainer.innerHTML +=
                    '<div class="col-md-4 mb-4 place-card-wrapper" ' +
                        'data-destination="' + place.city + '" ' +
                        'data-category="' + place.category.toLowerCase() + '" ' +
                        'data-keywords="' + place.placeName.toLowerCase() + ' ' + place.city.toLowerCase() + ' ' + place.category.toLowerCase() + '">' +

                        '<div class="card place-card">' +
                            '<img src="' + place.imagePath + '" class="card-img-top" alt="' + place.placeName + '">' +

                            '<div class="card-body">' +
                                '<h5 class="card-title">' + place.placeName + '</h5>' +
                                '<p class="card-text">' + place.description + '</p>' +
                                '<p><strong>Category:</strong> ' + place.category + '</p>' +
                                '<p><strong>City:</strong> ' + place.city + '</p>' +

                                '<button class="custom-button mb-2 add-to-plan-btn" ' +
                                    'data-place-id="' + place.placeID + '" ' +
                                    'data-bs-toggle="modal" data-bs-target="#addToPlanModal">' +
                                    'Add to Plan' +
                                '</button>' +

                                '<a href="place-details.html?placeID=' + place.placeID + '"class="btn btn-outline-secondary">View Details</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            }

            filterPlaces();
        });
}

//CREATE, EDIT OR DELETE PLANS
var planForm = document.getElementById("planForm");
var plansContainer = document.getElementById("plansContainer");
var editPlanForm = document.getElementById("editPlanForm");

function loadPlans() {
    if (plansContainer) {
        fetch("../api/plans.php")
            .then(function(response) {
                return response.json();
            })
            .then(function(plans) {
                plansContainer.innerHTML = "";

                for (var i = 0; i < plans.length; i++) {
                    var plan = plans[i];

                    plansContainer.innerHTML +=
                        '<div class="col-md-4 mb-4">' +
                            '<div class="card place-card">' +
                                '<div class="card-body">' +
                                    '<h5 class="card-title">' + plan.planName + '</h5>' +
                                    '<p><strong>Destination: </strong>' + plan.destinationCity + '</p>' +
                                    '<p><strong>Start Date: </strong>' + plan.startDate.substring(0, 10) + '</p>' +
                                    '<p><strong>End Date: </strong>' + plan.endDate.substring(0, 10) + '</p>' +

                                    '<div class="mt-3" id="plan-items-' + plan.planID + '"></div>' +

                                    '<button class="btn btn-danger delete-plan me-2 mt-2" data-id="' + plan.planID + '">Delete</button>' +
                                    '<button class="btn btn-warning edit-plan mt-2" data-bs-toggle="modal" data-bs-target="#editPlanModal" ' +
                                        'data-id="' + plan.planID + '" ' +
                                        'data-name="' + plan.planName + '" ' +
                                        'data-destination="' + plan.destinationCity + '" ' +
                                        'data-start="' + plan.startDate.substring(0, 10) + '" ' +
                                        'data-end="' + plan.endDate.substring(0, 10) + '">' +
                                        'Edit' +
                                    '</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

                    loadPlanItems(plan.planID);
                }
            });
    }
}
function loadPlanItems(planID) {
    fetch("../api/planitems.php?planID=" + planID)
        .then(function(response) {
            return response.json();
        })
        .then(function(places) {
            var container = document.getElementById("plan-items-" + planID);

            if (places.length === 0) {
                container.innerHTML = "<p><em>No places added yet.</em></p>";
            } else {
                container.innerHTML = "<strong>Added Places:</strong>";

                for (var i = 0; i < places.length; i++) {
                    container.innerHTML +=
    '<div class="border rounded p-2 mb-2">' +
        '<a href="place-details.html?placeID=' + places[i].PlaceID + '" class="text-decoration-none">' +
            '<strong>' + places[i].PlaceName + '</strong><br>' +
            '<small>' + places[i].City + ' | ' + places[i].Category + '</small>' +
        '</a>' +
        '<br>' +
        '<button class="btn btn-sm btn-outline-danger remove-place mt-2" ' +
            'data-plan-id="' + planID + '" ' +
            'data-place-id="' + places[i].PlaceID + '">' +
            'Remove' +
        '</button>' +
    '</div>';
                }
            }
        });
}
if (planForm) {
    planForm.onsubmit = function(event) {
        event.preventDefault();

        var planName = document.getElementById("planName").value;
        var destination = document.getElementById("planDestination").value;
        var startDate = document.getElementById("startDate").value;
        var endDate = document.getElementById("endDate").value;

        if (
            planName.trim() === "" ||
            destination.trim() === "" ||
            startDate === "" ||
            endDate === ""
        ) {
            alert("Please fill in all fields.");
            return;
        }

            if (new Date(endDate) < new Date(startDate)) {
            alert("End date cannot be earlier than start date.");
            return;
        }   


        var newPlan = {
            userID: 1,
            planName: planName,
            destinationCity: destination,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString()    
        };

        fetch("../api/plans.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPlan)
        })
        .then(function(response) {
            return response.json();
        })
        .then(function() {
            planForm.reset();
            loadPlans();
        });
    };
}

document.addEventListener("click", function(event) {
    document.addEventListener("click", function(event) {

    // EDIT PLAN
    if (event.target.classList.contains("edit-plan")) {
        document.getElementById("editPlanId").value = event.target.getAttribute("data-id");
        document.getElementById("editPlanName").value = event.target.getAttribute("data-name");
        document.getElementById("editPlanDestination").value = event.target.getAttribute("data-destination");
        document.getElementById("editStartDate").value = event.target.getAttribute("data-start");
        document.getElementById("editEndDate").value = event.target.getAttribute("data-end");
    }

    // DELETE PLAN
    if (event.target.classList.contains("delete-plan")) {
        var id = event.target.getAttribute("data-id");
        var confirmDelete = confirm("Are you sure you want to delete this plan?");

        if (confirmDelete) {
            fetch("../api/plans.php", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    planID: id
                })
            })
            .then(function() {
                loadPlans();
            });
        }
    }

    // REMOVE PLACE FROM PLAN
    if (event.target.classList.contains("remove-place")) {

        var planID = event.target.getAttribute("data-plan-id");
        var placeID = event.target.getAttribute("data-place-id");

        var confirmRemove = confirm("Remove this place from the plan?");

        if (confirmRemove) {

            fetch("../api/planitems.php", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    planID: planID,
                    placeID: placeID
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(function() {
                loadPlanItems(planID);
            });

        }
    }

});
});

if (editPlanForm) {
    editPlanForm.onsubmit = function(event) {
        event.preventDefault();

        var id = document.getElementById("editPlanId").value;

        var updatedPlan = {
            planID: id,
            userID: 1,
            planName: document.getElementById("editPlanName").value,
            destinationCity: document.getElementById("editPlanDestination").value,
            startDate: new Date(document.getElementById("editStartDate").value).toISOString(),
            endDate: new Date(document.getElementById("editEndDate").value).toISOString()
        };

        fetch("../api/plans.php", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPlan)
        })
        .then(function(response) {
            return response.json();
        })
        .then(function() {
            var modalElement = document.getElementById("editPlanModal");
            var modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            loadPlans();
        });
    };
}

loadPlans();

var selectedPlaceID = null;

document.addEventListener("click", function(event) {
    if (event.target.classList.contains("add-to-plan-btn")) {
        selectedPlaceID = event.target.getAttribute("data-place-id");

        fetch("../api/plans.php")
            .then(function(response) {
                return response.json();
            })
            .then(function(plans) {
                var planSelect = document.getElementById("planSelect");
                planSelect.innerHTML = '<option selected disabled>Select a plan</option>';

                for (var i = 0; i < plans.length; i++) {
                    planSelect.innerHTML +=
                        '<option value="' + plans[i].planID + '">' +
                            plans[i].planName +
                        '</option>';
                }
            });
    }
});

var confirmAddToPlan = document.getElementById("confirmAddToPlan");

if (confirmAddToPlan) {
    confirmAddToPlan.addEventListener("click", function() {
        var selectedPlanID = document.getElementById("planSelect").value;

        if (selectedPlanID === "Select a plan") {
            alert("Please choose a plan first.");
            return;
        }

        fetch("../api/planitems.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                planID: selectedPlanID,
                placeID: selectedPlaceID
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function() {
            alert("Place added to plan successfully.");
        });
    });
}

//LOAD PLACE DETAILS PAGE
var placeDetailsContainer = document.getElementById("placeDetailsContainer");

if (placeDetailsContainer) {
    var urlParams = new URLSearchParams(window.location.search);
    var placeID = urlParams.get("placeID");

    fetch("../api/places.php")
        .then(function(response) {
            return response.json();
        })
        .then(function(places) {
            for (var i = 0; i < places.length; i++) {
                if (places[i].placeID == placeID) {
                    var place = places[i];

                    placeDetailsContainer.innerHTML =
                    '<div class="banner-container">' +
                        '<img src="' + place.imagePath + '" class="banner-image" alt="' + place.placeName + '">' +
                    '</div>' +

                    '<div class="container-fluid p-3">' +
                        '<h1 class="display-4">' + place.placeName + '</h1>' +

                        '<p class="text-muted">' +
                            place.city + ', ' + place.country +
                        '</p>' +

                        '<p>' +
                            '<span class="badge bg-primary me-2">' + place.category + '</span>' +
                            '<span class="badge bg-success me-2">' + place.estimatedCost + ' ' + place.currency + '</span>' +
                            '<span class="badge bg-dark">' + place.rating + ' / 5</span>' +
                        '</p>' +

                        '<p>' + place.description + '</p>' +

                        '<button class="custom-button mb-2 add-to-plan-btn" ' +
                                'data-place-id="' + place.placeID + '" ' +
                                'data-bs-toggle="modal" data-bs-target="#addToPlanModal">' +
                                'Add to Plan' +
                        '</button> ' +
                        '<a href="places.html" class="btn btn-outline-secondary">Back to Destinations</a>';
                    '</div>'
                }
            }
        });
}

//LOGIN STATUS AND LOGOUT
var welcomeMessage = document.getElementById("welcomeMessage");
var logoutButton = document.getElementById("logoutButton");

if (welcomeMessage) {
    var loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser) {
        welcomeMessage.textContent = "Welcome, " + loggedInUser + "!";
    } else {
        welcomeMessage.textContent = "You are not logged in.";
    }
}

if (logoutButton) {
    logoutButton.addEventListener("click", function() {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("loggedInEmail");
        window.location.href = "account.html";
    });
}