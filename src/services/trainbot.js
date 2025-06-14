const { createRequire } = await import('module');
const require = createRequire(import.meta.url);
const { NlpManager } = require('node-nlp');


const manager = new NlpManager({ languages: ['en', 'gu'], forceNER: true ,nlu: { useNoneFeature: false , log:false} })

manager.addDocument('en', 'hello', 'greetings.hi');
manager.addDocument('en', 'hi', 'greetings.hi');
manager.addDocument('en', 'yo', 'greetings.hi');
manager.addDocument('en', 'hey', 'greetings.hi');
manager.addDocument('en', 'hey there', 'greetings.hi');
manager.addDocument('en', 'hi there', 'greetings.hi');
manager.addDocument('en', 'what’s up', 'greetings.hi');
manager.addDocument('en', 'hello there', 'greetings.hi');
manager.addDocument('en', 'namaste', 'greetings.hi');
manager.addDocument('en', 'good morning', 'greetings.hi');
manager.addDocument('en', 'good afternoon', 'greetings.hi');
manager.addDocument('en', 'good evening', 'greetings.hi');
manager.addDocument('en', 'hey dude', 'greetings.hi');
manager.addDocument('en', 'hello buddy', 'greetings.hi');
manager.addDocument('en', 'hi bot', 'greetings.hi');

manager.addDocument('en', 'how are you', 'user.ask.status');
manager.addDocument('en', 'how do you feel', 'user.ask.status');
manager.addDocument('en', 'are you okay', 'user.ask.status');
manager.addDocument('en', 'how are things', 'user.ask.status');
manager.addDocument('en', 'everything good?', 'user.ask.status');
manager.addDocument('en', 'you alright?', 'user.ask.status');
manager.addDocument('en', 'you doing fine?', 'user.ask.status');
manager.addDocument('en', 'are things okay with you?', 'user.ask.status');

manager.addDocument('en', 'can you help me', 'user.ask.help');
manager.addDocument('en', 'i need help', 'user.ask.help');
manager.addDocument('en', 'help me', 'user.ask.help');
manager.addDocument('en', 'i have a problem', 'user.ask.help');
manager.addDocument('en', 'assist me', 'user.ask.help');
manager.addDocument('en', 'what can you do', 'user.ask.help');
manager.addDocument('en', 'i need some support', 'user.ask.help');
manager.addDocument('en', 'could you assist me?', 'user.ask.help');
manager.addDocument('en', 'one problem', 'user.ask.help');
manager.addDocument('en', 'can i get some help', 'user.ask.help');
manager.addDocument('en', 'do you know how to help?', 'user.ask.help');

manager.addDocument('en', 'who are you', 'bot.identity');
manager.addDocument('en', 'what is your name', 'bot.identity');
manager.addDocument('en', 'are you a bot', 'bot.identity');
manager.addDocument('en', 'tell me about yourself', 'bot.identity');
manager.addDocument('en', 'what can you tell me about you', 'bot.identity');
manager.addDocument('en', 'are you human', 'bot.identity');
manager.addDocument('en', 'describe yourself', 'bot.identity');

manager.addDocument('en', 'goodbye', 'greetings.bye');
manager.addDocument('en', 'bye', 'greetings.bye');
manager.addDocument('en', 'see you soon', 'greetings.bye');
manager.addDocument('en', 'take care', 'greetings.bye');
manager.addDocument('en', 'have a good day', 'greetings.bye');
manager.addDocument('en', 'farewell', 'greetings.bye');
manager.addDocument('en', 'peace out', 'greetings.bye');
manager.addDocument('en', 'i’m leaving', 'greetings.bye');
manager.addDocument('en', 'see you tomorrow', 'greetings.bye');
manager.addDocument('en', 'later', 'greetings.bye');

manager.addDocument('en','fuck','badword');
manager.addDocument('en','fucker','badword');
manager.addDocument('en','mother fucker','badword');
manager.addDocument('en','assole','badword');
manager.addDocument('en','BC','badword');
manager.addDocument('en','MC','badword');
manager.addDocument('en','BSDK','badword');

