import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    // Mock Next.js router
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-neutral-50">
        <Story />
        {/* Demo content below header */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-4">Sayfa İçeriği</h2>
          <p className="text-neutral-600">
            Header sabit (sticky) konumdadır. Sayfayı aşağı kaydırdığınızda üstte kalır.
          </p>
        </div>
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

// Default Header State
export const Default: Story = {};

// With Long Content (Test Sticky Behavior)
export const WithScrollContent: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-neutral-50">
        <Story />
        <div className="container mx-auto px-4 py-12 space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4">Ürünlerimiz</h2>
            <p className="text-neutral-600 mb-4">
              Header'ı test etmek için sayfayı aşağı kaydırın. Sticky özelliği sayesinde üstte kalacaktır.
            </p>
          </section>

          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Bölüm {i + 1}</h3>
              <p className="text-neutral-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
  ],
};

// Mobile View
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Tablet View
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Dark Background Variant
export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-neutral-900">
        <Story />
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Koyu Tema Üzerinde Header</h2>
          <p className="text-neutral-300">
            Header beyaz arka planlı olarak koyu tema üzerinde nasıl görünüyor.
          </p>
        </div>
      </div>
    ),
  ],
};
