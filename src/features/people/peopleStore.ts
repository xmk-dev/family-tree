/*
    EXAMPLE:
    {
        userId:{
            id: userId,
            name: userName,
            parents: [],
            children: [],
        }
    }
*/

import {
  GENDERS,
  Gender,
  PEOPLE_RESPONSE_MESSAGES,
  PeopleData,
  PeopleResponseMessage,
  Person,
  PersonID,
  RELATIONSHIPS_PATHS,
  Relationship,
  TreePathNavigation,
} from '@/features/people/types';

// TODO: add partners
const mockPeopleData: PeopleData = {
  Beth: {
    id: 'Beth',
    name: 'Beth',
    gender: GENDERS.FEMALE,
    parents: [],
    siblings: [],
    children: ['Lily', 'Jessica', 'John', 'David'],
  },
  Lily: {
    id: 'Lily',
    name: 'Lily',
    gender: GENDERS.FEMALE,
    parents: ['Beth'],
    siblings: ['Jessica', 'John', 'David'],
    children: [],
  },
  Jessica: {
    id: 'Jessica',
    name: 'Jessica',
    gender: GENDERS.FEMALE,
    parents: ['Beth'],
    siblings: ['Lily', 'John', 'David'],
    children: ['Ted', 'Michael', 'Carla'],
    // partners: ['Andrew']
  },
  John: {
    id: 'John',
    name: 'John',
    gender: GENDERS.MALE,
    parents: ['Beth'],
    siblings: ['Lily', 'Jessica', 'David'],
    children: [],
  },
  David: {
    id: 'David',
    name: 'David',
    gender: GENDERS.MALE,
    parents: ['Beth'],
    siblings: ['Lily', 'Jessica', 'John'],
    children: [],
  },
  Andrew: {
    id: 'Andrew',
    name: 'Andrew',
    gender: GENDERS.MALE,
    parents: [],
    siblings: [],
    children: ['Ted', 'Michael', 'Carla'],
    // partners: ['Jessica']
  },
  Ted: {
    id: 'Ted',
    name: 'Ted',
    gender: GENDERS.MALE,
    parents: ['Andrew', 'Jessica'],
    siblings: ['Michael', 'Carla'],
    children: [],
  },
  Michael: {
    id: 'Michael',
    name: 'Michael',
    gender: GENDERS.MALE,
    parents: ['Andrew', 'Jessica'],
    siblings: ['Ted', 'Carla'],
    children: [],
  },
  Carla: {
    id: 'Carla',
    name: 'Carla',
    gender: GENDERS.FEMALE,
    parents: ['Andrew', 'Jessica'],
    siblings: ['Ted', 'Michael'],
    children: [],
    // partners: ['David']
  },
};

const peopleData: PeopleData = mockPeopleData;

export const addChild = (
  parentId: PersonID,
  childName: string,
  childGender: Gender,
): PeopleResponseMessage => {
  const parent = peopleData[parentId];

  if (!parent) {
    return PEOPLE_RESPONSE_MESSAGES.PERSON_NOT_FOUND;
  } else if (parent.gender === GENDERS.MALE) {
    return PEOPLE_RESPONSE_MESSAGES.CHILD_ADDITION_FAILED;
  } else if (!childName) {
    return PEOPLE_RESPONSE_MESSAGES.CHILD_NAME_EMPTY;
  } else if (peopleData[childName]) {
    return PEOPLE_RESPONSE_MESSAGES.ALREADY_EXISTS;
  } else if (!childGender || !Object.values(GENDERS).includes(childGender)) {
    return PEOPLE_RESPONSE_MESSAGES.CHILD_GENDER_ERROR;
  }

  const child: Person = {
    id: childName,
    name: childName,
    gender: childGender.toLowerCase() as Gender,
    parents: [parent.id], // TODO: handle partner
    children: [],
    siblings: [...parent.children],
  };
  parent.children.forEach((childId) => peopleData[childId].siblings.push(child.id));
  parent.children.push(child.id);
  peopleData[child.id] = child;

  console.log('CURRENT STATE: ', mockPeopleData);
  return PEOPLE_RESPONSE_MESSAGES.CHILD_CREATED;
};

const pathCrawler = (person: Person, relationshipPath: TreePathNavigation[]): PersonID[] => {
  const [currentNavigation, ...nextPathsNavigations] = relationshipPath;

  if (!currentNavigation) {
    return [person.id];
  }

  const goToPeopleIds: PersonID[] = [];

  if (currentNavigation.goToChildren) {
    goToPeopleIds.push(...person.children);
  } else if (currentNavigation.goToParents) {
    goToPeopleIds.push(...person.parents);
  } else if (currentNavigation.goToSiblings) {
    goToPeopleIds.push(...person.siblings);
  }

  const goToPeople = goToPeopleIds
    .map((personId) => peopleData[personId])
    .filter((person) =>
      currentNavigation.filterGender ? person.gender === currentNavigation.filterGender : true,
    );

  return goToPeople.flatMap((person) => pathCrawler(person, nextPathsNavigations));
};

export const findRelationship = (personId: string, relationship: Relationship): string => {
  const person = peopleData[personId];

  if(!person){
    return PEOPLE_RESPONSE_MESSAGES.PERSON_NOT_FOUND;
  }

  const relationshipPath = RELATIONSHIPS_PATHS[relationship];
  const result = pathCrawler(person, relationshipPath);

  return result.length ? result.join(', ') : PEOPLE_RESPONSE_MESSAGES.NONE;
};
