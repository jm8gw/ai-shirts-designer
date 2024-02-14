import { proxy } from 'valtio';

const state = proxy({ // Think of this like react context. Anthing within here can be utilized throughout the entire app.
    intro: true, // are we currently in the intro screen
    color: '#EFBD48', // this can be any color lol
    isLogoTexture: true, // are we currently displaying the logo on our shirt
    isFullTexture: false,
    logoDecal: './threejs.png', // the intial logo before we change or upload anything
    fullDecal: './threejs.png',
});
// think of these like empty default values upon intial load

export default state;