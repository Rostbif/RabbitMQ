const connectRabbitMQ = require("./config/rabbitmq");

const consumeUserCreatedMessages = async () => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  const exchange = "user_events";
  const queue = "user_created_queue";
  const routingKey = "user.created";

  await channel.assertExchange(exchange, "direct", { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, routingKey);

  console.log(`Waiting for messages in queue "${queue}"...`);

  channel.consume(queue, (message) => {
    if (message) {
      const content = JSON.parse(message.content.toString());
      console.log(
        `Processing user created event: ${content.userId}, ${content.email}`
      );
      // Simulate sending a welcome email
      console.log(`Welcome email sent to ${content.email}`);
      channel.ack(message);
    }
  });
};

consumeUserCreatedMessages();

// const consumeMessages = async (exchange, queue, routingKey) => {
//   const connection = await connectRabbitMQ();
//   const channel = await connection.createChannel();

//   await channel.assertExchange(exchange, "direct", { durable: true });
//   await channel.assertQueue(queue, {
//     durable: true,
//     deadLetterExchange: "dlx",
//   });
//   await channel.bindQueue(queue, exchange, routingKey);

//   console.log(
//     `Waiting for messages in queue "${queue}" with routing key "${routingKey}"...`
//   );

//   channel.consume(queue, (message) => {
//     if (message) {
//       console.log(`Received message: ${message.content.toString()}`);
//       channel.ack(message);
//     }
//   });
// };

// consumeMessages("logs", "info-queue", "info");
