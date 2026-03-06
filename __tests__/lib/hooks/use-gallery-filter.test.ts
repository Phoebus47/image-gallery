import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useGalleryFilter } from '@/lib/hooks/use-gallery-filter';

describe('useGalleryFilter', () => {
  it('starts with no active hashtag', () => {
    const { result } = renderHook(() => useGalleryFilter());
    expect(result.current.activeHashtag).toBeNull();
    expect(result.current.filter({ hashtags: ['#nature'] } as any)).toBe(true);
  });

  it('sets active hashtag on click', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => {
      result.current.onHashtagClick('#nature');
    });

    expect(result.current.activeHashtag).toBe('#nature');
    expect(result.current.filter({ hashtags: ['#nature'] } as any)).toBe(true);
    expect(result.current.filter({ hashtags: ['#travel'] } as any)).toBe(false);
  });

  it('toggles off when clicking same hashtag again', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => result.current.onHashtagClick('#nature'));
    expect(result.current.activeHashtag).toBe('#nature');

    act(() => result.current.onHashtagClick('#nature'));
    expect(result.current.activeHashtag).toBeNull();
  });

  it('switches to new hashtag when clicking different one', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => result.current.onHashtagClick('#nature'));
    act(() => result.current.onHashtagClick('#travel'));

    expect(result.current.activeHashtag).toBe('#travel');
  });

  it('onClearFilter resets active hashtag', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => result.current.onHashtagClick('#nature'));
    expect(result.current.activeHashtag).toBe('#nature');

    act(() => result.current.onClearFilter());
    expect(result.current.activeHashtag).toBeNull();
  });

  it('squareFilter starts as false', () => {
    const { result } = renderHook(() => useGalleryFilter());
    expect(result.current.squareFilter).toBe(false);
  });

  it('onSquareFilterClick toggles squareFilter on', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => result.current.onSquareFilterClick());

    expect(result.current.squareFilter).toBe(true);
  });

  it('onSquareFilterClick toggles squareFilter back off', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => result.current.onSquareFilterClick());
    act(() => result.current.onSquareFilterClick());

    expect(result.current.squareFilter).toBe(false);
  });

  it('filter passes square images when squareFilter is on', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => result.current.onSquareFilterClick());

    const squareImg = { width: 400, height: 400, hashtags: [] } as any;
    const rectImg = { width: 400, height: 300, hashtags: [] } as any;

    expect(result.current.filter(squareImg)).toBe(true);
    expect(result.current.filter(rectImg)).toBe(false);
  });

  it('filter composes hashtag and square conditions together', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => result.current.onHashtagClick('#nature'));
    act(() => result.current.onSquareFilterClick());

    // square + matching hashtag → pass
    expect(
      result.current.filter({
        width: 400,
        height: 400,
        hashtags: ['#nature'],
      } as any),
    ).toBe(true);
    // square + wrong hashtag → fail
    expect(
      result.current.filter({
        width: 400,
        height: 400,
        hashtags: ['#travel'],
      } as any),
    ).toBe(false);
    // non-square + correct hashtag → fail
    expect(
      result.current.filter({
        width: 400,
        height: 300,
        hashtags: ['#nature'],
      } as any),
    ).toBe(false);
  });
});
