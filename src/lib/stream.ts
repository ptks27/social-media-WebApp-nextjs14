import {StreamChat} from "stream-chat"

const streamServerClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_KEY!,
    process.env.STREAM_SECRET,
    {
    timeout: 10000, 
  }
)

export default streamServerClient;