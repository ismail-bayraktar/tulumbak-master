import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Footer>;

// Default Footer
export const Default: Story = {};

// With Page Content Above
export const WithPageContent: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen flex flex-col">
        {/* Page Content */}
        <div className="flex-1 bg-white">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-6">Tulumbak İzmir Baklava</h1>
            <p className="text-lg text-neutral-600 mb-4">
              İzmir'in en taze ve lezzetli baklavalarını kapınıza getiriyoruz.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Ücretsiz Kargo</h3>
                <p className="text-neutral-600">1000 TL ve üzeri siparişlerde</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Taze Üretim</h3>
                <p className="text-neutral-600">Her gün taze üretim garantisi</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Hızlı Teslimat</h3>
                <p className="text-neutral-600">Aynı gün teslimat imkanı</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Story />
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

// Footer Sections Only (Isolated)
export const Isolated: Story = {
  decorators: [
    (Story) => (
      <div className="bg-neutral-100 p-8">
        <Story />
      </div>
    ),
  ],
};
