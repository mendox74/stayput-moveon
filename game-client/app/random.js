const bee = require('../assets/icons/bee.svg');
const chick = require('../assets/icons/chick.svg');
const cock = require('../assets/icons/cock.svg');
const dog = require('../assets/icons/dog.svg');
const elephant = require('../assets/icons/elephant.svg');
const horse = require('../assets/icons/horse.svg');
const lion = require('../assets/icons/lion.svg');
const monkey = require('../assets/icons/monkey.svg');
const ounce = require('../assets/icons/ounce.svg');
const rat = require('../assets/icons/rat.svg');
const wolf = require('../assets/icons/wolf.svg');
const zebra = require('../assets/icons/zebra.svg');

const Animals = [bee, chick, cock, dog, elephant, horse, lion, monkey, ounce, rat, wolf, zebra];
exports.RandomAnimal = () => {
    return Animals[Math.floor(Math.random() * Animals.length)];
} 