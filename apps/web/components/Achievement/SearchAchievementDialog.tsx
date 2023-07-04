'use client';

import { LocalizedEntity } from '@/lib/localizedName';
import { WithIcon } from '@/lib/with';
import { Achievement } from '@gw2treasures/database';
import { FC, useEffect, useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { useDebounce } from '@/lib/useDebounce';
import { SkeletonTable } from '../Skeleton/SkeletonTable';
import { AchievementLink } from './AchievementLink';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { getLinkProperties } from '@/lib/linkProperties';
import { searchAchievement } from './SearchAchievementDialog.actions';

export type SearchAchievementDialogSubmitHandler = (achievement?: WithIcon<Pick<Achievement, 'id' | keyof LocalizedEntity>>) => void;

export interface SearchAchievementDialogProps {
  onSubmit: SearchAchievementDialogSubmitHandler;
  open: boolean;
}

export const SearchAchievementDialog: FC<SearchAchievementDialogProps> = ({ onSubmit, open }) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 1000);
  const [achievements, setAchievements] = useState<WithIcon<Achievement>[] | 'loading'>('loading');

  useEffect(() => {
    setAchievements('loading');
    searchAchievement(debouncedValue).then(setAchievements);
  }, [debouncedValue]);

  return (
    <Dialog onClose={() => onSubmit(undefined)} title="Search Achievement" open={open}>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
        <TextInput placeholder="Name / ID" value={searchValue} onChange={setSearchValue}/>
      </div>

      {achievements === 'loading' ? (
        <SkeletonTable columns={['Achievement', 'Select']} rows={2}/>
      ) : achievements.length === 0 ? (
        <p>No achievements found</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Table.HeaderCell>Achievement</Table.HeaderCell>
              <Table.HeaderCell small>Select</Table.HeaderCell>
            </tr>
          </thead>
          <tbody>
            {achievements.map((achievement) => (
              <tr key={achievement.id}>
                <td>
                  <AchievementLink achievement={achievement}/>
                </td>
                <td>
                  <Button onClick={() => onSubmit(getLinkProperties(achievement))}>Select</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Dialog>
  );
};
