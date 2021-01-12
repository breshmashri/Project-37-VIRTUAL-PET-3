//Creating the variables
var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload(){
  //Loading the images
  sadDog = loadImage("virtual pet images/Dog.png");
  happyDog = loadImage("virtual pet images/happy dog.png");
  garden = loadImage("virtual pet images/Garden.png");
  washroom = loadImage("virtual pet images/Wash Room.png");
  bedroom = loadImage("virtual pet images/Bed Room.png");
}

function setup() {
  database = firebase.database();
  createCanvas(400,500);
  
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  //Read game state from database
  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });
   
  dog = createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale = 0.15;
  
  feed = createButton("Feed the dog");
  feed.position(500, 100);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(600, 100);
  addFood.mousePressed(addFoods);
}

function draw() {
  currentTime = hour();
  console.log(lastFed);
  if(lastFed === undefined){
    feed.hide();
    addFood.hide();
  }
  if(lastFed != undefined){
    if(currentTime == (lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime == (lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime <= (lastFed+4)){
    update("Bathing");
    foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState != "Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
  drawSprites();
  fill("black");
  textSize(15);
  if(lastFed >= 12){
      text("Last Fed : "+ lastFed%12 + " PM", 50, 30);
        }else if(lastFed == 0){
            text("Last Fed : 12 AM",50,30);
        }else{
            text("Last Fed : "+ lastFed + " AM", 50, 30);
        }
  }
  
}

//Function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

//Function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//Function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//Update  the gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
