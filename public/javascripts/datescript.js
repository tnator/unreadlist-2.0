const startDate = dateSaved.toISOString().replace('.000Z', '');
const date = new Date(startDate);
const year = date.getFullYear();
const monthNum = date.getMonth();
const day = date.getDay();

// const monthArray = ['January', 'February', 'March'];
// for (let i=0; i<monthArray.length; i++) {
//     if (monthNum === 0) {
//         month = 'January';
//     } (monthNum === 1) {
//         month = 'February';
//     } (monthNum === 2) {
//         month = 'March';
//     }
// }

if (monthNum === 0) {
    month = "January";
} else if (monthNum === 1) {
    month = 'February';
} else {
    month = 'March';
};



const dateDisplay = month + '/' + day;