import {
  type PeopleResponseMessage,
  PEOPLE_COMMANDS,
  addChild,
  findRelationship,
  PEOPLE_RESPONSE_MESSAGES,
} from '@/features/people';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const { command } = await request.json();
  const [peopleCommand, ...props] = command.split(' ');

  let result: PeopleResponseMessage | string = PEOPLE_RESPONSE_MESSAGES.UNKNOWN_COMMAND;

  if (peopleCommand === PEOPLE_COMMANDS.ADD_CHILD) {
    result = addChild(props[0], props[1], props[2]);
  }

  if (peopleCommand === PEOPLE_COMMANDS.GET_RELATIONSHIP) {
    result = findRelationship(props[0], props[1]);
  }

  return NextResponse.json(result);
};
