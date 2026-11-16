document.addEventListener('DOMContentLoaded', () => {
  
  const screens = {
    welcome: document.getElementById('welcome-screen'),
    amount: document.getElementById('amount-screen'),
    obligations: document.getElementById('obligations-screen'),
    horizon: document.getElementById('horizon-screen'),
    result: document.getElementById('result-screen'),
    bank: document.getElementById('bank-screen') 
  };

  const startBtn = document.getElementById('start-btn');
  const nextBtn1 = document.getElementById('next-btn-1');
  const nextBtn2 = document.getElementById('next-btn-2');
  const nextBtn3 = document.getElementById('next-btn-3');
  const skipBtn = document.getElementById('skip-btn');
  
 
  let currentAmount = 5000; 
  let selectedObligationLimit = 0; 
  let selectedDays = 7;
  let selectedDaysLabel = "тиждень";

  function goToScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');
    toScreen.classList.add('active');
  }

  
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startBtn.style.transform = 'scale(0.96)';
      setTimeout(() => { startBtn.style.transform = 'translateY(0)'; }, 150);
      setTimeout(() => goToScreen(screens.welcome, screens.amount), 200);
    });
  }

  
  if (nextBtn1) {
    nextBtn1.addEventListener('click', () => {
      if (currentAmountString === "") currentAmount = 0;
      else currentAmount = parseInt(currentAmountString, 10);
      goToScreen(screens.amount, screens.obligations);
    });
  }


  let currentAmountString = "5000"; 
  const amountDisplay = document.getElementById('amount-display');
  const numKeys = document.querySelectorAll('.num-key:not(.empty):not(.action-key)');
  const deleteKey = document.getElementById('delete-key');

  function updateDisplay() {
    if (currentAmountString === "") amountDisplay.textContent = "0 ₴";
    else amountDisplay.textContent = currentAmountString + " ₴";
  }

  numKeys.forEach(key => {
    key.addEventListener('click', (e) => {
      const number = e.target.textContent;
      if (currentAmountString.length < 7) {
        if (currentAmountString === "0") currentAmountString = number; 
        else currentAmountString += number; 
        updateDisplay();
      }
    });
  });

  if (deleteKey) {
    deleteKey.addEventListener('click', () => {
      currentAmountString = currentAmountString.slice(0, -1);
      updateDisplay();
    });
  }

 
  const obligationCards = document.querySelectorAll('#obligations-screen .option-card');
  obligationCards.forEach(card => {
    card.addEventListener('click', () => {
      obligationCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      nextBtn2.removeAttribute('disabled');
      selectedObligationLimit = parseInt(card.getAttribute('data-value'), 10);
    });
  });

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      selectedObligationLimit = 0;
      goToScreen(screens.obligations, screens.horizon);
    });
  }

 
  const overdraftSheet = document.getElementById('overdraft-sheet');
  if (nextBtn2) {
    nextBtn2.addEventListener('click', () => {
      if (selectedObligationLimit > currentAmount) overdraftSheet.classList.add('active');
      else goToScreen(screens.obligations, screens.horizon);
    });
  }

  document.getElementById('sheet-change-btn')?.addEventListener('click', () => {
    overdraftSheet.classList.remove('active');
    goToScreen(screens.obligations, screens.amount);
  });
  document.getElementById('sheet-ignore-btn')?.addEventListener('click', () => {
    overdraftSheet.classList.remove('active');
    goToScreen(screens.obligations, screens.horizon);
  });

  
  const horizonCards = document.querySelectorAll('.horizon-option');
  horizonCards.forEach(card => {
    card.addEventListener('click', () => {
      horizonCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      nextBtn3.removeAttribute('disabled');
      selectedDays = parseInt(card.getAttribute('data-days'), 10);
      selectedDaysLabel = card.getAttribute('data-label') || `${selectedDays} дні(в)`;
    });
  });

  
  const finalAmountEl = document.getElementById('final-amount');
  const finalFormulaLabel = document.getElementById('final-formula-label');
  const dotsContainer = document.getElementById('days-dots');
  const daysText = document.getElementById('days-text');
  const bankSheet = document.getElementById('bank-sheet');

  if (nextBtn3) {
    nextBtn3.addEventListener('click', () => {
      let rawDailyAmount = (currentAmount - selectedObligationLimit) / selectedDays;
      if (rawDailyAmount < 0) rawDailyAmount = 0;
      const safeSpend = rawDailyAmount - (rawDailyAmount * 0.20);
      
      finalAmountEl.textContent = `${Math.floor(safeSpend)} ₴`;
      finalFormulaLabel.innerHTML = `Поточний залишок мінус<br>обов'язкове, розтягнуто на ${selectedDaysLabel}`;
      
      dotsContainer.innerHTML = '';
      for (let i = 0; i < selectedDays; i++) {
        const dot = document.createElement('div');
        dot.className = i === 0 ? 'day-dot active' : 'day-dot';
        dotsContainer.appendChild(dot);
      }
      daysText.textContent = `День 1 з ${selectedDays}`;

      goToScreen(screens.horizon, screens.result);
      
      setTimeout(() => { bankSheet.classList.add('active'); }, 3500);
    });
  }

 
  document.getElementById('decline-bank-btn')?.addEventListener('click', () => {
    bankSheet.classList.remove('active');
  });

  document.getElementById('connect-bank-btn')?.addEventListener('click', () => {
    bankSheet.classList.remove('active');
    // Ось тут скрипт точно знатиме, що screens.bank існує!
    goToScreen(screens.result, screens.bank);
  });

  document.getElementById('back-to-result')?.addEventListener('click', () => {
    goToScreen(screens.bank, screens.result);
  });

  document.getElementById('update-balance-btn')?.addEventListener('click', () => {
    goToScreen(screens.result, screens.amount);
  });
});
