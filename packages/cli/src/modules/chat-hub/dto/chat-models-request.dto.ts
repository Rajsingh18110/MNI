import { chatModelsRequestSchema, Z } from '@MNI/api-types';

export class ChatModelsRequestDto extends Z.class(chatModelsRequestSchema.shape) {}
