const { sitesDisplay } = require("../../controllers/controller");


// SET EMPTY VACATION SLOT BACKGROUND TO DARK
const slots = document.querySelectorAll("div.slot");

for (let i=0; i<slots.length; i++) {
    cell = slots[i].innerHTML;
    if (cell === 'BLK') {
        slots[i].style.backgroundColor = '#272727';
        slots[i].style.color = '#272727';
    } else if (cell === '') {
        slots[i].style.backgroundColor = '#F6AE2D';
        slots[i].style.color = '#F6F7F8';
    };
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
const totalRadsArray = ['jla', 'dma', 'era', 'aca', 'rrb', 'kib', 'jdb', 'aqc', 'jmc', 'bpc', 'egc', 'cmc', 'spd', 'cff', 'cmg', 'laj', 'vbk', 'dcm', 'rmm', 'rep', 'kbr', 'crr', 'jss', 'rjs', 'rkt', 'cva', 'mew'];
const totalRadsNum = totalRadsArray.length;
const nightRadsArray = ['cmc', 'vbk', 'cva'];
const vacationRadsArray = ['jla', 'dma', 'aca', 'rrb', 'kib', 'jdb', 'aqc', 'jmc', 'bpc', 'egc', 'cff', 'cmg', 'laj', 'dcm', 'rmm', 'rep', 'kbr', 'crr', 'jss', 'rjs', 'rkt', 'mew'];
const vacationRadsNum = vacationRadsArray.length
for (let i=0; i<vacationRadsArray.length; i++) {
    var initials = vacationRadsArray[i];
    var ilist = document.querySelectorAll('.' + initials);
    var totals = vacationRadsArray[i].toUpperCase() + ' has ' + ilist.length + ' weeks of vacation';
    var totalsContainer = document.querySelector('.totalsContainer');
    var node = document.createElement("li");
    node.classList.add('list-group-item');
    var textnode = document.createTextNode(totals);
    node.appendChild(textnode);
    totalsContainer.appendChild(node);
};


// const chevron = document.querySelectorAll('chevron');
// function toggleChevron() {
//     this.classList.toggle('fa-chevron-down');
//     this.classList.toggle('fa-chevron-up');
// };

// chevron.addEventListener('click', toggleChevron);