import { 
    checkAuth, 
    getCharacter,
    logout,
    updateBottom,
    updateHead,
    updateMiddle,
    updateChatchphrases,
    createDefaultChar
} from '../fetch-utils.js';

checkAuth();

const headDropdown = document.getElementById('head-dropdown');
const middleDropdown = document.getElementById('middle-dropdown');
const bottomDropdown = document.getElementById('bottom-dropdown');
const headEl = document.getElementById('head');
const middleEl = document.getElementById('middle');
const bottomEl = document.getElementById('bottom');
const reportEl = document.getElementById('report');
const chatchphrasesEl = document.getElementById('chatchphrases');
const catchphraseInput = document.getElementById('catchphrase-input');
const catchphraseButton = document.getElementById('catchphrase-button');
const logoutButton = document.getElementById('logout');

// we're still keeping track of 'this session' clicks, so we keep these lets
let headCount = 0;
let middleCount = 0;
let bottomCount = 0;

headDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    headCount++;
    // update the head in supabase with the correct data
    await updateHead(headDropdown.value);

    refreshData();
});


middleDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    middleCount++;
    // update the middle in supabase with the correct data
    await updateMiddle(middleDropdown.value);

    refreshData();
});


bottomDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    bottomCount++;
    // update the bottom in supabase with the correct data
    await updateBottom(bottomDropdown.value);
    refreshData();
});

catchphraseButton.addEventListener('click', async() => {
    
    // go fetch the old catch phrases
    const char = await getCharacter();
    const catchphrase = char.catchphrases;
    // console.log('🚀 ~ file: build.js ~ line 65 ~ catchphraseButton.addEventListener ~ catchphrase', catchphrase);
    catchphrase.push(catchphraseInput.value);
    await updateChatchphrases(catchphrase);
    
    // update the catchphrases array locally by pushing the new catchphrase into the old array
    
    // update the catchphrases in supabase by passing the mutated array to the updateCatchphrases function
    refreshData();
    catchphraseInput.value = '';
});

window.addEventListener('load', async() => {
    // let character;
    // on load, attempt to fetch this user's character
    const char = await getCharacter();
    // if this user turns out not to have a character
    if (!char) {
        await createDefaultChar();
        
        
    } else {
        await fetchAndDisplayCharacter();
    }
    // create a new character with correct defaults for all properties (head, middle, bottom, catchphrases)
    // and put the character's catchphrases in state (we'll need to hold onto them for an interesting reason);

    // then call the refreshData function to set the DOM with the updated data
    refreshData();
});

logoutButton.addEventListener('click', () => {
    logout();
});

function displayStats() {
    reportEl.textContent = `In this session, you have changed the head ${headCount} times, the body ${middleCount} times, and the pants ${bottomCount} times. And nobody can forget your character's classic catchphrases:`;
}



async function fetchAndDisplayCharacter() {
    // fetch the caracter from supabase
    const char = await getCharacter();
    // console.log('🚀 ~ file: build.js ~ line 98 ~ fetchAndDisplayCharacter ~ char', char);

    // if the character has a head, display the head in the dom
    if (char.head) {
        headEl.textContent = '';
        const img = document.createElement('img');
        img.src = `../assets/${char.head}-head.png`;
        headEl.append(img);
    }
    // if the character has a middle, display the middle in the dom
    if (char.middle) {
        middleEl.textContent = '';
        const img = document.createElement('img');
        img.src = `../assets/${char.middle}-middle.png`;
        middleEl.append(img);
    }
    // if the character has a pants, display the pants in the dom
    if (char.bottom) {
        bottomEl.textContent = '';
        const img = document.createElement('img');
        img.src = `../assets/${char.bottom}-pants.png`;
        bottomEl.append(img);
    }
    // loop through catchphrases and display them to the dom (clearing out old dom if necessary)
    chatchphrasesEl.textContent = '';
    for (const catchphrase of char.catchphrases) {
        const p = document.createElement('p');
        

        p.textContent = catchphrase;
        chatchphrasesEl.append(p);
    }
}

function refreshData() {
    displayStats();
    fetchAndDisplayCharacter();
}
