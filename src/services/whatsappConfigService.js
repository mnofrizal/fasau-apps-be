const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class WhatsappConfigService {
  async getConfig() {
    return await prisma.whatsappConfig.findFirst();
  }

  async upsertConfig(data) {
    const existingConfig = await this.getConfig();

    if (existingConfig) {
      // Update existing record
      return await prisma.whatsappConfig.update({
        where: { id: existingConfig.id },
        data: {
          groupId: data.groupId,
          groupName: data.groupName,
        },
      });
    } else {
      // Create new record
      return await prisma.whatsappConfig.create({
        data: {
          groupId: data.groupId,
          groupName: data.groupName,
        },
      });
    }
  }

  async deleteConfig() {
    const existingConfig = await this.getConfig();
    if (existingConfig) {
      return await prisma.whatsappConfig.delete({
        where: { id: existingConfig.id },
      });
    }
    return null;
  }
}

module.exports = new WhatsappConfigService();
