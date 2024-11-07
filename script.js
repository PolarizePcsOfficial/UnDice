document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("rollDiceBtn").addEventListener("click", rollDice);
  document.getElementById("shopBtn").addEventListener("click", openShop);
  document.querySelector(".close").addEventListener("click", closeShop);
  document.getElementById("buy2xBtn").addEventListener("click", buy2xUpgrade);
  document
    .getElementById("buy2xLuckBtn")
    .addEventListener("click", buy2xLuckUpgrade);

  let rollCount = localStorage.getItem("rollCount")
    ? parseInt(localStorage.getItem("rollCount"))
    : 0;
  let diceCoins = localStorage.getItem("diceCoins")
    ? parseInt(localStorage.getItem("diceCoins"))
    : 0;
  let is2xEnabled = localStorage.getItem("is2xEnabled") === "true";
  let is2xLuckEnabled = localStorage.getItem("is2xLuckEnabled") === "true";

  updateRollCount();
  updateDiceCoins();

  function rollDice() {
    const diceElements = [
      document.getElementById("dice1"),
      document.getElementById("dice2"),
    ];
    diceElements.forEach((dice) => {
      dice.style.animation = "none";
      void dice.offsetHeight;
      dice.style.animation = "roll 0.6s";
    });

    setTimeout(() => {
      const dice1 = roll();
      const dice2 = roll();
      const totalRoll = dice1 + dice2;
      let specialCrystalRolled = false;

      specialCrystalRolled = triggerSpecialRoll();

      if (!specialCrystalRolled) {
        diceElements[0].textContent = getDiceFace(dice1);
        diceElements[1].textContent = getDiceFace(dice2);
        document.getElementById("result").textContent =
          `You rolled a ${dice1} and a ${dice2}. Total: ${totalRoll}`;
      }

      rollCount += is2xEnabled ? 2 : 1;
      diceCoins += totalRoll;

      localStorage.setItem("rollCount", rollCount);
      localStorage.setItem("diceCoins", diceCoins);
      showCoinPopup(totalRoll);
      updateRollCount();
      updateDiceCoins();
    }, 600);
  }

  function triggerSpecialRoll() {
    const rollProbability = Math.random();
    let crystalRolled = false;

    if (rollProbability < 1 / 75) {
      showCrystalOverlay(
        "uLight",
        50,
        "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
        "1/75 chance",
      );
      document.getElementById("result").textContent =
        `You rolled a uLight crystal!`;
      crystalRolled = true;
    } else if (rollProbability < 1 / 99) {
      showCrystalOverlay(
        "Syrus",
        75,
        "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
        "1/99 chance",
      );
      document.getElementById("result").textContent =
        `You rolled a Syrus crystal!`;
      crystalRolled = true;
    } else if (rollProbability < 1 / 222) {
      showCrystalOverlay(
        "Apica",
        100,
        "linear-gradient(135deg, #ffecd2, #fcb69f)",
        "1/222 chance",
      );
      document.getElementById("result").textContent =
        `You rolled an Apica crystal!`;
      crystalRolled = true;
    } else if (rollProbability < 1 / 153) {
      showCrystalOverlay(
        "Leca",
        125,
        "linear-gradient(135deg, #d4fc79, #96e6a1)",
        "1/153 chance",
      );
      document.getElementById("result").textContent =
        `You rolled a Leca crystal!`;
      crystalRolled = true;
    } else if (rollProbability < 1 / 423) {
      showCrystalOverlay(
        "Pupius",
        150,
        "linear-gradient(135deg, #84fab0, #8fd3f4)",
        "1/423 chance",
      );
      document.getElementById("result").textContent =
        `You rolled a Pupius crystal!`;
      crystalRolled = true;
    } else if (rollProbability < 1 / 742) {
      showCrystalOverlay(
        "Glock",
        200,
        "linear-gradient(135deg, #ff9a9e, #fecfef)",
        "1/742 chance",
      );
      document.getElementById("result").textContent =
        `You rolled a Glock crystal!`;
      crystalRolled = true;
    }

    return crystalRolled;
  }

  function showCrystalOverlay(crystalName, coinReward, gradient, rarity) {
    const overlay = document.getElementById("specialRollOverlay");
    overlay.style.display = "flex";
    overlay.style.background = gradient;

    document.getElementById("cys1").textContent =
      `Crystal Obtained: ${crystalName}`;
    document.querySelector(".rarity").textContent = `(${rarity})`;
    document.querySelector(".reward").textContent = `+${coinReward} Dice Coins`;

    diceCoins += coinReward;
    updateDiceCoins();

    setTimeout(() => {
      overlay.style.animation = "fadeOut 2s ease-in-out";
      setTimeout(() => {
        overlay.style.display = "none";
        overlay.style.animation = "none";
      }, 2000);
    }, 5000);
  }

  function roll() {
    const weights = is2xLuckEnabled
      ? [0.5, 1, 1.5, 2, 2.5, 3.5]
      : [1, 1, 1, 1, 1, 1];
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
    document.getElementById("rollCount").textContent =
      `Total Rolls: ${rollCount}`;
  }

  function updateDiceCoins() {
    document.getElementById("diceCoins").textContent =
      `Dice Coins: ${diceCoins}`;
  }

  function openShop() {
    document.getElementById("shopModal").style.display = "block";
    updateShopUI(); 
  }

  function closeShop() {
    document.getElementById("shopModal").style.display = "none";
  }

  function updateShopUI() {
    const buy2xBtn = document.getElementById("buy2xBtn");
    const buy2xLuckBtn = document.getElementById("buy2xLuckBtn");

    if (is2xEnabled) {
      buy2xBtn.textContent = "Owned";
      buy2xBtn.disabled = true;
    } else {
      buy2xBtn.textContent = "Buy";
      buy2xBtn.disabled = false;
    }

    if (is2xLuckEnabled) {
      buy2xLuckBtn.textContent = "Owned";
      buy2xLuckBtn.disabled = true;
    } else {
      buy2xLuckBtn.textContent = "Buy";
      buy2xLuckBtn.disabled = false;
    }
  }

  function buy2xUpgrade() {
    const message = document.getElementById("purchaseMessage");
    if (rollCount >= 1000 && !is2xEnabled) {
      rollCount -= 1000;
      localStorage.setItem("rollCount", rollCount);
      is2xEnabled = true;
      localStorage.setItem("is2xEnabled", true);
      message.textContent = "Purchase Successful";
      message.style.color = "green";
    } else if (is2xEnabled) {
      message.textContent = "Owned";
      message.style.color = "orange";
    } else {
      message.textContent = "Not Enough Rolls";
      message.style.color = "red";
    }
    message.style.display = "block";
    setTimeout(() => (message.style.display = "none"), 1500);
    updateRollCount();
    updateShopUI(); 
  }

  function buy2xLuckUpgrade() {
    const message = document.getElementById("luckPurchaseMessage");
    if (rollCount >= 3000 && !is2xLuckEnabled) {
      rollCount -= 3000;
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
    setTimeout(() => (message.style.display = "none"), 1500);
    updateRollCount();
    updateShopUI(); 
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
      popup.style.transform = `translateY(-150px)`;
      popup.style.opacity = "0";
    }, 100);

    setTimeout(() => document.body.removeChild(popup), 1500);
  }
});
