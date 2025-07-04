import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import { ENV } from "./env.js";

export const aj = arcjet({
    key: ENV.ARCJET_KEY,
    characteristics: ['ip.src'],
    rules: [
        // sheild protect app from common attacks eg. SQL injection, XSS, CSRF attacks
        shield({ mode: "LIVE" }),

        // bot detection - blocks all bots except search engines
        detectBot({
            mode:"LIVE",
            allow:[
                "CATEGORY:SEARCH_ENGINE"
            ]
        }),
        // rate limiting with token bucket algorithm
        tokenBucket({
            mode:"LIVE",
            refillRate:10, // token added per interval
            interval:10,  // interval in seconds (10 seconds)
            capacity:15 // maximum tokens in bucket
        }),
    ],
})