const amqp = require("amqplib");
const dotenv = require("dotenv");

dotenv.config();

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    console.log("Producer Connected to RabbitMq");
    return connection;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    process.exit(1);
  }
};

module.exports = connectRabbitMQ;
