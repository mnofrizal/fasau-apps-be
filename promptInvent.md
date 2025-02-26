# Inventory Management System Guide

## Overview

This guide explains how to use the inventory management API to track items, record transactions, and monitor stock levels. The system automatically creates new items when they're first received, making it easy to record deliveries and track inventory movements.

## Key Features

- Automatic item creation
- Batch transaction support
- PO and reference number tracking
- Stock level monitoring
- Transaction history

## API Endpoints

### 1. Record New Deliveries (Stock IN)

Use this when receiving new items or restocking existing items.

**Endpoint:** POST `/api/v1/inventory/movements/batch`

**Example Request:**

```json
{
  "type": "IN",
  "reference": "0131/B12/2024",
  "notes": "Office furniture delivery",
  "createdBy": "John Doe",
  "items": [
    {
      "name": "Chair",
      "quantity": 3,
      "location": "Storage Room A",
      "notes": "Office chairs"
    },
    {
      "name": "Table",
      "quantity": 2,
      "location": "Storage Room B",
      "notes": "Office desks"
    }
  ]
}
```

**What happens:**

1. System checks if each item exists
2. Creates new items automatically if they don't exist
3. Records the incoming transaction
4. Updates stock quantities
5. Links all items to the same PO number

### 2. Record Items Going Out (Stock OUT)

Use this when items are being assigned, used, or removed from inventory.

**Example Request:**

```json
{
  "type": "OUT",
  "reference": "OUT/MKT/2024/001",
  "notes": "Marketing department allocation",
  "createdBy": "Jane Smith",
  "items": [
    {
      "name": "Chair",
      "quantity": 1,
      "notes": "For new employee"
    },
    {
      "name": "Table",
      "quantity": 1,
      "notes": "For new employee workspace"
    }
  ]
}
```

### 3. View Inventory Status

#### Check Current Stock

**Endpoint:** GET `/api/v1/inventory/items`

Shows all items with:

- Current quantity
- Location
- Recent transactions

#### View PO Details

**Endpoint:** GET `/api/v1/inventory/transactions/reference/{PO-NUMBER}`

Example: `/api/v1/inventory/transactions/reference/0131/B12/2024`

Shows:

- All items in the PO
- Quantities received
- Receiving details

#### Check Item History

**Endpoint:** GET `/api/v1/inventory/items/name/{ITEM-NAME}`

Example: `/api/v1/inventory/items/name/Chair`

Shows:

- Current stock level
- All transactions
- Location information

#### View All Transactions

**Endpoint:** GET `/api/v1/inventory/transactions`

Shows complete transaction history across all items.

## Common Use Cases

### 1. Receiving New Office Equipment

```json
{
  "type": "IN",
  "reference": "PO/2024/002",
  "notes": "IT equipment delivery",
  "createdBy": "John Doe",
  "items": [
    {
      "name": "Laptop",
      "quantity": 5,
      "location": "IT Storage",
      "notes": "Dell XPS 13"
    },
    {
      "name": "Monitor",
      "quantity": 5,
      "location": "IT Storage",
      "notes": "27 inch Dell"
    },
    {
      "name": "Keyboard",
      "quantity": 5,
      "location": "IT Storage",
      "notes": "Wireless keyboard"
    }
  ]
}
```

### 2. Department Equipment Assignment

```json
{
  "type": "OUT",
  "reference": "OUT/IT/2024/001",
  "notes": "New developer setup",
  "createdBy": "Jane Smith",
  "items": [
    {
      "name": "Laptop",
      "quantity": 1,
      "notes": "For developer John"
    },
    {
      "name": "Monitor",
      "quantity": 2,
      "notes": "Dual monitor setup"
    },
    {
      "name": "Keyboard",
      "quantity": 1,
      "notes": "Developer preference"
    }
  ]
}
```

## Best Practices

1. **Reference Numbers:**

   - Use consistent formats for PO numbers
   - Include department codes in OUT references
   - Make references descriptive (e.g., "PO/IT/2024/001")

2. **Notes:**

   - Include specific details in notes
   - Reference relevant information (employee names, purposes)
   - Document any special conditions

3. **Locations:**

   - Be specific with storage locations
   - Use consistent location names
   - Include location for all IN transactions

4. **Monitoring:**
   - Regularly check stock levels
   - Review transaction history
   - Verify PO contents after receiving

## Error Handling

The system prevents:

- Negative stock levels
- Invalid transactions
- Duplicate references

Error responses include clear messages explaining the issue.

## Tips

1. Always include reference numbers for tracking
2. Use descriptive notes for better record-keeping
3. Check stock levels before OUT transactions
4. Verify received items match PO immediately
5. Monitor transaction history regularly

This system is designed to be simple and efficient while maintaining accurate inventory records. You don't need to pre-create items - just record transactions as they happen, and the system handles the rest.
