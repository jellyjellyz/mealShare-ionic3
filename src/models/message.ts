export class Message {
	messageId: string;
	eventId: string;
	senderId: string;
	receiverId: string;
	// 1: request to join (host)
	// 2: accept invite (host)
	// 3: reject invite (host)
	// 4: receive invite (participant)
	// 5: reject request (participant)
	// 6: accept request (participant)
	messageType: number;
}
