/* ── usePageMeta ──
   Sets document.title per route.
   Usage: usePageMeta('Dashboard')
   → document.title = 'Dashboard — ChessIQ Analytics'
*/

import { useEffect } from 'react';

const SITE_NAME = 'ChessIQ Analytics';
const DEFAULT_TITLE = 'ChessIQ Analytics — Every move tells a story';

export function usePageMeta(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
  }, [title]);
}
