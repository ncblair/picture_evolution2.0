const NUM_IMAGES = 30*2; //always even
const IMAGE_WIDTH = 10;
var canvas = document.getElementById("canv");
var button = document.getElementById("generateDefault");
canvas.width = IMAGE_WIDTH;
canvas.height = IMAGE_WIDTH;
var cWidth = canvas.width;
var cHeight = canvas.height;

$(document).ready(function() {
    var c = new Canvas($("#canv"), cWidth, cHeight);
    var images = [];
    
    for (var i = 0; i < NUM_IMAGES; i++) {
        images.push(genRandom(c));
    }
    c.render();
    button.addEventListener("click", function(event) {
        console.log("Generating New Image");
        setInterval(function() {
            return update(images, c);
        }, 50);
    });
});

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

//random image
function genRandom(canvas) {
    var pixels = [];
    for (var i = 0; i < canvas.w*canvas.h; i++) {
        pixels[i] = [randomRGB(), randomRGB(), randomRGB()];
    }
    return new Image(pixels);
}

class Canvas {
    constructor(canvas, width, height) {

        this.canvas = canvas;
        
        this.w = width;
        this.h = height;
        
        this.context = canvas[0].getContext("2d");
        this.context.imageSmoothingEnabled = true;
        //this.fitToWindow();
        this.image = genRandom(this);
    }
    
    fillPixel(colr, x, y) {
        this.context.fillStyle = colr;
        this.context.fillRect(x, y, 1, 1);
    }
    
    render() {
        requestAnimationFrame(this.render.bind(this));
        var pixels = this.image.pixels;
        for (var i = 0; i < this.w; i++) {
            for (var j = 0; j < this.h; j++) {
                var index = j*this.w + i;
                var p = pixels[index];
                this.fillPixel("rgb(" + p[0].toString() + ", " + p[1].toString() + ", " + p[2].toString() + ")", i, j)
            }
        }
    }
    
    changeImage(image) {
        this.image = image;
    }

    
    fitToWindow() {
        //make sure canvas fits in screen
        if ($(window).height() < $(window).width()) {
            this.canvas.height("500px");
            this.canvas.width("auto");                    
        }
        else {
            this.canvas.height("auto");
            this.canvas.width("500px");
        }
    }
    
    clear() {
        this.context.clearRect(0, 0, this.w, this.h);
    }
}



function update(images, canvas) {
    
    var imgs = evolve(images).slice();
    console.log(imgs.length);
    canvas.changeImage(imgs[0]);
    canvas.fitToWindow();
    
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
    var retVal = survivors.concat(mutated);
    for (var i = 0; i < retVal.length; i++) {
        images[i] = retVal[i];
    }
    return retVal;
}

//nondestructive
function mutate(image) {
    var newImagePixels = [];
    var oldPixels = image.pixels;
    
    for (var pix of oldPixels) {
        if (Math.random() > .95) {
            /*var a = Math.floor((pix[0] + randomRGB())/2);
            var b = Math.floor((pix[1] + randomRGB())/2);
            var c = Math.floor((pix[2] + randomRGB())/2);*/
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



function mlScore(image, canvas) {
    var total = 0;
    for (var pixel of image.pixels) {
        total += pixel[0];
        total += pixel[1];
        total += pixel[2];
    }
    return total;
}
    
function randomRGB() {
    return Math.floor(Math.random()*255);
}