import * as React from 'react';
import {
  makeStyles,
  Container,
  Typography,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@material-ui/core';
import { gql, useQuery, useMutation, ApolloError } from '@apollo/client';

import { Table } from '../models/models';
import { TABLE_FRAGMENT } from '../models/fragments';

export const GET_TABLES = gql`
  query getTables {
    tables {
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

export const JOIN_TABLE = gql`
  mutation joinTable($tableId: ID!) {
    joinTable(tableId: $tableId) {
      ...TableFragment
    }
  }
  ${TABLE_FRAGMENT}
`;

const headers = ['ID', 'Host', 'Created', 'Participants', 'Actions'];

const MyTablesPageWithData = (): React.ReactElement => {
  const { data: tablesData } = useQuery(GET_TABLES);

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

  const [joinTable] = useMutation(JOIN_TABLE, {
    update(cache, { data: { joinTable: joinTableResult } }) {
      cache.modify({
        fields: {
          tables(existingTables = []) {
            const joinTableRef = cache.writeFragment({
              data: joinTableResult,
              fragment: TABLE_FRAGMENT,
              fragmentName: 'TableFragment',
            });
            return existingTables.map((table: Table) =>
              table.id === joinTableResult.id ? joinTableRef : table
            );
          },
        },
      });
    },
  });

  const tables = tablesData ? tablesData.tables : [];

  return (
    <MyTablesPage
      tables={tables}
      createTable={createTable}
      joinTable={(tableId: string) => {
        joinTable({ variables: { tableId } });
      }}
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
  tables: Table[];
  createTable: () => void;
  joinTable: (tableId: string) => void;
}

const MyTablesPage = ({
  tables,
  createTable,
  joinTable,
}: MyTablesPageProps): React.ReactElement => {
  const classes = useStyles();
  return (
    <Container maxWidth="md">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          My Tables
        </Typography>
        <Button
          type="button"
          variant="contained"
          color="primary"
          className={classes.createButton}
          onClick={createTable}
        >
          Create&nbsp;Game
        </Button>
        <TableContainer component={Paper}>
          <MuiTable className={classes.table}>
            <TableHead>
              <TableRow key="headerRow">
                {headers.map((header) => (
                  <TableCell key={`${header}header`}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell key={`${table.id}id`}>{table.id}</TableCell>
                  <TableCell key={`${table.id}createdBy`}>
                    {table.createdBy ? table.createdBy.username : table}
                  </TableCell>
                  <TableCell key={`${table.id}createdOn`}>
                    {new Date(parseInt(table.createdOn, 10)).toLocaleString()}
                  </TableCell>
                  <TableCell key={`${table.id}participants`}>
                    {table.participants.map((p) => p.username).join(', ')}
                  </TableCell>
                  <TableCell key={`${table.id}actions`}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      className={classes.createButton}
                      onClick={() => {
                        joinTable(table.id);
                      }}
                    >
                      Join&nbsp;Game
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </MuiTable>
        </TableContainer>
      </div>
    </Container>
  );
};

export default MyTablesPageWithData;
