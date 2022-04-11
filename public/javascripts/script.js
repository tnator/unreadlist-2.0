// const { sitesDisplay } = require("../../controllers/controller");

// JAVASCRIPT TO UNDERLING NAV LINK FOR CURRENT PAGE
const links = document.querySelectorAll('a.primary-nav-link');
var current = 0;
for (let i=0; i<links.length; i++) {
    if (links[i].href === document.URL) {
        links[i].classList.add('current');      
    }
};

// SET EMPTY VACATION SLOT BACKGROUND TO DARK
const slots = document.querySelectorAll("td.slot");
for (let i=0; i<slots.length; i++) {
    cell = slots[i].innerHTML;
    if (cell === 'BLK') {
        slots[i].style.backgroundColor = '#272727';
        slots[i].style.color = '#272727';
    } 
    // else if (cell === '') {
    //     slots[i].style.backgroundColor = 'transparent';
    //     slots[i].style.color = '#F6F7F8';
    // };
};

// TOGGLE ALL VACATION WEEKS BACKGROUND COLOR FOR GIVEN RAD
for (let i=0; i<slots.length; i++) {
    slots[i].addEventListener('click', ()=> {
        const classInitials = slots[i].innerHTML.toLowerCase();
        var initialsList = document.querySelectorAll("." + classInitials);
        for (let k=0; k<initialsList.length; k++) {
            initialsList[k].classList.toggle('bg-danger');
            initialsList[k].classList.toggle('text-light');
        };
    })
}
// const totalRadsArray = ['jla', 'dma', 'era', 'aca', 'rrb', 'kib', 'jdb', 'aqc', 'jmc', 'bpc', 'egc', 'cmc', 'spd', 'cff', 'cmg', 'laj', 'vbk', 'dcm', 'rmm', 'rep', 'kbr', 'crr', 'jss', 'rjs', 'rkt', 'cva', 'mew'];
// const totalRadsNum = totalRadsArray.length;
// const nightRadsArray = ['cmc', 'vbk', 'cva'];
// const vacationRadsArray = ['jla', 'dma', 'aca', 'rrb', 'kib', 'jdb', 'aqc', 'jmc', 'bpc', 'egc', 'cff', 'cmg', 'laj', 'dcm', 'rmm', 'rep', 'kbr', 'crr', 'jss', 'rjs', 'rkt', 'mew'];
// const vacationRadsNum = vacationRadsArray.length
// for (let i=0; i<vacationRadsArray.length; i++) {
//     var initials = vacationRadsArray[i];
//     var ilist = document.querySelectorAll('.' + initials);
//     var totals = vacationRadsArray[i].toUpperCase() + ' has ' + ilist.length + ' weeks of vacation';
//     var totalsContainer = document.querySelector('.totalsContainer');
//     var node = document.createElement("li");
//     node.classList.add('list-group-item');
//     var textnode = document.createTextNode(totals);
//     node.appendChild(textnode);
//     totalsContainer.appendChild(node);
// };


// SCRIPT FOR CONTACTS PAGE ACCORDION TOGGLE
var accordion = document.querySelectorAll(".site-accordion");
for (i=0; i<accordion.length; i++) {
    accordion[i].addEventListener('click', function() {
        console.log('toggle');
        this.classList.toggle('active');
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}

// TOGGLE ALL HONEY BADGER SHIFTS BACKGROUND COLOR FOR GIVEN RAD
const assigned = document.querySelectorAll("td.assigned");
for (let i=0; i<assigned.length; i++) {
    assigned[i].addEventListener('click', ()=> {
        const classInitials = assigned[i].innerHTML.toLowerCase();
        var initialsList = document.querySelectorAll("." + classInitials);
        for (let k=0; k<initialsList.length; k++) {
            initialsList[k].classList.toggle('bg-danger');
            initialsList[k].classList.toggle('text-light');
        };
    })
}

const totals = document.querySelector(".totals");
const shiftrows = document.querySelectorAll("tr.shiftrow");
for (let i=0; i<shiftrows.length; i++ ) {
    rate = document.querySelector("tr.shiftrow td.assigned");
    console.log(rate);
};

// JAVASCRIPT FROM tomduffytech.com FOR PHONE NUMBER FORMATTING
function formatPhoneNumber(value) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        // return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
    // return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
    )}-${phoneNumber.slice(6, 10)}`;
    }

    function phoneNumberFormatter() {
    const inputField = document.querySelectorAll('.phone-number');
    for (let i=0; i<inputField.length; i++) {
        var formattedInputValue = formatPhoneNumber(inputField[i].value);
        inputField[i].value = formattedInputValue;
        console.log(formattedInputValue);
    }
    // const formattedInputValue = formatPhoneNumber(inputField.value);
    // inputField.value = formattedInputValue;
    }


//   SEARCH BAR FOR CONTACTS
function liveSearch() {
// Locate the card elements
let contact = document.querySelectorAll('.panel-contact')
// Locate the search input
let search_query = document.getElementById("searchbox").value;
// Loop through the cards
for (var i = 0; i < contact.length; i++) {
    // If the text is within the card...
    if(contact[i].innerText.toLowerCase()
    // ...and the text matches the search query...
    .includes(search_query.toLowerCase())) {
        // ...remove the `.is-hidden` class.
        contact[i].classList.remove("is-hidden");
    } else {
    // Otherwise, add the class.
    contact[i].classList.add("is-hidden");
    }
}
}