"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    var _a, _b, _c;
    const username = (_a = process.env.ADMIN_USERNAME) !== null && _a !== void 0 ? _a : 'admin';
    const password = (_b = process.env.ADMIN_PASSWORD) !== null && _b !== void 0 ? _b : 'admin123';
    const email = (_c = process.env.ADMIN_EMAIL) !== null && _c !== void 0 ? _c : 'admin@studenthub.com';
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const admin = await prisma.admin.upsert({
        where: { username },
        update: {
            passwordHash,
            email,
            firstName: 'System',
            lastName: 'Administrator',
            role: 'super_admin',
            isActive: true,
            updatedAt: new Date()
        },
        create: {
            username,
            passwordHash,
            email,
            firstName: 'System',
            lastName: 'Administrator',
            role: 'super_admin',
            isActive: true
        }
    });
    console.log(`✅ Admin upserted: ${admin.username} (id: ${admin.id})`);
}
main()
    .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
