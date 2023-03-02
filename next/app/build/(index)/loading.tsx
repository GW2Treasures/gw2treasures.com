import { SkeletonTable } from '@/components/Skeleton/SkeletonTable';

export default function loadingAchievement() {
  return (
    <SkeletonTable columns={['Build', 'Item Updates', 'Skill Updates', 'Date']}/>
  );
}
