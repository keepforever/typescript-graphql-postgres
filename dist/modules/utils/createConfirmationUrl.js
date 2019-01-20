"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const redis_1 = require("../../redis");
exports.createConfirmationUrl = (userId) => __awaiter(this, void 0, void 0, function* () {
    const token = uuid_1.v4();
    yield redis_1.redis.set(token, userId, "ex", 60 * 60 * 24);
    return `http://localhost:3000/user/confirm/${token}`;
});
//# sourceMappingURL=createConfirmationUrl.js.map