const regex = /^https:\/\/render\.guildwars2\.com\/file\/(?<signature>[^/]*)\/(?<id>[^/]*)\.png$/;

export function parseIcon(url: string | undefined): { id: number, signature: string } | undefined {
  if(typeof url !== 'string') {
    return;
  }

  const match = url.match(regex)?.groups;

  return match ? {
    id: Number(match.id),
    signature: match.signature
  } : undefined;
}
