const NUM_IMAGES = 500*2; //always even
const IMAGE_WIDTH = 24;

const invisibleCanvas = document.getElementById("invCanv");
const invWidth = invisibleCanvas.width;
const invHeight = invisibleCanvas.height;
//global var

var generation = 0;
$("#generationNumber").text(0);
var typeOfChild = 0;
var typeOfChildren = ["Best", "Worst"]
$("#typeOfChild").text(typeOfChildren[0]);

var canvas = document.getElementById("canv");
canvas.width = IMAGE_WIDTH;
canvas.height = IMAGE_WIDTH;
var cWidth = canvas.width;
var cHeight = canvas.height;

$(document).ready(function() {
    var c = new Canvas($("#canv"), cWidth, cHeight, typeOfChild);
    var ic = new Canvas($("#invCanv"), invWidth, invHeight, typeOfChild);
    var images = [];
    var clock = setInterval(function(){
        c.fitToWindow();
    }, 50);
    for (var i = 0; i < NUM_IMAGES; i++) {
        images.push(genRandom(c));
    }
    c.render();
    $("#startGeneration").click(function(event) {
        $("#startGeneration").css("display", "none");
        $("#pauseGeneration").css("display", "inline-block");
        console.log("Generating New Image");
        clearInterval(clock);
        clock = setInterval( function() {
            return c.update(images);
        }, 5);
    });
    $("#pauseGeneration").click(function(event) {
        console.log("Pausing Generation");
        $("#pauseGeneration").css("display", "none");
        $("#resumeGeneration").css("display", "inline-block");
        clearInterval(clock);
        
        
    });
    $("#resumeGeneration").click(function(event) {
        console.log("Pausing Generation");
        $("#resumeGeneration").css("display", "none");
        $("#pauseGeneration").css("display", "inline-block");
        clearInterval(clock);
        clock = setInterval(function() {
            return c.update(images);
        }, 5);
    });
    $("#resetGeneration").click(function(event) {
        $("#resumeGeneration").css("display", "none");
        $("#pauseGeneration").css("display", "none");
        $("#startGeneration").css("display", "inline-block");
        console.log("Resetting Generation");
        
        for (var i = 0; i < images.length; i++) {
            images[i] = genRandom(c);
        }
        c.generation = 0;
        
        //nonsense code just resets the pixels on board. probably wanna change this
        c.changeChild(images);
        c.changeChild(images);
        //end nonsense
        
        
        clearInterval(clock);
    });
    
    
    $("#typeOfChild").click(function(event) {
        setTypeOfChild(c.changeChild(images));
    });
    
});

class Image {
    
    //takes in a list of pixels of length w*h (traverse east then south from topLeft)
    constructor(pixels, canvas) {
        this.pixels = pixels;
        this.canvas = canvas;
        this.score = redSquareScore(this);
    }
    
    getVol() {
        w = []
        for (var c = 0; c < 3; c++) {
            for (var pix of this.pixels) {
                w.push(pix[c])
            }
        }
    }

    
    getPixel(i, j) {
        return this.pixels[j*this.canvas.w + i];
    }
    
    getImg() {
        this.paint();
        return this.canvas.imgData(0, 0, this.canvas.w, this.canvas.h);
    }
    
    paint() {
        for (var i = 0; i < this.canvas.w; i++) {
            for (var j = 0; j < this.canvas.h ; j++) {
                var p = this.getPixel(i, j);
                this.canvas.fillPixel("rgb(" + p[0].toString() + ", " + p[1].toString() + ", " + p[2].toString() + ")", i, j);
            }
        }
    }
}

//random image
function genRandom(canvas) {
    var pixels = [];
    for (var i = 0; i < canvas.w*canvas.h; i++) {
        pixels[i] = [randomRGB(), randomRGB(), randomRGB()];
    }
    return new Image(pixels, canvas);
}

class Canvas {
    constructor(canvas, width, height, typeOfChild) {

        this.canvas = canvas;
        this.generation = generation;
        this.w = width;
        this.h = height;
        
        this.context = canvas[0].getContext("2d");
        this.context.imageSmoothingEnabled = true;
        //this.fitToWindow();
        this.image = genRandom(this);
        this.typeOfChild = typeOfChild;
    }
    
