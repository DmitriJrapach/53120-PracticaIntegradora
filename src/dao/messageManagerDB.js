import messageModel from "./models/messageModel.js";


class messageManagerDB {

    async getAllMessages() {
        try {
          const messages = await messageModel.find();
          return messages;
        } catch (error) {
          console.error(error.message);
          throw new Error("Error al obtener los mensajes");
        }
      }

      async insertMessage(messageData) {
        try {
          const newMessage = new MessageModel(messageData);
          const savedMessage = await newMessage.save();
          return savedMessage;
        } catch (error) {
          console.error(error.message);
          throw new Error("Error al guardar el mensaje");
        }
      }
    
}

export { messageManagerDB };