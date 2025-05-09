const amqp = require('amqplib');

async function listenEvents(eventHandler) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        
        await channel.assertExchange('game_events', 'fanout', { durable: false });
        const q = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(q.queue, 'game_events', '');

        channel.consume(q.queue, (msg) => {
            const event = JSON.parse(msg.content.toString());
            console.log('Evento recibido:', event);
            eventHandler(event); // Pasamos el evento a la función que lo procesará
        }, { noAck: true });
    } catch (error) {
        console.error(error);
    }
}

module.exports = { listenEvents };