    fillPixel(colr, x, y) {
        this.context.fillStyle = colr;
        this.context.fillRect(x, y, 1, 1);
    }
    
    render() {
        requestAnimationFrame(this.render.bind(this));
        this.image.paint(this.canvas);
        $("#generationNumber").text(this.generation);
    }
    
    imgData(x, y, w, h) {
        return this.context.getImageData(x, y, width, height).data
    }
    
    changeImage(image) {
        this.image = image;
    }

    
    fitToWindow() {
        //make sure canvas fits in screen
        var top = document.getElementById("canv").getBoundingClientRect().top;
        if (($(window).height() - top - 30) < $(window).width()) {
            this.canvas.height($(window).height() - top - 30);
            this.canvas.width("auto");                    
        }
        else {
            this.canvas.height("auto");
            this.canvas.width($(window).width()*.7);    
        }
    }
    
    clear() {
        this.context.clearRect(0, 0, this.w, this.h);
    }
    update(images) {
        var imgs = evolve(images, this).slice();
        this.changeImage(imgs[(imgs.length - 1)*(this.typeOfChild%2)]);
        this.fitToWindow();
        this.generation += 1;
    }
    
    changeChild(images) {
        this.typeOfChild += 1;
        this.changeImage(images[(images.length - 1)*(this.typeOfChild%2)]);
        return this.typeOfChild;
    }
}



    


function evolve(images, canvas) {
    images.sort(function(im1, im2) {
        return im2.score - im1.score;
    });
    var survivors = images.splice(0,Math.ceil(images.length / 2));
    var mutated = [];
    
    
    for (var img of survivors) {
        if (Math.random() > .99) {
            mutated.push(mutate(img, canvas));
        } else {
            //REFERENCE
            mutated.push(img);
        }
    }
    var retVal = survivors.concat(mutated);
    for (var i = 0; i < retVal.length; i++) {
        images[i] = retVal[i];
    }
    return retVal;
}

//nondestructive
function mutate(image, canvas) {
    var newImagePixels = [];
    var oldPixels = image.pixels;
    
    for (var pix of oldPixels) {
        if (Math.random() > .99) {
            var weight = Math.random();
            var a = Math.floor((pix[0]*(weight) + randomRGB()*(1-weight)));
            var b = Math.floor((pix[1]*(weight) + randomRGB()*(1-weight)));
            var c = Math.floor((pix[2]*(weight) + randomRGB()*(1-weight)));
            /*var a = randomRGB();
            var b = randomRGB();
            var c = randomRGB();*/
            newImagePixels.push([a, b, c]);
        }
        else {
            newImagePixels.push([pix[0], pix[1], pix[2]]);
        }
    }
    
    return new Image(newImagePixels, canvas);
}

//nondestructive
function imgcpy(image, canvas) {
    var newImagePixels = [];
    var oldPixels = image.pixels;
    
    for (var pix of oldPixels) {
        newImagePixels.push([pix[0], pix[1], pix[2]]);
    }
    
    return new Image(newImagePixels, canvas);
}


function lightnessscore(image, canvas) {
     var total = 0;
     for (var pixel of image.pixels) {
         total += pixel[0];
         total += pixel[1];
         total += pixel[2];
     }
     return total;
}

function redSquareScore(image, canvas) {
    var total = 0;
    for (var i = 0; i < IMAGE_WIDTH; i++) {
        for (var j = 0; j < IMAGE_WIDTH; j++) {
            var pixel = image.getPixel(i, j);
            if ((i == 0 || i == IMAGE_WIDTH - 1) || (j == 0 || j == IMAGE_WIDTH -1)){
                total += pixel[0] - pixel[1] - pixel[2];
            } else {
                //not on box;
                total += pixel[0] + pixel[1] + pixel[2];
            }
        }
    }
    return total;
}
    
function randomRGB() {
    return Math.floor(Math.random()*255);
}


function setTypeOfChild(typeOfChild) {
    $("#typeOfChild").text(typeOfChildren[typeOfChild%typeOfChildren.length]);
}

