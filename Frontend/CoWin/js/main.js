var field = document.querySelector('#date');
var date = new Date();
field.value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0);

document.querySelector('#search-form').addEventListener('submit', getList);

function getList(e) {
    e.preventDefault();
    let pincode = document.getElementById('pincode').value;
    let date = new Date(document.getElementById('date').value);
    let age = document.querySelector("input[type='radio'][name='age']:checked").value;
    let fees = document.querySelector("input[type='radio'][name='cost']:checked").value;
    let day = date.getDate().toString().padStart(2, 0) + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getFullYear().toString();
    fetch('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + pincode + '&date=' + day)
    .then((res) => res.json())
    .then((data) => {
        let output = '<thead><tr><th class="border-collapse border border-gray-800 bg-gray-300">No.</th><th class="w-1/3 border-collapse border border-gray-800 bg-gray-300">Location</th><th class="border-collapse border border-gray-800 bg-gray-300">Vaccine</th><th class="border-collapse border border-gray-800 bg-gray-300">Fees</th><th class="border-collapse border border-gray-800 bg-gray-300">Availability</th><th class="border-collapse border border-gray-800 bg-gray-300">Age</th><th class="w-1/12 border-collapse border border-gray-800 bg-gray-300">Slots</th></tr></thead><tbody>';
        let list = data.sessions;
        let x = 1;
        list.forEach((post) => {
            if ((post.min_age_limit == age && post.fee_type == fees) || (post.min_age_limit == age && fees == 'both') || (age == 'both' && post.fee_type == fees)) {                
                output += `
                    <tr>
                        <td class="border-collapse border border-gray-800">
                            ${x}
                        </td>
                        <td class="border-collapse border border-gray-800">
                            <h1 class="text-lg">${post.name}</h1>
                            <h1 class="text-sm text-gray-500">${post.address}</h1>
                            <h1 class="text-sm text-gray-500">${post.district_name}, ${post.state_name}</h1>
                            <h1 class="text-sm">Center Id = ${post.center_id}</h1>
                        </td class="border-collapse border border-gray-800">
                        <td class="border-collapse border border-gray-800">${post.vaccine}</td>
                        <td class="border-collapse border border-gray-800">
                            ${post.fee_type}<br>
                            ${post.fee}
                        </td>
                        <td class="border-collapse border border-gray-800">
                            Dose 1 = ${post.available_capacity_dose1}<br>
                            Dose 2 = ${post.available_capacity_dose2}
                        </td>
                        <td class="border-collapse border border-gray-800">${post.min_age_limit} & above</td>
                        <td class="text-sm border-collapse border border-gray-800">
                            ${post.slots[0]}<br>
                            ${post.slots[1]}<br>
                            ${post.slots[2]}<br>
                            ${post.slots[3]}<br>
                        </td>
                    </tr>
                `;
                x++;            
            } else if (age == 'both' || fees == 'both'){
                output += `
                    <tr>
                        <td class="border-collapse border border-gray-800">
                            ${x}
                        </td>
                        <td class="border-collapse border border-gray-800">
                            <h1 class="text-lg">${post.name}</h1>
                            <h1 class="text-sm text-gray-500">${post.address}</h1>
                            <h1 class="text-sm text-gray-500">${post.district_name}, ${post.state_name}</h1>
                            <h1 class="text-sm">Center Id = ${post.center_id}</h1>
                        </td class="border-collapse border border-gray-800">
                        <td class="border-collapse border border-gray-800">${post.vaccine}</td>
                        <td class="border-collapse border border-gray-800">
                            ${post.fee_type}<br>
                            ${post.fee}
                        </td>
                        <td class="border-collapse border border-gray-800">
                            Dose 1 = ${post.available_capacity_dose1}<br>
                            Dose 2 = ${post.available_capacity_dose2}
                        </td>
                        <td class="border-collapse border border-gray-800">${post.min_age_limit} & above</td>
                        <td class="text-sm border-collapse border border-gray-800">
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
        document.querySelector('#output').innerHTML = output + '</tbody>';
    })
    .catch((err) => console.log(err));
}