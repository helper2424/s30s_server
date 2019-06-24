import * as io from 'socket.io'
import SocketIO from 'socket.io'
import * as http from 'http'
import { Server } from 'net';

let socket = io.listen(3010)    
class Client {
    name: String
    socket: io.Socket
    constructor(socket:io.Socket) {
        this.name = ''
        this.socket = socket
    }

    identity():string {
        return 'CL ' + this.name + ' - ' + this.socket.id
    }

    id():string {
        return this.socket.id
    }
}

socket.on('connection', (socket) => {
    let address = socket.handshake.address
    const socketId = socket.id
    let client = new Client(socket)

    console.log('New connection received ', address, ' ', client.identity())
    socket.broadcast.emit('user_connected', client.id(), client.name)

    socket.on('error', (error_data) => {
        console.log(error_data)
    })

    socket.on('setName', (name) => {
        console.log(client.identity(), ' set up name ', name)
        client.name = name
        socket.broadcast.emit('user_updated_name', client.id(), name)
    })

    socket.on('message', (data) => {
        console.log(client.identity(), ' send a message "', data, '"')
        socket.broadcast.emit('user_message', client.id(), data)
    })

    socket.on('disconnect', () => {
        console.log('Client dicsonnected ', client.identity())
    })
})
