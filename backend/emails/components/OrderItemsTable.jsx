import React from 'react';
import { Section, Row, Column, Text } from '@react-email/components';

/**
 * Order Items Table Component
 * Professional table for displaying order items in emails
 */
export const OrderItemsTable = ({ items = [], brandColor = '#d4af37' }) => {
  return (
    <Section style={tableContainerStyle}>
      {/* Table Header */}
      <Row style={{ ...headerRowStyle, backgroundColor: brandColor }}>
        <Column style={{ width: '40%', ...headerCellStyle }}>
          <Text style={headerTextStyle}>Ürün</Text>
        </Column>
        <Column style={{ width: '20%', ...headerCellStyle, textAlign: 'center' }}>
          <Text style={headerTextStyle}>Adet</Text>
        </Column>
        <Column style={{ width: '20%', ...headerCellStyle, textAlign: 'right' }}>
          <Text style={headerTextStyle}>Birim Fiyat</Text>
        </Column>
        <Column style={{ width: '20%', ...headerCellStyle, textAlign: 'right' }}>
          <Text style={headerTextStyle}>Toplam</Text>
        </Column>
      </Row>

      {/* Table Body */}
      {items.map((item, index) => (
        <Row key={index} style={bodyRowStyle}>
          <Column style={{ width: '40%', ...bodyCellStyle }}>
            <Text style={bodyTextStyle}>{item.name || 'Ürün'}</Text>
            {item.size && (
              <Text style={sizeTextStyle}>{item.size}g</Text>
            )}
          </Column>
          <Column style={{ width: '20%', ...bodyCellStyle, textAlign: 'center' }}>
            <Text style={bodyTextStyle}>{item.quantity || 1}</Text>
          </Column>
          <Column style={{ width: '20%', ...bodyCellStyle, textAlign: 'right' }}>
            <Text style={bodyTextStyle}>₺{(item.price || 0).toFixed(2)}</Text>
          </Column>
          <Column style={{ width: '20%', ...bodyCellStyle, textAlign: 'right' }}>
            <Text style={bodyTextStyle}>
              ₺{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </Text>
          </Column>
        </Row>
      ))}
    </Section>
  );
};

// Inline styles
const tableContainerStyle = {
  margin: '24px 0',
  borderRadius: '4px',
  overflow: 'hidden',
  border: '1px solid #e0e0e0',
};

const headerRowStyle = {
  padding: 0,
};

const headerCellStyle = {
  padding: '12px 16px',
};

const headerTextStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: 0,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const bodyRowStyle = {
  borderBottom: '1px solid #e0e0e0',
};

const bodyCellStyle = {
  padding: '16px',
};

const bodyTextStyle = {
  fontSize: '15px',
  lineHeight: '20px',
  color: '#333333',
  margin: 0,
};

const sizeTextStyle = {
  fontSize: '13px',
  lineHeight: '18px',
  color: '#666666',
  margin: '4px 0 0 0',
};

export default OrderItemsTable;
