var field = document.querySelector('#date');
var date = new Date();
field.value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0);

document.querySelector('#search-form').addEventListener('submit', getList);

const checkbox = document.querySelector('#toggle');
const html = document.querySelector('html');

const toggleDarkMode = () => {
    checkbox.checked ? html.classList.add("dark") : html.classList.remove("dark");
}

toggleDarkMode();
checkbox.addEventListener('click', toggleDarkMode);

function getList(e) {
    e.preventDefault();
    let pincode = document.getElementById('pincode').value;
    let date = new Date(document.getElementById('date').value);
    let age = document.querySelector("input[type='radio'][name='age']:checked").value;
    let fees = document.querySelector("input[type='radio'][name='cost']:checked").value;
    let vaccine = document.querySelector("input[type='radio'][name='vaccine']:checked").value;
    let day = date.getDate().toString().padStart(2, 0) + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getFullYear().toString();
    fetch('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + pincode + '&date=' + day)
    .then((res) => res.json())
    .then((data) => {
        let output = '<thead class="dark:text-gray- py-2300"><tr><th class="border-collapse border border-gray-800 dark:broder-gray-200 dark:bg-gray-700 bg-gray-300 text-2xl">No.</th><th class="w-1/3 border-collapse border border-gray-800 dark:broder-gray-200 bg-gray-300 dark:bg-gray-700 text-2xl">Location</th><th class="border-collapse border border-gray-800 dark:broder-gray-200 bg-gray-300 dark:bg-gray-700 text-2xl">Vaccine</th><th class="border-collapse border border-gray-800 dark:broder-gray-200 bg-gray-300 dark:bg-gray-700 text-2xl">Fees</th><th class="border-collapse border border-gray-800 dark:broder-gray-200 bg-gray-300 dark:bg-gray-700 text-2xl">Availability</th><th class="border-collapse border border-gray-800 dark:broder-gray-200 bg-gray-300 dark:bg-gray-700 text-2xl">Age</th><th class="w-1/6 border-collapse border border-gray-800 dark:broder-gray-200 bg-gray-300 dark:bg-gray-700 text-2xl">Slots</th></tr></thead><tbody>';
        let list = data.sessions;
        let x = 1;
        list.forEach((post) => {
            if ((post.min_age_limit == age && post.fee_type == fees && post.vaccine == vaccine) || 
            (post.min_age_limit == age && fees == 'both' && post.vaccine == vaccine) || 
            (age == 'both' && post.fee_type == fees && post.vaccine == vaccine) ||
            (post.min_age_limit == age && post.fee_type == fees && vaccine == 'any') ||                
            (post.min_age_limit == age && fees == 'both' && vaccine == 'any') || 
            (age == 'both' && fees == 'both' && post.vaccine == vaccine) ||
            (age == 'both' && post.fee_type == fees && vaccine == 'any')) {                
                output += `
                    <tr>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">
                            ${x}
                        </td>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">
                            <h1 class="text-lg">${post.name}</h1>
                            <h1 class="text-sm text-gray-500">${post.address}</h1>
                            <h1 class="text-sm text-gray-500">${post.district_name}, ${post.state_name}</h1>
                            <h1 class="text-sm">Center Id = ${post.center_id}</h1>
                        </td>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">${post.vaccine}</td>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">
                            ${post.fee_type}<br>
                            ${post.fee}
                        </td>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">
                            Dose 1 = ${post.available_capacity_dose1}<br>
                            Dose 2 = ${post.available_capacity_dose2}
                        </td>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">${post.min_age_limit} & above</td>
                        <td class="text-sm border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">
                            ${post.slots[0]}<br>
                            ${post.slots[1]}<br>
                            ${post.slots[2]}<br>
                            ${post.slots[3]}<br>
                        </td>
                    </tr>
                `;
                x++;;            
            } else if (age == 'both' && fees == 'both' && vaccine == 'any'){
                output += `
                    <tr>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">
                            ${x}
                        </td>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">
                            <h1 class="text-lg">${post.name}</h1>
                            <h1 class="text-sm text-gray-500">${post.address}</h1>
                            <h1 class="text-sm text-gray-500">${post.district_name}, ${post.state_name}</h1>
                            <h1 class="text-sm">Center Id = ${post.center_id}</h1>
                        </td>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">${post.vaccine}</td>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">
                            ${post.fee_type}<br>
                            ${post.fee}
                        </td>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">
                            Dose 1 = ${post.available_capacity_dose1}<br>
                            Dose 2 = ${post.available_capacity_dose2}
                        </td>
                        <td class="border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">${post.min_age_limit} & above</td>
                        <td class="text-sm border-collapse border border-gray-800 dark:broder-gray-200 px-3 py-2">
                            ${post.slots[0]}<br>
                            ${post.slots[1]}<br>
                            ${post.slots[2]}<br>
                            ${post.slots[3]}<br>
                        </td>
                    </tr>
                `;
                x++;
            }
        });
        if (output == '<thead class="dark:text-gray- py-2300"><tr><th class="border-collapse border border-gray-800 dark:broder-gray-200 dark:bg-gray-700 bg-gray-300 text-2xl">No.</th><th class="w-1/3 border-collapse border border-gray-800 dark:broder-gray-200 bg-gray-300 dark:bg-gray-700 text-2xl">Location</th><th class="border-collapse border border-gray-800 dark:broder-gray-200 bg-gray-300 dark:bg-gray-700 text-2xl">Vaccine</th><th class="border-collapse border border-gray-800 dark:broder-gray-200 bg-gray-300 dark:bg-gray-700 text-2xl">Fees</th><th class="border-collapse border border-gray-800 dark:broder-gray-200 bg-gray-300 dark:bg-gray-700 text-2xl">Availability</th><th class="border-collapse border border-gray-800 dark:broder-gray-200 bg-gray-300 dark:bg-gray-700 text-2xl">Age</th><th class="w-1/6 border-collapse border border-gray-800 dark:broder-gray-200 bg-gray-300 dark:bg-gray-700 text-2xl">Slots</th></tr></thead><tbody>') {
            document.querySelector('#output').innerHTML = '<h1 class="text-3xl text-red-600 font-bold px-6 py-3 text-2xl">No slots available</h1>'
        } else {
            document.querySelector('#output').innerHTML = output + '</tbody>';
        }
    })
    .catch((err) => console.log(err));
}