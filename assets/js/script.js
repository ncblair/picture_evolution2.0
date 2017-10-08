const NUM_IMAGES = 6*2; //always even
const IMAGE_WIDTH = 5;
const NUM_ITERATIONS = 100000;
var canvas = document.getElementById("canv");
var context = canvas.getContext("2d");
canvas.width = IMAGE_WIDTH;
canvas.height = IMAGE_WIDTH;
var w = canvas.width;
var h = canvas.height;
var globalImage;

$("#generateDefault").click(function() {
    console.log("Generating New Image");
    globalImage = genRandom();
    render();
    main();
    
});


function render() {
    this.requestAnimationFrame(render);
    var pixels = globalImage.pixels;
    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            var index = j*w + i;
            var p = pixels[index];
            context.fillStyle = "rgb(" + p[0].toString() + ", " + p[1].toString() + ", " + p[2].toString() + ")";
            context.fillRect(i, j, 1, 1);
        }
    }
}

class Image {
    
    //takes in a list of pixels of length w*h (traverse east then south from topLeft)
    constructor(pixels) {
        this.pixels = pixels;
    }
    
    getVol(twoDArray) {
        return;
    }

    
    getPixel(i, j) {
        return this.pixels[j*w + i];
    }
}

function main() {

    var images = [];
    
    for (var i = 0; i < NUM_IMAGES; i++) {
        images.push(genRandom(NUM_IMAGES, IMAGE_WIDTH));
    }
    render(images[0]);
    for (var i = 0; i < NUM_ITERATIONS; i++) {
        images = evolve(images);
        globalImage = images[0]; 
        
    }
    
}

//random image
function genRandom() {
    var pixels = [];
    for (var i = 0; i < w*h; i++) {
        pixels[i] = [randomRGB(), randomRGB(), randomRGB()];
    }
    return new Image(pixels);
}

function evolve(images) {
    images.sort(function(im1, im2) {
        return mlScore(im2) - mlScore(im1);
    });   
    var survivors = images.splice(0,Math.ceil(images.length / 2));
    var mutated = [];
    
    
    for (var img of survivors) {
        mutated.push(mutate(img));
    }
    return survivors.concat(mutated);
}

//nondestructive
function mutate(image) {
    var newImagePixels = [];
    var oldPixels = image.pixels;
    
    for (var pix of oldPixels) {
        if (Math.random() > .95) {
            var a = randomRGB();
            var b = randomRGB();
            var c = randomRGB();
            newImagePixels.push([a, b, c]);
        }
        else {
            newImagePixels.push([pix[0], pix[1], pix[2]]);
        }
    }
    
    return new Image(newImagePixels);
}



function mlScore(image) {
    var total = 0;
    for (var i =0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            total += image.getPixel(i, j)[0];
            total += image.getPixel(i, j)[1];
            total += image.getPixel(i, j)[2];
        }
    }
    return total;
}
    
function randomRGB() {
    return Math.floor(Math.random()*255);
}