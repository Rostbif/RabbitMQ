const connectRabbitMQ = require("./config/rabbitmq");

const consumeMessages = async (exchange, queue, routingKey) => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, "direct", { durable: true });
  await channel.assertQueue(queue, {
    durable: true,
    deadLetterExchange: "dlx",
  });
  await channel.bindQueue(queue, exchange, routingKey);

  console.log(
    `Waiting for messages in queue "${queue}" with routing key "${routingKey}"...`
  );

  channel.consume(queue, (message) => {
    if (message) {
      console.log(`Received message: ${message.content.toString()}`);
      channel.ack(message);
    }
  });
};

consumeMessages("logs", "info-queue", "info");
