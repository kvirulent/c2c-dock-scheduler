const ErrorModal = document.querySelector(".error_modal_container");
const ErrorModalTitle = ErrorModal.querySelector(".error_modal_title");
const ErrorModalSubtext = ErrorModal.querySelector(".error_modal_subtext");

async function DisplayNetworkError(network_error) {
    ErrorModalTitle.innerHTML = `ERROR: ${await network_error.json().then((data) => { return data.error })}`
    ErrorModal.style = "visibility: visible;"
};

async function AjaxRequest(url, method, data = null) {
  const request = {
    method: method,
    headers: { "Content-Type": "application/json" }
  };

  if (data) {
    request.body = JSON.stringify(data)
  }

  const response = await fetch(url, request);

  if (!response.ok) {
    DisplayNetworkError(response);
  };

  return response;
};

async function GetServerTime() {
  return await AjaxRequest("/scheduler/get_server_time", "GET");
};

async function GetHydrateData(bay_id) {
  return await AjaxRequest(`/scheduler/get_hydrate_data?bay_id=${bay_id}`);
};

async function GetAllBays() {
  return await AjaxRequest("/scheduler/get_all_bays");
};

async function SetSchedule(bay_id, schedule) {
  return await AjaxRequest("/scheduler/set_schedule", "POST", {
    bay_id: bay_id,
    schedule: schedule,
  });
};

let server_time;
let bays;

async function SetDataCache() {
    server_time = await GetServerTime();
    bays = await GetAllBays();
    await GetHydrateData(7)
}

SetDataCache()