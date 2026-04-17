import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render correctly', () => {
      render(<Card data-testid="card">Card Content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveTextContent('Card Content')
      expect(card).toHaveClass('rounded-xl border bg-card text-card-foreground shadow')
    })

    it('should apply custom classes and forward ref', () => {
      const ref = createRef<HTMLDivElement>()
      render(<Card ref={ref} className="custom-class" data-testid="card" />)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-class')
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('CardHeader', () => {
    it('should render correctly', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>)
      const header = screen.getByTestId('header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('flex flex-col space-y-1.5 p-6')
    })
  })

  describe('CardTitle', () => {
    it('should render correctly', () => {
      render(<CardTitle data-testid="title">Title</CardTitle>)
      const title = screen.getByTestId('title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('font-semibold leading-none tracking-tight')
    })
  })

  describe('CardDescription', () => {
    it('should render correctly', () => {
      render(<CardDescription data-testid="description">Description</CardDescription>)
      const desc = screen.getByTestId('description')
      expect(desc).toBeInTheDocument()
      expect(desc).toHaveClass('text-sm text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('should render correctly', () => {
      render(<CardContent data-testid="content">Content</CardContent>)
      const content = screen.getByTestId('content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('p-6 pt-0')
    })
  })

  describe('CardFooter', () => {
    it('should render correctly', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>)
      const footer = screen.getByTestId('footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('flex items-center p-6 pt-0')
    })
  })
})
