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

// Function to get server time and hydration data
async function SetDataCache() {
    server_time = await GetServerTime();
    bays = await GetAllBays();
}

// Function to hydrate the bay modal buttons
function HydrateButtons() {
  for (let i = 0; i < BayModalButtons.length; i++) {
    const button = BayModalButtons[i]
    const bay = bays[i]
    for (let j = 0; j < bay.schedule.length; j++) {
      if (bay.schedule[j][0] < server_time && bay.schedule[j][1] > server_time) {
        console.log("Occupied Currently")
        BayModalButtons[i].src = "../bay_closed.png"
      }
    }

    button.addEventListener('click', function() {
      BayModal.querySelectorAll(".bay_identifier").value = bay_id;
      BayModal.style = "visibility: visible;"
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