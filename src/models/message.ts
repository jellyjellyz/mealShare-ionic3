export class Message {
	messageId: string;
	eventId: string;
	senderId: string;
	receiverId: string;
	// 1: request to join (host)
	// 2: accept invite (host)
	// 3: reject invite (host)
	// 4: receive invite (participant)
	messageType: number;
}
