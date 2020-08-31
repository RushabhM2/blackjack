// CODEWORKS CODING ASSIGNMENT
// AUTHOR: RUSHABH MEHTA
// DATE: 17TH JAN 2020
// Application for In-person Software Engineering Course starting April 13th 2020 in London

// REFERENCES (ALL SOURCES ARE CREATIVE COMMONS FOR NON COMMERICAL USE)
// card images from http://acbl.mybigcommerce.com/52-playing-cards/
// backgrond image from https://image.freepik.com/free-vector/casino-background-pattern_23-2147498271.jpg?1

/*---------------------------------------- START OF JAVASCRIPT CODE ------------------------------*/
// SET UP DECK
let suits = ["H","S","D","C"];   
let descriptions = [2,3,4,5,6,7,8,9,10,"J","Q","K","A"];
let values = [2,3,4,5,6,7,8,9,10,10,10,10,11];

// Initialisng global variables that will be used across functions
let userCards = []; // stores the value of each card dealt to the user
let userTotal = []; // totals the sum of card values dealt to the user

let dealerCards = []; // stores the value of each card dealt to the dealer
let dealerTotal = []; // totals the sum of card values dealt to the dealer
let flipCard = ""; // This variable will store the name of the image of the hidden dealer card, it will be used when the hidden card needs to be revealed

let deck = []; // array where the deck of card objects will be stored
let totalGames = 0; // counter tracking total games played
let wins = 0; // counter tracking total wins
let losses = 0; // counter tracking total losses

// DEFINE TEMPLATE FOR THE CARD OBJECT
class Card{
    constructor(suit,description,value){
        this.suit = suit;
        this.description = description;
        this.value = value;
        this.image = "images/"+description+suit+".jpg";
    }
}

// CREATE AN ARRAY OF CARD OBJECTS TO SIMULATE THE DECK
function createDeck(suits,descriptions,values){
  let tempDeck = [];
  suits.forEach(suit=>{
    descriptions.forEach((description,index)=>{
      tempDeck.push(new Card(suit,description,values[index]))
    });
  });
  return tempDeck;
}

// DEAL A CARD, DISPLAY IT ON THE PAGE
function deal(deck, location){
  // location defines where the cards will be dealt, to the dealer or user
  
  // finding a random card and removing it from the deck
  let index = Math.floor((Math.random()*deck.length));
  let newCard = deck[index];
  let newDeck = deck.slice(0,index).concat(deck.slice(index+1,deck.length));

  // selecting HTML elements where dealt cards will show up
  const myList = document.querySelector(location);

  // create HTML elements to be added when new card is dealt
  let newListItem = document.createElement("div");
  let image = document.createElement("img");
  let newValueItem = document.createElement("div");

  // set values of new HTML elements
  image.setAttribute("src",newCard.image);
  newValueItem.textContent = newCard.value;

  // add div to list and add CSS class for correct graphics
  myList.appendChild(newListItem);
  newListItem.classList.add("card");
  // add image to div add CSS class for correct graphics
  newListItem.appendChild(image);
  image.classList.add("card-image");
  // add value div to div add CSS class for correct graphics
  newListItem.appendChild(newValueItem);
  newValueItem.classList.add("card-value");

  return [newCard,newDeck];
}

// GET THE TOTAL OF CARDS IN HAND, BUT ALSO CONTAINS LOGIC FOR THE ACE SWITCH BETWEEN 1 AND 11
function getTotal(cards,location){
  if(cards.reduce((a,b)=>a+b)>21){
    if(cards.includes(11)){
      let newValueItem = document.querySelectorAll(location);
      newValueItem[cards.indexOf(11)].textContent = 1;
      cards[cards.indexOf(11)] = 1;
      return getTotal(cards, location);
    }else{
      return [cards,cards.reduce((a,b)=>a+b)]
    }
  }else{
    return [cards,cards.reduce((a,b)=>a+b)]
  }
}

function startGame(){  
  // HIDING THE DEALER TOTAL
  document.querySelector("#dealer-total").style.display = "none";
  
  // DEALING TO USER
  // first deal 2 cards and display them
  for(i=0;i<2;i++){
    let temp = deal(deck,"#user")
    userCards.push(temp[0].value);
    deck = temp[1];
  }
  // then get total and display it
  [userCards,userTotal] = getTotal(userCards,"#user .card .card-value");
  let userTotalHTML = document.querySelector("#user-total");
  userTotalHTML.textContent = userTotal;

  // DEALING TO DEALER
  // first deal 2 cards and display them
  for(let i=0;i<2;i++){
    let temp = deal(deck,"#dealer")
      dealerCards.push(temp[0].value);
      deck = temp[1];
  }
  // changing the dealer's first card so its flipped backwards and hidden to the user
  let firstCard = document.querySelector(".card-image");
  let firstCardValue = document.querySelector(".card-value")
  flipCard = firstCard.getAttribute("src");
  firstCardValue.textContent = "";
  firstCard.setAttribute("src","images/back.jpg");

  // then get total and display it
  [dealerCards,dealerTotal] = getTotal(dealerCards,"#dealer .card .card-value");
  let dealerTotalHTML = document.querySelector("#dealer-total");
  dealerTotalHTML.textContent = dealerTotal;

  // checking for blackjack in the users cards
  if(userCards.includes(11) && userCards.includes(10)){
    endGame("BlackJack",dealerTotal);
  }
  return [userCards,dealerCards];
}

