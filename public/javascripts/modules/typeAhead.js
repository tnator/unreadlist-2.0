// const axios = require('axios');
//or we can use this since we are using webpack
import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(contacts) {
    return contacts.map(contact => {
        // <a href="/contacts" class="search__result">
        //     <strong>${contact.numLabel}</strong>
        // </a>
        return `
            <a href="tel:1-${contact.phoneNum}" class="search__result">
                <strong>${contact.numLabel}</strong>
            </a>
        `;
    }).join('');
}

function typeAhead(search) {
    if (!search) return;

    const searchInput = search.querySelector('input[name="contactSearch"]');
    const searchResults = search.querySelector('.search__results');

    // on is a shortcut in bling.js
    searchInput.on('input', function() {
        // if there is no value, quit it!
        if(!this.value) {
            searchResults.style.display = 'none';
            return; //stop!
        }
        // show the search results
        searchResults.style.display = 'block';
        // will remove with backspace
        // searchResults.innerHTML = '';

        axios
            .get(`/api/contactSearch?q=${this.value}`)
            .then(res => {
                // console.log(res.data);
                if (res.data.length) {
                    // Example if you type ORMC
                    // console.log('There is something to show');
                    const html = searchResultsHTML(res.data);
                    searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
                    return;
                };
                // tell them nothing came back
                searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${this.value} found!</div>`);
            })
            .catch(err => {
                console.error(err);
            });
    });

    // handle keyboard inputs
    searchInput.on('keyup', (e) => {
        // if not pressing up, down, or enter, who cares
        if(![38, 40, 14].includes(e.keyCode)) {
            return; //skp it
        }
        const activeClass = 'search__result--active';
        const current = search.querySelector(`.${activeClass}`);
        const items = search.querySelectorAll('.search__result');
        let next;
        if (e.keyCode === 40 && current) {
            next = current.nextElementSibling || items[0];
        } else if (e.keyCode === 40) {
            next = items[0];
        } else if (e.keyCode === 38 && current) {
            next = current.previousElementSibling || items[items.length - 1]
        } else if (e.keyCode === 38) {
            next = items[items.length - 1];
        } else if (e.keyCode === 13 && current.href) {
            window.location = current.href;
            return;
        };
        if (current) {
            current.classList.remove(activeClass);
        };
        next.classList.add(activeClass);
    });
};

export default typeAhead;