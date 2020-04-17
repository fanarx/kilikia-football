export const INSERT_VOTES = `
  mutation insert_votes($vote: String!) {
    insert_votes(objects: {vote: $vote}) {
      returning {
        id
        vote
        user {
          name
        }
      }
    }
  }
`;

export const UPDATE_VOTES_BY_PK = `
mutation update_votes_by_pk($id: Int!, $vote: String!) {
  update_votes_by_pk(pk_columns: {id: $id}, _set: {vote: $vote}) {
    id
    vote
    user {
      name
      id
    }
  }
}
`;