// DEALING OF CARDS IF THE PLAYER DECIDES TO HIT
function hit(){
    // Deal cards per hit
    let temp = deal(deck,"#user")
    userCards.push(temp[0].value);
    deck = temp[1];

    // get total of user cards in hand
    [userCards,userTotal] = getTotal(userCards,"#user .card .card-value");
    let userTotalHTML = document.querySelector("#user-total");
    userTotalHTML.textContent = userTotal;

    // stopping the game if user goes bust
    if(userTotal>21){
      if(userCards)
      newGame.style.display = "block";
      endGame(userTotal,dealerTotal);
    }
  }

  // CONTAINS LOGIC THAT IS REQUIRED AFTER THE PLAYER "STANDS", "BUSTS" OR GETS A "BLACK JACK"
  function endGame(uTotal,dTotal){
    // show the "new game" button, and hide the "hit" and "stand" buttons
    let newGame = document.querySelector("#new-game");
    newGame.style.display = "block";
    hitButton.style.display = "none";
    standButton.style.display = "none";
    document.querySelector("#dealer-total").style.display = "block";
    document.querySelector(".card-value").textContent = dealerCards[0];
    document.querySelector(".card-value").style.display = "block"
  
    // flip the hidden card in the dealer's hand
    let firstCard = document.querySelector(".card-image");
    firstCard.setAttribute("src",flipCard);
    
    // Give game results to player in scenarios where further cards do not need to be dealt to the dealer
    let feedback = document.querySelector("#feedback");
    if(uTotal === "BlackJack" && dTotal === 21){
      feedback.textContent = "You have a BLACK JACK!!... but so does the dealer... PUSH!!";
      return 0;
    }else if(dTotal === 21){
      losses++;
      feedback.textContent = "dealer got a BLACK JACK!! you LOSE!!";
      return 0;
    }else if((uTotal === "BlackJack")){
      wins++;
      feedback.textContent = "you got a BLACK JACK!! you WIN!!"
      return 0;
    }else if(uTotal>21){
      losses++;
      feedback.textContent = "oof, you BUST";
      return 0;
    }
    
    // dealing further cards to the dealer if the game ending scenarios above don't occur
    while(dTotal<17){
      let temp = deal(deck,"#dealer");
      dealerCards.push(temp[0].value);
      deck = temp[1];
  
      [dealerCards,dealerTotal] = getTotal(dealerCards,"#dealer .card .card-value");
      dTotal = dealerTotal;
      let dealerTotalHTML = document.querySelector("#dealer-total");
      dealerTotalHTML.textContent = dealerTotal;
    }
  
    // Give game results to player in remaining scenarios
    if(dTotal>21){
      wins++;
      feedback.textContent = "dealer BUST... you WIN!!";
      return 0;
    }else if(uTotal>dTotal){
      wins++;
      feedback.textContent = "You WIN!!";
      return 0;
    }else if(uTotal === dTotal){
      feedback.textContent = "PUSH";
      return 0;
    }else if(uTotal<dTotal){
      losses++;
      feedback.textContent = "You LOSE";
      return 0;
    }
  }

// REMAINING GAME LOGIC
let newGame = document.querySelector("#new-game");
let hitButton = document.querySelector("#hit");
let standButton = document.querySelector("#stand");

// THE ACTIONS REQUIRED ON EACH NEW GAME
newGame.addEventListener("click",function(){
  // Hiding the "new game" button and displaying the "hit" and "stand" buttons
  newGame.style.display = "none";
  hitButton.style.display = "block";
  standButton.style.display = "block";
  
  // selecting and filling in the game counters with update from this new game
  document.querySelector("#games").textContent = totalGames;
  document.querySelector("#wins").textContent = wins;
  document.querySelector("#losses").textContent = losses;
  totalGames++;

  // clearing the card containers and feeback box for new game
  document.querySelector("#dealer").innerHTML = '';
  document.querySelector("#user").innerHTML = ''
  feedback.innerHTML = '';

  userCards = []; // stores the value of each card dealt to the user
  userTotal = []; // total of cards dealt to the user
  
  dealerCards = []; // stores the value of each card dealt to the dealer
  dealerTotal = []; // total of the cards dealt to the dealer
  flipCard = ""; // This variable will store the name of the image of the hidden dealer card

  deck = createDeck(suits,descriptions,values); // variable to store remaining cards in deck

  // SETTING UP THE TABLE WITH THE START GAME FUNCTION
  startGame();
   
});

// ACTION WHEN PLAYER CLICKS THE "HIT" BUTTON FOR ANOTHER CARD
hitButton.addEventListener("click",function(){
  hit();
});

// ACTION WHEN PLAYER DECIDES TO STAND ON HIS CURRENT HAND
standButton.addEventListener("click",function (){
  endGame(userTotal,dealerTotal);
});