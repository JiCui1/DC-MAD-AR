//All the soding for basic functionality of the page 


//View the image that is uploaded
fileUpload.onchange = evt => {
    const [file] = fileUpload.files
    if (file) {
        imageUpload.src = URL.createObjectURL(file)
    }
}
        
/* -------------- SELECT ONE IMAGE AND DISPLAY THAT IMAGE ---------------*/
let imagePreview = document.getElementById("imagePreview")
        
function viewA(){
    console.log("Image 01")
    imagePreview.innerHTML="<img src='images/a.png' />";
}
        
function viewB(){
    console.log("Image 01")
    imagePreview.innerHTML="<img src='images/b.png' />";
}
        
function viewC(){
    console.log("Image 01")
    imagePreview.innerHTML="<img src='images/c.png' />";
}
        
function viewD(){
    console.log("Image 01")
    imagePreview.innerHTML="<img src='images/d.png' />";
}
        
function viewE(){
    console.log("Image 01")
    imagePreview.innerHTML="<img src='images/e.png' />";
}


/**------------------ ADD MARKERS TO DRAG AND DROP-------------------- */
let markerOne = document.getElementById('markerOne');
let markerTwo = document.getElementById('markerTwo');

function addMarker(){
    console.log('Add Marker')
    if(imagePreview.innerHTML  != null ){
        console.log("Not empty");
        if (markerOne == null){
            imagePreview.innerHTML = markerOne.innerHTML
        }
        else{
            imagePreview.innerHTML = markerTwo.innerHTML
        }
        event.preventDefault();
    }
}
        
        
/* ----------------  DRAG AND DROP ---------------*/
        
function allowDrop(ev) {
    ev.preventDefault();
}
        
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
        
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}
        
        
/*---------------------TOGGLE ----------------------*/
        
//Toggle for Scale 
$(".toggleScale").click(function(){
    $('.slideScale').toggle('slow')
});
        
//Toggle for Position 
$(".togglePosition").click(function(){
    $('.slidePosition').toggle('slow')
});
        
        
//Toggle for Rotation 
$(".toggleRotation").click(function(){
    $('.slideRotation').toggle('slow')
});
        
//----------------  SCALING SLIDERS -----------------------//
        
function updateScaleX(val) {
    document.getElementById('xScaleInput').value=val; 
}
        
function updateScaleY(val) {
    document.getElementById('yScaleInput').value=val; 
}
        
function updateScaleZ(val) {
    document.getElementById('zScaleInput').value=val; 
}
        
//----------------  POSITION SLIDERS -----------------------//
        
        
function updatePositionX(val) {
    document.getElementById('xPositionInput').value=val; 
}
        
function updatePositionY(val) {
    document.getElementById('yPositionInput').value=val; 
}
        
function updatePositionZ(val) {
    document.getElementById('zPositionInput').value=val; 
}
        
        
//----------------  ROTATION SLIDERS -----------------------//
        
function updateRotationX(val) {
    document.getElementById('xRotationInput').value=val; 
}
        
function updateRotationY(val) {
    document.getElementById('yRotationInput').value=val; 
}
        
function updateRotationZ(val) {
    document.getElementById('zRotationInput').value=val; 
}
        
        