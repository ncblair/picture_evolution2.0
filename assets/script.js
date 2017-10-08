const NUM_IMAGES = 5*2; //always even
const IMAGE_WIDTH = 5;
const NUM_ITERATIONS = 1000;
var canvas = document.getElementById("canv");
var context = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

$(".button").click(function() {
    console.log("hello")
    
});

class Image() {
    
    //takes in a list of pixels of length w*h (traverse east then south from topLeft)
    constructor(pixels) {
        this.pixels = pixels;
    }
    
    function getVol(twoDArray) {
        return;
    }
    
    function getJSON() {
        
    }
}

function main() {

    var images = genRandom(NUM_IMAGES, IMAGE_WIDTH);

    for (var i = 0; i < NUM_ITERATIONS; i++) {
        evolve(images);
        drawOnCanvas(images[0]);
    }
}


function genRandom() {
    var pixels = [];
    for (int i = 0; i < w*h; i++) {
        pixels[i] = [Math.random()*255, Math.random()*255, Math.random()*255]
    }
    return new Image(pixels);
}

function evolve(images) {
    images.sort(function(im1, im2) {
        return mlScore(im1) - mlScore(im2);
    });   
    var survivors = images.splice(0,Math.ceil(images.length / 2));
    var mutated = [];
    for (var img of survivors) {
        mutated.push(mutate(img));
    }
    return survivors.concat(mutated);
}

function mutate(images) {
    
}

function drawOnCanvas(image) {
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            context.fillStyle = image[i][j];
            canvas.fillRect(i, j, 1, 1);
            //FILL THIS IN WITH THE RIGHT SHIT
        }
    }
}