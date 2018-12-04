export class Message {
	messageId: number;
	eventId: string;
	senderId: number;
	receiverId: number;
	// 1: request to join (host)
	// 2: accept invite (host)
	// 3: reject invite (host)
	// 4: receive invite (participant)	
	messageType: number;
}