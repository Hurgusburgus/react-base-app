import * as React from 'react';
import { makeStyles, Container, Typography, Grid } from '@material-ui/core';
import { gql, useQuery, useMutation, ApolloError } from '@apollo/client';
import TableCard from './table-card';
import { Table } from '../models/models';
import { TABLE_FRAGMENT } from '../models/fragments';

export const GET_MY_TABLES = gql`
  query getMyTables {
    myTables {
      ...TableFragment
    }
  }
  ${TABLE_FRAGMENT}
`;

export const GET_MY_INVITES = gql`
  query getMyTableInvites {
    myTableInvites {
      ...TableFragment
    }
  }
  ${TABLE_FRAGMENT}
`;

export const CREATE_TABLE = gql`
  mutation createTable {
    createTable {
      ...TableFragment
    }
  }
  ${TABLE_FRAGMENT}
`;

const MyTablesPageWithData = (): React.ReactElement => {
  const { data: myTablesData } = useQuery(GET_MY_TABLES);
  const { data: myInvitesData } = useQuery(GET_MY_INVITES);

  const [createTable] = useMutation(CREATE_TABLE, {
    update(cache, { data: { createTable: createTableResult } }) {
      cache.modify({
        fields: {
          tables(existingTables = []) {
            const newTableRef = cache.writeFragment({
              data: createTableResult,
              fragment: TABLE_FRAGMENT,
              fragmentName: 'TableFragment',
            });
            return [...existingTables, newTableRef];
          },
        },
      });
    },
  });

  const myTables: Table[] = myTablesData ? myTablesData.myTables : [];
  const myInvites: Table[] = myInvitesData
    ? myInvitesData.myTableInvites.filter(
        (invite: Table) => !myTables.find((table) => table.id === invite.id)
      )
    : [];
  return (
    <MyTablesPage
      myTables={myTables}
      myTableInvites={myInvites}
      createTable={createTable}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  table: {
    minwidth: 650,
  },
  createButton: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface MyTablesPageProps {
  myTables: Table[];
  myTableInvites: Table[];
  createTable: () => void;
}

const MyTablesPage = ({
  myTables,
  myTableInvites,
  createTable,
}: MyTablesPageProps): React.ReactElement => {
  const classes = useStyles();
  return (
    <>
      <Container maxWidth="md">
        <Grid container direction="row" justify="space-between">
          <Grid item key="myTables">
            <Typography component="h1" variant="h2">
              My Tables
            </Typography>
            <Grid container direction="column" justify="flex-start">
              {myTables.map((table) => (
                <Grid item key={`myTable ${table.id}`}>
                  <TableCard table={table} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item key="myTables">
            <Typography component="h1" variant="h2">
              My Invites
            </Typography>
            <Grid container direction="column" justify="flex-start">
              {myTableInvites.map((table) => (
                <Grid item key={`myTable ${table.id}`}>
                  <TableCard table={table} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default MyTablesPageWithData;
