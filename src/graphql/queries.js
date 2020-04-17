export const GET_USERS = `
  query getUsers {
    users(order_by: {name: asc}) {
      id
      name
      is_confirmed
    }
  }
`;
