import { MsgKeyType } from "./GMPManager";

export const TouchStart: MsgKeyType<() => void> = ['TouchStart'];
export const TouchEnd: MsgKeyType<() => void> = ['TouchEnd'];
export const ActorDead: MsgKeyType<() => void> = ['ActorDead'];