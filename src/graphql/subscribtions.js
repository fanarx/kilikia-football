export const SUBSCRIBE_TO_VOTES = `
subscription subscribeToVotes {
  votes(order_by: {created_at: asc}) {
    vote
    id
    user {
      name
      id
    }
  }
}
`;

export const SUBSCRIBE_TO_OTHER_PLAYERS = `
    subscription subscribeToOtherPlayers {
      otherPlayers(order_by: {created_at: asc}) {
        id
        name
        vote
        created_at
        invitedBy {
          id
          name
        }
      }
    }
`;
