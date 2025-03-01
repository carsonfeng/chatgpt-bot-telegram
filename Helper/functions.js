const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.API,
});

const openai = new OpenAIApi(configuration);

const getImage = async (text) => {
  try {
    const response = await openai.createImage({
      prompt: text,
      n: 1,
      size: "512x512",
    });

    return response.data.data[0].url;
  } catch (error) {
    console.log(error);
  }
};

const getChat = async (text) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0,
      max_tokens: 1000,
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.log(error);
  }
};

const getChat3 = async (text) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k-0613",
      messages: [{
          role: "user",
          content: text,
      }],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.log(error);
  }
};

const getChat3_dialog = async (dialog) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k-0613",
      messages: dialog,
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.log(error);
  }
};

const getChat4 = async (text) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4-0613",
      messages: [{
          role: "user",
          content: text,
      }],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.log(error);
  }
};

const getChat4_dialog = async (dialog) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4-0613",
      messages: dialog,
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.log(error);
  }
};


module.exports = { openai, getImage, getChat, getChat3, getChat3_dialog, getChat4, getChat4_dialog};
