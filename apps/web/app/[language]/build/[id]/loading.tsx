import DetailLayout from '@/components/Layout/DetailLayout';
import { Skeleton } from '@/components/Skeleton/Skeleton';

export default function LoadingBuild() {
  return (
    <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>
  );
}
