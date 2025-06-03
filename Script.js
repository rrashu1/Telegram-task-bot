document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Telegram WebApp
  const tg = window.Telegram.WebApp;
  tg.expand();
  
  // Set user info
  const user = tg.initDataUnsafe?.user;
  if (user) {
    document.getElementById('user-name').textContent = 
      `${user.first_name} ${user.last_name || ''}`.trim();
    document.getElementById('user-avatar').src = user.photo_url || 'https://via.placeholder.com/40';
    document.getElementById('referral-link').value = 
      `${window.location.origin}?ref=${user.id}`;
  }
  
  // Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      // Update active tab button
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update active tab content
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Copy referral link
  document.getElementById('copy-link').addEventListener('click', () => {
    const linkInput = document.getElementById('referral-link');
    linkInput.select();
    document.execCommand('copy');
    alert('Referral link copied to clipboard!');
  });
  
  // Load tasks
  await loadTasks();
  
  // Load user data
  await loadUserData();
  
  // Withdraw button
  document.getElementById('withdraw-btn').addEventListener('click', () => {
    tg.showPopup({
      title: 'Withdraw Earnings',
      message: 'Enter amount to withdraw:',
      buttons: [
        { id: 'cancel', type: 'cancel' },
        { id: 'withdraw', type: 'default', text: 'Withdraw' }
      ]
    }, (btnId) => {
      if (btnId === 'withdraw') {
        tg.showAlert('Withdrawal request submitted!');
      }
    });
  });
});

async function loadTasks() {
  try {
    // In a real app, you would fetch from your backend
    const mockTasks = [
      {
        id: 1,
        title: "Watch Video",
        description: "Watch this 30-second video to earn points",
        reward: 10,
        completed: false
      },
      {
        id: 2,
        title: "Visit Website",
        description: "Visit our sponsor's website for 30 seconds",
        reward: 5,
        completed: false
      },
      {
        id: 3,
        title: "Download App",
        description: "Download and install our partner app",
        reward: 20,
        completed: false
      },
      {
        id: 4,
        title: "Complete Survey",
        description: "Answer a few questions about your preferences",
        reward: 15,
        completed: false
      }
    ];
    
    const taskList = document.querySelector('.task-list');
    taskList.innerHTML = '';
    
    mockTasks.forEach(task => {
      const taskCard = document.createElement('div');
      taskCard.className = 'task-card';
      taskCard.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p class="reward">Reward: ${task.reward} points</p>
        <button class="btn" data-task-id="${task.id}">
          ${task.completed ? 'Completed' : 'Start Task'}
        </button>
      `;
      taskList.appendChild(taskCard);
      
      // Add click event
      if (!task.completed) {
        const btn = taskCard.querySelector('.btn');
        btn.addEventListener('click', () => startTask(task.id));
      }
    });
    
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

async function startTask(taskId) {
  try {
    // In a real app, you would call your backend API
    console.log(`Starting task ${taskId}`);
    alert(`Task ${taskId} started! Complete it to earn points.`);
    
    // Simulate task completion after 3 seconds
    setTimeout(() => {
      alert(`Task ${taskId} completed! Points added to your account.`);
      loadUserData(); // Refresh user data
      loadTasks(); // Refresh task list
    }, 3000);
    
  } catch (error) {
    console.error('Error starting task:', error);
    alert('Failed to start task. Please try again.');
  }
}

async function loadUserData() {
  try {
    // In a real app, you would fetch from your backend
    const mockData = {
      balance: 150,
      totalEarnings: 350,
      totalReferrals: 8,
      referralEarnings: 75,
      transactions: [
        { id: 1, type: 'task', amount: 10, date: '2023-11-01', description: 'Watch Video' },
        { id: 2, type: 'task', amount: 20, date: '2023-10-30', description: 'Download App' },
        { id: 3, type: 'referral', amount: 5, date: '2023-10-28', description: 'Referral Bonus' },
        { id: 4, type: 'task', amount: 15, date: '2023-10-25', description: 'Complete Survey' }
      ]
    };
    
    // Update UI
    document.getElementById('user-balance').textContent = `${mockData.balance} points`;
    document.getElementById('total-earnings').textContent = mockData.totalEarnings;
    document.getElementById('total-referrals').textContent = mockData.totalReferrals;
    document.getElementById('referral-earnings').textContent = mockData.referralEarnings;
    
    // Load transactions
    const transactionList = document.querySelector('.transaction-list');
    transactionList.innerHTML = '';
    
    mockData.transactions.forEach(tx => {
      const txItem = document.createElement('div');
      txItem.className = 'transaction-item';
      txItem.innerHTML = `
        <div>
          <span class="transaction-description">${tx.description}</span>
          <span class="transaction-date">${tx.date}</span>
        </div>
        <span class="transaction-amount">+${tx.amount} points</span>
      `;
      transactionList.appendChild(txItem);
    });
    
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}
