import { GetStaticPaths, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon as DbIcon, Language, Revision, Skill, SkillHistory } from '@prisma/client';
import { Skeleton } from '../../../../components/Skeleton/Skeleton';
import { Gw2Api } from 'gw2-api-types';
import { getStaticSuperProps, withSuperProps } from '../../../../lib/superprops';
import { DiffLayout, DiffLayoutHeader, DiffLayoutRow } from '../../../../components/Layout/DiffLayout';
import { SkillIcon } from '../../../../components/Skill/SkillIcon';
import { parseIcon } from '../../../../lib/parseIcon';
import { FormatDate } from '../../../../components/Format/FormatDate';
import { Fact } from '../../../../components/Skill/SkillTooltip';
import { Json } from '../../../../components/Format/Json';
import { Infobox } from '../../../../components/Infobox/Infobox';
import { format } from 'gw2-tooltip-html';

export interface SkillDiffPageProps {
  a: Revision;
  b: Revision;
}

const SkillDiffPage: NextPage<SkillDiffPageProps> = ({ a, b }) => {
  const router = useRouter();

  if(!a || !b) {
    return <Skeleton/>;
  }

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
        <><FormatDate date={a.createdAt}/> (<Link href={`/build/${a.buildId}`}>Build {a.buildId}</Link>) ▪ <Link href={`/skill/${dataA.id}/${a.id}`}>View revision</Link></>,
        <><FormatDate date={b.createdAt}/> (<Link href={`/build/${b.buildId}`}>Build {b.buildId}</Link>) ▪ <Link href={`/skill/${dataB.id}/${b.id}`}>View revision</Link></>,
      ]}/>

      {a.createdAt > b.createdAt && (
        <div style={{ padding: 16, paddingBottom: 0 }}>
          <Infobox>You are comparing an old version against a newer version. <Link href={`/skill/diff/${b.id}/${a.id}`}>Switch around</Link></Infobox>
        </div>
      )}

      <DiffLayoutRow changed={dataA.description !== dataB.description}
        left={<p dangerouslySetInnerHTML={{ __html: format(dataA.description) }}/>}
        right={<p dangerouslySetInnerHTML={{ __html: format(dataB.description) }}/>}/>

      {factsDiff.map(({ left, right }, index) => (
        <DiffLayoutRow key={index} left={left && <Fact fact={left}/>} right={right && <Fact fact={right}/>}/>
      ))}
      {factsDiff.length > 0 && traitedFactsDiff.length > 0 && (
        <hr style={{ margin: 0, border: 'none', background: '#eee', height: 1 }}/>
      )}
      {traitedFactsDiff.map(({ left, right }, index) => (
        <DiffLayoutRow key={index} left={left && <Fact fact={left}/>} right={right && <Fact fact={right}/>}/>
      ))}
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

export const getStaticProps = getStaticSuperProps<SkillDiffPageProps>(async ({ params, locale }) => {
  const idA = params?.a?.toString();
  const idB = params?.b?.toString();

  const [a, b] = await Promise.all([
    db?.revision.findUnique({ where: { id: idA }}),
    db?.revision.findUnique({ where: { id: idB }}),
  ]);

  if(!a || !b) {
    return {
      notFound: true
    };
  }

  return {
    props: { a, b },
    revalidate: 600 /* 10 minutes */
  };
});

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default withSuperProps(SkillDiffPage);
