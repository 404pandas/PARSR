// Future Development
// List component to render pet cards for saved pets

import React from "react";
import { ListPage } from "material-ui-shell/lib/containers/Page";
import { ListItem, ListItemText, Typography, Divider } from "@mui/material";
import { useIntl } from "react-intl";
// Future development
// add dummy data in SavedPetList folder and uncomment the next line
// import list from './data.json'

import "./style.css";

// Future Development
// Specify fields for SavedPetlist using dummy data provided in data.json
const fields = [
  {
    name: "name",
    label: "Name",
  },
  {
    name: "email",
    label: "E-Mail",
  },
  {
    name: "amount",
    label: "Amount",
    type: "number",
  },
  {
    name: "isActive",
    label: "Active",
    type: "bool",
  },
  {
    name: "registered",
    label: "Registered",
    type: "date",
  },
  {
    name: "registrationTime",
    label: "Registration time",
    type: "time",
  },
];

const Row = ({ index, style, data }) => {
  const { name, amount = "", registered, email } = data;

  return (
    <div key={`${name}_${index}`} style={style}>
      <ListItem alignItems='flex-start'>
        <ListItemText
          primary={`${name} ${index}`}
          secondary={
            <React.Fragment>
              <Typography
                component='span'
                variant='body2'
                color='textSecondary'
              >
                {email}
              </Typography>
              <br />
              <Typography
                component='span'
                variant='body2'
                color='textSecondary'
              >
                {`${amount} ${registered}`}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider />
    </div>
  );
};

const SavedPetList = () => {
  const intl = useIntl();

  return (
    // Renders the saved pet list
    <ListPage
      name='list_demo'
      list={list}
      fields={fields}
      Row={Row}
      listProps={{ itemSize: 91 }}
      getPageProps={(list) => {
        return {
          pageTitle: intl.formatMessage(
            {
              id: "list_page_demo",
              defaultMessage: "List Page demo with {count} rows",
            },
            { count: list.length }
          ),
        };
      }}
    />
  );
};
export default SavedPetList;
