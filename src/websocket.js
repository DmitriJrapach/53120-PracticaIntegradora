// import { productManagerFS } from "./dao/productManagerFS.js";
// const ProductService = new productManagerFS('products.json');
import { productManagerDB } from "./dao/productManagerDB.js";
const ProductService = new productManagerDB();

export default (io) => {
    // Manejador de eventos para la conexión de WebSocket
    io.on("connection", (socket) => {
           
        const messages = [];
    
        console.log("Nuevo cliente conectado: ", socket.id);

        socket.on("message", data => {
            // console.log(`Mensaje: ${data.message}`);
            messages.push(data);

            io.emit("messagesLogs", messages);
        });

        socket.on("userConnect", data => {
            socket.emit("messagesLogs", messages);
            socket.broadcast.emit("newUser", data);
        });
    

        // Evento para crear un nuevo producto
        socket.on("createProduct", async (data) => {
            try {
                await ProductService.createProduct(data);
                const products = await ProductService.getAllProducts();
                // Emitir evento de productos actualizados a todos los clientes
                io.emit("publishProducts", products);
            } catch (error) {
                // Emitir mensaje de error al cliente que intentó crear el producto
                socket.emit("statusError", error.message);
            }
        });

        // Evento para eliminar un producto
        socket.on("deleteProduct", async (data) => {
            try {
                const result = await ProductService.deleteProduct(data.pid);
                // Emitir evento de productos actualizados a todos los clientes
                io.emit("publishProducts", result);
            } catch (error) {
                // Emitir mensaje de error al cliente que intentó eliminar el producto
                socket.emit("statusError", error.message);
            }
        });
    });
};