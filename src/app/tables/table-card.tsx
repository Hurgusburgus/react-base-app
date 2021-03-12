import * as React from 'react';
import {
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  Chip,
} from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
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

interface TableCardWithDataProps {
  table: Table;
}

const TableCardWithData = ({
  table,
}: TableCardWithDataProps): React.ReactElement => {
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
            return existingTables.map((t: Table) =>
              t.id === joinTableResult.id ? joinTableRef : t
            );
          },
        },
      });
    },
  });

  return (
    <TableCard
      table={table}
      joinTable={() => {
        joinTable({ variables: { tableId: table.id } });
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
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
  },
}));

interface MyTablesPageProps {
  table: Table;
  joinTable: (tableId: string) => void;
}

const TableCard = ({
  table,
  joinTable,
}: MyTablesPageProps): React.ReactElement => {
  const classes = useStyles();
  return (
    <Card>
      <CardHeader
        title={table?.gameInfo?.name || ''}
        subheader={`Created: ${new Date(
          parseInt(table.createdOn, 10)
        ).toLocaleString()}`}
        className={classes.cardHeader}
      />
      <CardContent>
        <div>
          {table.participants.map((participant) => (
            <Chip
              icon={<FaceIcon />}
              label={participant.username}
              color="primary"
            />
          ))}
          {table.invitees.reduce((invitees, invitee) => {
            if (
              table.participants.find(
                (participant) => participant.id === invitee.id
              )
            ) {
              return invitees;
            }
            return [
              ...invitees,
              <Chip icon={<FaceIcon />} label={invitee.username} />,
            ];
          }, [])}
        </div>
      </CardContent>
    </Card>
  );
};

export default TableCardWithData;
