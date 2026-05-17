
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
   resultMessage.innerHTML=visibleCount + " place(s) found.";
}
var searchForm=document.getElementById("searchForm");
if(searchForm){
    searchForm.onsubmit=function(event){
        event.preventDefault();
        filterPlaces();
    }
}

//LOGIN 
const loginForm=document.getElementById("loginForm");
if(loginForm){
    loginForm.addEventListener("submit", function(event){
        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        const loginMessage = document.getElementById("loginMessage");

        if(email==="" || password===""){
            loginMessage.textContent="Please fill in both email and password.";
            loginMessage.style.color="red";
        }else{
            loginMessage.textContent="Login form was successfully submitted.";
            loginMessage.style.color="green";
        }

    });
}

//REGISTER
const registerForm = document.getElementById("registerForm");
if(registerForm){
    registerForm.addEventListener("submit", function(event){
        event.preventDefault();
        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const registerMessage = document.getElementById("registerMessage");

        if(fullName===""|| email===""|| password === "" || confirmPassword===""){
            registerMessage.textContent ="Please fill in all registration fields.";
            registerMessage.style.color ="red";
        }else if(password !== confirmPassword){
            registerMessage.textContent="Passwords do not match.";
            registerMessage.style.color ="red";
        }else{
            registerMessage.textContent="Registration form was successfully submitted.";
            registerMessage.style.color = "green";
        }

    });
}

//CREATE OR DELETE PLANS
var planForm = document.getElementById("planForm");
var plansContainer = document.getElementById("plansContainer");

function loadPlans(){
    if(plansContainer){
        fetch("/api/plans")
            .then(function(response){
                return response.json();
            })
            .then(function(plans){
                plansContainer.innerHTML="";
                
            }
    }
}
document.addEventListener("click", function(event){
    if(event.target.classList.contains("delete-plan")){
        const confirmDate = confirm("Are you sure you want to delete this plan?");
        if(confirmDate){
            event.target.closest(".col-md-4").remove();
        }
    }
});

//ADD TO PLAN
const addToPlanButton = document.getElementById("click", function(){
    const selectedPlan = document.getElementById("planSelect").value;
    if(selectedPlan==="Select a plan"){
        alert("Please choose a plan first.");
    }else{
        alert("Place added to " + selectedPlan + " successfully.");
   
    }
});

//LOAD PLACES FROM API
var placesContainer=document.getElementById("placesContainer");
if(placesContainer){
    fetch("/api/places").then(function(response){
        return response.json();
    }).then(function(places){
        placesContainer.innerHTML="";

        for(var i=0;i<places.length;i++){
            var place=places[i];
            placesContainer.innerHTML += 
            '<div class="col-md-4 mb-4 place-card-wrapper" ' +
            'data-destination="' +place.city + '" ' + 'data-category="' +
            place.category.toLowerCase()+ '"' + 'data-keywords="' + place.placeName.toLowerCase()+
            ' '+place.city.toLowerCase() + ' ' + place.category.toLowerCase() + '">' +
                '<div class="card place-card">' +
                    '<img src="' + place.imagePath + '"class="card-img-top" alt="' + place.placeName +
                    '">' +
                    '<div class="card-body">' +
                        '<h5 class="card-title">' + place.placeName + '</h5>' +
                        '<p class="card-text">' + place.description + '</p>' +
                        '<p><strong>Category:</strong> ' + place.category + '</p>' +
                        '<p><strong>City:</strong> ' + place.city + '</p>' +

                        '<button class="custom-button mb-2" data-bs-toggle="modal" data-bs-target="#addToPlanModal">' +'Add to Plan' +
                        '</button>' +

                        '<a href="place-details.html" class="btn btn-outline-secondary">' +'View Details' +
                        '</a>' +
                    '</div>' +
                '</div>'+
            '</div>';
        }
        filterPlaces();
    });
        
    }


    function loadPlans(){
        if(placesContainer){
            fetch("/api/plans").then(function(response){
                return response.json();
            })
            .then(function(plans){
                console.log(plans);
                placesContainer.innerHTML="";
                for(var i=0; i<plans.length;i++){
                    var plan = plans[i];

                    plansContainer.innerHTML += '<div class="col-md-4 mb-4>' +
                    '<div class="card place-card">' + '<div class="card-body">' +
                    '<h5 class="card-title">' + plan.planName + '</h5>' + 
                    '<p><strong>Destination:</strong>' + plan.destinationCity + '</p>' + 
                    '<p><strong>Start Date:</strong>' + plan.startDate.subtring(0,10) + '</p>' + 
                    '<p><strong>End Date:</strong>' + plan.endDate.subtring(0,10)+'</p>' +
                    '<button class="btn btn-danger" onclicj="deletePlan(' + plan.planID + ')"Delete</button>' +
                    '</div>' + '</div>' + '</div>';
                }

            });
        }
    }
    if(planForm){
        planForm.onsubmit=function(event){
            event.preventDefault();

            var newPlan={
                userID: 1,
                planName: document.getElementById("planName").value,
                destinationCity: document.getElementById("planDestination").value,
                startDate: (document.getElementById("startDate").value).toISOString(),
                endDate: (document.getElementById("endDate").value).toISOString()};
            fetch("/api/plans",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newPlan)
            }).then(function(response){
                return response.json();
            }).then(function(){
                planForm.reset();
                loadPlans();
            });
            };
        }    
function deletePlan(id){
    fetch("/api/plans/" + id, {
        method: "DELETE"
    }).then(function(){
        loadPlans();
    });
}
loadPlans();