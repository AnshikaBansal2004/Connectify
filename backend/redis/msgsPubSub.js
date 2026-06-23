import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

// Create a Redis instance for subscribing
const subscriber = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PWD,
    username: process.env.REDIS_USER,
    tls: {}
});

// Create a Redis instance for publishing
const publisher = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PWD,
    username: process.env.REDIS_USER,
    tls: {}
});

export function subscribe(channel, callback) {
    subscriber.subscribe(channel, (err, count) => {
        if (err) {
            console.error('Error subscribing to channel:', err);
            return;
        }

        console.log(`Subscribed to ${channel}`);
    });

    // When a message is received on any subscribed channel,
    // check if the channel matches the specified channel and
    // call the provided callback function with the received message.

    subscriber.on('message', (subscribedChannel, message) => {
        if (subscribedChannel === channel) {
            callback(message);
        }
    });
}

export function unsubscribe(channel) {
    subscriber.unsubscribe(channel, (err, count) => {
        if (err) {
            console.error('Error unsubscribing from channel:', err);
            return;
        }

        console.log(`Unsubscribed from ${channel}`);
    });
}

export async function publish(channel, message) {
    try {
        await publisher.publish(channel, message);
        console.log(`Published message to ${channel}: ${message}`);
    } catch (error) {
        console.error('Error publishing message:', error);
    }
}