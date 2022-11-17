import { Icon, Skill } from '@prisma/client';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { SkillIcon } from '../Skill/SkillIcon';
import styles from './Search.module.css';

export interface SkillsProps {
  searchValue: string;
}

export const Skills: FC<SkillsProps> = ({ searchValue }) => {
  const [result, setResult] = useState<(Skill & { icon: Icon | null })[]>([]);

  useEffect(() => {
    const abort = new AbortController();

    fetch(`/api/search/skills?q=${encodeURIComponent(searchValue)}`, { signal: abort.signal }).then((r) => r.json()).then(({ result }) => {
      setResult(result);
    });
    return () => abort.abort();
  }, [searchValue]);

  if(searchValue === '' || result.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.category}>Skills</div>
      {result.map((skill) => (
        <Link href={`/skill/${skill.id}`} key={skill.id} className={styles.result}>
          {skill.icon && (<SkillIcon icon={skill.icon} size={32}/>)}
          <div className={styles.title}>
            {skill.name_en}
          </div>
        </Link>
      ))}
    </>
  );
};
