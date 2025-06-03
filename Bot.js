const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Channel links
const channels = [
  { name: 'Instant Earn Airdrop', url: 'https://t.me/instant_earn_airdrop' },
  { name: 'Global Fun', url: 'https://t.me/global_Fun22' },
  { name: 'My Earn Cash', url: 'https://t.me/myearn_Cash_payment' }
];

// Start command
bot.start(async (ctx) => {
  try {
    // Check if user is member of all channels
    const memberStatuses = await Promise.all(
      channels.map(channel => 
        ctx.telegram.getChatMember(channel.url.split('/').pop(), ctx.from.id)
          .then(status => status.status !== 'left')
          .catch(() => false)
      )
    );
    
    const allJoined = memberStatuses.every(status => status);
    
    if (!allJoined) {
      let message = '📢 Please join these channels first to proceed:\n\n';
      channels.forEach(channel => {
        message += `👉 ${channel.name}: ${channel.url}\n`;
      });
      message += '\nAfter joining, click /start again.';
      return ctx.reply(message);
    }
    
    // If all channels joined
    ctx.replyWithHTML(`
      🎉 Welcome to <b>Task & Earn Bot</b>!
      
      Here's what you can do:
      /tasks - View available tasks
      /referral - Get your referral link
      /earnings - Check your earnings
      
      <a href="${process.env.WEB_APP_URL}">Open Web App</a> to complete tasks!
    `);
    
  } catch (error) {
    console.error('Start command error:', error);
    ctx.reply('⚠️ An error occurred. Please try again later.');
  }
});

// Tasks command
bot.command('tasks', (ctx) => {
  ctx.replyWithHTML(`
    � <b>Available Tasks</b>:
    
    1. Watch video (10 points)
    2. Visit website (5 points)
    3. Download app (20 points)
    4. Complete survey (15 points)
    
    <a href="${process.env.WEB_APP_URL}">Click here to complete tasks</a>
  `);
});

// Referral command
bot.command('referral', (ctx) => {
  const referralLink = `${process.env.WEB_APP_URL}?ref=${ctx.from.id}`;
  ctx.replyWithHTML(`
    📢 <b>Your Referral Link</b>:
    
    ${referralLink}
    
    Share this link with friends to earn 10% of their earnings!
  `);
});

// Error handling
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
});

module.exports = bot;
