// Need webpack to use this
// $ is querySelector from bling.js
// $$ is querySelectorAll from bling.js
// ...on... is basically addEventListener from bling.js

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import ajaxHeart from './modules/heart'

// Google maps does latitude and then longitude which is opposite of mongo db
autocomplete( $('#address'), $('#lat'), $('#lng') );

typeAhead( $('.search') );

makeMap( $('#map') );

const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);