"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const telegraf_1 = require("telegraf");
const config_1 = require("./config");
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
class Bot {
    constructor() {
        this.bot = this.createTelegramBot();
    }
    start() {
        this.bot.start(this.handleBotStart);
        this.bot.launch(this.handleBotLaunch);
        this.bot.command("payout", this.onPayOut);
    }
    // -------------------------------PRIVATE--------------------------------- //
    createTelegramBot() {
        const botToken = config_1.Config.TELE_BOT_TOKEN;
        return new telegraf_1.Telegraf(botToken);
    }
    handleBotStart(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const webLink = config_1.Config.TELE_BOT_WEB_LINK;
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
            const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id;
            const userId = (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.username;
            if (chatId) {
                yield axios_1.default.post(`${config_1.Config.BACKEND_URL}/chat`, {
                    telegram: userId,
                    chatId: chatId,
                });
            }
        });
    }
    onPayOut(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userName = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.username;
            const token = yield axios_1.default.post(`${config_1.Config.BACKEND_URL}/signin`, {
                telegram: userName,
                wallet: (0, utils_1.generateRandomString)(16),
            });
            const balance = yield axios_1.default.get(`${config_1.Config.BACKEND_URL}/balance`, {
                headers: {
                    authorization: token.data.token,
                },
            });
        });
    }
    handleBotLaunch() {
        console.log("Bot is up and running...");
    }
}
exports.Bot = Bot;
