import faker, { description } from './faker';
import generateMedia from './mediaGenerator';
import generateDate from './dateGenerator';

const generate = () =>
  ({
    id: faker.string.uuid(),
    action: description(),
    createdAt: generateDate() as Date,
    dateSet: generateDate() as Date,
    campaignId: faker.string.uuid(),
    userId: faker.string.uuid(),
    assigneeId: 'none' as string,
    status: 'pending' as 'pending' | 'inprogress' | 'complete',
    media: generateMedia({ type: 'image' }) as Media,
  }) satisfies Action;

export default generate;
