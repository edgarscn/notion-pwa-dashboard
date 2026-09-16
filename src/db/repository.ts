import { db } from './index';
import { Teamspace, Page, Database, RecordItem, PropertySchema } from '../types';

// Teamspaces
export async function createTeamspace(name: string, icon: string = '🏢'): Promise<Teamspace> {
  const now = new Date().toISOString();
  const teamspace: Teamspace = {
    id: `ts-${Date.now()}`,
    name,
    icon,
    createdAt: now,
    updatedAt: now,
  };
  await db.teamspaces.add(teamspace);
  return teamspace;
}

export async function updateTeamspace(id: string, updates: Partial<Teamspace>): Promise<void> {
  await db.teamspaces.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteTeamspace(id: string): Promise<void> {
  const pagesInTeamspace = await db.pages.where('teamspaceId').equals(id).toArray();
  for (const page of pagesInTeamspace) {
    await deletePage(page.id);
  }
  await db.teamspaces.delete(id);
}

// Pages
export async function createPage(
  teamspaceId: string,
  parentId: string | null = null,
  title: string = 'Nova Página',
  isDatabase: boolean = false,
  icon: string = '📄'
): Promise<Page> {
  const now = new Date().toISOString();
  const pageId = `page-${Date.now()}`;
  const siblings = await db.pages
    .where('teamspaceId')
    .equals(teamspaceId)
    .filter((p) => p.parentId === parentId)
    .toArray();

  const page: Page = {
    id: pageId,
    teamspaceId,
    parentId,
    title,
    icon,
    isDatabase,
    content: isDatabase ? undefined : '# Nova Página\n\nComece a digitar seu conteúdo...',
    order: siblings.length,
    createdAt: now,
    updatedAt: now,
  };

  await db.pages.add(page);

  if (isDatabase) {
    const databaseId = `db-${Date.now()}`;
    const defaultProperties: PropertySchema[] = [
      { id: 'p-title', name: 'Nome', type: 'text' },
      {
        id: 'p-status',
        name: 'Status',
        type: 'status',
        options: [
          { id: 'st-1', name: 'Não iniciado', color: 'bg-gray-100 text-gray-700 border-gray-300' },
          { id: 'st-2', name: 'Em andamento', color: 'bg-blue-100 text-blue-700 border-blue-300' },
          { id: 'st-3', name: 'Concluído', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
        ],
      },
      { id: 'p-created', name: 'Data Criação', type: 'created_time' },
    ];

    const database: Database = {
      id: databaseId,
      pageId: pageId,
      title,
      properties: defaultProperties,
      defaultView: 'table',
      createdAt: now,
      updatedAt: now,
    };
    await db.databases.add(database);

    // Create a first default record
    const recId = `rec-${Date.now()}`;
    await db.records.add({
      id: recId,
      databaseId: databaseId,
      order: 0,
      createdAt: now,
      updatedAt: now,
      values: {
        'p-title': 'Primeiro Registro',
        'p-status': 'Não iniciado',
        'p-created': now,
      },
    });
  }

  return page;
}

export async function updatePage(id: string, updates: Partial<Page>): Promise<void> {
  await db.pages.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  if (updates.title) {
    const dbLinked = await db.databases.where('pageId').equals(id).first();
    if (dbLinked) {
      await db.databases.update(dbLinked.id, { title: updates.title });
    }
  }
}

export async function deletePage(id: string): Promise<void> {
  const children = await db.pages.filter((p) => p.parentId === id).toArray();
  for (const child of children) {
    await deletePage(child.id);
  }
  const dbLinked = await db.databases.where('pageId').equals(id).first();
  if (dbLinked) {
    await db.records.where('databaseId').equals(dbLinked.id).delete();
    await db.databases.delete(dbLinked.id);
  }
  await db.pages.delete(id);
}

// Databases & Properties
export async function updateDatabaseView(id: string, view: 'table' | 'board'): Promise<void> {
  await db.databases.update(id, { defaultView: view, updatedAt: new Date().toISOString() });
}

export async function addPropertyToDatabase(databaseId: string, property: PropertySchema): Promise<void> {
  const database = await db.databases.get(databaseId);
  if (!database) return;

  const properties = [...database.properties, property];
  await db.databases.update(databaseId, { properties, updatedAt: new Date().toISOString() });
}

export async function updatePropertyInDatabase(databaseId: string, updatedProperty: PropertySchema): Promise<void> {
  const database = await db.databases.get(databaseId);
  if (!database) return;

  const properties = database.properties.map((p) => (p.id === updatedProperty.id ? updatedProperty : p));
  await db.databases.update(databaseId, { properties, updatedAt: new Date().toISOString() });
}

export async function deletePropertyFromDatabase(databaseId: string, propertyId: string): Promise<void> {
  const database = await db.databases.get(databaseId);
  if (!database) return;

  const properties = database.properties.filter((p) => p.id !== propertyId);
  await db.databases.update(databaseId, { properties, updatedAt: new Date().toISOString() });

  // Remove property key from all records
  const records = await db.records.where('databaseId').equals(databaseId).toArray();
  for (const rec of records) {
    delete rec.values[propertyId];
    await db.records.put(rec);
  }
}

// Records
export async function createRecord(databaseId: string, initialValues: Record<string, any> = {}): Promise<RecordItem> {
  const now = new Date().toISOString();
  const existingRecords = await db.records.where('databaseId').equals(databaseId).toArray();
  const recordId = `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const database = await db.databases.get(databaseId);
  const values: Record<string, any> = { ...initialValues };

  if (database) {
    database.properties.forEach((prop) => {
      if (prop.type === 'created_time' && !values[prop.id]) {
        values[prop.id] = now;
      }
    });
  }

  const record: RecordItem = {
    id: recordId,
    databaseId,
    order: existingRecords.length,
    createdAt: now,
    updatedAt: now,
    values,
  };

  await db.records.add(record);
  return record;
}

export async function updateRecordCell(recordId: string, propertyId: string, value: any): Promise<void> {
  const record = await db.records.get(recordId);
  if (!record) return;

  const updatedValues = { ...record.values, [propertyId]: value };
  await db.records.update(recordId, {
    values: updatedValues,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteRecord(recordId: string): Promise<void> {
  await db.records.delete(recordId);
}
