// Formating Date
var field = document.querySelector('#date');
var date = new Date();
field.value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0);

// Event: Getting Slots
document.querySelector('#search-form').addEventListener('submit', getList);

// Event: Toggle Dark Mode
const checkbox = document.querySelector('#toggle');
const html = document.querySelector('html');

const toggleDarkMode = () => {
    checkbox.checked ? html.classList.add("dark") : html.classList.remove("dark");
}

toggleDarkMode();
checkbox.addEventListener('click', toggleDarkMode);

// Function: Getting Slots
function getList(e) {
    e.preventDefault();
    
    // Getting inout values
    let pincode = document.getElementById('pincode').value;
    let date = new Date(document.getElementById('date').value);
    let age = document.querySelector("input[type='radio'][name='age']:checked").value;
    let fees = document.querySelector("input[type='radio'][name='cost']:checked").value;
    let vaccine = document.querySelector("input[type='radio'][name='vaccine']:checked").value;
    let day = date.getDate().toString().padStart(2, 0) + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getFullYear().toString();
    
    // Fetching API
    fetch('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + pincode + '&date=' + day)
    .then((res) => res.json())
    .then((data) => {

        // Setting head
        let output = `
            <thead class="dark:text-gray-200 py-3 md:text-lg sm:text-base text-sm">
                <tr>
                    <th class="sm:table-cell hidden border-collapse border border-gray-800 
                    dark:broder-gray-200 dark:bg-gray-700 bg-gray-300"
                    >
                        No.
                    </th>
                    <th class="w-1/3 border-collapse border border-gray-800 
                    dark:broder-gray-200 bg-gray-300 dark:bg-gray-700"
                    >
                        Location
                    </th>
                    <th class="border-collapse border border-gray-800 dark:broder-gray-200 
                    bg-gray-300 dark:bg-gray-700"
                    >
                        Vaccine
                    </th>
                    <th class="border-collapse border border-gray-800 dark:broder-gray-200 
                    bg-gray-300 dark:bg-gray-700"
                    >
                        Fees
                    </th>
                    <th class="border-collapse border border-gray-800 dark:broder-gray-200 
                    bg-gray-300 dark:bg-gray-700"
                    >
                        Doses
                    </th>
                    <th class="border-collapse border border-gray-800 dark:broder-gray-200 
                    bg-gray-300 dark:bg-gray-700"
                    >
                        Age
                    </th>
                    <th class="w-1/6 border-collapse border border-gray-800 dark:broder-gray-200 
                    bg-gray-300 dark:bg-gray-700"
                    >
                        Slots
                    </th>
                </tr>
            </thead>
            <tbody>`;
        let list = data.sessions;
        let x = 0;
        list.forEach((post) => {
            if ((post.min_age_limit == age && post.fee_type == fees && post.vaccine == vaccine) || 
            (post.min_age_limit == age && fees == 'both' && post.vaccine == vaccine) || 
            (age == 'both' && post.fee_type == fees && post.vaccine == vaccine) ||
            (post.min_age_limit == age && post.fee_type == fees && vaccine == 'any') ||                
            (post.min_age_limit == age && fees == 'both' && vaccine == 'any') || 
            (age == 'both' && fees == 'both' && post.vaccine == vaccine) ||
            (age == 'both' && post.fee_type == fees && vaccine == 'any')) {
                let n = post.slots.length;
                let slots = '';
                for (var i = 0; i < n; i++) {
                    slots += `${post.slots[i]}<br>`;
                }            
                output += `
                    <tr class="text-xs">
                        <td class="sm:table-cell hidden sm:text-md border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">
                            ${x+1}
                        </td>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">
                            <h1 class="md:text-lg sm:text-sm ">${post.name}</h1>
                            <h1 class="sm:text-sm text-xs text-gray-500">${post.address}</h1>
                            <h1 class="sm:text-sm text-xs text-gray-500">${post.district_name}, ${post.state_name}</h1>
                            <h1 class="sm:text-sm text-xs">Center Id = ${post.center_id}</h1>
                        </td>
                        <td class="sm:text-base border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">${post.vaccine}</td>
                        <td class="sm:text-base border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">
                            ${post.fee_type}<br>
                            ${post.fee}
                        </td>
                        <td class="sm:text-base border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">
                            Dose 1 = ${post.available_capacity_dose1}<br>
                            Dose 2 = ${post.available_capacity_dose2}
                        </td>
                        <td class="sm:text-base border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">${post.min_age_limit} & above</td>
                        <td class="sm:text-sm border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">
                            ${slots}
                        </td>
                    </tr>
                `;
                x++;            
            } else if (age == 'both' && fees == 'both' && vaccine == 'any'){
                let n = post.slots.length;
                let slots = '';
                for (var i = 0; i < n; i++) {
                    slots += `${post.slots[i]}<br>`;
                }            
                output += `
                    <tr class="text-xs">
                        <td class="sm:table-cell hidden sm:text-md border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">
                            ${x+1}
                        </td>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">
                            <h1 class="md:text-lg sm:text-sm ">${post.name}</h1>
                            <h1 class="sm:text-sm text-xs text-gray-500">${post.address}</h1>
                            <h1 class="sm:text-sm text-xs text-gray-500">${post.district_name}, ${post.state_name}</h1>
                            <h1 class="sm:text-sm text-xs">Center Id = ${post.center_id}</h1>
                        </td>
                        <td class="sm:text-base border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">${post.vaccine}</td>
                        <td class="sm:text-base border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">
                            ${post.fee_type}<br>
                            ${post.fee}
                        </td>
                        <td class="sm:text-base border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">
                            Dose 1 = ${post.available_capacity_dose1}<br>
                            Dose 2 = ${post.available_capacity_dose2}
                        </td>
                        <td class="sm:text-base border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">${post.min_age_limit} & above</td>
                        <td class="sm:text-sm border-collapse border border-gray-800 dark:broder-gray-200 sm:px-3 px-1 py-2">
                            ${slots}
                        </td>
                    </tr>
                `;
                x++;
            }
        });

        // Checking Availability then Displaying
        if (x == 0) {
            document.querySelector('#output').innerHTML = '<h1 class="text-3xl text-red-600 font-bold px-6 py-3 text-2xl">No slots available</h1>'
        } else {
            document.querySelector('#output').innerHTML = output + '</tbody>';
        }
    })
    // Consoling Errors
    .catch((err) => console.log(err));
}