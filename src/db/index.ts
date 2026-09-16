import Dexie, { Table } from 'dexie';
import { Teamspace, Page, Database, RecordItem } from '../types';

export class NotionDexie extends Dexie {
  teamspaces!: Table<Teamspace, string>;
  pages!: Table<Page, string>;
  databases!: Table<Database, string>;
  records!: Table<RecordItem, string>;

  constructor() {
    super('NotionPWAWorkspace');
    this.version(1).stores({
      teamspaces: 'id, name, createdAt',
      pages: 'id, teamspaceId, parentId, title, isDatabase, order',
      databases: 'id, pageId, title',
      records: 'id, databaseId, createdAt, order',
    });
  }
}

export const db = new NotionDexie();
