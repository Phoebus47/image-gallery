import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SquareFilterButton } from '@/components/SquareFilterButton';

describe('SquareFilterButton', () => {
  afterEach(() => cleanup());
  it('renders button with correct aria-label', () => {
    render(
      <SquareFilterButton squareFilter={false} onSquareFilterClick={vi.fn()} />,
    );
    expect(
      screen.getByRole('button', { name: /show square images only/i }),
    ).toBeInTheDocument();
  });

  it('has aria-pressed="false" when squareFilter is off', () => {
    render(
      <SquareFilterButton squareFilter={false} onSquareFilterClick={vi.fn()} />,
    );
    expect(
      screen.getByRole('button', { name: /show square images only/i }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('has aria-pressed="true" when squareFilter is on', () => {
    render(
      <SquareFilterButton squareFilter={true} onSquareFilterClick={vi.fn()} />,
    );
    expect(
      screen.getByRole('button', { name: /show square images only/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onSquareFilterClick when clicked', () => {
    const onSquareFilterClick = vi.fn();
    render(
      <SquareFilterButton
        squareFilter={false}
        onSquareFilterClick={onSquareFilterClick}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: /show square images only/i }),
    );
    expect(onSquareFilterClick).toHaveBeenCalledTimes(1);
  });

  it('renders svg icon inside button', () => {
    const { container } = render(
      <SquareFilterButton squareFilter={false} onSquareFilterClick={vi.fn()} />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('rect')).toBeInTheDocument();
  });
});
