import { PageLayout } from '@/components/Layout/PageLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { CleanupTool } from './tool';
import { getUser } from '@/lib/getUser';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import Link from 'next/link';

export default async function InventoryCleanupPage() {
  const user = await getUser();

  return (
    <PageLayout>
      <Headline id="cleanup">Inventory Cleanup</Headline>
      <p>This tool makes suggestions on how you can clean up your inventory.</p>

      {user ? (
        <CleanupTool/>
      ) : (
        <Notice>You need to <Link href="/login">login</Link> to use this tool.</Notice>
      )}
    </PageLayout>
  );
}
