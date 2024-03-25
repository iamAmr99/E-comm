
// generate io instance

import { Server } from "socket.io"

let io
export const generateIo = (server) => {
   io = new Server(server, {
    cors: {
      origin: '*'
    }
  })

  return io
}


// return io


export const getIo = ()=>{
    if(!io) throw new Error('io is not initialized')
    return io
}

