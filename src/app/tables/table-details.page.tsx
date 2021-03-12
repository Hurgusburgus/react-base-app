import * as React from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles, Container, Typography, Grid } from '@material-ui/core';
import { gql, useQuery, useMutation, ApolloError } from '@apollo/client';
import TableCard from './table-card';
import { Table } from '../models/models';
import { TABLE_FRAGMENT } from '../models/fragments';

export const GET_TABLE = gql`
  query getTable($id: ID!) {
    table(id: $id) {
      ...TableFragment
    }
  }
  ${TABLE_FRAGMENT}
`;

export const JOIN_TABLE = gql`
  mutation joinTable {
    joinTable {
      ...TableFragment
    }
  }
  ${TABLE_FRAGMENT}
`;

const TableDetailsPageWithData = (): React.ReactElement => {
  const { tableId } = useParams<{ [key: string]: string }>();
  const { data: tableData } = useQuery(GET_TABLE, {
    variables: { id: tableId },
  });

  const table: Table = tableData ? tableData.table : null;

  return <TableDetailsPage table={table} />;
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

interface TableDetailsPageProps {
  table: Table;
}

const TableDetailsPage = ({
  table,
}: TableDetailsPageProps): React.ReactElement => {
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

export default TableDetailsPageWithData;
