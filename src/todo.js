
import { Firestore } from '@google-cloud/firestore'

const store      = new Firestore(),
      collection = store.collection('discord-bot'),
      document   = collection.doc('todoList'),
      todos      = await getTodoList(document);

export default async function(msg) {
  /** ## Sample To-Do Application ##
   *  This application is meant to help demonstrate
   *  how to get/set data from a firebase store.
   */

  // Filter incoming messages.
  const isBot    = msg.author.bot,
        isPrefix = msg.content.startsWith('!todo');
  if (isBot || !isPrefix) return;

  // Parse out paramaters from the message content.
  const { action, entry } = getParams(msg.content);

  // Pass our commands to the appropriate handlers.
  switch (action) {
    case 'add':
      await addTodo(entry);
      return msg.reply('Added entry to list!');
    case 'remove':
      let res = await removeTodo(entry);
      return (res)
        ? msg.reply('Removed entry from list!')
        : msg.reply('Your selection was invalid!');
    default:
      return msg.reply(listTodos());
  }
}

function getParams(content) {
  /** Parse parameters from the message content. */
  let [ _, action, ...rest ] = content.split(' ');
  let entry = rest.join(' ');
  if (!isNaN(entry)) entry = Number(entry);
  return { action, entry }
}

async function getTodoList(document) {
  /** Fetch our todo array from the document. */
  return document.get()
  .then(res => res.data().todos)
  .then(todos => {
    return (Array.isArray(todos))
      ? todos
      : new Array();
  })
  .catch(err => new Array());
}

async function addTodo(entry) {
  /** Add a todo item to our list. */
  todos.push(entry);
  return document.update({ todos });
}

async function removeTodo(pos) {
  /** Remove a todo item from our list. */
  if (!pos 
    || isNaN(pos) 
    || pos > todos.length
  ) return false;

  todos.splice(pos-1, 1);
  return document.update({ todos });
}

function listTodos() {
  /** Print out our current todo list. */
  let head = `\`\`\` === [ TODO LIST ] === \n`,
      line = (i, v) => `[${i}] ${v}\n`,
      foot = 'Use number values to remove an entry.';

  todos.map((v, i) => head += line(i+1, v));
  return `${head} \n ${foot} \n \`\`\``;
}