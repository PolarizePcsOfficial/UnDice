document.addEventListener("DOMContentLoaded", function() {
 document.getElementById("rollDiceBtn").addEventListener("click", rollDice);
 document.getElementById("shopBtn").addEventListener("click", openShop);
 document.querySelector(".close").addEventListener("click", closeShop);
 document.getElementById("buy2xBtn").addEventListener("click", buy2xUpgrade);
 document.getElementById("buy2xLuckBtn").addEventListener("click", buy2xLuckUpgrade);


 let rollCount = localStorage.getItem("rollCount") ? parseInt(localStorage.getItem("rollCount")) : 0;
 let diceCoins = localStorage.getItem("diceCoins") ? parseInt(localStorage.getItem("diceCoins")) : 0;
 let is2xEnabled = localStorage.getItem("is2xEnabled") === "true";
 let is2xLuckEnabled = localStorage.getItem("is2xLuckEnabled") === "true";


 updateRollCount();
 updateDiceCoins();
 updateShopButton();


 loadLeaderboard();
 setInterval(loadLeaderboard, 60000); //LEADERBOARD REFRESHER BABY!!!!!!!


 //Also I'm too lazy to add code comments so yeah


 function rollDice() {
   const diceElements = [document.getElementById("dice1"), document.getElementById("dice2")];


   diceElements.forEach(dice => {
     dice.style.animation = "none";
     void dice.offsetHeight;
     dice.style.animation = "roll 0.6s";
   });


   setTimeout(() => {
     const dice1 = roll();
     const dice2 = roll();
     const totalRoll = dice1 + dice2;


     diceElements[0].textContent = getDiceFace(dice1);
     diceElements[1].textContent = getDiceFace(dice2);
     document.getElementById("result").textContent = `You rolled a ${dice1} and a ${dice2}. Total: ${totalRoll}`;


     rollCount += is2xEnabled ? 2 : 1;
     diceCoins += totalRoll;


     localStorage.setItem("rollCount", rollCount);
     localStorage.setItem("diceCoins", diceCoins);


     showCoinPopup(totalRoll);
     updateRollCount();
     updateDiceCoins();
   }, 600);
 }


 function roll() {
   const weights = is2xLuckEnabled ? [0.5, 1, 1.5, 2, 2.5, 3.5] : [1, 1, 1, 1, 1, 1];
   const sumOfWeights = weights.reduce((a, b) => a + b, 0);
   let random = Math.random() * sumOfWeights;


   for (let i = 0; i < weights.length; i++) {
     random -= weights[i];
     if (random < 0) {
       return i + 1;
     }
   }
   return 6;
 }


 function getDiceFace(number) {
   const diceFaces = ["🎲", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
   return diceFaces[number];
 }


 function updateRollCount() {
   document.getElementById("rollCount").textContent = `Total Rolls: ${rollCount}`;
 }


 function updateDiceCoins() {
   document.getElementById("diceCoins").textContent = `Dice Coins: ${diceCoins}`;
 }


 function openShop() {
   document.getElementById("shopModal").style.display = "block";
 }


 function closeShop() {
   document.getElementById("shopModal").style.display = "none";
 }


 function buy2xUpgrade() {
   const message = document.getElementById("purchaseMessage");
  
   // First upgrade: costs 1000 rolls
   if (rollCount >= 1000 && !is2xEnabled) {
     rollCount -= 1000;
     localStorage.setItem("rollCount", rollCount);
     is2xEnabled = true;
     localStorage.setItem("is2xEnabled", true);
     message.textContent = "Purchase Successful";
     message.style.color = "green";
   }
   else if (rollCount >= 3000 && !is2xEnabled) {
     rollCount -= 3000;
     localStorage.setItem("rollCount", rollCount);
     is2xEnabled = true;
     localStorage.setItem("is2xEnabled", true);
     message.textContent = "Purchase Successful";
     message.style.color = "green";
   }
   else if (is2xEnabled) {
     message.textContent = "Owned";
     message.style.color = "orange";
   } else {
     message.textContent = "Not Enough Rolls";
     message.style.color = "red";
   }
   message.style.display = "block";
   setTimeout(() => {
     message.style.display = "none";
   }, 1500);
   updateRollCount();
 }


 function buy2xLuckUpgrade() {
   const message = document.getElementById("luckPurchaseMessage");
   if (rollCount >= 50 && !is2xLuckEnabled) {
     rollCount -= 50;
     localStorage.setItem("rollCount", rollCount);
     is2xLuckEnabled = true;
     localStorage.setItem("is2xLuckEnabled", true);
     message.textContent = "Purchase Successful";
     message.style.color = "green";
   } else if (is2xLuckEnabled) {
     message.textContent = "Owned";
     message.style.color = "orange";
   } else {
     message.textContent = "Not Enough Rolls";
     message.style.color = "red";
   }
   message.style.display = "block";
   setTimeout(() => {
     message.style.display = "none";
   }, 1500);
   updateRollCount();
 }


 function updateShopButton() {
   const buy2xBtn = document.getElementById("buy2xBtn");
   const buy2xLuckBtn = document.getElementById("buy2xLuckBtn");


   if (rollCount >= 1000 && !is2xEnabled) {
     buy2xBtn.classList.add("green");
     buy2xBtn.classList.remove("red");
     buy2xBtn.textContent = "Buy 2x Rolls (1000 Rolls)";
   } else if (is2xEnabled) {
     buy2xBtn.classList.add("gray");
     buy2xBtn.classList.remove("green");
     buy2xBtn.textContent = "Owned";
   } else {
     buy2xBtn.classList.add("red");
     buy2xBtn.classList.remove("green");
   }


   if (rollCount >= 50 && !is2xLuckEnabled) {
     buy2xLuckBtn.classList.add("green");
     buy2xLuckBtn.classList.remove("red");
     buy2xLuckBtn.textContent = "Buy 2x Luck (50 Rolls)";
   } else if (is2xLuckEnabled) {
     buy2xLuckBtn.classList.add("gray");
     buy2xLuckBtn.classList.remove("green");
     buy2xLuckBtn.textContent = "Owned";
   } else {
     buy2xLuckBtn.classList.add("red");
     buy2xLuckBtn.classList.remove("green");
   }
 }


 function showCoinPopup(amount) {
   const popup = document.createElement("div");
   popup.textContent = `+${amount}`;
   popup.style.position = "absolute";
   popup.style.fontSize = "2rem";
   popup.style.color = "#FFD700";
   popup.style.top = `${window.innerHeight / 2}px`;
   popup.style.left = `${window.innerWidth / 2}px`;
   popup.style.transition = "all 1.5s ease-out";
   document.body.appendChild(popup);


   setTimeout(() => {
     popup.style.transform = `translate(-${window.innerWidth / 2}px, -${window.innerHeight / 2}px)`;
     popup.style.opacity = "0";
   }, 50);


   setTimeout(() => {
     document.body.removeChild(popup);
   }, 1600);
 }


 function loadLeaderboard() {
   const leaderboardList = document.getElementById("leaderboardList");
   leaderboardList.innerHTML = '';


   for (let i = 1; i <= 100; i++) {
     const playerName = `Player${i}`;
     const diceCoins = Math.floor(Math.random() * 10000);


     const listItem = document.createElement("li");
     listItem.innerHTML = `${playerName} <span>${diceCoins} Dice Coins</span>`;
     leaderboardList.appendChild(listItem);
   }
 }
});


//Also I know the project isn't really all about programming but I took this as an excuss to make something half-cool
