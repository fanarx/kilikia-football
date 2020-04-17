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
