import ApolloClient, { gql } from "./boost_patch/ApolloClientWithWebsockets";
import { ApolloCache } from "apollo-cache";

export const defaults = {
  currentUser: {
    __typename: "CurrentUser",
    id: "u5",
    name: "Maja"
  },
  draftMessages: []
};

export const resolvers = {
  Mutation: {
    // QUESTION: is there are better way to implement?
    //   something like "update or insert"?
    setDraftMessageForChannel: (
      _: any,
      { channelId, text }: { channelId: string; text: string },
      { cache }: { cache: ApolloCache<any> }
    ) => {
      const id = `DraftMessage:${channelId}`;
      const fragment = gql`
        fragment draftMessage on DraftMessage {
          text
        }
      `;
      const existingDraftMessage = cache.readFragment({ fragment, id });

      if (existingDraftMessage) {
        // already available
        const data = { ...existingDraftMessage, text };
        cache.writeData({ id, data });
        return;
      }

      const currentDraftMessages: {
        draftMessages: [{ id: string; text: string }];
      } | null = cache.readQuery({
        query: gql`
          query getDraftMessages @client {
            draftMessages {
              id
              text
            }
          }
        `
      });
      if (!currentDraftMessages) {
        // this should not happen as we initialize the state with an empty array
        return;
      }
      const newDraftMessage = {
        id: channelId,
        text,
        __typename: "DraftMessage"
      };

      const data = {
        draftMessages: currentDraftMessages.draftMessages.concat([newDraftMessage])
      };
      cache.writeData({ data });
    }
  },
  Query: {
    // this both resolvers are currently not used and not needed, but:
    // QUESTION: are they correctly implementend?
    // QUESTION: if someone uses it and the list of draft messages gets updated, the query is not re-run
    //           automatically. how to refresh consumers of this query?
    draftMessageForChannels: (_: any, { channelIds }: { channelIds: string[] }, { cache }: { cache: ApolloCache<any> }) => {
      const allDraftMessagesResult: {
        draftMessages: [{ id: string; text: string }];
      } | null = cache.readQuery({
        query: gql`
          query getDraftMessages @client {
            draftMessages {
              id
              text
            }
          }
        `
      });

      if (!allDraftMessagesResult) {
        return [];
      }

      const result = allDraftMessagesResult.draftMessages.filter(am => channelIds.includes(am.id));
      return result;
    },

    draftMessageForChannel: (_: any, { channelId }: { channelId: string }, { cache }: { cache: ApolloCache<any> }) => {
      const fragment = gql`
        fragment draftMessage on DraftMessage {
          text
        }
      `;
      const id = `DraftMessage:${channelId}`;
      const ret = cache.readFragment({ fragment, id });
      return ret;
    }
  }
};
