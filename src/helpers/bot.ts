import { Telegraf as TelegramBot, Context } from "telegraf";
import { Config } from "./config";
import axios from "axios";
import { generateRandomString } from "./utils";

export class Bot {
    private bot: TelegramBot;

    constructor() {
        this.bot = this.createTelegramBot();
    }

    public start() {
        this.bot.start(this.handleBotStart);
        this.bot.launch(this.handleBotLaunch);
        this.bot.command("payout", this.onPayOut);
    }

    // -------------------------------PRIVATE--------------------------------- //

    private createTelegramBot() {
        const botToken = Config.TELE_BOT_TOKEN;
        return new TelegramBot(botToken);
    }

    private async handleBotStart(ctx: Context) {
        const webLink = Config.TELE_BOT_WEB_LINK;

        ctx.reply("Hi! lets get you started Click the button below", {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Get Started",
                            web_app: {
                                url: webLink,
                            },
                        },
                    ],
                ],
            },
        });

        const chatId = ctx.chat?.id;
        const userId = ctx.from?.username;
        if (chatId) {
            await axios.post(`${Config.BACKEND_URL}/chat`, {
                telegram: userId,
                chatId: chatId,
            });
        }
    }

    private async onPayOut(ctx: Context) {
        const userName = ctx.from?.username;

        const token = await axios.post(`${Config.BACKEND_URL}/signin`, {
            telegram: userName,
            wallet: generateRandomString(16),
        });

        const balance = await axios.get(`${Config.BACKEND_URL}/balance`, {
            headers: {
                authorization: token.data.token,
            },
        });
    }

    private handleBotLaunch() {
        console.log("Bot is up and running...");
    }
}
