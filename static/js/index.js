// Handles client interactivity and AJAX
// Define variables for handling DOM elements
const ErrorModal = document.querySelector(".error_modal_container");
const ErrorModalTitle = ErrorModal.querySelector(".error_modal_title");
const ErrorModalSubtext = ErrorModal.querySelector(".error_modal_subtext");
const BayModalButtons = document.getElementsByClassName("bay_modal_button");
const BayModalSubmit = document.querySelector(".bay_submit")
const BayModal = document.querySelector(".bay_modal")
const BayModalFrom = document.querySelector("#from")
const BayModalTo = document.querySelector("#to")

// Define variables for storing server data
let server_time;
let bays;

// Displays network errors to the user
function DisplayNetworkError(network_error) {
    ErrorModalTitle.innerHTML = `ERROR: ${network_error.error}`
    ErrorModal.style = "visibility: visible;"
};

// Function for constructing and deconstructing AJAX requests
async function AjaxRequest(url, method, data = null) {
  const request = { // Define the request
    method: method,
    headers: { "Content-Type": "application/json" }
  };

  if (method.toLowerCase() == "post") { // Add a body if the method is POST
    request.body = JSON.stringify(data)
  }

  // Send the request to the server
  const response = await fetch(url, request);
  // Extract the returned JSON
  const json = await response.json()

  if (!response.ok) { // Display an error if the request returned an error
    DisplayNetworkError(json);
  };

  // Return the response
  return json;
};

// Functions for common data requests
// Returns current server time
async function GetServerTime() {
  return await AjaxRequest("/scheduler/get_server_time", "GET");
};

// Returns all bays
async function GetAllBays() {
  return await AjaxRequest("/scheduler/get_all_bays", 'GET');
};

// Sets the schedule of the specified bay
async function SetSchedule(bay_id, schedule) {
  return await AjaxRequest("/scheduler/set_schedule", "POST", {
    bay_id: bay_id,
    schedule: schedule,
  });
};

// Hydration functions
// Function to get server time and hydration data
async function SetDataCache() {
    server_time = (await GetServerTime()).time;
    bays = (await GetAllBays()).bays;
}

// Function to hydrate the bay modal buttons
function HydrateButtons() {
  for (let i = 0; i < BayModalButtons.length; i++) { // Loop through every button
    const bay = bays[i]
    var occupied_check = false
    BayModalButtons[i].querySelector(".bay_modal_title").innerText = BayModalButtons[i].name; // Set the button's title

    for (let k = 0; k < bay.schedule.length; k++) {
      if (bay.schedule[k][0] <= server_time && bay.schedule[k][1] >= server_time) { // Check if the bay is currently occupied
        BayModalButtons[i].querySelectorAll(".bay_modal_button_img")[0].classList.value = "bay_modal_button_img bay_modal_button_img_occupied" // Apply a filter to make the button red if its occupied
        occupied_check = true
      }
    };

    if (!occupied_check) { // Apply a filter to make the button green if it's unoccupied
      BayModalButtons[i].querySelectorAll(".bay_modal_button_img")[0].classList.value = "bay_modal_button_img bay_modal_button_img_free";
    }
    
    // Add event listeners for openning & hydrating the modal
    BayModalButtons[i].addEventListener('click', function() { 
      BayModal.querySelectorAll(".bay_identifier")[0].value = bay.id;
      BayModal.querySelectorAll("#bay_modal_title")[0].innerText = BayModalButtons[i].name;
      BayModal.style = "visibility: visible;"
    })
  }
}


// Function to attach event handlers to the modal
function AttachModalEventHandlers() {
  // Event listener for closing the modal
  BayModal.querySelectorAll(".bay_modal_quit")[0].addEventListener("click", function() {
    BayModal.style = "visibility: hidden;"
  });

  // Event listener for submitting the form
  BayModal.addEventListener("submit", function(e) {
    e.preventDefault();
    SetSchedule(BayModal.querySelectorAll(".bay_identifier")[0].value, [BayModalFrom.value, BayModalTo.value]);
    return false;
  });
};



// Main function to set up the DOM
async function setup() {
  await SetDataCache();
  AttachModalEventHandlers();
  HydrateButtons();
};

setup();