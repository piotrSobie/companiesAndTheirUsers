const companies = [];
const users = [];

function checkData(data){
    if(data.ok){
        return data.json();
    }
    else{
        return Promise.reject(data);
    }
}

function loadCompanies(companyObjects) {
    companyObjects.forEach(company => {
        const {
            name = "No data",
            uri = "No data"
        } = company;
        company.users = [];
        companies.push(company);
    });
}

function handleUsers(userObjects) {
    userObjects.forEach(user =>{
        const {
            name = "No data",
            uri = "No data",
            email = "No data",
            uris : {
                comany = "No data"
            }
        } = user;
        let numbers = user.email.match(/\d+/g).map(Number);
        companies[numbers[1]].users.push(user);
        users.push(user);
    });
    companies.sort((company1, company2) => company1.users.length - company2.users.length);
}

function loadToTable() {
    companies.forEach(company => {
        let usersRows = "";
        company.users.forEach(user => {
            usersRows += `<tr>
                            <td></td>
                            <td class="text-center">${user.name}</td>
                            <td class="text-center">${user.email}</td>
                          </tr>`;
        });
        let expandId = company.name.replace(" ", "");
        let tableRow = `<tbody>
                            <tr data-toggle="collapse" data-target=#${expandId} class="clickable">
                                <td class="text-center">${company.name}</td>
                                <td class="text-center">${company.uri}</td>
                                <td class="text-center">${company.users.length}</td>
                            </tr>
                        </tbody>
                        <tbody id=${expandId} class="collapse">
                            ${usersRows}
                        </tbody>`;
        $('.table').append(tableRow);
    })
}

function handleError(error){
    if(error.status === 404){
        alert("Blad: adres nie istnieje: " + error.url);
    }
    else{
        alert("Blad: wystapil nieznany blad")
    }
}

fetch('http://localhost:3000/companies')
    .then(data => checkData(data))
    .then(companyObjects => loadCompanies(companyObjects))
    .then(() => {
        fetch('http://localhost:3000/users')
            .then(data => checkData(data))
            .then(userObjects => handleUsers(userObjects))
            .then(() => loadToTable())
            .catch(error => handleError(error));
    })
    .catch(error => handleError(error));

