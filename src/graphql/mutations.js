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

export const INSERT_OTHER_PLAYERS_ONE = `
  mutation insert_otherPlayers_one($name: String!, $vote: String!) {
    insert_otherPlayers_one(object: {name: $name, vote: $vote}) {
      invitedBy {
        id
        name
      }
    }
  }
`;

export const UPDATE_OTHER_PLAYERS_BY_PK = `
  mutation update_otherPlayers_by_pk($id: Int!, $vote: String!) {
    update_otherPlayers_by_pk(pk_columns: {id: $id}, _set: {vote: $vote}) {
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

export const DELETE_OTHER_PLAYERS_BY_PK = `
  mutation delete_otherPlayers_by_pk($id: Int!) {
    delete_otherPlayers_by_pk(id: $id) {
      id
      name
      vote
      invitedBy {
        id
        name
      }

    }
  }
`;
