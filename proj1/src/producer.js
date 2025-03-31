const connectRabbitMQ = require("./config/rabbitmq");

const sendMessage = async (exchange, routingKey, message) => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, "direct", { durable: true });
  channel.publish(exchange, routingKey, Buffer.from(message), {
    persistent: true,
  });
  //channel.sendToQueue(queue, Buffer.from(message));

  console.log(
    `Message sent to exchange "${exchange}" with routing key "${routingKey}": ${message}`
  );
  await channel.close();
  await connection.close();
};

sendMessage("logs", "info", "This is an info message");
