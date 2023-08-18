require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const { getImage, getChat, getChat3, getChat3_dialog, getChat4, getChat4_dialog} = require("./Helper/functions");
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");

const configuration = new Configuration({
  apiKey: process.env.API,
});
const openai = new OpenAIApi(configuration);
module.exports = openai;

const bot = new Telegraf(process.env.TG_API);
bot.start((ctx) => ctx.reply("Welcome , You can ask anything from me"));

bot.help((ctx) => {
  ctx.reply(
    "This bot can perform the following command \n /image -> to create image from text \n /ask -> ank anything from me "
  );
});



// Image command
bot.command("image", async (ctx) => {
  const text = ctx.message.text?.replace("/image", "")?.trim().toLowerCase();

  if (text) {
   
    const res = await getImage(text);

    if (res) {
      ctx.sendChatAction("upload_photo");
      // ctx.sendPhoto(res);
      // ctx.telegram.sendPhoto()
      ctx.telegram.sendPhoto(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "You have to give some description after /image",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  }
});


// Chat command

bot.command("ask", async (ctx) => {
  const text = ctx.message.text?.replace("/ask", "")?.trim().toLowerCase();

  if (text) {
    ctx.sendChatAction("typing");
    const res = await getChat(text);
    if (res) {
      ctx.telegram.sendMessage(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please ask anything after /ask",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  
    //  reply("Please ask anything after /ask");
  }
});

// Chat command with chatGPT3
bot.command("ask3", async (ctx) => {
  const text = ctx.message.text?.replace("/ask3", "")?.trim().toLowerCase();

  if (text) {
    ctx.sendChatAction("typing");
    const res = await getChat3(text);
    if (res) {
      ctx.telegram.sendMessage(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please ask anything after /ask3",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  
    //  reply("Please ask anything after /ask");
  }
});

// Chat command with chatGPT4
bot.command("ask4", async (ctx) => {
  const text = ctx.message.text?.replace("/ask4", "")?.trim().toLowerCase();

  if (text) {
    ctx.sendChatAction("typing");
    const res = await getChat4(text);
    if (res) {
      ctx.telegram.sendMessage(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please ask anything after /ask4",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  
    //  reply("Please ask anything after /ask");
  }
});

var dialogGrouByFromId = {}
var dialogLastTimeStampGroupByFromId = {}

bot.command("new", async (ctx) => {
  const res = "new conversation"
  var fromId = ctx.message.from.id

  dialogGrouByFromId[fromId] = []
  dialogLastTimeStampGroupByFromId[fromId] = new Date().getTime()

  ctx.telegram.sendMessage(ctx.message.chat.id, res, {
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.command("continue", async (ctx) => {
  const res = "continue old conversation"
  var fromId = ctx.message.from.id

  dialogLastTimeStampGroupByFromId[fromId] = new Date().getTime()

  ctx.telegram.sendMessage(ctx.message.chat.id, res, {
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.on(message('text'), async (ctx) => {

  var fromId = ctx.message.from.id
  if (!(fromId in dialogGrouByFromId)){
    dialogGrouByFromId[fromId] = []
  }
  if (!(fromId in dialogLastTimeStampGroupByFromId)){
    dialogLastTimeStampGroupByFromId[fromId] = new Date().getTime()
  }

  // 超过5分钟清理会话从头来
  var span = (new Date().getTime() - dialogLastTimeStampGroupByFromId[fromId])
  if (span >= 5 * 60 * 1000) {
    dialogGrouByFromId[fromId] = []
  }
  dialogLastTimeStampGroupByFromId[fromId] = new Date().getTime()

  const text = ctx.message.text?.trim().toLowerCase();

  if (text) {
    dialogGrouByFromId[fromId].push({
      role: "user",
      content: text,
    })
    ctx.sendChatAction("typing");
    const res = await getChat4_dialog(dialogGrouByFromId[fromId]);
    if (res) {
      dialogGrouByFromId[fromId].push({
        role: "assistant",
        content: res,
      })
      ctx.telegram.sendMessage(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
      
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please ask anything after /ask3",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  
    //  reply("Please ask anything after /ask");
  }
});

bot.launch();
