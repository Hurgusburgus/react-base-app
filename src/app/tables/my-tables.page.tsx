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
import { gql, useQuery, useMutation } from '@apollo/client';

import { Table } from '../models/models';

export const MY_TABLES = gql`
  query getTables {
    getTables {
      id
      createdBy
      createdOn
      invitees
      participants
    }
  }
`;

const headers = ['ID', 'Host', 'Created', 'Participants'];

const MyTablesPageWithData = (): React.ReactElement => {
  const { data } = useQuery(MY_TABLES);

  const tables = data ? data.getTables : [];

  return <MyTablesPage tables={tables} />;
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
}));

interface MyTablesPageProps {
  tables: Table[];
}

const MyTablesPage = ({ tables }: MyTablesPageProps): React.ReactElement => {
  const classes = useStyles();

  return (
    <Container maxWidth="md">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          My Tables
        </Typography>
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
                    {table.createdBy}
                  </TableCell>
                  <TableCell key={`${table.id}createdOn`}>
                    {table.createdOn}
                  </TableCell>
                  <TableCell key={`${table.id}participants`}>
                    {table.participants.join(', ')}
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