manager.addDocument('en', 'I forgot notice', 'user.ask.forgot');
manager.addDocument('en', 'forgot notice', 'user.ask.forgot');
manager.addDocument('en', 'can you help to show notice', 'user.ask.forgot');
manager.addDocument('en', 'I forgot what how to wakeup assistant', 'user.ask.forgot');
manager.addDocument('en', 'I don’t remember notice', 'user.ask.forgot');
manager.addDocument('en', 'I can’t remember wakeup words', 'user.ask.forgot');
manager.addDocument('en', 'help me remember notice', 'user.ask.forgot');
manager.addDocument('en', 'help me remember wakeup words', 'user.ask.forgot');
manager.addDocument('en', 'help me to wakeup assistant', 'user.ask.forgot');
manager.addDocument('en', 'I lost my assistant wakeup word', 'user.ask.forgot');
manager.addDocument('en', 'can you remind me wakeup words', 'user.ask.forgot');
manager.addDocument('en', 'I need help remembering', 'user.ask.forgot');
manager.addDocument('en', 'oops I forgot wakeup words', 'user.ask.forgot');
manager.addDocument('en', 'I just forgot wakeup words', 'user.ask.forgot');
manager.addDocument('en', 'how to wake up assistant','user.ask.forgot');
manager.addDocument('en','how to add tasks','user.ask.forgot');
manager.addDocument('en','not give my pending tasks','user.ask.forgot');
manager.addDocument('en', 'why ninja assistant not work','user.ask.forgot');
manager.addDocument('en', 'assistant not give any response','user.ask.forgot');
manager.addDocument('en' ,'what are wake words','user.ask.forgot');
manager.addDocument('en' ,'assistant dead','user.ask.forgot');

manager.addDocument('en','automatic delete my 3 days old tasks','user.ask.autodelete');
manager.addDocument('en','why my old tasks are not shown','user.ask.autodelete');
manager.addDocument('en','where is my old tasks','user.ask.autodelete');
manager.addDocument('en','my old tasks are missing','user.ask.autodelete');
manager.addDocument('en','missing some tasks','user.ask.autodelete');

manager.addAnswer('en', 'greetings.hi', 'Hi! How can I help you today?');
manager.addAnswer('en', 'greetings.hi', 'Hey, what can I do for you?');
manager.addAnswer('en', 'greetings.hi', 'Hello! What’s up?');
manager.addAnswer('en', 'greetings.hi', 'Hi there, friend!');
manager.addAnswer('en', 'greetings.hi', 'Hello! 😊');
manager.addAnswer('en', 'greetings.hi', 'Namaste 🙏 How can I assist you?');
manager.addAnswer('en', 'user.ask.status', "I'm doing great, thanks for asking!");
manager.addAnswer('en', 'user.ask.status', "All good here! How about you?");
manager.addAnswer('en', 'user.ask.status', "I'm fine and ready to assist you!");
manager.addAnswer('en', 'user.ask.help', 'Sure! I can help you with your tasks, reminders, and more.');
manager.addAnswer('en', 'user.ask.help', 'Of course! Let me know what you need.');
manager.addAnswer('en', 'user.ask.help', 'Yes, I am here to assist. Just ask!');
manager.addAnswer('en', 'bot.identity', "I'm your personal assistant bot!");
manager.addAnswer('en', 'bot.identity', "I'm a smart chatbot designed to help you.");
manager.addAnswer('en', 'bot.identity', "You can call me your bot. I'm here for you!");
manager.addAnswer('en', 'greetings.bye', 'Bye! Take care.');
manager.addAnswer('en', 'greetings.bye', 'See you next time!');
manager.addAnswer('en', 'greetings.bye', 'Goodbye, friend!');

manager.addAnswer('en', 'badword','Hey hey you are cross limit');
manager.addAnswer('en', 'user.ask.forgot','To gaand marava bhuli gayo BP na code to bahu yaad rey chhe ne');
manager.addAnswer('en', 'user.ask.autodelete','Sayad aapne ye champal dekhi nahi hogi ak gaand pe repta padega na sadak pe hagta firega');

(async () => {
    await manager.train();
    manager.save()
    console.log("Model trained and saved.");
})();


export const botresponce = async (req, res) => {
    const {userText} = req.body || "Hello";
    const response = await manager.process('en', userText);
    return res.json({
        response: response.answer ?? 'Bhai chhadi ma re hu tari jem j chhu bahu nathi aavdatu'
    });
};