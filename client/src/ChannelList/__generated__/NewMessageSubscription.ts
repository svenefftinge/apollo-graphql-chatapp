

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: NewMessageSubscription
// ====================================================

export interface NewMessageSubscription_messageAdded_author {
  id: string;
  name: string;  // The readable name
}

export interface NewMessageSubscription_messageAdded_channel {
  id: string;  // Unique identifier
}

export interface NewMessageSubscription_messageAdded {
  id: string;
  date: string;
  text: string;
  author: NewMessageSubscription_messageAdded_author;
  channel: NewMessageSubscription_messageAdded_channel;
}

export interface NewMessageSubscription {
  messageAdded: NewMessageSubscription_messageAdded;
}

export interface NewMessageSubscriptionVariables {
  channelIds: string[];
}

//==============================================================
// START Enums and Input Objects
// All enums and input objects are included in every output file
// for now, but this will be changed soon.
// TODO: Link to issue to fix this.
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================