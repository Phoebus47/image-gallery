import { useCallback, useMemo, useState } from 'react';
import type { ImageItem } from '@/lib/data/mock-images';

export function useGalleryFilter() {
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const [squareFilter, setSquareFilter] = useState<boolean>(false);

  const filter = useMemo(() => {
    return (img: ImageItem) => {
      const matchesHashtag = activeHashtag
        ? img.hashtags.includes(activeHashtag)
        : true;
      const matchesSquare = squareFilter ? img.width === img.height : true;
      return matchesHashtag && matchesSquare;
    };
  }, [activeHashtag, squareFilter]);

  const onHashtagClick = useCallback((tag: string) => {
    setActiveHashtag((current) => (current === tag ? null : tag));
  }, []);

  const onClearFilter = useCallback(() => {
    setActiveHashtag(null);
  }, []);

  const onSquareFilterClick = useCallback(() => {
    setSquareFilter((current) => !current);
  }, []);

  return {
    activeHashtag,
    filter,
    onHashtagClick,
    onClearFilter,
    squareFilter,
    onSquareFilterClick,
  };
}
