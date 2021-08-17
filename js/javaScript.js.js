/* eslint-disable no-unused-vars */
// Global variables

let imageSelectionOne = document.getElementById('imageSelectionOne');
let imageSelectionTwo = document.getElementById('imageSelectionTwo');
let imageSelectionThree = document.getElementById('imageSelectionThree');
let ulEl = document.createElement('ul');
let listOfData = document.getElementById('listOfData');
let button = document.getElementById('myBtn');

let imageArray=['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg'];
let maxClicks = 25;
let totalClicks = 0;
let imageUsed = [1, 2, 3, 4, 5, 6];
let showingList = false;
let imgPush = [];
let imName = [];
let timesShown = [];
let timesSelected = [];

// Local Storage
function saveToLocalStorage() {
  let data = JSON.stringify(imgPush);
  localStorage.setItem('data', data);
}
function readFromLocalStorage() {
  let stringObj = localStorage.getItem('data');
  let normalObj = JSON.parse(stringObj);

  if (normalObj) {
    imgPush = normalObj;
    console.log();
    showResults();
  }
}
readFromLocalStorage();


// Constructor
function ImageList(imgName){
  this.name = imgName.split('.')[0];
  this.filepath = `img/${imgName}`;
  this.timesShown = 0;
  this.timesSelected = 0;
  imgPush.push(this);
  imName.push(this.name);
}

for (let i = 0; i < imageArray.length; i++) {
  new ImageList(imageArray[i]);
//   console.log(imgPush[i]);
}

// to append list to the DOM
function makeList() {
  if (!showingList) {

    listOfData.appendChild(ulEl);
    showingList = true;

    imageSelectionOne.removeEventListener('click', handleImage);
    imageSelectionTwo.removeEventListener('click', handleImage);
    imageSelectionThree.removeEventListener('click', handleImage);
  }
}



// Displays images
function randomImage(socketEl){
  // generate a random number 0-7
  let randomIndex = Math.floor(Math.random() * imageArray.length);
  while (imageUsed.includes(randomIndex)){
    randomIndex = Math.floor(Math.random() * imageArray.length);
  }
  // assign src
  socketEl.src = imgPush[randomIndex].filepath;
  // assign title
  socketEl.title = imgPush[randomIndex].name;
  // assign the alt
  socketEl.alt = imgPush[randomIndex].name;
  // increment times shown
  imgPush[randomIndex].timesShown++;
  // Replaces items in used image array
  imageUsed.shift();
  imageUsed.push(randomIndex);

}


// Event handler
function handleImage(event){
  console.log(event.target.alt);
  totalClicks++;

  for (let i=0; i < imgPush.length; i++) {
    if(event.target.alt === imgPush[i].name) {
      imgPush[i].timesSelected = imgPush[i].timesSelected + 1;
    }
  }

  if (totalClicks < maxClicks) {
    randomImage(imageSelectionOne);
    randomImage(imageSelectionTwo);
    randomImage(imageSelectionThree);
  } else {
    makeList();
    // button.style.display = 'block';
  }
}


// Event listener
imageSelectionOne.addEventListener('click', handleImage);
imageSelectionTwo.addEventListener('click', handleImage);
imageSelectionThree.addEventListener('click', handleImage);


// Function Calls
randomImage(imageSelectionOne);
randomImage(imageSelectionTwo);
randomImage(imageSelectionThree);


button.addEventListener('click', showResults);

function showResults(event){
  // event.preventDefault();
  renderList();
}

function renderList() {
  ulEl.textContent = '';
  for (let i=0; i<imageArray.length; i++){
    let liEl = document.createElement('li');
    liEl.textContent = imgPush[i].name + ' was clicked ' + imgPush[i].timesSelected + ' times' + ' times Shown ' + imgPush[i].timesShown;

    timesSelected.push(imgPush[i].timesSelected);
    timesShown.push(imgPush[i].timesShown);
    ulEl.appendChild(liEl);
  }
  // button.style.display = 'none';
  saveToLocalStorage();
}

// button.style.display = 'none';


function chartRender() {
  let ctx = document.getElementById('myChart').getContext('2d');
  // eslint-disable-next-line no-undef
  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: imName,
      datasets: [{
        label: '# of times Selected',
        data: timesSelected,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }, {
        label: '# of times Shown',
        data: timesShown,
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
chartRender();
