import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import Button from '../../components/common/Button';

describe('Button Component', () => {
  it('renders with children text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders primary variant with correct classes', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('bg-button-2');
    expect(button).toHaveClass('text-text');
  });

  it('renders secondary variant with correct classes', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByText('Secondary Button');
    expect(button).toHaveClass('bg-button');
    expect(button).toHaveClass('text-text');
  });

  it('renders success variant with correct classes', () => {
    render(<Button variant="success">Success Button</Button>);
    const button = screen.getByText('Success Button');
    expect(button).toHaveClass('bg-button-1');
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    const button = screen.getByText('Clickable Button');
    
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByText('Custom Button');
    expect(button).toHaveClass('custom-class');
  });

  it('renders as a button element by default', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByText('Default Button');
    expect(button.tagName).toBe('BUTTON');
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('supports different button types', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>);
    expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit');
    
    rerender(<Button type="reset">Reset</Button>);
    expect(screen.getByText('Reset')).toHaveAttribute('type', 'reset');
  });

  it('has base styling classes', () => {
    render(<Button>Styled Button</Button>);
    const button = screen.getByText('Styled Button');
    expect(button).toHaveClass('px-12');
    expect(button).toHaveClass('py-4');
    expect(button).toHaveClass('rounded');
    expect(button).toHaveClass('font-poppins');
  });
});
