const connectRabbitMQ = require("./config/rabbitmq");

const sendUserCreatedMessage = async (userId, email) => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  const exchange = "user_events";
  const routingKey = "user.created";
  const message = JSON.stringify({ userId, email });

  await channel.assertExchange(exchange, "direct", { durable: true });
  channel.publish(exchange, routingKey, Buffer.from(message), {
    persistent: true,
  });

  console.log(`Message sent: ${message}`);
  await channel.close();
  await connection.close();
};

// Example of usage
sendUserCreatedMessage("12345", "user@example.com");

// const sendMessage = async (exchange, routingKey, message) => {
//   const connection = await connectRabbitMQ();
//   const channel = await connection.createChannel();

//   await channel.assertExchange(exchange, "direct", { durable: true });
//   channel.publish(exchange, routingKey, Buffer.from(message), {
//     persistent: true,
//   });
//   //channel.sendToQueue(queue, Buffer.from(message));

//   console.log(
//     `Message sent to exchange "${exchange}" with routing key "${routingKey}": ${message}`
//   );
//   await channel.close();
//   await connection.close();
// };

// sendMessage("logs", "info", "This is an info message");
