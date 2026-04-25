import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Event: a.model({
    title: a.string().required(),
    description: a.string(),
    location: a.string(),
    startTime: a.datetime().required(),
    endTime: a.datetime().required(),
    timezone: a.string().required(),
    visibility: a.enum(['PUBLIC', 'PRIVATE']),
    createdBy: a.string().required(),
    invitations: a.hasMany('Invitation', 'eventId'),
    comments: a.hasMany('Comment', 'eventId'),
  }).authorization((allow) => [
    allow.publicApiKey()
  ]),

  Invitation: a.model({
    eventId: a.id().required(),
    event: a.belongsTo('Event', 'eventId'),
    inviteeEmail: a.string().required(),
    status: a.enum(['PENDING', 'ACCEPTED', 'DECLINED', 'ATTENDED']),
    role: a.enum(['SPEAKER', 'VENDOR', 'VIP', 'ATTENDEE']),
  }).authorization((allow) => [
    allow.publicApiKey()
  ]),

  Comment: a.model({
    eventId: a.id().required(),
    event: a.belongsTo('Event', 'eventId'),
    content: a.string().required(),
    createdBy: a.string().required(),
    reactions: a.json(), // Speichert Reaktionen als Objekt, z.B. {"like": 5, "heart": 3}
  }).authorization((allow) => [
    allow.publicApiKey()
  ]),

  AuditLog: a.model({
    id: a.id().required(),
    timestamp: a.datetime().required(),
    userId: a.string().required(),
    operation: a.string().required(),
    input: a.json(),
    result: a.json(),
    error: a.string(),
    sourceIP: a.string(),
  }).authorization((allow) => [
    allow.publicApiKey() // In Produktion sollte dies restriktiver sein
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
