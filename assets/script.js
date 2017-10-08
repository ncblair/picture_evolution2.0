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



function main() {

    var images = genRandom(NUM_IMAGES, IMAGE_WIDTH);

    for (var i = 0; i < NUM_ITERATIONS; i++) {
        evolve(images);
        drawOnCanvas(images[0]);
    }
}

function genRandom() {
    
}


drawOnCanvas(image) {
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            context.fillStyle = image[i][j];
            canvas.fillRect(i, j, 1, 1);
            //FILL THIS IN WITH THE RIGHT SHIT
        }
    }
}