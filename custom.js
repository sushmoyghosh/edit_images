

const fileInput = document.querySelector('.file-input');
const filterOptions = document.querySelectorAll('.filter button');//must be  write all to select all button
const filterName = document.querySelector('.filter-info .name'); //button click name changes
const filterValue = document.querySelector('.filter-info .value');//percentage value
const filterSlider = document.querySelector('.slider input'); //input percentage
const rotateOptions = document.querySelectorAll('.rotate button');//rotation
const previewImg = document.querySelector('.preview-img img');//.preview-img class and img tag
const resetFilter = document.querySelector('.reset-filter ');
const chooseImgBtn = document.querySelector('.choose-img ');
const saveImg = document.querySelector('.save-img ');

let inversion =0 ,brightness =100 ,saturation =100 ,grayscale = 0;//let the set value
let rotate =0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => { //to incress nd decress
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}


const loadImage = () =>{
    let file = fileInput.files[0];//getting user selected file
    if(!file) return; //return if user hasnt sellected any file
    previewImg.src = URL.createObjectURL(file); //passing file url as preview img src
    previewImg.addEventListener('load', ()=> {
        resetFilter.click(); //reset the edit img
        document.querySelector(".container").classList.remove("disable");//to remove disable class nd edit
    });
}
filterOptions.forEach(option => {
    option.addEventListener("click",() =>{
        document.querySelector(".filter .active").classList.remove("active");//to activet all button
        option.classList.add("active");
        filterName.innerText = option.innerText;//changining the name by clicking button

        if(option.id ==="brightness"){  //changing the percentage nd remaining same if chnged others 
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id ==="saturation"){
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if(option.id ==="inversion"){
             filterSlider.max ="100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        }else{
             filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;

        }

    });
    
});

filterSlider.addEventListener("input",()=>{  //input percentage
    filterValue.innerText = `${filterSlider.value}%`;

    const selectedFilter = document.querySelector(".filter .active");//selected filter btn
    
    if(selectedFilter.id === "brightness"){
        brightness = filterSlider.value;//slider percentage high low
    }else if(selectedFilter.id === "saturation"){
        saturation = filterSlider.value;
    }else if(selectedFilter.id === "inversion"){
        inversion = filterSlider.value;
    }
    else {
        grayscale = filterSlider.value;
    }
    
    applyFilters();//to incress nd decress call function here
})

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
       if(option.id === "left"){
            rotate -= 90; //click pic rotated 90deg
       }else if(option.id === "right"){
        rotate += 90; //click pic rotated 90deg
   }else if(option.id === "horizontal"){
    //if fliphorizontal value is 1,set this value to -1 or 1
    flipHorizontal = flipHorizontal === 1 ? -1 : 1;
   }else{
    flipVertical = flipVertical === 1 ? -1 : 1;
   }
        applyFilters();
    });
});



fileInput.addEventListener('change', loadImage); //select images 1st stay here
chooseImgBtn.addEventListener('click', () => fileInput.click());// click button to select images

resetFilter.addEventListener("click", () => { //reset button
     inversion =0 ; brightness =100 ; saturation =100 ; grayscale = 0;//let the set value
     rotate =0;  flipHorizontal = 1;  flipVertical = 1;
     filterOptions[0].click();
     applyFilters();
});

saveImg.addEventListener('click', () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d"); //canvas.getContext return a drwing context on the canvas
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate( canvas.width / 2 , canvas.height / 2 ); //tranlate canvas from center
    if(rotate !== 0){ //rotate value isnt 0, rotate the canvas
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal,flipVertical); //flip  canvas horizontal/vertical
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height /2, canvas.width, canvas.height);
    //document.body.appendChild(canvas);//show the edit img

    const link = document.createElement("a");//create <a> tag element
    link.download = "image.jpg"; //passing a tag dwnld value to "image.jpg"
    link.href = canvas.toDataURL(); //passing a tag href value to canvas data url
    link.click(); //clicking a tag so the img dwnld

})