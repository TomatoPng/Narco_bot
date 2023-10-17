module.exports = {
    name: 'ping',
    description: 'pong',
    execute(msg, args, utils) {
        msg.channel.send("Bot is responding");
    },
};
