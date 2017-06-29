export interface IMessage {
    source: string;
    event: string;
    data: IMessageData;
}

export interface IMessageData {
    isLoaded: boolean;
}
