const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-ET-WEB-PT-D';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
        const allPlayers = await response.json();
        // console.log(allPlayers)
        return allPlayers;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (id) => {
    try {
        const response = await fetch(`${APIURL}/${id}`);
        const player = await response.json();
        return player;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${id}!`, err);
    }
};

const addNewPlayer = async (name, breed, imageUrl) => {
    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            body: JSON.stringify({ name, breed, imageUrl }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const player = await response.json();
        fetchAllPlayers();

                // reload the window
                window.location.reload();

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (id) => {
    try {
        const response = await fetch(`${APIURL}/${id}`, {
            method: 'DELETE',
        });
        const player = await response.json();
        console.log(player);
        fetchAllPlayers()

        // reload the window
        window.location.reload();

    } catch (err) {
        console.error(`Whoops, trouble removing player #${id} from the roster!`, err);
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */

// render single player
// const renderSinglePlayer = async (id) => {
//     try {
//         const playerResponse = await fetch(`${APIURL}/${id}`);
//         const players = await playerResponse.json();
//         console.log('Player', players);

// // Create new HTML element to display party details
//         const playerDetailsElement = document.createElement('div');
//             playerDetailsElement.classList.add('player-details');
//             playerDetailsElement.innerHTML =  `
//             <h2>${players.name}</h2>
//             <p>${players.id}</p>
//             <p>${players.breed}</p>
//             <p>${players.status}</p>
//             <p>${players.createdAt}</p>
//             <p>${players.updatedAt}</p>
//             <p>${players.imageUrl}</p>
//             <p>${players.teamId}</p>
//             <p>${players.cohortId}</p>
//             <br>
//             <button class="close-button">Close</button>
//             `;

const renderSinglePlayer = (players) => {
    let playerHTML = `
            <div id="single">
            <img id="detail-image" src="${players.imageUrl}">
            <h2>Name: ${players.name}</h2>
            <p>ID: ${players.id}</p>
            <p>Breed: ${players.breed}</p>
            <p>Status: ${players.status}</p>
            <p>Team ID: ${players.teamId}</p>
            <p>CoHort ID: ${players.cohortId}</p>
            <br><br>
            <button class="close-button">Close</button>
            </div>
    `
    playerContainer.innerHTML = playerHTML;

    let closeButton = playerContainer.querySelector('.close-button');
    // Add event listener to close button
    closeButton.addEventListener('click', async () => {
        const playerS = await fetchAllPlayers();
        renderAllPlayers(playerS.data.players);
    })

}

const renderAllPlayers = (playerList) => {
        playerContainer.innerHTML = '';
        playerList.forEach((players) => {
            const playerElement = document.createElement('div');
            playerElement.classList.add('players');
            playerElement.innerHTML = `
                    <h2>${players.name}</h2>
                    <p>${players.breed}</p>
                    <a href="${players.imageUrl}"><img src="${players.imageUrl}"></a>
                    <br><br>
                    <button class="details-button" data-id"${players.id}">See Player Details</button>
                    <button class="remove-button" data-id"${players.id}">Remove Player</button> 
            `;
        playerContainer.appendChild(playerElement);

        let removeButton = playerElement.querySelector('.remove-button');
        // Attach event listener to delete button
        removeButton.addEventListener('click', (event) => {
            event.preventDefault();
            removePlayer(players.id);
        });

        let detailButton = playerElement.querySelector('.details-button');
        // Attach event listener to details button
        detailButton.addEventListener('click', (event) => {
            event.preventDefault();
            renderSinglePlayer(players);
        });
    })
}


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        let formHtml = `
        <form>
            <h2 id="addPlayer">Add New Player</h2>
            <label for="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Name">
            <label for="breed">Breed</label>
            <input type="text" id="breed" name="breed" placeholder="breed">
            <label for="imageUrl">Image URL</label>
            <input type="text" id="imageUrl" name="imageUrl" placeholder="Image URL">
            <button type="submit">Create</button>
        </form>
        `;
newPlayerFormContainer.innerHTML = formHtml;
        
        let form = newPlayerFormContainer.querySelector('form');
        form.addEventListener('submit', async (event) => {
           event.preventDefault() ;

            let playerData = {
                name: form.name.value,
                breed: form.breed.value,
                imageUrl: form.imageUrl.value
            };
await addNewPlayer(playerData.name, playerData.breed, playerData.imageUrl);

            const players = await fetchAllPlayers();
            renderAllPlayers(players.data.players);

            form.name.value = '';
            form.breed.value = '';
            form.imageUrl = '';
        });
        
        
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}


const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players.data.players);

    renderNewPlayerForm();
}

init();