const Telegraf = require('telegraf')
const fs = require('fs');
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const { token, groupid } = require('./config')
const bot = new Telegraf(token)
const commandParts = require('./utils/cp.js')


bot.use(commandParts());

// get ChatID
bot.command('id', (ctx) => {
  ctx.reply(`ChatID: ${ctx.chat.id}`);
})

bot.command('request', (ctx) => {

  ctx.telegram.sendMessage(groupid, "@" + ctx.message.from.username + " requested the following feature: " + ctx.state.command.args, Markup.inlineKeyboard([
    Markup.callbackButton('Accept!', `accept:${ctx.chat.id}:${ctx.state.command.args}:${ctx.message.id}`),
    Markup.callbackButton('Decline!', `delete:${ctx.chat.id}:${ctx.state.command.args}:${ctx.message.id}`),
  ]).extra())

});

bot.action(/^accept.*/, (ctx)=> { 
  let data = ctx.callbackQuery.data.split(':');
  // example for sending to the group
  // ctx.telegram.sendMessage(groupid, `accepted user ${data[1]}`)
  
  ctx.telegram.deleteMessage(ctx.chat.id,ctx.callbackQuery.message.message_id);
  // message the user
  ctx.telegram.sendMessage(data[1], `Accepted the following request: ${data[2]}`)
  
});

bot.action(/^delete.*/m, (ctx)=> {
  let data = ctx.callbackQuery.data.split(':');

  ctx.telegram.deleteMessage(ctx.chat.id,ctx.callbackQuery.message.message_id);
  ctx.telegram.sendMessage(data[1], `Declined the following request: ${data[2]}`)
  
})
bot.startPolling()