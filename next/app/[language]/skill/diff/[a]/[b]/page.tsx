import Link from 'next/link';
import { Gw2Api } from 'gw2-api-types';
import { DiffLayout, DiffLayoutHeader, DiffLayoutRow } from '@/components/Layout/DiffLayout';
import { SkillIcon } from '@/components/Skill/SkillIcon';
import { parseIcon } from '@/lib/parseIcon';
import { FormatDate } from '@/components/Format/FormatDate';
import { Fact } from '@/components/Skill/SkillTooltip';
import { Notice } from '@/components/Notice/Notice';
import { format } from 'gw2-tooltip-html';
import { Separator } from '@/components/Layout/Separator';
import { Json } from '@/components/Format/Json';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import { db } from '@/lib/prisma';
import { remember } from '@/lib/remember';

const getRevisions = remember(60, async function getRevisions(idA: string, idB: string) {
  const [a, b] = await Promise.all([
    db?.revision.findUnique({ where: { id: idA }}),
    db?.revision.findUnique({ where: { id: idB }}),
  ]);

  if(!a || !b || a.entity !== 'Skill' || b.entity !== 'Skill') {
    notFound();
  }

  return { a, b };
});

async function SkillDiffPage({ params }: { params: { a: string, b: string }}) {
  const idA = params.a.toString();
  const idB = params.b.toString();

  const { a, b } = await getRevisions(idA, idB);

  const dataA: Gw2Api.Skill = JSON.parse(a.data);
  const dataB: Gw2Api.Skill = JSON.parse(b.data);

  const iconA = parseIcon(dataA.icon);
  const iconB = parseIcon(dataB.icon);

  const factsDiff = diffFacts(dataA.facts, dataB.facts);
  const traitedFactsDiff = diffFacts(dataA.traited_facts, dataB.traited_facts);

  return (
    <DiffLayout>
      <DiffLayoutHeader icons={[
        iconA && <SkillIcon icon={iconA} size={64}/>,
        iconB && <SkillIcon icon={iconB} size={64}/>,
      ]} title={[
        dataA.name,
        dataB.name,
      ]} subtitle={[
        <Fragment key="a"><FormatDate date={a.createdAt} data-superjson/> (<Link href={`/build/${a.buildId}`}>Build {a.buildId}</Link>) ▪ <Link href={`/skill/${dataA.id}/${a.id}`}>View revision</Link></Fragment>,
        <Fragment key="b"><FormatDate date={b.createdAt} data-superjson/> (<Link href={`/build/${b.buildId}`}>Build {b.buildId}</Link>) ▪ <Link href={`/skill/${dataB.id}/${b.id}`}>View revision</Link></Fragment>,
      ]}/>

      {dataA.id !== dataB.id && (
        <div style={{ padding: 16, paddingBottom: 0 }}>
          <Notice>You are comparing two different skills</Notice>
        </div>
      )}

      {a.createdAt > b.createdAt && (
        <div style={{ padding: 16, paddingBottom: 0 }}>
          <Notice>You are comparing an old version against a newer version. <Link href={`/skill/diff/${b.id}/${a.id}`}>Switch around</Link></Notice>
        </div>
      )}

      <DiffLayoutRow changed={dataA.description !== dataB.description}
        left={<p dangerouslySetInnerHTML={{ __html: format(dataA.description) }}/>}
        right={<p dangerouslySetInnerHTML={{ __html: format(dataB.description) }}/>}/>

      {factsDiff.map(({ left, right }, index) => {
        // eslint-disable-next-line react/no-array-index-key
        return (<DiffLayoutRow key={index} left={left && <Fact fact={left}/>} right={right && <Fact fact={right}/>}/>);
      })}
      {factsDiff.length > 0 && traitedFactsDiff.length > 0 && (
        <DiffLayoutRow left={<Separator/>} right={<Separator/>}/>
      )}
      {traitedFactsDiff.map(({ left, right }, index) => {
        // eslint-disable-next-line react/no-array-index-key
        return (<DiffLayoutRow key={index} left={left && <Fact fact={left}/>} right={right && <Fact fact={right}/>}/>);
      })}
      <DiffLayoutRow left={<Separator/>} right={<Separator/>}/>
      <DiffLayoutRow left={<Json data={dataA}/>} right={<Json data={dataB}/>}/>
    </DiffLayout>
  );
};

function diffFacts<T>(left: T[] | undefined, right: T[] | undefined): { left?: T, right?: T }[] {
  if(left === undefined) {
    if(right === undefined) {
      return [];
    }

    return right.map((right) => ({ right }));
  }
  if(right === undefined) {
    return left.map((left) => ({ left }));
  }

  let leftIndex = 0;
  let rightIndex = 0;
  const diff: { left?: T, right?: T }[] = [];

  const leftData = left.map((value) => JSON.stringify(value));
  const rightData = right.map((value) => JSON.stringify(value));

  while(leftIndex < left.length && rightIndex < right.length) {
    if(leftData[leftIndex] === rightData[rightIndex]) {
      diff.push({ left: left[leftIndex], right: right[rightIndex] });
      leftIndex++;
      rightIndex++;
    } else {
      // check if we find the matching element later on the right
      let foundRight = false;
      for(let i = rightIndex + 1; i < right.length; i++) {
        if(leftData[leftIndex] === rightData[i]) {
          for(; rightIndex < i; rightIndex++) {
            diff.push({ right: right[rightIndex] });
          }
          diff.push({ left: left[leftIndex], right: right[rightIndex] });
          leftIndex++;
          rightIndex++;
          foundRight = true;
          break;
        }
      }

      if(!foundRight) {
        diff.push({ left: left[leftIndex] });
        leftIndex++;
      }
    }
  }

  // push remaining objects
  for(; leftIndex < left.length; leftIndex++) {
    diff.push({ left: left[leftIndex] });
  }
  for(; rightIndex < right.length; rightIndex++) {
    diff.push({ right: right[rightIndex] });
  }

  return diff;
}

export default SkillDiffPage;
