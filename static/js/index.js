// Simple and probably not best-practice script to handle client interaction with AJAX


// Handles displaying bay modals
const bay_modal = document.getElementById("bay_modal");
const modal_title = document.getElementById("bay_modal_title");
const modal_buttons = document.getElementsByClassName("bay_modal_button");
const bay_modal_quit = document.getElementById("bay_modal_quit");
const bay_modal_from_selection = document.getElementById("from");
const bay_modal_to_selection = document.getElementById("to");
const bay_modal_submit = document.getElementsByClassName("bay_submit");
var modal_bay_id = null; // = null if modal is closed, = bay id if modal is open
var bays = []

// Define a function to clean up ajax requests
async function ajax_request(url, method, body) {
    const options = {
        method: method,
        headers: new Headers({'content-type':'application/json'})
    };

    options.body = JSON.stringify(body)
    return await fetch(url, options)
}

async function hydrate() {
    server_bays = await ajax_request("/scheduler", 'post', {request_type: "GET_BAYS"})
    server_time = await ajax_request("/scheduler", 'post', {request_type: "GET_SERVER_TIME"})

    for (let i = 0; i < server_bays.length; i++) {
        bays.push(server_bays[i])
    }

    for (let i = 0; i < bays.length; i++) {
        bay = document.getElementById(i)
        for (let k = 0; k < bays[i].schedule.length; k++) {
            if (server_time > bays[i].schedule[k][0] && server_time < bays[i].schedule[k][1]) {
                console.log(`bay ${i} was closed`)
                bay.getElementByClassName("bay_modal_button_img").src="../bay_closed.png"
            } else {
                console.log(`bay ${i} was open`)
                bay.getElementByClassName("bay_modal_button_img").src="../bay_open.png"
            }
        }
    }
}

hydrate()

// // Close the modal when the exit button is clicked
// bay_modal_quit.addEventListener("click", function () {
//   modal_bay_id = null;
//   bay_modal.style = "visibility: hidden;";
// });

// // Add event listeners to each bay button to open and hydrate the modal
// for (let i = 0; i < modal_buttons.length; i++) {
//   modal_buttons[i].addEventListener("click", async function () {
//     modal_bay_id = modal_buttons[i].id;
//     // Send request to API for hydration data
//     bay_data = await ajax_request("/scheduler", 'post', {request_type: "GET_HYDRATE_DATA", bay_identifier: modal_buttons[i].id})
//     console.log(bay_data)

//     // Hydrate the modal
//     // This algorithm was optimized by 90%
//     // It used to have 3 for loops
//     const scheduleFrom = {};
//     const scheduleTo = {};

//     bay_data.schedule.forEach((sch) => {
//       scheduleFrom[sch[0]] = true;
//       scheduleTo[sch[1]] = true;
//     });

//     for (let j = 0; j < 25; j++) {
//       if (scheduleFromDict[j]) {
//         bay_modal_from_selection[j].style = "background: red;";
//       }
//       if (scheduleToDict[j]) {
//         bay_modal_to_selection[j].style = "background: red;";
//       }
//     }

//     modal_title.innerText = modal_buttons[i].name;
//     bay_modal.style = "visibility: visible;";
//   });

//   // Send request to API to create a schedule entry
//   bay_modal_submit.addEventListener("click", function () {
//     if (modal_bay_id == null) {
//       console.warn(
//         "Error: Tried to submit a schedule request but no modal is selected!"
//       );
//     }
//     response = JSON.parse(
//       fetch("/scheduler", {
//         method: "post",
//         body: JSON.stringify({
//           request_type: "SCHEDULE_BAY",
//           bay_identifier: modal_buttons[i].id,
//           end: bay_modal_to_selection.value,
//           start: bay_modal_from_selection.value,
//         }),
//       })
//     );

//     console.log(response)

//   });
// }