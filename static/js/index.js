// Handles client interactivity and AJAX
// Define variables for handling DOM elements
const ErrorModal = document.querySelector(".error_modal_container");
const ErrorModalTitle = ErrorModal.querySelector(".error_modal_title");
const ErrorModalSubtext = ErrorModal.querySelector(".error_modal_subtext");
const BayModalButtons = document.getElementsByClassName("bay_modal_button");
const BayModal = document.querySelector(".bay_modal")

// Define variables for storing server data
let server_time;
let bays;

// Displays network errors to the user
function DisplayNetworkError(network_error) {
    ErrorModalTitle.innerHTML = `ERROR: ${network_error.error}`
    ErrorModal.style = "visibility: visible;"
};

// Function for constructing and deconstructing AJAX requests
async function AjaxRequest(url, method = 'GET', data = null) {
  const request = { // Define the request
    method: method,
    headers: { "Content-Type": "application/json" }
  };

  if (method.toLowerCase() == "post") { // Add a body if the method is POST
    request.body = JSON.stringify(data)
  }

  // Send the request to the server
  const response = await fetch(url, request);

  if (!response.ok) { // Display an error if the request returned an error
    DisplayNetworkError(await response.json());
  };

  // Return the response
  return response.json();
};

// Functions for common data requests
// Returns current server time
async function GetServerTime() {
  return await AjaxRequest("/scheduler/get_server_time", "GET");
};

// Returns bay data for modal hydration
async function GetHydrateData(bay_id) {
  return await AjaxRequest(`/scheduler/get_hydrate_data?bay_id=${bay_id}`, 'GET');
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
    BayModalButtons[i].querySelector(".bay_modal_title").innerText = BayModalButtons[i].name; // Set the button's title

    if (bay.schedule[0] <= server_time && bay.schedule[1] >= server_time) { // Check if the bay is currently occupied
      BayModalButtons[i].querySelectorAll(".bay_modal_button_img")[0].classList.value = "bay_modal_button_img_occupied" // Apply a filter to make the button white
    }

    BayModalButtons[i].addEventListener('click', function() { // Add event listeners for openning the modal
      BayModal.querySelectorAll(".bay_identifier").value = bay_id;
      BayModal.style = "visibility: visible;"
      // TODO: Hydrate the modal here
    })
  }
}

// Function to hydrate the bay modal
async function HydrateModal(bay_id) {
  const bay = bays[bay_id]
}

// Function to attach event handlers to the modal
function AttachModalEventHandlers() {
  BayModal.querySelectorAll("bay_modal_quit").addEventListener("click", function() {
    BayModal.style = "visibility: hidden;"
  });
};

// Main function to set up the DOM
async function setup() {
  await SetDataCache()
  HydrateButtons()
}

setup()