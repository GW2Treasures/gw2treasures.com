import type { ReviewQueue } from '@gw2treasures/database';

const reviewUrls: Record<ReviewQueue, string> = {
  'ContainerContent': 'container-content',
  'MysticForge': 'mystic-forge',
};

export function getReviewUrlKeyFromQueue(queue: ReviewQueue) {
  return reviewUrls[queue];
}
