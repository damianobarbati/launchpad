import { runInTransaction } from '@api/common/Repository.ts';
import TrackerRepository from '@api/tracker/TrackerRepository.ts';
import { sleep } from '@common/helpers.ts';
import database from '@database/database.ts';
import type { Tracker, TrackerRow, TrackerRowInsert } from '@type/Tracker.ts';
import { afterEach, describe, expect, it } from 'vitest';

describe('Repository', () => {
  afterEach(async () => {
    await database<TrackerRow>('trackers').delete().whereIn('metrics_ex_id', ['1', '2', '3', '4']);
  });

  describe('createOrUpdate', () => {
    it('should return the duplicated row updated', async () => {
      const row1: TrackerRowInsert = {
        creator_id: global.admin.id,
        owner_id: global.admin.id,
        metrics_ex_id: '1',
        description: 'AAA',
      };
      const row2: TrackerRowInsert = {
        creator_id: global.admin.id,
        owner_id: global.admin.id,
        metrics_ex_id: '1',
        description: 'ZZZ',
      };
      const result1 = await TrackerRepository.createOrUpdate(row1, 'metrics_ex_id');
      const result2 = await TrackerRepository.createOrUpdate(row2, 'metrics_ex_id');
      expect(result1).toMatchObject(row1);
      expect(result2).toMatchObject(row2);
      expect(result2.id).toEqual(result1.id);
    });
  });

  describe('createAll', () => {
    it('should insert many rows at once and return them', async () => {
      const rows: TrackerRowInsert[] = [
        { creator_id: global.admin.id, owner_id: global.admin.id, metrics_ex_id: '1', description: 'AAA' },
        { creator_id: global.admin.id, owner_id: global.admin.id, metrics_ex_id: '2', description: 'BBB' },
        { creator_id: global.admin.id, owner_id: global.admin.id, metrics_ex_id: '3', description: 'CCC' },
      ];
      const result = await TrackerRepository.createAll(rows);
      expect(result).toEqual([expect.objectContaining(rows[0]), expect.objectContaining(rows[1]), expect.objectContaining(rows[2])]);
    });
  });

  describe('createOrUpdateAll', () => {
    it('should return the new rows and the duplicated rows updated', async () => {
      const rows1: TrackerRowInsert[] = [
        { creator_id: global.admin.id, owner_id: global.admin.id, metrics_ex_id: '1', description: 'AAA' },
        { creator_id: global.admin.id, owner_id: global.admin.id, metrics_ex_id: '2', description: 'BBB' },
        { creator_id: global.admin.id, owner_id: global.admin.id, metrics_ex_id: '3', description: 'CCC' },
      ];
      const rows2: TrackerRowInsert[] = [
        ...rows1,
        {
          creator_id: global.admin.id,
          owner_id: global.admin.id,
          metrics_ex_id: '4',
          description: 'DDD',
        },
      ];
      const result1 = await TrackerRepository.createOrUpdateAll(rows1, 'metrics_ex_id');
      const result2 = await TrackerRepository.createOrUpdateAll(rows2, 'metrics_ex_id');
      // IDs did not change for the first 3 items
      expect(result1.map((row) => row.id)).toEqual(result2.map((row) => row.id).slice(0, 3));
      // data was updated
      expect(result1).toEqual([expect.objectContaining(rows1[0]), expect.objectContaining(rows1[1]), expect.objectContaining(rows1[2])]);
      expect(result2).toEqual([
        expect.objectContaining(rows2[0]),
        expect.objectContaining(rows2[1]),
        expect.objectContaining(rows2[2]),
        expect.objectContaining(rows2[3]),
      ]);
    });
  });

  describe('runInTransaction', () => {
    it('should commit on success', async () => {
      const trx_result = await runInTransaction(async () => {
        const result = await TrackerRepository.create({
          creator_id: global.admin.id,
          owner_id: global.admin.id,
          metrics_ex_id: '1',
          description: 'Hello world',
        });

        return result;
      });

      const committed_result = (await TrackerRepository.getBy({ metrics_ex_id: '1' })) as Tracker;
      expect(trx_result).toMatchObject(committed_result);
    });

    it('should rollback on failure', async () => {
      const transaction = runInTransaction(async () => {
        await TrackerRepository.create({
          creator_id: global.admin.id,
          owner_id: global.admin.id,
          metrics_ex_id: '1',
          description: 'Hello world',
        });

        await TrackerRepository.create({
          creator_id: global.admin.id,
          owner_id: global.admin.id,
          metrics_ex_id: '1',
          description: 'Hello world',
        });
      });

      await expect(transaction).rejects.toThrow();

      const committed_result = (await TrackerRepository.getBy({ metrics_ex_id: '1' })) as Tracker;
      expect(committed_result).toBeNull();
    });

    it('should rollback on timeout', async () => {
      const transaction = runInTransaction(async () => {
        await sleep(2_000);

        await TrackerRepository.create({
          creator_id: global.admin.id,
          owner_id: global.admin.id,
          metrics_ex_id: '1',
          description: 'Hello world',
        });
      }, 1_000);

      await expect(transaction).rejects.toThrow('Transaction took more than 1000s to process.');

      const committed_result = (await TrackerRepository.getBy({ metrics_ex_id: '1' })) as Tracker;
      expect(committed_result).toBeNull();
    });
  });
});
