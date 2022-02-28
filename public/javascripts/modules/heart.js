import axios from 'axios';
import { $ } from './bling';

// this function is to keep on Sites page after hearting... i think

// arrow functions are used so we can use THIS

function ajaxHeart(e) {
    e.preventDefault();
    console.log('Heart it!!');
    axios
        .post(this.action)
        .then(res => {
            // console.log(res.data);
            // this.heart accesses the button from the pug file since it has a name="heart"
            const isHearted = this.heart.classList.toggle('text-danger');
            console.log(isHearted);
            $('.heart-count').textContent = res.data.hearts.length;
        })
        .catch(console.error);
}

export default ajaxHeart;