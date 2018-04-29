

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ChannelListQuery
// ====================================================

export interface ChannelListQuery_channels_latestMessage_author {
  id: string;
  name: string;  // The readable name
}

export interface ChannelListQuery_channels_latestMessage {
  id: string;
  date: string;
  author: ChannelListQuery_channels_latestMessage_author;
  text: string;
}

export interface ChannelListQuery_channels {
  id: string;                                              // Unique identifier
  title: string;                                           // Human-readable title of this Channel
  latestMessage: ChannelListQuery_channels_latestMessage;  // The newest message that have been posted to this channel
}

export interface ChannelListQuery {
  channels: ChannelListQuery_channels[];
}

export interface ChannelListQueryVariables {
  memberId?: string | null;
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