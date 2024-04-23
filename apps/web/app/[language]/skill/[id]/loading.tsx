import DetailLayout from '@/components/Layout/DetailLayout';
import { Skeleton } from '@/components/Skeleton/Skeleton';

export default function LoadingSkill() {
  return (
    <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>} icon={<Skeleton width={48} height={48}/>}><Skeleton/></DetailLayout>
  );
}
