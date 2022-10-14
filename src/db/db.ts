import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { Signal } from '../Signal';

export type Block = Partial<{
  localId: string;
  body: string;
  content: string;
  createdAt: Date;
  type?: "page";
}>;

interface EngramDB extends DBSchema {
  blocks: {
    value: Block;
    key: string;
  };
}

let _db: Promise<IDBPDatabase<EngramDB>> | null = null;

export function getDb() {
  if (_db) {
    return _db;
  }

  _db = openDB<EngramDB>("engram-pages-db", 1, {
    upgrade(db, oldVersion, newVersion) {
      if (oldVersion < 1) {
        const blocksStore = db.createObjectStore("blocks", {
          keyPath: "localId",
        });
      }
    },
  });

  return _db;
}

export async function addBlock(value: EngramDB["blocks"]["value"]) {
  const db = await getDb();

  const localId = uuidv4();
  const date = new Date();
  const addedBlock = { ...value, localId, createdAt: date };
  await db.add("blocks", addedBlock);
  return addedBlock;
}

const blockUpdatedSignal = new Signal<Block>();
export async function updateBlock(value: EngramDB["blocks"]["value"]) {
  const db = await getDb();
  await db.put("blocks", value);
  blockUpdatedSignal.dispatch(value);
}

export function onBlockUpdated(listener: (newBlock: Block) => void) {
  blockUpdatedSignal.add(listener);
}

const blockRemovedSignal = new Signal<string>();
export async function removeBlock(id?: string) {
  if (!id) {
    return;
  }

  const db = await getDb();
  await db.delete("blocks", id);
  blockRemovedSignal.dispatch(id)
}

export function onBlockRemoved(listener: (string) => void) {
  blockRemovedSignal.add(listener);
}

export async function getBlock(id?: string) {
  if (!id) {
    return;
  }
  
  const db = await getDb();
  return db.get("blocks", id);
}

export async function getAllBlocks() {
  const db = await getDb();
  return db.getAll("blocks");
}