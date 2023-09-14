'use client';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { SearchAchievementDialog } from '@/components/Achievement/SearchAchievementDialog';
import { Dialog } from '@/components/Dialog/Dialog';
import { LocalizedTextInput } from '@/components/Form/LocalizedTextInput';
import { ItemLink } from '@/components/Item/ItemLink';
import { SearchItemDialog } from '@/components/Item/SearchItemDialog';
import { FlexRow } from '@/components/Layout/FlexRow';
import { Tab, TabList, TabProps } from '@/components/TabList/TabList';
import { Tip } from '@/components/Tip/Tip';
import { LocalizedEntity, localizedName } from '@/lib/localizedName';
import { WithIcon } from '@/lib/with';
import { Achievement, Item, VendorTab } from '@gw2treasures/database';
import { Icon } from '@gw2treasures/ui';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import { Label } from '@gw2treasures/ui/components/Form/Label';
import { NumberInput } from '@gw2treasures/ui/components/Form/NumberInput';
import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { TableRowButton } from '@gw2treasures/ui/components/Table/TableRowButton';
import { FC, ReactElement, useState } from 'react';

export interface EditVendorProps {
  // TODO: add props
}

export const EditVendor: FC<EditVendorProps> = ({ }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>Edit Vendor</Button>
      <Dialog wide open={dialogOpen} onClose={() => setDialogOpen(false)} title="Edit Vendor">
        <EditVendorDialog/>
      </Dialog>
    </>
  );
};

export interface EditVendorDialogProps {
  // TODO: add props
}

type EditVendorTab = Omit<VendorTab, 'requiresItemId' | 'requiresAchievementId'> & {
  requiresItem: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>> | null;
  requiresAchievement: WithIcon<Pick<Achievement, 'id' | keyof LocalizedEntity>> | null;
}

const EmptyVendorTab: Omit<EditVendorTab, 'id'> = {
  dailyPurchaseLimit: null,
  name_de: '',
  name_en: '',
  name_es: '',
  name_fr: '',
  requiresItem: null,
  requiresAchievement: null,
  rotation: false,
  unlock_de: '',
  unlock_en: '',
  unlock_es: '',
  unlock_fr: '',
  vendorId: 'TODO',
};

export const EditVendorDialog: FC<EditVendorDialogProps> = ({ }) => {
  const [tabs, setTabs] = useState<EditVendorTab[]>([{ ...EmptyVendorTab, id: crypto.randomUUID() }]);

  const editTabWithId = (id: string) => (update: Partial<EditVendorTab>) => {
    setTabs((tabs) => tabs.map(
      (t) => t.id === id ? { ...t, ...update } : t
    ));
  };

  const [addItemRequirement, setAddItemRequirement] = useState<string>();
  const [addAchievementRequirement, setAddAchievementRequirement] = useState<string>();

  return (
    <>
      <TabList actions={<Button icon="add" appearance="menu" onClick={() => setTabs([...tabs, { ...EmptyVendorTab, id: crypto.randomUUID() }])}>Add tab</Button>}>
        {tabs.map<ReactElement<TabProps>>((tab) => {
          const edit = editTabWithId(tab.id);

          return (
            <Tab id={tab.id} title={localizedName(tab, 'en') || '[Untitled]'} icon="vendor" key={tab.id}>
              <Label label="Title">
                <LocalizedTextInput value={{ de: tab.name_de ?? '', en: tab.name_en ?? '', es: tab.name_es ?? '', fr: tab.name_fr ?? '' }} onChange={(language, value) => edit({ [`name_${language}`]: value })}/>
              </Label>
              <Label label="Daily Purchase Limit">
                <NumberInput value={tab.dailyPurchaseLimit} onChange={(dailyPurchaseLimit) => edit({ dailyPurchaseLimit })} min={0} max={255}/>
              </Label>
              <Label label="Flags" visualOnly>
                <Checkbox checked={tab.rotation} onChange={(rotation) => edit({ rotation })}>Items in this tab are on a rotation <Tip tip={<p>Always add all possible items to a vendor.</p>}><Icon icon="info"/></Tip></Checkbox>
              </Label>
              <Label label="Required Item" visualOnly>
                {tab.requiresItem ? (<><ItemLink item={tab.requiresItem}/><Button icon="delete" appearance="menu" onClick={() => edit({ requiresItem: null })}>Delete</Button></>) : <Button icon="item" onClick={() => setAddItemRequirement(tab.id)}>Select Item</Button>}
              </Label>
              <Label label="Required Achievement" visualOnly>
                {tab.requiresAchievement ? (<><AchievementLink achievement={tab.requiresAchievement}/><Button icon="delete" appearance="menu" onClick={() => edit({ requiresAchievement: null })}>Delete</Button></>) : <Button icon="achievement" onClick={() => setAddAchievementRequirement(tab.id)}>Select Achievement</Button>}
              </Label>
              <Label label="Required Mastery" visualOnly>
                <Button icon="mastery" disabled>Select Mastery</Button>
              </Label>
              <Label label="Unlock Description">
                <LocalizedTextInput value={{ de: tab.unlock_de ?? '', en: tab.unlock_en ?? '', es: tab.unlock_es ?? '', fr: tab.unlock_fr ?? '' }} onChange={(language, value) => edit({ [`unlock_${language}`]: value })}/>
              </Label>
              <Label label="Actions" visualOnly>
                <FlexRow>
                  <Button appearance="menu" icon="delete" intent="delete" onClick={() => setTabs(tabs.filter(({ id }) => id !== tab.id))}>Delete Tab</Button>
                </FlexRow>
              </Label>
              <Headline id="items">Items</Headline>
              <Table>
                <thead>
                  <tr>
                    <Table.HeaderCell>Item</Table.HeaderCell>
                    <Table.HeaderCell>Cost</Table.HeaderCell>
                    <Table.HeaderCell>Limits</Table.HeaderCell>
                    <Table.HeaderCell>Requirements</Table.HeaderCell>
                  </tr>
                </thead>
                <tbody>
                  <TableRowButton onClick={() => {}}><Icon icon="add"/> Add Item</TableRowButton>
                </tbody>
              </Table>
            </Tab>
          );
        })}
      </TabList>
      <SearchItemDialog open={addItemRequirement !== undefined} onSubmit={(requiresItem) => { addItemRequirement && editTabWithId(addItemRequirement)({ requiresItem }); setAddItemRequirement(undefined); }}/>
      <SearchAchievementDialog open={addAchievementRequirement !== undefined} onSubmit={(requiresAchievement) => { addAchievementRequirement && editTabWithId(addAchievementRequirement)({ requiresAchievement }); setAddAchievementRequirement(undefined); }}/>
    </>
  );
};
